function renderHello(elementId) {
    React.renderComponent(
        React.DOM.h1(null, 'Hello React DOM JS'),
        document.getElementById(elementId)
    );
}

window.addEventListener('load', function(evt) {
    renderHello('domlab');
})

