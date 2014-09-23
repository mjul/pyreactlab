GroupsAndValuesTest = TestCase("GroupsAndValues");

GroupsAndValuesTest.prototype.setUp = function() {
    this.div = document.createElement('div');
    this.div.id = 'targetDiv';
}

GroupsAndValuesTest.prototype.testGroupsAndValuesCanRender = function () {
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
    var gvComponent = GroupVals.GroupsAndValues({data: data}, this.div);
    var gvInstance = React.addons.TestUtils.renderIntoDocument(gvComponent);
    var groups = React.addons.TestUtils.scryRenderedComponentsWithType(gvInstance, GroupVals.Group);
    assertEquals("Expected correct number of groups", 3, groups.length);
    assertEquals("Group 1 data", data[0], groups[0].props.data);
    assertEquals("Group 2 data", data[1], groups[1].props.data);
    assertEquals("Group 3 data", data[2], groups[2].props.data);
};

GroupsAndValuesTest.prototype.instanceWithSingleGroup = function(groupName, valueTexts) {
    var values = valueTexts.map(function(t, i) {return {valueId: i+1, text: t};});
    var data = [{groupId: 1, name: groupName, values: values}];
    var gvComponent = GroupVals.GroupsAndValues({data: data}, this.div);
    return React.addons.TestUtils.renderIntoDocument(gvComponent);
}

GroupsAndValuesTest.prototype.testGroupsAndValuesCanRender = function () {
    var gvInstance = this.instanceWithSingleGroup("G1", ['V1','V2','V3']);
    var groups = React.addons.TestUtils.scryRenderedComponentsWithType(gvInstance, GroupVals.Group);
    assertEquals("Expected single group", 1, groups.length);

    var values = React.addons.TestUtils.scryRenderedComponentsWithType(gvInstance, GroupVals.Value);
    assertEquals("Expected all values", 3, values.length);

    assertEquals("Expected correct value [0]", 'V1', values[0].props.data.text);
    assertEquals("Expected correct value [1]", 'V2', values[1].props.data.text);
    assertEquals("Expected correct value [2]", 'V3', values[2].props.data.text);
};

GroupsAndValuesTest.prototype.testValueCanMoveUp = function () {
    var gvInstance = this.instanceWithSingleGroup("G1", ['A','B','C']);
    var data = gvInstance.state.data;

    var firstGroup = React.addons.TestUtils.findRenderedComponentWithType(gvInstance, GroupVals.Group);
    var secondValue = React.addons.TestUtils.scryRenderedComponentsWithType(firstGroup, GroupVals.ListItem)[1];
    var upButton = React.addons.TestUtils.findRenderedDOMComponentWithClass(secondValue, 'moveUp');
    React.addons.TestUtils.Simulate.click(upButton);

    var reorderedValues = gvInstance.state.data[0].values.map(function(v) { return v.text; });
    assertEquals("Expected B moved up", ['B', 'A', 'C'], reorderedValues);

    var values = React.addons.TestUtils.scryRenderedComponentsWithType(gvInstance, GroupVals.Value);
    assertEquals("Expected correct value [0]", data[0].values[1], values[0].props.data);
    assertEquals("Expected correct value [1]", data[0].values[0], values[1].props.data);
    assertEquals("Expected correct value [2]", data[0].values[2], values[2].props.data);
};

GroupsAndValuesTest.prototype.testValueCanMoveDown = function () {
    var gvInstance = this.instanceWithSingleGroup("G1", ['A','B','C']);
    var data = gvInstance.state.data;

    var firstGroup = React.addons.TestUtils.findRenderedComponentWithType(gvInstance, GroupVals.Group);
    var secondValue = React.addons.TestUtils.scryRenderedComponentsWithType(firstGroup, GroupVals.ListItem)[1];
    var downButton = React.addons.TestUtils.findRenderedDOMComponentWithClass(secondValue, 'moveDown');
    React.addons.TestUtils.Simulate.click(downButton);

    var reorderedValues = gvInstance.state.data[0].values.map(function(v) { return v.text; });
    assertEquals("Expected B moved down", ['A', 'C', 'B'], reorderedValues);

    var values = React.addons.TestUtils.scryRenderedComponentsWithType(gvInstance, GroupVals.Value);
    assertEquals("Expected correct value [0]", data[0].values[0], values[0].props.data);
    assertEquals("Expected correct value [1]", data[0].values[2], values[1].props.data);
    assertEquals("Expected correct value [2]", data[0].values[1], values[2].props.data);
};

GroupsAndValuesTest.prototype.testValueCanBeDeleted = function () {
    var gvInstance = this.instanceWithSingleGroup("G1", ['A','B','C']);
    var data = gvInstance.state.data;

    var firstGroup = React.addons.TestUtils.findRenderedComponentWithType(gvInstance, GroupVals.Group);
    var secondValue = React.addons.TestUtils.scryRenderedComponentsWithType(firstGroup, GroupVals.ListItem)[1];
    var deleteButton = React.addons.TestUtils.findRenderedDOMComponentWithClass(secondValue, 'delete');
    React.addons.TestUtils.Simulate.click(deleteButton);

    var updatedValues = gvInstance.state.data[0].values.map(function(v) { return v.text; });
    assertEquals("Expected B deleted down", ['A', 'C'], updatedValues);

    var values = React.addons.TestUtils.scryRenderedComponentsWithType(gvInstance, GroupVals.Value);
    assertEquals("Expected correct value [0]", data[0].values[0], values[0].props.data);
    assertEquals("Expected correct value [1]", data[0].values[2], values[1].props.data);
};