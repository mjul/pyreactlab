//var React = require('react');

var DragDrop = (function(React)
{
    var itemComponent = React.createClass({
        displayName: 'Item',
        propTypes: {
            data: React.PropTypes.shape({
                id: React.PropTypes.number.isRequired,
                name: React.PropTypes.string.isRequired
            }),
            onDrag: React.PropTypes.func,
            onDrop: React.PropTypes.func
        },
        getInitialState: function() {
            return {isDragging: false, isDraggingOver: false};
        },
        render: function() {
            var cx = React.addons.classSet;
            var data = this.props.data;
            return React.DOM.li({
                draggable: true,
                className: cx({
                    'dragging': this.state.isDragging,
                    'dragging-over': this.state.isDraggingOver
                }),
                onDragStart: this.handleDragStart,
                onDragEnd: this.handleDragEnd,
                onDragOver: this.handleDragOver,
                onDragEnter: this.handleDragEnter,
                onDragLeave: this.handleDragLeave,
                onDrop: this.handleDrop
            }, data.name);
        },
        handleDragStart: function(evt) {
            // this / evt.target is the source component
            this.setState({isDragging: true});
            if (this.props.onDrag) {
                this.props.onDrag(this);
            }
        },
        handleDragEnd: function(evt) {
            this.setState({isDragging: false, isDraggingOver: false});
        },
        handleDragOver: function(evt) {
            // evt is the source
            if (evt.preventDefault) {
                evt.preventDefault(); // allow drop
            }
            evt.dataTransfer.dropEffect = 'move';
            return false;
        },
        handleDragEnter: function(evt) {
            // this / evt.target is the hover target
            this.setState({isDraggingOver: true});
        },
        handleDragLeave: function(evt) {
            // this / evt.target is the hover target
            this.setState({isDraggingOver: false});
        },
        handleDrop: function(evt) {
            // this / evt.target is where we drop it
            if (evt.stopPropagation) {
                evt.stopPropagation();
            }
            if (evt.preventDefault) {
                evt.preventDefault();
            }
            if (this.props.onDrop) {
                this.props.onDrop(this);
            }
            this.setState({isDragging: false, isDraggingOver: false});
            return false;
        }
    });

    var listComponent = React.createClass({
            displayName: 'List',
            getInitialState: function() {
                return {data: this.props.data}
            },
            handleDrag: function(sourceComponent) {
                this.setState({dragSource: sourceComponent});
            },
            handleDrop: function(targetComponent) {
                var sourceComponent = this.state.dragSource;
                var droppingOnItself = sourceComponent && (sourceComponent.props.data.id == targetComponent.props.data.id);
                if (!droppingOnItself) {
                    var self = this;
                    var pos = function (e) {
                        var index = null;
                        self.state.data.forEach(function (x, idx) {
                            if (x.id == e.props.data.id)
                                index = idx;
                        });
                        return index;
                    };
                    var sourcePos = pos(sourceComponent);
                    var targetPos = pos(targetComponent);
                    var sourceData = this.state.data[sourcePos];
                    var sourceRemoved = React.addons.update(this.state.data, {$splice: [[sourcePos, 1]]});
                    if (sourcePos < targetPos) {
                        // move down
                        var sourceAddedAfterTarget = React.addons.update(sourceRemoved, {$splice: [[targetPos, 0, sourceData]]});
                        this.setState({data: sourceAddedAfterTarget});
                    } else {
                        // move up
                        var sourceAddedBeforeTarget = React.addons.update(sourceRemoved, {$splice: [[targetPos, 0, sourceData]]});
                        this.setState({data: sourceAddedBeforeTarget});
                    }
                }
                this.setState({dragSource: null});
            },
            render: function() {
                var self = this;
                var items = this.state.data.map(
                    function(item, index) {
                        return itemComponent({data: item, key: "li"+ item.id,
                            onDrag: self.handleDrag, onDrop: self.handleDrop
                        });
                    });
                return React.DOM.ul({},
                    items
                );
            }
        }
    );
    return {List: listComponent};
})(React);

window.addEventListener('load', function (evt) {
    var targetDiv = document.getElementById('content');
    var items = [
        {id: 1, name: 'First'},
        {id: 2, name: 'Second'},
        {id: 3, name: 'Third'}
    ];
    React.renderComponent(DragDrop.List({data: items}), targetDiv);
});
