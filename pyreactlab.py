from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html');


@app.route('/list')
def list():
    return render_template('list.html')

@app.route('/groupvals')
def groups_and_values():
    return render_template('groupvals.html')

if __name__ == '__main__':
    app.run(port=5001)
