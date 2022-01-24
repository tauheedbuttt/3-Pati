import random
import json
from flask import Flask
from flask import request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

move = 0
location = 0

satti_move = 0
satti_player_card = 0

# returns score according to card
def score(card):
    if card==" ":
        # if card unkown, give it a random score
        return random.randint(2,13)
    number = card.split("_")[0]
    if (number=="2"): 
        return 2
    elif (number=="3"): 
        return 3
    elif (number=="4"): 
        return 4
    elif (number=="5"): 
        return 5
    elif (number=="6"): 
        return 6
    elif (number=="7"): 
        return 7
    elif (number=="8"): 
        return 8
    elif (number=="9"): 
        return 9
    elif (number=="10"): 
        return 10
    elif (number=="jack"): 
        return 11
    elif (number=="queen"): 
        return 12
    elif (number=="king"): 
        return 13
    elif (number=="ace"): 
        return 1
    else:
        return 0

def space_for_avail_card(hand, avail_card):
    # find card with biggest score
    max = hand[0]
    for card in hand:
        if (score(card) > score(max)):
            max = card
    # if card with biggest score is less than available card, then no need to put in hand
    if score(max) < score(avail_card):
        return -1
    return hand.index(max)

# Gives Next move for PC based on current situation
def generate_next_move(player_num, avail_card, players):
    global move
    global location

    hand = players[player_num]
    # see if available card is eligible to be in hand
    space = space_for_avail_card(hand, avail_card)
    print(hand)

    if space == -1:
        move = -1
        location = 0
    else:
        move = space
        location = 1

def generate_satti_move(player_num, players):
    global satti_move
    global satti_player_card
    # get the card with the highest score
    hand = players[player_num]
    max = hand[0]
    for card in hand:
        if (score(card) > score(max)):
            max = card
    print(f"Player {player_num+1}")
    locations = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [9,10,11]
    ]
    satti_move = locations[player_num][hand.index(max)]

    arr = [i for i in range(0,len(players)) if i != (player_num)]
    satti_player = random.choice(arr)
    satti_player_card = locations[satti_player][random.choice([0,1,2])]

@app.route('/sattimethod', methods = ['POST'])
def set_satti_data():
    jsdata = json.loads((request.form['javascript_data']))
    players = jsdata['players']
    player_num = int(jsdata['player_num'])-1
    generate_satti_move(player_num, players)
    return (jsdata)

@app.route('/getsattidata')
def get_satti_data():
    next_move = {
        'move': satti_move,
        'player_card': satti_player_card
    }
    print(f"Satti Move: {next_move['move']}\nPlayer Card:{next_move['player_card']}")
    return f"{next_move['move']} {next_move['player_card']}"


@app.route('/postmethod', methods = ['POST'])
def get_post_javascript_data():
    jsdata = json.loads((request.form['javascript_data']))
    players = jsdata['players']
    player_num = int(jsdata['player_num'])-1
    avail_card = jsdata['avail_card']

    generate_next_move(player_num, avail_card, players)
    return (jsdata)

@app.route('/getpythondata')
def get_python_data():
    next_move = {
        'move': move,
        'location': location
    }
    
    return f"{next_move['move']} {next_move['location']}"

app.run(host='127.0.0.1', port=5500)


def openNewWindow():
     
    window = Toplevel(GUI)
    window.title("IQBAL BLOCK MAP")
 
    # sets the geometry of toplevel
    newWindow.geometry("200x200")
 
    # A Label widget to show in toplevel
    Label(newWindow,
          text ="This is a new window").pack()