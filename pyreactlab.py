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

@app.route('/kinetic')
def kinetic():
    return render_template('kinetic.html')

@app.route('/dragdrop')
def dragdrop():
    return render_template('dragdrop.html')


if __name__ == '__main__':
    app.run(port=5001)
