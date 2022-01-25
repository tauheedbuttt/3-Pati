backside_src = "images/cards/backside.png"
game_end = false;
temp_lol = []
sessionStorage.setItem("player_moves", JSON.stringify(temp_lol))


// ----------------------------HELPER FUNCTIONS----------------------------
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// remove item from array
function array_remove(arr, value) { 
    var index = arr.indexOf(value);
    if (index !== -1) {
        arr.splice(index, 1);
    }
    return arr;
}
// Send Browser Back to Home
function go_home(){
    window.location.href="home.html"
}
// returns deck of cards
function get_deck_of_cards(){
    // returns array consisting deck of cards in string format
    // [2_of_clubs, 3_of_hearts, ..., etc] total 52 hence all of them
    categories = ["clubs","spades","hearts","diamonds"];
    bigThree = ["queen", "jack", "king"];
    allCards = []
    for(i = 0 ; i<4 ; i++){
        //get numbers of the category
        allCards.push("ace_of_"+ categories[i])
        for(j=2 ; j<=10 ; j++){
            allCards.push(j + "_of_" + categories[i]);
        }
        //get big three of the category
        for(j=0 ; j<3 ; j++){
            allCards.push(bigThree[j] + "_of_" + categories[i]+"2");
        }
    }
    return allCards;
}
function remove_from_current(card){
    card.style.pointerEvents="none";
    card.style.visibility="hidden";
}
// Calculate points of the given card
function score(card){
    number = card.split("_")[0];
    if (number=="2") return 2;
    else if (number=="3") return 3;
    else if (number=="4") return 4;
    else if (number=="5") return 5;
    else if (number=="6") return 6;
    else if (number=="7") return 7;
    else if (number=="8") return 8;
    else if (number=="9") return 9;
    else if (number=="10") return 10;
    else if (number=="jack") return 11;
    else if (number=="queen") return 12;
    else if (number=="king") return 13;
    else if (number=="ace") return 1;
    else return 0;
}

// -----------------Get Card Elements by passing their location -------------
function card_location(card, cards){
    // given a cards array, tels where the card lies in that array
    for(i=0 ; i<cards.length ; i++){
        if (card.id == cards[i].id)
            return i
    }
    return -1
}

function card_from_board(player_num, card_num){
    // INPUT: player number [1, 2, 3, 4], the card number [0, 1, 2]
    // OUTPUT: returns card depending on its location provided in card number
    var cn = "cards player"+player_num+"Cards"
    var cards = document.getElementsByClassName(cn)
    return cards[card_num]
}

function card_from_board_matrix(cell_num){
    // INPUT: Cell Num is the cells allocated to each player
    // Player 1 has cells [0,1,2]
    // Player 2 has cells [3,4,5]
    // Player 3 has cells [6,7,8]
    // Player 4 has cells [9,10,11]
    // Output: Returns card at the particular cell
    var locations = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [9,10,11]
    ]
    var total_players=  parseInt(sessionStorage.getItem("players"))
    for(let p=0 ; p<total_players ; p++){
        for(let c=0 ; c<3 ; c++){
            if (cell_num == locations[p][c]){
                var cn = "cards player"+(p+1)+"Cards"
                var cards = document.getElementsByClassName(cn)
                return cards[c]
            }
        }
    }
    return null;
}
// returns card location in cell numbers
function location_of(card){
    player_num = card.className.split(" ")[1].split("Card")[0]
    player_num = parseInt(player_num[player_num.length-1])-1

    locations = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [9,10,11]
    ]

    cards = document.getElementsByClassName(card.className)
    for(let c =0 ; c<cards.length ; c++){
        if (cards[c].id == card.id){
            return locations[player_num][c]
        }
    }
}


// ----------------------------UPDATE STORAGE----------------------------
// Store Opponent Numbers selected at 
function set_players(){
    const players = parseInt(document.getElementById("players").value)+1
    sessionStorage.setItem("players", players);
    if (players<=1){
        alert("Please Select Number of Opponents")
    }
    else{
        window.location.href="game.html"
    }
}

