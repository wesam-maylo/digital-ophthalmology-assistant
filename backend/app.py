from flask import Flask, jsonify

app = Flask(__name__)


@app.get("/")
def index():
    return """
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Backend is running</title>
      </head>
      <body>
        <h1>Backend is running</h1>
        <p>This is a minimal Flask placeholder backend.</p>
      </body>
    </html>
    """


@app.get("/health")
def health():
    return jsonify({"status": "ok", "message": "Backend placeholder running"})


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)
