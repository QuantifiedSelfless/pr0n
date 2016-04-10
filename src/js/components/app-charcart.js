React = require('react');
$ = require('jquery');
AppStore = require('../stores/app-store.js');
RemoveFromList = require('./app-removefromlist.js');
AppActions = require('../actions/app-actions.js');


var CharCart = React.createClass({
    
    getInitialState: function() {
        return {
            visible: 'hidden',
            items: AppStore.getActiveQuestionList()
        };
    },

    componentWillMount: function() {
        AppStore.addChangeListener('cart_update', this._onChange);
        AppStore.addChangeListener('show_button', this._showButton);
        AppStore.addChangeListener('hide_button', this._hideButton);
    },

    componentWillUnmount: function() {
        AppStore.removeChangeListener('cart_update', this._onChange);
        AppStore.removeChangeListener('show_button', this._showButton);
        AppStore.removeChangeListener('hide_button', this._hideButton);
    },
    componentDidUpdate: function() {
            $(document).scrollTop($(document).height());
    },
    handler: function () {
        AppActions.flipToScreen()
    },

    _onChange: function() {
        this.setState({ items: AppStore.getActiveQuestionList() });
    },

    _showButton: function() {
        this.setState({ visible: 'visible' });
    },

    _hideButton: function() {
        if (this.state.visible != 'hidden') {
            this.setState({ visible: 'hidden' });
        }
    },

    render: function() {
        var items = this.state.items.map(function(item, i) {
            return (
                <div className="col-2 left overflow-hidden" key={i}>
                    <div className="cartbutton overflow-hidden">
                        <div className="left remove cartsize bold"> <RemoveFromList index={i} /> </div>
                        <div className="center px2 cartsize bold"> {item.trait} </div>
                    </div>
                </div>
            );   
        })
        return (
            <div className="choosen">
                <h3>Choosen Characteristics</h3> 
                <div className="clearfix field">
                    {items}
                </div>
                <div className="confirm center">
                    <button className="btn btn-primary" style={{visibility: this.state.visible}} onClick={this.handler}>Confirm</button>
                </div>
            </div>
        )
    }
});

module.exports = CharCart
