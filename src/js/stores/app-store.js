'use strict';
var AppDispatcher = require('../dispatchers/app-dispatcher.js');
var assign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;
//keeping track of gamestate in the store
var current_state = 0;
var checked = false;
//declare object lists
var char_list = [];
var answer_titles = [];
var answer_titles_flipped = [];
var similar_char = [];
//game data 
var thoughts = ["Romance is hard! Don't feel discouraged.", "You wouldn't last a week together", "You're either weirdly compatibile, or best friends."]
var flipmessage = ['Please turn the screen to player 1.', 'Please turn the screen to player 2'];
var title_list = ['Please choose 5 personalities you value the most in a romantic partner.', 'Answer the following questions about a romantic partner with the following characteristics.', 'Thanks for playing!'];
var trait_list = [
    { 'question': 'I value others\' well-being over my own.',
        'trait': 'Considerate',
        'flipped': false
    },
    { 'question': 'I work hard on tasks even when they prove to be difficult.',
        'trait': 'Conscientious',
        'flipped': false
    },
    { 'question': 'I get anxious when I have to wait through something I don\'t enjoy.',
        'trait': 'Patient',
        'flipped': true
    },
    { 'question': 'I hold back from speaking my thoughts if I think others\' will be displeased.',
        'trait': 'Direct',
        'flipped': true
    },
    { 'question': 'I prefer being around friends than being alone.',
        'trait': 'Social',
        'flipped': false
    },
    { 'question': 'It is difficult for me to commit to changes I want to make to myself.',
        'trait': 'Disciplined',
        'flipped': true
    },
    { 'question': 'I enjoy thinking about complex social and philosophical issues.',
        'trait': 'Deep',
        'flipped': false
    },
    { 'question': 'I have been in many relationships and know myself well as a partner.',
        'trait': 'Experienced',
        'flipped': false
    },
    { 'question': 'I am dedicated to a higher power above humanity.',
        'trait': 'Religious',
        'flipped': false
    },
    { 'question': 'If I have money, I tend to spend it.',
        'trait': 'Frugal',
        'flipped': true
    },
    { 'question': 'When I hear a new perspective, I have a hard time listening.',
        'trait': 'Open-minded',
        'flipped': true
    },
    { 'question': 'If someone asks for help, I do not expect anything in return.',
        'trait': 'Generous',
        'flipped': false
    },
    { 'question': 'I avoid situations that could jeopardize my relationships.',
        'trait': 'Loyal',
        'flipped': false
    },
    { 'question': 'I often feel like all attempts at doing good will fail.',
        'trait': 'Optimistic',
        'flipped': true
    },
    { 'question': 'I rarely consider how much I have exercised before deciding what to eat.',
        'trait': 'Healthy',
        'flipped': true
    },
    { 'question': 'I feel it is important I meet or exceed people\'s expectations of me.',
        'trait': 'Responsible',
        'flipped': false
    },
    { 'question': 'I am careful to learn the sexual preferences of my partner.',
        'trait': 'Romantic',
        'flipped': false
    },
    { 'question': 'Manners and social graces are very important to me.',
        'trait': 'Polite',
        'flipped': true
    },
    { 'question': 'I pay close attention to the emotions of the people around me.',
        'trait': 'Sensitive',
        'flipped': false
    },
    { 'question': 'When someone disrepects a friend or partner, I immediately defend them.',
        'trait': 'Protective',
        'flipped': false
    }];
var temp_titles = ['Strongly Agree', 'Agree', 'Not Sure', 'Disagree', 'Strongly Disagree'];

//build list objects for data passed by dispatcher
for(var i=0; i<(trait_list.length); i++) {
     char_list.push({
         'title': title_list[i],
     });
}    

for(var i=0;i<(temp_titles.length); i++) {
    answer_titles.push({
        'id': temp_titles.length - i - 1,
        'title': temp_titles[i]
    });
    answer_titles_flipped.push({
        'id': i,
        'title': temp_titles[i]
    });
}

//player classes 
class player {
    constructor(id, active) {
        this.id = 'player' + id;
        this.stage = 0;
        this.active = active;
        this.traits = [];
        this.questions = [];
        this.sum = 0;
    }
    addToList(item, thisList) {
        switch (this.stage) { 
            case 0:
                if (!item.inList) {
                    item['inList'] = true;
                    thisList.push(item);
                }
                break;
            case 1:
                thisList.push(item);
                break;
        }
    }
    removeFromList(index, thisList) {
        thisList[0]['inList'] = false;
        thisList.splice(index, 1);
    }
    isActive() {
        return this.active;
    }
    flipActive() {
        if (this.active) {
            this.addStage();
        }
        for (var i=0; i<trait_list.length; i++) {
            trait_list[i]['inList'] = false; 
        }
        this.active = !this.active;
    }
    activeList() {
        if (!this.stage) {
            return this.traits;
        }
        else {
            return this.questions;
        }
    }
    activeStage() {
        return this.stage;
    }
    addStage() {
        this.stage += 1;
    }
    sumList() {
        if (this.sum) return this.sum;
        for (var i=0; i<(this.questions.length); i++) {
           this.sum += this.questions[i].id;
        }
        return (this.sum / 25)*50;
    }
}

