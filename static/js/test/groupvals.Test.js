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
