React = require('react');
AppStore = require('../stores/app-store.js');
AddToList = require('./app-addtolist.js');


var CharList = React.createClass({
    
    getInitialState: function () {
        return { items: AppStore.getTraits() };
    },
    
    render: function() {
        var items = this.state.items.map(function (item, i) {
            return (
                <AddToList item={item} stage={0} key={i}/> 
            );
        });

        debugger;
    
        return (
            <div className="flex flex-wrap charlist field">
                {items}
            </div>
        )
    }
}); 

module.exports = CharList
