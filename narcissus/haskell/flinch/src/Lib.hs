module Lib
    ( someFunc
    ) where


type UUID = String
type InMemStorage = M.Map UUID Int
someFunc :: IO ()
someFunc = do
    putStrLn "What is your name?:"
    name <- getLine
    putStrLn $ "Welcome " ++ name ++ "!"
