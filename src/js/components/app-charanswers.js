React = require('react');
AppStore = require('../stores/app-store.js');
AppActions = require('../actions/app-actions.js');
AddToList = require('./app-addtolist.js');

var CharAnswers = React.createClass({ 

    getInitialState: function() {
        return { 
            question_state: 0,
            questions: AppStore.getInactiveQuestionList(),
            titles: AppStore.getAnswerTitles(), 
            titles_flipped: AppStore.getFlippedTitles()
        }
    },

    componentWillMount: function() {
        AppStore.addChangeListener('cart_update', this._onChange);
    },

    componentWillUnmount: function() {
        AppStore.removeChangeListener('cart_update', this._onChange);
    }, 

    _onChange: function() {
        this.setState({ question_state: this.state.question_state + 1 });
    },
        
    render: function() {
        var items = []
        for (var i=0; i<this.state.questions.length; i++) {
            if (!this.state.questions[i].flipped) {
                items.push(this.state.titles.map( function(item, i) {
                    return (
                        <AddToList item={item} stage={1} key={i}/>
                    )
                }))
            }
            else {
                items.push(this.state.titles_flipped.map( function(item, i) {
                    return (
                        <AddToList item={item} stage={1} key={i}/>
                    )
                }))
            }
        }
        return  (
            <div className="flex flex-justify charlist field">
                {items[this.state.question_state]}
            </div>
        );
    }

});

module.exports = CharAnswers;
