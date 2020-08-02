package io.github.rjdestigter.narcissus

import cats.effect.{ExitCode => CatsExitCode}
import io.github.rjdestigter.narcissus.configuration.{ApiConfig, Configuration}
import io.github.rjdestigter.narcissus.persistence.{
  UserPersistence,
  UserPersistenceService
}
import io.github.rjdestigter.narcissus.http.Api
import org.http4s.implicits._
import org.http4s.server.Router
import org.http4s.server.blaze.BlazeServerBuilder
import org.http4s.server.middleware.CORS
import zio._
import zio.blocking.Blocking
import zio.clock.Clock
import zio.console.putStrLn
import zio.interop.catz._

object Main extends App {

  type AppEnvironment = Configuration with Clock with UserPersistence

  type AppTask[A] = RIO[AppEnvironment, A]

  val userPersistence = (Configuration.live ++ Blocking.live) >>> UserPersistenceService.live

  override def run(args: List[String]): ZIO[ZEnv, Nothing, ExitCode] = {
    val program: ZIO[AppEnvironment, Throwable, Unit] =
      for {
        api <- configuration.apiConfig
        httpApp = Router[AppTask](
          "/users" -> Api(s"${api.endpoint}/users").route
        ).orNotFound

        server <- ZIO.runtime[AppEnvironment].flatMap { implicit rts =>
          BlazeServerBuilder[AppTask]
            .bindHttp(api.port, api.endpoint)
            .withHttpApp(CORS(httpApp))
            .serve
            .compile[AppTask, AppTask, CatsExitCode]
            .drain
        }
      } yield server

    program
      .provideSomeLayer[ZEnv](Configuration.live ++ userPersistence)
      .tapError(err => putStrLn(s"Execution failed with: $err"))
      .exitCode
  }
}