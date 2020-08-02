module Main exposing (..)

-- Press buttons to increment and decrement a counter.
--
-- Read how it works:
--   https://guide.elm-lang.org/architecture/buttons.html
--


import Browser
import Html exposing (Html, button, div, text)
import Html.Events exposing (onClick, onInput)
import Html.Attributes as Attr



-- MAIN


main =
  Browser.sandbox { init = init, update = update, view = view }



-- MODEL


type alias Model = Int


init : Model
init =
  0



-- UPDATE


type Msg
  = Increment
  | Decrement


update : Msg -> Model -> Model
update msg model =
  case msg of
    Increment ->
      model + 1

    Decrement ->
      model - 1



-- VIEW

input : String -> String -> String -> Html Msg
input type_ name label =
  Html.section []
    [ Html.label [] [ text label ]
    , Html.input [ Attr.type_ type_, Attr.name name ] []
    ]


view : Model -> Html Msg
view model =
  div []
    [ input "email" "email" "Email"
    , input "password" "password" "Password"
    , button [] [text "Sign-in"]
    ]