// update storage by taking data from gameboard
function upd_players(){
    var total_players = parseInt(sessionStorage.getItem("players"));
    players = JSON.parse(sessionStorage.getItem("players_data"));
    for (let p=0 ; p<total_players ; p++){
        cn = "cards player"+(p+1)+"Cards"
        cards = document.getElementsByClassName(cn);
        for(let c=0 ; c<3 ; c++){
            players[p][c] = cards[c].id
        }
    }
    sessionStorage.setItem("players_data", JSON.stringify(players));
}

// make both cards unkown in storage
function unkown_players(card1, card2){
    var total_players = parseInt(sessionStorage.getItem("players"));
    players = JSON.parse(sessionStorage.getItem("players_data"));
    for (let p=0 ; p<total_players ; p++){
        for(let c=0 ; c<3 ; c++){
            if (card1 == players[p][c] || card2 == players[p][c])
                players[p][c] = " "
        }
    }
    sessionStorage.setItem("players_data", JSON.stringify(players));
}


// ----------------------------On-Going Game----------------------------

// starts the game after play btn is clicked
function start_game(play_btn){
    // make deck clickable
    deck = document.getElementsByClassName("cards backside deck")
    deck[deck.length-1].style.pointerEvents="auto"
    
    //turnover your cards
    p1Cards = document.getElementsByClassName("player1Cards");
    for(i =0 ; i<p1Cards.length ; i++){
        p1Cards[i].src=backside_src;
    }
    play_btn.remove()

}

// Deal Cards to all the players and place remaining deck of cards on the side
function display_cards(){
    //get number of players
    var total_players = sessionStorage.getItem("players");
    
    // generate deck of cards
    allCards = get_deck_of_cards();
    deck = []
    players = []
    counter = 0
    for(i=0 ; i<total_players ; i++){
        var randomCard = []
        className = "player"+(i+1)+"Cards";
        for(j = 0 ; j<3 ; j++){
            randomCard.push(allCards[random(0,allCards.length-1)])
            allCards = array_remove(allCards, randomCard[j]);

            space_for_player = document.getElementById(""+counter);
            card = document.createElement("img");
            card_source = "images/cards/"+randomCard[j]+".png";

            card.setAttribute("id", randomCard[j]);
            card.setAttribute("class", "cards "+className);
            card.setAttribute("src", backside_src);
            if (i==0)
                card.setAttribute("src", card_source);
                card.setAttribute("onclick", "remove_from_hand(this)");
            
            card.style.visibility="visible"
            card.style.pointerEvents="none";
            space_for_player.appendChild(card)

            counter+=1;
        }
        players.push(randomCard)
    }


    // Put Deck on Board
    remainginCards = allCards.length;
    for(i = 0 ; i<remainginCards ; i++){
        //store in memory
        const randomCard = allCards[random(0,allCards.length-1)];
        allCards = array_remove(allCards, randomCard);
        deck.push(randomCard)

        //put on table
        place_for_deck = document.getElementById("deck")
        card = document.createElement("img");

        card.setAttribute("id", randomCard);
        card.setAttribute("class", "cards backside deck");
        card.setAttribute("src", backside_src);
        card.setAttribute("onclick", "remove_from_deck(this)");
        card.style.pointerEvents="none"
        

        card.style.transform = "rotate("+ Math.floor(Math.random()*15)  +"deg)";

        place_for_deck.appendChild(card);
    }
    sessionStorage.setItem("players_data", JSON.stringify(players));
    sessionStorage.setItem("deck_cards", JSON.stringify(deck));
}

// Remove the top card from deck in Storage
function pop_card_from_deck(){
    //get the deck array to update it as well
    deck = JSON.parse(sessionStorage.getItem("deck_cards"));
    if (deck.length == 0){
        return "none"
    }
    //get top element
    card = deck[deck.length-1];
    document.getElementById(card).remove();
    deck = array_remove(deck, card);
    sessionStorage.setItem("deck_cards", JSON.stringify(deck));

    // return card from top of deck
    return card
}

