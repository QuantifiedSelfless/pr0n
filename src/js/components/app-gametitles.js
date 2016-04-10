React = require('react');
AppStore = require('../stores/app-store.js');
    
var GameTitles = React.createClass({
    
    getInitialState: function() {
        return { titles: AppStore.getTitles() }
    },

    render: function() {
        var temp = !this.props.flipscreen ? AppStore.getTitles()[this.props.stage] : AppStore.flipscreen(AppStore.currentPlayer())
        return (
            <h1 className="title-font title-padding">{temp}</h1>
        )
    }

});

module.exports = GameTitles;
