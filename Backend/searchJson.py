from setuptools import setup, find_packages






from pprint import pprint
from flask import Flask, jsonify, request
from flask_restful import Api, Resource, reqparse
import math




app = Flask(__name__)

api = Api(app)




from googleapiclient.discovery import build

def search(query, **kwargs):
    cseKey = "AIzaSyD5fPCLeTjNJf8ollqd0PQySFJH7tj2C1M"
    cseId = "f21d1d5075edf911b"
    service = build("customsearch", "v1", developerKey=cseKey)
    req = service.cse().list(q=query, cx=cseId, **kwargs)
    print(req)
    res = req.execute()

    returnObj = {}
    returnObj['logRM'] = math.log10(int(res['searchInformation']['totalResults'])/100000)
    returnObj['RM'] = int(res['searchInformation']['totalResults'])/100000

    return returnObj


from flask import Flask

app = Flask(__name__)


@app.route("/")
def home():
    return "No query was added"

#http://127.0.0.1:5000/search?query=bananana
@app.route('/search', methods=['GET'])
def index():
    if request.method == "GET":
        res = search(request.args.get("query"))
        return jsonify(res)

if __name__ == '__main__':
    app.run(debug = True)