// Remove the top card from deck on Web
function remove_from_deck(card){
    // remove card from top
    card_id = pop_card_from_deck()

    card_source = "images/cards/"+card_id+".png";

    pop_up_space = document.getElementById("current");
    card2 = document.createElement("img");

    card2.setAttribute("id", card_id);
    card2.setAttribute("class", "cards frontside current");
    card2.setAttribute("src", card_source);
    card2.setAttribute("onclick", "remove_from_current(this)");
    card2.style.transform = "rotate("+ Math.floor(Math.random()*15)  +"deg)";
    card2.style.pointerEvents="none";

    //make player hand cards clickable so they can make their move
    p1Cards = document.getElementsByClassName("player1Cards");
    for(i =0 ; i<p1Cards.length ; i++){
        p1Cards[i].style.pointerEvents="auto";
    }

    //make dealt area clickable so they can discard the card
    document.getElementById("dealt").style.pointerEvents="auto"

    pop_up_space.appendChild(card2);
}

//                  ------------User Moves------------
// Specail 7 Card move for USER
async function user_satti_move(card){
    if (sessionStorage.getItem("card_1")==null){
        sessionStorage.setItem("card_1", card.id)
        let cn = card.className
        if(cn == "cards player1Cards"){
            // dont allow to swap with own but rest
            player_cards = document.getElementsByClassName(cn)
            for (let c=0 ; c<3 ; c++){
                player_cards[c].style.pointerEvents="none";
            }
        }
        else{
            // dont allow swap with anyone except player 1
            var total_players = parseInt(sessionStorage.getItem("players"));
            for (let p=2 ; p<=total_players ; p++){
                cn = "cards player"+p+"Cards"
                player_cards = document.getElementsByClassName(cn)
                for (let c=0 ; c<3 ; c++){
                    player_cards[c].style.pointerEvents="none";
                }
            }
        }
    }
    else if(sessionStorage.getItem("card_2")==null){
        sessionStorage.setItem("card_2", card.id)
    
        card1 = document.getElementById(sessionStorage.getItem("card_1"))
        card2 = document.getElementById(sessionStorage.getItem("card_2"))
        sessionStorage.removeItem("card_1")
        sessionStorage.removeItem("card_2")

        id1 = "" + location_of(card1) + ""
        id2 = "" + location_of(card2) + ""
        
        // change class names
        temp = card1.className
        card1.className = card2.className
        card2.className = temp

       
        // add them into opposite hands
        document.getElementById(id1).appendChild(card2)
        document.getElementById(id2).appendChild(card1)

        // highlight them for a while
        card1.style.boxShadow="0 0 20px 2px rgb(230, 255, 2)"
        card2.style.boxShadow="0 0 20px 2px rgb(230, 255, 2)"
        await sleep(700)
        card1.style.boxShadow=null
        card2.style.boxShadow=null

        // make all cards unclickable and update storage
        // get number of players
        var total_players = parseInt(sessionStorage.getItem("players"));
        for(let p=0 ; p<total_players ; p++){
            class_name = "cards player"+(p+1)+"Cards"
            //make player hand cards unclickable
            player = document.getElementsByClassName(class_name);
            for(c = 0 ; c<p1Cards.length ; c++){
                if (p==0){
                    player[c].setAttribute("onclick","remove_from_hand(this)")
                }
                player[c].style.pointerEvents="none";
            }
        }
        // make swapped cards unkown at both ends
        unkown_players(card1.id, card2.id) 

        // console.log("-----------------------Player 1 MOVE-----------------------")
        // console.log(JSON.parse(sessionStorage.getItem("players_data")))

        // now let opponents make their move
        make_opponents_move();
    }
}

