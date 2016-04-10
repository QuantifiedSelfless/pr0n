var AppActions = require('../actions/app-actions'),
    React      = require('react');

var FlipScreen = React.createClass({
    
    handler: function() {
        AppActions.flipFromScreen();
    },

    render: function() {
        return (
            <div className="flex flex-column">
                <img className="mx-auto mb3" src="../src/js/img/arrows-26-128.png"></img>
                <button className="btn btn-primary mx-auto mt3" onClick={this.handler}>Continue</button>
            </div>
        );
    }
});

module.exports = FlipScreen;
