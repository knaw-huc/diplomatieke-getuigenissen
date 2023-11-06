from flask import Flask, request, send_from_directory, jsonify, Response
from flask_cors import CORS
from elastic_index import Index
from record import Record
from config import videos_root, captions_root, thumbs_root

app = Flask(__name__, static_folder='frontend/dist', static_url_path='')
CORS(app)

index = Index()
record = Record(index)


@app.get('/')
@app.get('/zoeken')
@app.get("/diplomaten")
def frontend_no_path():
    return app.send_static_file("index.html")


@app.get("/zoeken/<path>")
@app.get("/interview/<path>")
def frontend_with_path(path):
    return app.send_static_file("index.html")


@app.post("/api/facet")
def get_facet():
    struc = request.get_json()
    ret_struc = index.get_facet(struc["name"], struc["amount"], struc["filter"], struc["searchvalues"])
    return jsonify(ret_struc)


@app.post("/api/browse")
def browse():
    struc = request.get_json()
    ret_struc = index.browse(struc["page"], struc["page_length"], struc["searchvalues"])
    return jsonify(ret_struc)


@app.post("/api/transcript")
def transcript():
    struc = request.get_json()
    ret_struc = index.vtt_search(struc["record"], struc["searchvalues"])
    return jsonify(ret_struc)


@app.get("/api/diplomaten")
def diplomaten():
    ret_struc = index.diplomaten()
    return jsonify(ret_struc)


@app.get("/api/detail/<int:rec>")
def get_detail(rec):
    retStruc = index.get_record(rec)
    return jsonify(retStruc)


@app.get("/api/video/<int:rec>/<int:session>")
def get_video(rec, session):
    session_path, session_file_prefix = record.get_session_path(rec, session)
    videos = videos_root + '/' + session_path
    filename = session_file_prefix + '.mp4'
    return send_from_directory(videos, filename, conditional=True)


@app.get("/api/thumbnail/<int:rec>/<int:session>")
def get_thumbnail(rec, session):
    session_path, session_file_prefix = record.get_session_path(rec, session)
    captions = thumbs_root + '/' + session_path
    filename = session_file_prefix + '.jpg'
    return send_from_directory(captions, filename, mimetype='image/jpeg')


@app.get("/api/captions/<int:rec>/<int:session>")
def get_captions(rec, session):
    session_path, session_file_prefix = record.get_session_path(rec, session)
    captions = captions_root + '/' + session_path
    filename = session_file_prefix + '.vtt'
    return send_from_directory(captions, filename, mimetype='text/vtt')


@app.get("/api/chapters/<int:rec>/<int:session>")
def get_chapters(rec, session):
    vtt = record.get_chapters_vtt(rec, session)
    return Response(vtt, mimetype='text/vtt')


if __name__ == '__main__':
    app.run(host='0.0.0.0')