//initializing player objects, player one is initalized as active
var Player_1 = new player(1, true);
var Player_2 = new player(2, false);

//swap active player function
function activePlayer() {
    var player = Player_1.isActive() ? Player_1 : Player_2;
    return player;
}
function inactivePlayer() {
    var player = Player_1.isActive() ? Player_2 : Player_1;
    return player;
}
//AppStore event emitter
var AppStore = assign(EventEmitter.prototype, {
    emitChange: function(change) {
        this.emit(change)
    },
    addChangeListener: function(change, callback) {
        this.on(change, callback);
    },
    removeChangeListener: function(change, callback) {
        this.removeListener(change, callback);
    },

    //game specific functions
    currentPlayer: function() {
        return !Player_1.isActive() ? 1 : 0;
    },
    getAnswerTitles: function() {
        return answer_titles;
    },
    getFlippedTitles: function() {
        return answer_titles_flipped;
    },
    getTraits: function() {
        return trait_list;
    }, 
    getTitles: function() {
        return title_list;
    },
    getActiveQuestionList: function() {
        var player = activePlayer();
        return player.traits; 
    },
    getInactiveQuestionList: function() {
        var player = inactivePlayer();
        return player.traits;
    },
    switchPlayer: function() {
        Player_1.flipActive();
        Player_2.flipActive();
        return Player_1.isActive();
    },
    getSimilarChar: function() {
        console.log(similar_char.length);
        if (similar_char.length == 0) { return "You did not choose similar characteristics." }
        if (similar_char.length == 1) { return "You had 1 characteristic in common." }
        else  { return "You chose " + similar_char.length + " of the same characteristics." }
    },
    getSum: function() {
        var temp = Player_1.sumList() + Player_2.sumList();
        for (var i=0; i<Player_1.traits.length; i++) {
           if (Player_1.traits[i].trait == Player_2.traits[i].trait) {
               temp+=7;
               similar_char.push(Player_1.traits[i].trait);
           }
        }
        console.log(temp);
        return temp
    },
    calculateMessage: function(i) {
        console.log(i);
        var temp = 0;
        if (i<30) { temp = 0 }
        if (i>30 && i<60) { temp = 1 }
        if (i>60) { temp = 2 } 
        return temp;
    },
    flipscreen: function(i) {
        return flipmessage[i];
    },
    getState: function() {
        current_state++;
    },
    getThoughts: function() {
        return thoughts;
    },
    //event dispatcher
    dispatcherIndex: AppDispatcher.register(function(payload) {
        var action = payload.action;
        var player = activePlayer();
        var finalstate = false;
        switch(action.actionType) {
            
            //this triggers when things are added to the player lists
            case "ADD_CHAR":
                //this allows for different active list lengths for stage two question list
                // var active_list_length = !player.activeStage() ? 5 : 5;
                //only add if cart has room
                if (player.activeList().length != 5) {
                    player.addToList(payload.action.item, player.activeList());  
                    AppStore.emitChange('cart_update');
                }
                if (!current_state && (player.activeList().length == 5)) {
                    //this is a 'confirm' button for the stage one cart
                    AppStore.emitChange('show_button');
                    break;
                }
                //this will trigger from the flipscreen continue button
                else if (player.activeList().length == 5) {
                    if (Player_2.isActive()) { 
                        AppStore.emitChange('switch_from_flipscreen'); 
                        break;
                    }
                    AppStore.emitChange('switch_to_flipscreen');
                } 
                break;

            //this triggers only in stage one when things are removed from the app-cart 
            case "REMOVE_CHAR":
                player.removeFromList(payload.action.index, player.activeList()); 
                AppStore.emitChange('hide_button');
                AppStore.emitChange('cart_update');
                break;
                
            //these swap the game to and from the flipscreen state  
            case "FLIP_TO_SCREEN": 
                AppStore.emitChange('switch_to_flipscreen');
                break;

            case "FLIP_FROM_SCREEN": 
                AppStore.emitChange('switch_from_flipscreen');
                break;
        }

        return true;
    })
})

module.exports = AppStore;