// Throw the card taken from deck
function put_on_dealt(){
    //put revelead card at place of the one that was removed
    card = document.getElementsByClassName("cards frontside current")[0];
    //change card attributes for new location
    card_source = "images/cards/"+card.id+".png";
    card.className = "cards frontside dealt"
    card.src = card_source
    card.style.pointerEvents = "none";
    // put on dealt
    document.getElementById("dealt").appendChild(card);
    
    //make player hand cards unclickable
    p1Cards = document.getElementsByClassName("player1Cards");
    for(i =0 ; i<p1Cards.length ; i++){
        p1Cards[i].style.pointerEvents="none";
    }
    
    // if card thrown is 7, make all hands clickable for swapping
    special_Card_thrown = false;
    if (card.id.split("_")[0] == "7"){
        //get number of players
        var total_players = parseInt(sessionStorage.getItem("players"));
        for(let p=0 ; p<total_players ; p++){
            class_name = "cards player"+(p+1)+"Cards"
            //make player hand cards unclickable
            PLAYER = document.getElementsByClassName(class_name);
            for(i =0 ; i<p1Cards.length ; i++){

                PLAYER[i].setAttribute("onclick","user_satti_move(this)")
                PLAYER[i].style.pointerEvents="auto";
            }
        }
        special_Card_thrown=true;
    }
    
    // console.log("-----------------------Player 1 MOVE-----------------------")
    // console.log(JSON.parse(sessionStorage.getItem("players_data")))
    document.getElementById("dealt").style.pointerEvents="none"
    //check if game finished
    deck = document.getElementsByClassName("cards backside deck")
    if(deck.length == 0){
        game_end = true;
        show_winner();
        return
    }
    if (special_Card_thrown == false)
        make_opponents_move();
}

// Throw the card taken from hand
function remove_from_hand(card){

    document.getElementById("dealt").style.pointerEvents="none"
    card_id = (card.id)
    p1Cards = document.getElementsByClassName("cards player1Cards");
    card_loc = card_location(card, p1Cards)

    //create variable with link to image
    card_source = "images/cards/"+card.id+".png";
    
    //get area where card is to be placed
    pop_up_space = document.getElementById("dealt");
    //change card attributes for new location
    
    card.src = card_source
    card.className = "cards frontside dealt"
    card.setAttribute("onclick", "remove_from_current(this)");
    card.style.pointerEvents="none";
    card.style.transform = "rotate("+ Math.floor(Math.random()*15)  +"deg)";
    if(document.getElementsByClassName("cards frontside dealt").length != 2){
        card.style.boxShadow = "0 0 40px 8px rgba(65, 65, 65, 0.247)"
    }
    else{
        card.style.boxShadow = null
    }
    
    //put the card on availble space
    pop_up_space.appendChild(card);
    
    //put revelead card at place of the one that was removed
    currentCard = document.getElementsByClassName("cards frontside current")[0];
    
    //change card attributes for new location
    currentCard.className = "cards player1Cards"
    currentCard.src = backside_src
    currentCard.setAttribute("onclick", "remove_from_hand(this)");
    currentCard.style.pointerEvents = "none";
    currentCard.style.transform = "rotate(0)";

    //put the card at players hand
    document.getElementById(""+(card_loc)).appendChild(currentCard);

    //make cards unclickable
    for (i=0 ; i<p1Cards.length ; i++){
        p1Cards[i].style.pointerEvents="none"
    }
    
    //update storage after move
    players = JSON.parse(sessionStorage.getItem("players_data"));
    players[0][card_loc] = currentCard.id;
    sessionStorage.setItem("players_data", JSON.stringify(players));

    special_Card_thrown = false
    // if card thrown is 7, make all hands clickable for swapping
    if (card_id.split("_")[0] == "7"){
        //get number of players
        var total_players = parseInt(sessionStorage.getItem("players"));
        for(let p=0 ; p<total_players ; p++){
            cn = "cards player"+(p+1)+"Cards"
            //make player hand cards clickable
            PLAYER = document.getElementsByClassName(cn);
            for(i =0 ; i<p1Cards.length ; i++){

                PLAYER[i].setAttribute("onclick","user_satti_move(this)")
                PLAYER[i].style.pointerEvents="auto";
            }
        }
        special_Card_thrown = true;
    }

    
    // store our move
    my_move = {
        player: 1,
        where: card_loc,
        what: card_id
    }
    moves = JSON.parse(window.sessionStorage.getItem("player_moves"));
    moves.push(my_move)
    sessionStorage.setItem("player_moves", JSON.stringify(moves))
    
    // console.log("-----------------------Player 1 MOVE-----------------------")
    // console.log(JSON.parse(sessionStorage.getItem("players_data")))
    // console.log(JSON.parse(window.sessionStorage.getItem("player_moves")))
    
    //check if game finished
    deck = document.getElementsByClassName("cards backside deck")
    if(deck.length == 0){
        game_end = true;
        show_winner();
        return
    }
    if (special_Card_thrown == false)
        make_opponents_move();
}

