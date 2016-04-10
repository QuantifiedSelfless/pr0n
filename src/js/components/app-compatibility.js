React = require('react');
AppStore = require('../stores/app-store.js');

var Compatibility = React.createClass({

    render: function() { 
        var styles = {
            width: this.props.stuff + '%'
        } 
        return (
            <div className="mx2"> 
                <h1 className="center">{"You are " + this.props.stuff + " percent compatible."}</h1>
                <div className="meter yellow mx-auto">
                    <span style={styles}></span>
                </div>
            </div>
        )
    }

});

module.exports = Compatibility;
