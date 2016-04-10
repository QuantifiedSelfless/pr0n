React = require('react')

var PlayerPick = React.createClass({ 

    render: function() {
        return (
            <h3 className="center mr4 italic">{this.props.stuff ? "Player 1 is currently playing" : "Player 2 is currently playing"}</h3>
        )
    }

});

module.exports = PlayerPick;
