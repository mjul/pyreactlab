var React = require('react');
var ReactKinetic = require('./react-kinetic');

var KineticApp = (function(React, RK)
{
    var Bubble = React.createClass({
        render: function () {
            var data = this.props.data;

            // add a tag to the label
            var tag = RK.Tag({
                fill: '#bbb',
                stroke: '#333',
                shadowColor: 'black',
                shadowBlur: 10,
                shadowOffset: [10, 10],
                shadowOpacity: 0.2,
                lineJoin: 'round',
                pointerDirection: 'up',
                pointerWidth: 20,
                pointerHeight: 20,
                cornerRadius: 5
            });

            // add text to the label
            var text = RK.Text({
                text: data.name,
                fontSize: 50,
                lineHeight: 1.2,
                padding: 10,
                fill: 'green'
            });

            // create label
            var label = RK.Label({
                x: 0,
                y: 0,
                draggable: true
            }, text);


            return (RK.Group({x: data.x, y: data.y, draggable: true},
                        RK.Circle({x: 0, y: 0, radius: data.r, stroke: 'black', fill: 'red'}),
                        RK.Circle({x: 0, y: 0, radius: data.r+5, stroke: 'grey', fill: 'transparent'}),
                        label
                    ));
        }
    });

    var BubbleStage = React.createClass({
            render: function () {
                var bubbles = this.props.data.map(function(b, i) {
                    return Bubble({key: "bubble_"+i, data: b});
                });
                return (RK.Stage({height: 300, width: 300},
                            RK.Layer(null, bubbles)
                        ));
            }
    });

    return {BubbleStage: BubbleStage};
}
(React, ReactKinetic));


window.addEventListener('load', function (evt) {
    var target_div = document.getElementById('content');
    var bubbles = [{name: "Foo", x: 50, y: 50, r: 30},
                   {name: "Bar", x: 150, y: 50, r: 40},
                   {name: "Baz", x: 50, y: 150, r: 80}];
    React.renderComponent(KineticApp.BubbleStage({data: bubbles}), target_div);
});
