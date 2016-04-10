var AppStore      = require('../stores/app-store.js'),
    CharAnswers   = require('./app-charanswers.js'),
    CharCart      = require('./app-charcart.js'),
    CharList      = require('./app-charlist.js'),
    CharQuestion  = require('./app-charquestions.js'),
    Compatibility = require('./app-compatibility.js'),
    FinalThoughts = require('./app-finalthoughts.js'),
    FlipScreen    = require('./app-flipscreen.js'),
    GameTitles    = require('./app-gametitles.js'),
    PlayerPick    = require('./app-playerpick.js'),
    React         = require('react');

var App = React.createClass({

    getInitialState: function() {
        return {
            finalstate: false,
            flipscreen: false,
            currPlayer: 1,
            currState: 1,
            confirm_cart: true,
            stage: 0,
            titlestate: 0,
            end: 0,
            showPlayer: true,
            showResults: true,
            title: GameTitles, 
            body: CharList, 
            misc: CharCart,
        } 
    },

    componentWillMount: function() {
        AppStore.addChangeListener('switch_to_flipscreen', this._fliptoChange);
        AppStore.addChangeListener('switch_from_flipscreen', this._flipfromChange);
    },
    
    _fliptoChange: function() {
        this.setState({
            flipscreen: true,
            currPlayer: AppStore.switchPlayer(),
            body: FlipScreen,
            showPlayer: false,
            showResults: false
        });
    },

    _flipfromChange: function() {

        switch(this.state.stage) {
            //stage 1, part 2
            case 0:
                this.setState({
                    stage: this.state.stage + 1,
                    flipscreen: false,
                    showPlayer: true,
                    showResults: true,
                    body: CharList,
                    misc: CharCart
                });
                break; 
            //stage 2, part 1
            case 1:
                AppStore.getState()
                this.setState({
                    stage: this.state.stage + 1,
                    titlestate: this.state.titlestate + 1,
                    flipscreen: false,
                    showPlayer: true,
                    showResults: true,
                    body: CharQuestion,
                    misc: CharAnswers
                }); 
                break;
            //stage 2, part 2
            case 2:
                this.setState({
                    stage: this.state.stage + 1,
                    flipscreen: false,
                    showPlayer: true,
                    showResults: true,
                    body: CharQuestion,
                    misc: CharAnswers,
                    finalstate: true
                });
                break;
            //final stage 
            case 3:
                this.setState({
                    titlestate: this.state.titlestate + 1,
                    flipscreen: false,
                    showPlayer: false,
                    end: AppStore.getSum(),
                    body: Compatibility,
                    misc: FinalThoughts,
                }); 
                break;
            
            break; 
        }
    },   

    render: function() {
        return (
            <div>
                <div>
                    <div className="titles">
                        <img className="logo-container2" src="../src/js/img/Yellow-Tree-logo.png"></img>
                        <this.state.title stage={this.state.titlestate} flipscreen={this.state.flipscreen}/>
                    </div>
                    <div>{this.state.showPlayer ? <PlayerPick stuff={this.state.currPlayer} /> : null}</div>
                    <div><this.state.body stuff={this.state.end}/></div>
                </div> 
                <div>{this.state.showResults ? <this.state.misc stuff={this.state.end}/> : null}</div>
            </div>
        )
    }
});

module.exports = App;
