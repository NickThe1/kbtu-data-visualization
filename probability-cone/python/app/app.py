from flask import Flask, render_template, request
from flask import Flask

app = Flask(__name__)


@app.route('/')
def main():  # put application's code here
    return render_template("index.html")


if __name__ == '__main__':
    app.run(debug=True)