//                  ------------PC Moves------------

// Send AI Current Status for Normal Move
function send_current_status(n, p_data, av_card){
    obj = {
        players: p_data,
        player_num: n,
        avail_card: av_card
    };
    const data = JSON.stringify(obj);
    $.post( "http://127.0.0.1:5500/postmethod", {
        javascript_data: data 
    });
}

// Send AI Current Status for Special 7 Card Move
function send_satti_status(n, p_data){
    moves = JSON.parse(window.sessionStorage.getItem("player_moves"));
    moves_to_send = []
    // remove self_move
    for(let m=moves.length-1 ;  m>=0 ; m--){

        if(moves[m].player != n)
            moves_to_send.push(moves[m])

        if (moves_to_send.length == p_data.length-1)
            break
    }
    obj = {
        players: p_data,
        player_num: n,
        info: moves_to_send
    };
    const data = JSON.stringify(obj);
    $.post( "http://127.0.0.1:5500/sattimethod", {
        javascript_data: data 
    });
}

// Ask AI For Next Normal Move
function get_next_move(){
    $.get("http://127.0.0.1:5500/getpythondata", function(data) {
        complete_move = data.split(" ")
        sessionStorage.setItem("next_move", JSON.stringify(complete_move))
        bruh = JSON.parse(sessionStorage.getItem("next_move"))
    })
}

// Ask AI For next Special 7 Card Move
function next_satti_move(){
    $.get("http://127.0.0.1:5500/getsattidata", function(data) {
        complete_move = data.split(" ")
        sessionStorage.setItem("next_satti_move", JSON.stringify(complete_move))
        bruh = JSON.parse(sessionStorage.getItem("next_satti_move"))
    })
}

// Take  the Special 7 Card Move on Web and Storage
async function pc_satti_move(j, players){
    send_satti_status(j,players)
    await sleep(800) //wait for it to send
    // get move from AI
    next_satti_move()
    await sleep(800) //wait for it to load
    satti_move = JSON.parse(sessionStorage.getItem("next_satti_move"))

    var move = parseInt(satti_move[0])
    var player_card = parseInt(satti_move[1])

    var card1 = card_from_board_matrix(move);
    var card2 = card_from_board_matrix(player_card);
    if (card2.className == "cards player1Cards"){
        // if replaced with user
        card2.removeAttribute("onclick")
        card1.removeAttribute("onclick")
        card1.setAttribute("onclick","remove_from_hand(this)")
    }

    // console.log("---------------------------------------------------")
    
    // change classses
    var temp = card1.className
    card1.className = card2.className
    card2.className = temp
    
    // change styles
    var temp2 = card1.style
    card1.style = card2.style
    card2.style = temp2

    // console.log(card1.id)
    // console.log(card2.id)
    
    //change their locations
    document.getElementById(""+move).appendChild(card2)
    document.getElementById(""+player_card).appendChild(card1)

    // highlight them for a while
    card1.style.boxShadow="0 0 20px 2px rgb(230, 255, 2)"
    card2.style.boxShadow="0 0 20px 2px rgb(230, 255, 2)"
    await sleep(700)
    card1.style.boxShadow=null
    card2.style.boxShadow=null

    // update players storage
    locations = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [9,10,11]
    ]

    // make both cards unkown for players
    unkown_players(card1.id, card2.id)

}

