# 3 Pati

A simple to understand card playing game. Each player gets dealt 3 cards and they move them around the table according to their needs. At the end the cards are revealed and the player with the least amount of score wins.

## Libraries
Run these commands in command prompt. Access command prompt by pressing start on keyboard. Then type in search "cmd". Command prompt shows up and just click it. If these commands dont successfuly install the libraries, try launching command prompt with administartive rights. 
* ### Flask
        pip install flask
        
* ### Flask_Cors
        pip install flask_cors

## Rules
* Each Player gets dealt 3 cards. They can see their cards at the start of the game, but can't see them for the rest of the game until the end.
* Each move consists of 2 steps. Take card from the deck. Either put it on board and discard it or swap with one of the cards in your hand.
* If card containing number 7 is thrown, player is allowed to swap one of their cards with one of the other opponents.
* Player with the least amount of score is the winner.
 
## Scores
        Card category does not matter (i.e Clubs, Diamonds, Hearts and Spades)
        Ace   -> 1
        2     -> 2
        3     -> 3
        4     -> 4
        5     -> 5
        6     -> 6
        7     -> 7
        8     -> 8
        9     -> 9
        10    -> 10
        Jack  -> 11
        Queen -> 12
        King  -> 13

## Start the app
Use this website to play the game on web
                https://teen-pati.herokuapp.com/

## Installation Steps
Use this method to play game on pc

First install the mentioned libraries to your python environment. After that run the script in app.py. This will start the Flask server which will allow the data transfer between Web Application and AI implementation in Python. Then open "home.html" on any browser and play the game. 
