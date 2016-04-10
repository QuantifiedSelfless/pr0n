React = require('react');
AppStore = require('../stores/app-store.js');

var CharQuestion = React.createClass({

    getInitialState: function() {
        return {
            question: 0,
            items: AppStore.getInactiveQuestionList()
        };
    },

    componentWillMount: function() {
        AppStore.addChangeListener('cart_update', this._onChange)
    },

    componentWillUnmount: function() {
        AppStore.removeChangeListener('cart_update', this._onChange)
    },

    _onChange: function() { 
        this.setState({ 
            question: this.state.question + 1,
        });
    },

    render: function() {
        return (
                <h2 className="charquestion center title-font">{this.state.items[this.state.question].question}</h2>
        );
    }

});

module.exports = CharQuestion;