// Take  the Normal Move on Web and Storage
async function make_opponents_move(){
    //get number of players
    var total_players = parseInt(sessionStorage.getItem("players"));
    players = JSON.parse(sessionStorage.getItem("players_data"));

    player_nums = [2,3,4];
    locations = [
        [3,4,5],
        [6,7,8],
        [9,10,11]
    ]
    for (i=0; i<total_players-1 ; i++){
        saved_alread = false;
        await sleep(800);
        // ----------------------------REMOVE FROM DECK AND TAKE A LOOK-------------------
        // remove top card from deck and place it in center
        card_id = pop_card_from_deck()
        current_area = document.getElementById("current");
        
        // create card
        card2 = document.createElement("img")
        card2.id = card_id;
        card2.className= "cards backside current";
        card2.src = backside_src;
        card2.style.transform = "rotate("+ Math.floor(Math.random()*15)  +"deg)";
        card2.style.pointerEvents="none"
        
        //put on table
        current_area.appendChild(card2);
        
        // ----------------------------ASK AI FOR NEXT MOVE-------------------
        
        // get player number
        j = player_nums[i];
        curr_class = "player" + j + "Cards";
        //highlight area of current opponent
        huh = curr_class.split("Cards")[0]
        document.getElementById(huh).style.visibility="visible";
        document.getElementById(huh).style.boxShadow="0 0 20px 2px rgba(65, 65, 65, 0.247)";
        
        // send current status to AI
        send_current_status(j, players, card_id)
        await sleep(800) //wait for it to send
        // get move from AI
        get_next_move()
        await sleep(800) //wait for it to load
        complete_move = JSON.parse(sessionStorage.getItem("next_move"))
        
        move = parseInt(complete_move[0])
        where = parseInt(complete_move[1])
        
        
        await sleep(800);
        
        // ------------------NEXT STEP DEPENDING ON TO KEEP OR THROW-----------------------
        if (where == 1){
            // get opponent card and its location
            opponent_move = card_from_board(j,move).id
            opponent_card = document.getElementById(opponent_move);
            card_loc = locations[i][move];

            // take card from opponent and place on table
            dealt_area = document.getElementById("dealt")
            // change attributes for new location
            card_source = "images/cards/"+opponent_move+".png";
            opponent_card.className = "cards frontside dealt";
            opponent_card.src = card_source;
            opponent_card.style.pointerEvents="none"
            opponent_card.style.boxShadow = null
            // put on table
            dealt_area.appendChild(opponent_card)
            // await sleep(800);

            // replace with opponents hand
            currentCard = document.getElementsByClassName("cards backside current")[0];
            currentCard.className = "cards "+curr_class;
            currentCard.src = backside_src;
            currentCard.style.visibility="visible"
            currentCard.style.transform = "rotate(0)";
            // put on opponent's hand
            document.getElementById(""+card_loc).appendChild(currentCard);
            currentCard.style.boxShadow = "0 0 20px 2px rgb(230, 255, 2)"
            await sleep(800)
            currentCard.style.boxShadow = null
            players[j-1][move] = currentCard.id;

            // store our move
            my_move = {
                player: j,
                where: move,
                what: opponent_move
            }
            moves = JSON.parse(window.sessionStorage.getItem("player_moves"));
            moves.push(my_move)
            sessionStorage.setItem("player_moves", JSON.stringify(moves))
            
            sessionStorage.setItem("players_data", JSON.stringify(players));
            // see if 7satti is thrown
            if (opponent_card.id.split("_")[0] == "7"){
                // console.log(JSON.parse(sessionStorage.getItem("players_data")))
                await pc_satti_move(j, players)
                players = JSON.parse(sessionStorage.getItem("players_data"))
            }
        }
        else{
            // take card from current and place on table
            dealt_area = document.getElementById("dealt")
            
            card2.style.boxShadow = "0 0 20px 2px rgb(230, 255, 2)"
            await sleep(1000)
            card2.style.boxShadow = null
            
            // change attributes for new location
            card_source = "images/cards/"+card2.id+".png";
            card2.className = "cards frontside dealt";
            card2.src = card_source;
            card2.style.pointerEvents="none"
            card2.style.boxShadow = null
            // put on table
            dealt_area.appendChild(card2)
            
            // see if 7satti is thrown
            sessionStorage.setItem("players_data", JSON.stringify(players));
            if (card2.id.split("_")[0] == "7"){
                
                // console.log(JSON.parse(sessionStorage.getItem("players_data")))
                await pc_satti_move(j, players)
                players = JSON.parse(sessionStorage.getItem("players_data"))
            }
        }
        
        document.getElementById(huh).style.boxShadow=null
        
        // console.log("-----------------------Player "+j+" MOVE-----------------------")
        // console.log(players)
        // console.log(JSON.parse(window.sessionStorage.getItem("player_moves")))

        deck = document.getElementsByClassName("cards backside deck")
        if(deck.length == 0){
            game_end = true;
            show_winner();
            return
        }
    }
    deck = document.getElementsByClassName("cards backside deck")
    if(deck.length == 0){
        game_end = true;
        show_winner();
        return
    }
    deck[deck.length-1].style.pointerEvents="auto"
}

