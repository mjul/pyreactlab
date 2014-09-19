/**
 * Created by mjul on 18/09/14.
 */

"use strict";


var ListItem = React.createClass({
    displayName: 'ListItem',

    propTypes: {
        index: React.PropTypes.number.isRequired,
        data: React.PropTypes.object.isRequired,
        onListItemDeleted: React.PropTypes.func
    },

    handleDelete: function (evt) {
        evt.preventDefault();
        if (this.props.onListItemDeleted) {
            this.props.onListItemDeleted(this.props.index, this.props.data)
        }
    },

    render: function () {
        return React.DOM.li({className: 'listItem'},
            React.DOM.div({className: 'listItemChildren'}, this.props.children),
            React.DOM.div({className: 'listItemControls'},
                React.DOM.button({className: 'delete', onClick: this.handleDelete}, 'Delete')));
    }
});

var List = React.createClass({
    displayName: 'List',

    propTypes: {
        data: React.PropTypes.array.isRequired,
        onListItemDeleted: React.PropTypes.func
    },

    handleListItemDeleted: function (itemNumber, itemData) {
        var remainingItems = React.addons.update(this.props.data, {$splice: [
            [itemNumber, 1]
        ]});
        if (this.props.onListItemDeleted) {
            this.props.onListItemDeleted(itemNumber, remainingItems, itemData);
        }
    },

    render: function () {
        var deletedCallback = this.handleListItemDeleted;
        var dataItems = this.props.data;
        var items = React.Children.map(this.props.children, function (c, index) {
            var d = dataItems[index];
            return ListItem({key: 'LI_key_' + index, onListItemDeleted: deletedCallback,
                index: index, data: d}, c);
        });
        return React.DOM.ul({className: 'list', data: this.props.data},
            items
        );
    }
});


var Value = React.createClass({
    displayName: 'Value',
    propTypes: {
        data: React.PropTypes.shape({text: React.PropTypes.string.isRequired}).isRequired,
        onListItemDeleted: React.PropTypes.func
    },
    render: function () {
        return React.DOM.div({className: 'value'}, this.props.data.text);
    }
});


var ListItemAdder = React.createClass({
    displayName: 'ListItemAdder',
    propTypes: {
        onListItemAdded: React.PropTypes.func.isRequired
    },
    getInitialState: function () {
        return {newValue: ''};
    },
    handleChange: function (evt) {
        var newValue = evt.target.value;
        this.setState({newValue: newValue});
    },
    handleAddValue: function (evt) {
        evt.preventDefault();
        var text = this.state.newValue;
        this.setState({newValue: ''});
        this.props.onListItemAdded(text);
    },
    render: function () {
        var handleChangeCallback = this.handleChange;
        return React.DOM.div({className: 'listItemAdder'},
            React.DOM.form({onSubmit: this.handleAddValue},
                React.DOM.input({onChange: handleChangeCallback, value: this.state.newValue}),
                React.DOM.button({disabled: (this.state.newValue.length == 0)}, "Add")));
    }
});

var Group = React.createClass({
    displayName: 'Group',

    propTypes: {
        index: React.PropTypes.number.isRequired,
        data: React.PropTypes.shape({
            groupId: React.PropTypes.number.isRequired,
            name: React.PropTypes.string.isRequired,
            values: React.PropTypes.array.isRequired
        }).isRequired,
        onGroupValueDeleted: React.PropTypes.func,
        onGroupValueAdded: React.PropTypes.func
    },
    handleValueAdded: function (text) {
        var group = this.props.data;
        var newValue = {text: text};
        var newGroup = React.addons.update(group, {values: {$push: [newValue]}});
        this.props.onGroupValueAdded(this.props.index, newGroup, newValue);
    },

    handleValueDeleted: function (valueIndex, newValues, deletedValue) {
        var newGroup = React.addons.update(this.props.data, {values: {$set: newValues}});
        if (this.props.onGroupValueDeleted) {
            this.props.onGroupValueDeleted(this.props.index, newGroup, deletedValue);
        }
    },
    render: function () {
        var deletedCallback = this.handleValueDeleted;
        var addedCallback = this.handleValueAdded;
        var dataValues = this.props.data.values;
        var values = dataValues.map(function (v, index) {
            return Value({data: v, key: "value_" + index});
        });
        return React.DOM.div({className: 'group'},
            React.DOM.h2(null, this.props.data.name),
            React.DOM.div({className: 'values'},
                List({onListItemDeleted: deletedCallback, data: dataValues}, values),
                ListItemAdder({onListItemAdded: addedCallback})
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

    handleGroupValueAdded: function (index, newGroup, newValue) {
        var groups = this.state.data;
        var maxValueId = -1;
        groups.forEach(function (group) {
            var vals = group.values.map(function (v) {
                return v.valueId;
            });
            var maxInGroup = Math.max.apply(Math, vals);
            maxValueId = Math.max(maxValueId, maxInGroup);
        });
        var valueIndex = newGroup.values.indexOf(newValue);
        newValue.valueId = maxValueId;
        newGroup[valueIndex] = newValue;
        var newGroups = React.addons.update(groups, {$splice: [
            [index, 1, newGroup]
        ]});
        this.setState({data: newGroups});
    },

    handleGroupValueDeleted: function (index, newGroup, deletedValue) {
        var groups = this.state.data;
        var newGroups = React.addons.update(groups, {$splice: [
            [index, 1, newGroup]
        ]});
        this.setState({data: newGroups});
    },

    handleAddGroup: function (name) {
        var groups = this.state.data;
        var maxGroupId = Math.max.apply(null, groups.map(function (g) {
            return g.groupId;
        }));
        var newGroup = {groupId: maxGroupId + 1, name: name, values: []};
        var newGroups = React.addons.update(groups, {$push: [newGroup]});
        this.setState({data: newGroups});
    },

    render: function () {
        var groupValueCallback = this.handleGroupValueAdded;
        var groupValueDeletedCallback = this.handleGroupValueDeleted;
        var addGroupCallback = this.handleAddGroup;
        var items = this.state.data.map(function (group, index) {
            return Group(
                {data: group,
                    index: index,
                    key: "group_" + group.groupId,
                    onGroupValueAdded: groupValueCallback,
                    onGroupValueDeleted: groupValueDeletedCallback});
        });
        return React.DOM.div({className: 'groupsAndValues'},
            items,
            ListItemAdder({onListItemAdded: addGroupCallback})
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
