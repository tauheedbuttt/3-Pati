import random
import json
from flask import Flask
from flask import request
from flask_cors import CORS
import math

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

def generate_next_move(player_num, avail_card, players):
    global move
    global location

    hand = players[player_num]
    hand_scores = [score(card) for card in hand]
    avail_score = score(avail_card)

    # get the card with which you wish to exhcange
    move = hand_scores.index(max(hand_scores))

    if (avail_score > max(hand_scores)):
        # if avail card bigger than our maximum, dont bother changing
        location = -1
    else:
        location = 1

# -----------------------------MinMax AI Algorithm------------------------------
def minimax(curDepth, nodeIndex, maxTurn, scores, targetDepth):
 
    # base case : targetDepth reached
    if (curDepth == targetDepth):
        return scores[nodeIndex]
     
    if (maxTurn):
        return max(minimax(curDepth + 1, nodeIndex * 2, False, scores, targetDepth),
                   minimax(curDepth + 1, nodeIndex * 2 + 1, False, scores, targetDepth))
     
    else:
        return min(minimax(curDepth + 1, nodeIndex * 2, True, scores, targetDepth),
                   minimax(curDepth + 1, nodeIndex * 2 + 1, True, scores, targetDepth))
def maxmini(curDepth, nodeIndex, maxTurn, scores, targetDepth):
 
    # base case : targetDepth reached
    if (curDepth == targetDepth):
        return scores[nodeIndex]
     
    if (maxTurn):
        return max(maxmini(curDepth + 1, nodeIndex * 2, False, scores, targetDepth),
                   maxmini(curDepth + 1, nodeIndex * 2 + 1, False, scores, targetDepth))
     
    else:
        return min(maxmini(curDepth + 1, nodeIndex * 2, True, scores, targetDepth),
                   maxmini(curDepth + 1, nodeIndex * 2 + 1, True, scores, targetDepth))

# -----------------------------NEXT MOVE BASED ON AI SUGGESTIOn ------------------------
def ai_next_move(player_num, avail_card, players):
    global move
    global location

    hand = players[player_num]
    hand_scores = [score(card) for card in hand]
    avail_score = score(avail_card)

    min_max_arr = hand_scores + [avail_score]
    treeDepth = math.log(len(min_max_arr), 2)

    suggested_card = minimax(0, 0, True, min_max_arr, treeDepth)

    print(f"Hand Scores: {hand_scores}")
    print(f"Available Scores: {avail_score}")
    print(f"Scores: {min_max_arr}")

    if suggested_card == avail_score:
        # if the suggested card is the same as the card lifted, put it back
        location = -1
    else:
        # else replace with the card having highest score
        largest = max(hand_scores)
        move = hand_scores.index(largest)
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


# ----------------------------GET SATTI MOVE FROM AI -------------------------------
def ai_satti_next_move(player_num, info, players):
    global satti_move
    global satti_player_card

    hand = players[player_num]
    hand_scores = [score(card) for card in hand]
    candidate = max(hand_scores)

    candidate_found = False

    locations = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [9,10,11]
    ]
    satti_move = locations[player_num][hand_scores.index(candidate)]

    # if dont know previous moves, return random value
    if len(info)==0:
        arr = [i for i in range(0,len(players)) if i != (player_num)]
        satti_player = random.choice(arr)
        satti_player_card = locations[satti_player][random.choice([0,1,2])]
        return


    scores = []
    p_nums = []

    # convert information regarding players to integer
    for player in info:
        player["where"] = int(player["where"])
        player["what"] = score(player["what"])
        scores.append(player["what"])
        p_nums.append(player["player"])
        # if card found worthy of replacement
        if candidate > player["what"]:
            candidate_found = True

    player_card = min(scores)
    # if candidate not found, find candidate through AI
    if not candidate_found:
        # apply minmax to find candidate
        min_max_arr = scores + [candidate]
        treeDepth = math.log(len(min_max_arr), 2)
        minmax_result = minimax(0, 0, True, min_max_arr, treeDepth)

        if minmax_result == candidate:
            player_card = min(scores)
    
    player_selected = p_nums[scores.index(player_card)]
    player_card_index = [player["where"] for player in info if player["player"] == player_selected][0]

    satti_move = locations[player_num][hand_scores.index(candidate)]
    satti_player_card = locations[player_selected-1][player_card_index]

@app.route('/sattimethod', methods = ['POST'])
def set_satti_data():
    jsdata = json.loads((request.form['javascript_data']))
    players = jsdata['players']
    player_num = int(jsdata['player_num'])-1
    info = jsdata['info']
    print(info)
    ai_satti_next_move(player_num, info, players)
    # generate_satti_move(player_num, players)
    return (jsdata)

@app.route('/getsattidata')
def get_satti_data():
    next_move = {
        'move': satti_move,
        'player_card': satti_player_card
    }
    # print(f"Satti Move: {next_move['move']}\nPlayer Card:{next_move['player_card']}")
    return f"{next_move['move']} {next_move['player_card']}"


@app.route('/postmethod', methods = ['POST'])
def get_post_javascript_data():
    jsdata = json.loads((request.form['javascript_data']))
    players = jsdata['players']
    player_num = int(jsdata['player_num'])-1
    avail_card = jsdata['avail_card']

    generate_next_move(player_num, avail_card, players)
    # ai_next_move(player_num, avail_card, players)
    return (jsdata)

@app.route('/getpythondata')
def get_python_data():
    next_move = {
        'move': move,
        'location': location
    }
    return f"{next_move['move']} {next_move['location']}"

app.run(host='127.0.0.1', port=5500)