// --------------------------Game Finished--------------------------

// Reveal cards of all the players
function reveal_cards(player){
    class_name = "cards player" + player + "Cards"
    cards = document.getElementsByClassName(class_name)
    for (i=0 ; i<3 ; i++)
        cards[i].src = "images/cards/"+cards[i].id+".png";
}

// Highlight the winners' Hand
function add_shadow_to_winners(player){
    class_name = "cards player" + player + "Cards"
    cards = document.getElementsByClassName(class_name)
    for (i=0 ; i<3 ; i++)
        // cards[i].style.border="thick solid green"
        cards[i].style.boxShadow = "0 0 20px 2px rgb(255, 174, 0)";
}

// Find the Winner
async function show_winner(){
    upd_players();
    // console.log("FINAL STORAGE")
    var total_players = parseInt(sessionStorage.getItem("players"));
    players = JSON.parse(sessionStorage.getItem("players_data"));
    // console.log(players)
    player_names = ["Player 1", "Player 2", "Player 3", "Player 4"]
    hands = []
    scores = [];
    for ( i=0 ; i<total_players ; i++){
        hands.push(players[i])
        total = 0
        for (j=0 ; j<3 ; j++){
            total += score(players[i][j])
        }
        scores.push(total)
    }
    win_score = Math.min(...scores);
    winners = []
    for (let i=0 ; i<total_players ; i++){
        if (win_score == scores[i])
        winners.push(player_names[i])
    }
    
    msg = ""
    if (winners.length > 1){
        msg = "Winners are: " + winners.join(", ")
    }
    else{
        msg = "Winner is: " + winners[0]
    }
    for(z=1 ; z<=total_players ; z++){
        reveal_cards(z)
        if(scores[z-1] == win_score){
            add_shadow_to_winners(z)
        }
        await sleep(800)
    }
    // console.log(win_score)
    show_result(total_players, win_score, scores, player_names)
}

// Show the Result on Screen
function show_result(total_players, win_score, scores, player_names){
    // hide game board
    document.getElementById("dealt").remove()
    document.getElementById("current").remove()
    document.getElementById("deck").remove()

    // show result board
    document.getElementById("ann").style.position="relative"
    document.getElementById("ann").style.visibility="visible"
    document.getElementById("ann").style.opacity="1"

    // sort names according to scores
    for(let k=0 ; k<total_players ; k++){
        for (let m=0 ; m<total_players ; m++){
            if (scores[k] < scores[m]){
                let temp = scores[k];
                scores[k] = scores[m];
                scores[m] = temp;

                let temp2 = player_names[k];
                player_names[k] = player_names[m];
                player_names[m] = temp2;
            }
        }
    }

    for(let k=0 ; k<4 ; k++){
        score = "score"+(k+1)
        btn = document.getElementById(score)
        if(k >= total_players){
            btn.remove()
        }
        // console.log(score)
        btn.innerHTML = player_names[k]+": "+scores[k]
        if (scores[k]==win_score)
            btn.style.backgroundColor = "green"
    }
}
