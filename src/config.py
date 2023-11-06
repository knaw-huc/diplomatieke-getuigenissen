import os

es_host = os.environ.get("ES_HOST", "http://localhost:9200")
es_user = os.environ.get("ES_USER")
es_password = os.environ.get("ES_PASSWORD")
es_diplo_index = os.environ.get("ES_DIPLO_INDEX", "diplo")
es_vtt_index = os.environ.get("ES_VTT_INDEX", "vttplus")

videos_root = os.environ.get('VIDEOS_PATH')
captions_root = os.environ.get('CAPTIONS_PATH')
thumbs_root = os.environ.get('THUMBS_PATH')
