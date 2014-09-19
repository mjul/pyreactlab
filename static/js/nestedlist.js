/**
 * Created by mjul on 18/09/14.
 */

"use strict";


var ListItem = React.createClass({
    displayName: 'ListItem',
    render: function () {
        var subList = "";
        if (this.props.children) {
            subList = NestedList({data: this.props.children});
        }
        return React.DOM.li({className: 'listItem', key: this.props.id},
                             this.props.text, subList);
    }
});


var NestedList = React.createClass({
    displayName: 'NestedList',
    getInitialState: function() {
        return {data: []};
    },
    render: function() {
        var items = this.props.data.map(function (item) {
                      return ListItem(item);
                    });
        return React.DOM.ul({className: 'nestedList'}, items);
    }
});


function renderList(dom_id) {
    var target_div = document.getElementById(dom_id);
    var data = [{id: 1, text: 'foo',
                    children: [{id: 11, text: 'foo c1'}, {id: 12, text: 'foo c2'}]},
                {id: 2, text: 'bar'}];
    React.renderComponent(NestedList({data: data}), target_div);
}


window.addEventListener('load', function(evt) {
    renderList('content');
});
