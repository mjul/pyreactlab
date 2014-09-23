/**
 * Created by mjul on 18/09/14.
 */

"use strict";

var GroupVals = GroupVals || {};

GroupVals.ListItem = React.createClass({
    displayName: 'ListItem',

    propTypes: {
        index: React.PropTypes.number.isRequired,
        data: React.PropTypes.object.isRequired,
        onListItemDeleted: React.PropTypes.func,
        onListItemUpped: React.PropTypes.func,
        onListItemDowned: React.PropTypes.func
    },

    handleDelete: function (evt) {
        evt.preventDefault();
        if (this.props.onListItemDeleted) {
            this.props.onListItemDeleted(this.props.index, this.props.data)
        }
    },

    handleUp: function (evt) {
        evt.preventDefault();
        if (this.props.onListItemUpped) {
            this.props.onListItemUpped(this.props.index, this.props.data);
        }
    },

    handleDown: function (evt) {
        evt.preventDefault();
        if (this.props.onListItemDowned) {
            this.props.onListItemDowned(this.props.index, this.props.data);
        }
    },

    render: function () {
        var onUp = this.handleUp;
        var onDown = this.handleDown;
        var onDelete = this.handleDelete;
        return React.DOM.li({className: 'listItem'},
            React.DOM.div({className: 'listItemChildren'}, this.props.children),
            React.DOM.div({className: 'listItemControls'},
                React.DOM.button({className: 'moveUp', onClick: onUp}, 'Up'),
                React.DOM.button({className: 'moveDown', onClick: onDown}, 'Down'),
                React.DOM.button({className: 'delete', onClick: onDelete}, 'Delete')
            ));
    }
});


GroupVals.List = React.createClass({
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

    handleListItemsExchanged: function (itemNumber, newItemNumber, itemData) {
        var listLength = this.props.data.length;
        var isInList = function (pos) {
            return (pos >= 0) && (pos < listLength);
        }
        if ((itemNumber != newItemNumber) && isInList(itemNumber) && isInList(newItemNumber)) {
            var targetItem = this.props.data[newItemNumber];
            var targetMoved = React.addons.update(this.props.data, {$splice: [
                [itemNumber, 1, targetItem]
            ]});
            var reorderedItems = React.addons.update(targetMoved, {$splice: [
                [newItemNumber, 1, itemData]
            ]});
            if (this.props.onListItemMoved) {
                this.props.onListItemMoved(itemNumber, reorderedItems, itemData);
            }
        }
    },

    render: function () {
        var deletedCallback = this.handleListItemDeleted;
        var moveCallback = this.handleListItemsExchanged;
        var dataItems = this.props.data;
        var items = React.Children.map(this.props.children, function (c, index) {
            var d = dataItems[index];
            return GroupVals.ListItem({key: 'LI_key_' + index,
                onListItemDeleted: deletedCallback,
                onListItemUpped: function (itemPos, item) {
                    return moveCallback(itemPos, itemPos - 1, item);
                },
                onListItemDowned: function (itemPos, item) {
                    return moveCallback(itemPos, itemPos + 1, item);
                },
                index: index, data: d}, c);
        });
        return React.DOM.ul({className: 'list'},
            items
        );
    }
});


GroupVals.Value = React.createClass({
    displayName: 'Value',
    propTypes: {
        data: React.PropTypes.shape({text: React.PropTypes.string.isRequired}).isRequired,
        onListItemDeleted: React.PropTypes.func,
    },
    render: function () {
        return React.DOM.div({className: 'value'}, this.props.data.text);
    }
});


GroupVals.ListItemAdder = React.createClass({
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

GroupVals.Group = React.createClass({
    displayName: 'Group',

    propTypes: {
        index: React.PropTypes.number.isRequired,
        data: React.PropTypes.shape({
            groupId: React.PropTypes.number.isRequired,
            name: React.PropTypes.string.isRequired,
            values: React.PropTypes.array.isRequired
        }).isRequired,
        onGroupValueDeleted: React.PropTypes.func,
        onGroupValueAdded: React.PropTypes.func,
        onGroupValueMoved: React.PropTypes.func
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

    handleValueMoved: function (valueIndex, newValues, movedItem) {
        var newGroup = React.addons.update(this.props.data, {values: {$set: newValues}});
        if (this.props.onGroupValueMoved) {
            this.props.onGroupValueMoved(this.props.index, newGroup);
        }
    },

    render: function () {
        var deletedCallback = this.handleValueDeleted;
        var addedCallback = this.handleValueAdded;
        var movedCallback = this.handleValueMoved;
        var dataValues = this.props.data.values;
        var values = dataValues.map(function (v, index) {
            return GroupVals.Value({data: v, key: "value_" + index});
        });
        return React.DOM.div({className: 'group'},
            React.DOM.h2(null, this.props.data.name),
            React.DOM.div({className: 'values'},
                GroupVals.List({onListItemDeleted: deletedCallback,
                    onListItemMoved: movedCallback,
                    data: dataValues}, values),
                GroupVals.ListItemAdder({onListItemAdded: addedCallback})
            ));
    }
});


GroupVals.GroupsAndValues = React.createClass({
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

    handleGroupValueMoved: function (index, newGroup) {
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

    handleGroupDeleted: function (groupIndex, newGroups, deletedGroup) {
        this.setState({data: newGroups});
    },

    handleGroupMoved: function (groupIndex, newGroups, movedGroup) {
        this.setState({data: newGroups});
    },

    render: function () {
        var groupValueCallback = this.handleGroupValueAdded;
        var groupValueDeletedCallback = this.handleGroupValueDeleted;
        var groupValueMovedCallback = this.handleGroupValueMoved;
        var addGroupCallback = this.handleAddGroup;
        var groupDeletedCallback = this.handleGroupDeleted;
        var groupMovedCallback = this.handleGroupMoved;
        var groups = this.state.data;
        var items = groups.map(function (group, index) {
            return GroupVals.Group(
                {data: group,
                    index: index,
                    key: "group_" + group.groupId,
                    onGroupValueAdded: groupValueCallback,
                    onGroupValueMoved: groupValueMovedCallback,
                    onGroupValueDeleted: groupValueDeletedCallback});
        });
        return React.DOM.div({className: 'groupsAndValues'},
            GroupVals.List({data: groups,
                onListItemDeleted: groupDeletedCallback,
                onListItemMoved: groupMovedCallback}, items),
            GroupVals.ListItemAdder({onListItemAdded: addGroupCallback})
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
    React.renderComponent(GroupVals.GroupsAndValues({data: data}), target_div);
}


window.addEventListener('load', function (evt) {
    renderGroupsAndValues('content');
});
