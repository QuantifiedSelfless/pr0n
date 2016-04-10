React = require('react');
AppActions = require('../actions/app-actions.js');

var RemoveFromList = React.createClass({
    
    handler: function() {
        AppActions.removeChar(this.props.index)
    },

    render: function() {
        return <div className="center" onClick={this.handler}>x</div>
    }

});

module.exports = RemoveFromList;
