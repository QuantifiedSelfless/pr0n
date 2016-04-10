React = require('react');
AppStore = require('../stores/app-store.js');

var FinalThoughts = React.createClass({

    getInitialState: function() {
        return {
            similar: AppStore.getSimilarChar(),
            thoughts: AppStore.getThoughts(),
            message: AppStore.calculateMessage(this.props.stuff)
        }
    },

    render: function() {
        console.log(this.state.similar);
        return (
            <div className="center">
                <h3>{this.state.similar}</h3>
                <h3>{this.state.thoughts[this.state.message]}</h3>
            </div>
        )
    }
});

module.exports = FinalThoughts;
