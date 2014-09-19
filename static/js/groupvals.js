/**
 * Created by mjul on 18/09/14.
 */

"use strict";


var Value = React.createClass({
    displayName: 'Value',
    render: function () {
        return React.DOM.li({className: 'value'}, this.props.data.text);
    }
});

var Group = React.createClass({
    displayName: 'Group',
    getInitialState: function () {
        return {newValue: ''};
    },
    handleChange: function (evt) {
        this.setState({newValue: evt.target.value});
    },
    handleAddValue: function (evt) {
        evt.preventDefault();
        var nextNewValue = '';
        this.setState({newValue: nextNewValue});
        this.props.onGroupValueAdded(this.props.data, {text: this.state.newValue});
    },
    render: function () {
        var values = this.props.data.values.map(function (v, index) {
            return Value({data: v, key: "value_" + v.valueId});
        });
        return React.DOM.div({className: 'group'},
            React.DOM.h2(null, this.props.data.name),
            React.DOM.div({className: 'values'},
                React.DOM.ul(null, values),
                React.DOM.div(null,
                    React.DOM.form({onSubmit: this.handleAddValue},
                        React.DOM.input({onChange: this.handleChange, value: this.state.newValue}),
                        React.DOM.button(null, "Add Value")))
                ));
    }
});


var GroupsAndValues = React.createClass({
    displayName: 'GroupsAndValues',
    getInitialState: function () {
        return {
            data: this.props.data,
            newGroup: ''
        };
    },
    handleChange: function (evt) {
        this.setState({newGroup: evt.target.value});
    },
    handleGroupValueAdded: function (group, newValue) {
        var groups = this.state.data;
        var groupPos = groups.indexOf(group);
        var maxValueId = -1;
        groups.forEach(function (group) {
            var vals = group.values.map(function (v) {
                return v.valueId;
            });
            var maxInGroup = Math.max.apply(Math, vals);
            maxValueId = Math.max(maxValueId, maxInGroup);
        });
        newValue.valueId = maxValueId + 1;
        var group = groups[groupPos];
        var newGroup = React.addons.update(group, {values: {$push: [newValue]}});
        var newGroups = React.addons.update(groups, {$splice: [[groupPos,1,newGroup]]});
        this.setState({data: newGroups});
    },
    handleAddGroup: function (evt) {
        evt.preventDefault();
        var groups = this.state.data;
        var maxGroupId = groups.length + 1;
        //var maxGroupId = Math.max.apply(groups.map(function (g) { return g.groupId; }));
        var newGroup = {groupId: maxGroupId + 1, name: this.state.newGroup, values: []};
        this.state.newGroup = '';
        this.setState({data: groups.concat([newGroup])});
    },
    render: function () {
        var groupValueCallback = this.handleGroupValueAdded;
        var groupCallback = this.handleGroupAdded;
        var items = this.state.data.map(function (group, index) {
            return Group(
                {data: group, key: "group_" + group.groupId,
                    onGroupValueAdded: groupValueCallback,
                    onGroupAdded: groupCallback});
        });
        return React.DOM.div({className: 'groupsAndValues'}, items,
            React.DOM.div(null,
                React.DOM.form({onSubmit: this.handleAddGroup},
                    React.DOM.input({onChange: this.handleChange, value: this.state.newGroup}),
                    React.DOM.button(null, "Add Group")
                )
            )
        );
    }
});


function renderGroupsAndValues(dom_id) {
    var target_div = document.getElementById(dom_id);
    var data = [
        {groupId: 1,
            name: 'How many hours?',
            values: [
                {valueId: 1, text: '54'},
                {valueId: 2, text: '62'},
                {valueId: 3, text: '48'}
            ]},
        {groupId: 2,
            name: 'How many cities?',
            values: [
                {valueId: 4, text: '2'},
                {valueId: 5, text: '6'},
                {valueId: 6, text: '5'}
            ]},
        {groupId: 3,
            name: 'Which of these companies?',
            values: [
                {valueId: 7, text: 'Swipe'},
                {valueId: 8, text: 'Wimp'},
                {valueId: 9, text: 'Appear.in'}
            ]}
    ];
    React.renderComponent(GroupsAndValues({data: data}), target_div);
}


window.addEventListener('load', function (evt) {
    renderGroupsAndValues('content');
});
