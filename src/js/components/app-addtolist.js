React = require('react');
AppActions = require('../actions/app-actions.js');

var AddToList = React.createClass({

    handler: function() {
        AppActions.addChar(this.props.item)
    },

    render: function() {
        var local_title = !this.props.stage ? this.props.item.trait : this.props.item.title;
        return (
            <div className="col-2 center  button-spacing">
                <button className="btn btn-primary" onClick={this.handler} key={this.props.key}>{local_title}</button>
            </div>
        );
    }
    
});

module.exports = AddToList; 
