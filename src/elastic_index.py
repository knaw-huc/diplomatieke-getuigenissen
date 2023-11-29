import math
import string

from elasticsearch import Elasticsearch
from config import es_host, es_user, es_password, es_diplo_index, es_vtt_index


class Index:
    def __init__(self):
        self.client = Elasticsearch(
            es_host,
            basic_auth=(es_user, es_password) if es_user and es_password else None,
            verify_certs=False,
            retry_on_timeout=True
        )

    @staticmethod
    def make_matches(search_values):
        return [
            {"match_phrase" if item["field"] == "FREE_TEXT" else "match":
                 {("transcript" if item["field"] == "FREE_TEXT" else item["field"]): value}}
            for item in search_values
            for value in item["values"]
        ]

    def get_record(self, id):
        result = self.client.get(index=es_diplo_index, id=str(id), _source=['record'])
        return result['_source']['record'] | {'id': id}

    def get_record_achternaam(self, id):
        result = self.client.get(index=es_diplo_index, id=str(id), _source=['achternaam'])
        return result['_source']['achternaam']

    def get_facet(self, field, amount, facet_filter, search_values):
        terms = {
            "field": field,
            "size": amount,
            "order": {
                "_count": "desc"
            }
        }

        if facet_filter:
            filtered_filter = facet_filter.translate(str.maketrans('', '', string.punctuation))
            filtered_filter = ''.join([f"[{char.upper()}{char.lower()}]" for char in filtered_filter])
            terms["include"] = f'.*{filtered_filter}.*'

        body = {
            "size": 0,
            "aggs": {
                "names": {
                    "terms": terms
                }
            }
        }

        if search_values:
            body["query"] = {
                "bool": {
                    "must": self.make_matches(search_values)
                }
            }

        response = self.client.search(index=es_diplo_index, body=body)

        return [{"key": hits["key"], "doc_count": hits["doc_count"]}
                for hits in response["aggregations"]["names"]["buckets"]]

    def browse(self, page, length, search_values):
        if not search_values:
            return {"amount": 0, "pages": 0, "items": []}

        int_page = int(page)
        start = (int_page - 1) * length

        response = self.client.search(index=es_diplo_index, body={
            "query": {
                "bool": {
                    "must": self.make_matches(search_values)
                }
            },
            "size": length,
            "from": start,
            "_source": ["id", "titel", "record"]
        })

        return {"amount": response["hits"]["total"]["value"],
                "pages": math.ceil(response["hits"]["total"]["value"] / length),
                "items": [item["_source"] for item in response["hits"]["hits"]]}

    def vtt_search(self, record, search_values):
        body = {
            "query": {
                "bool": {
                    "must": [{
                        "match": {
                            "id": record
                        }
                    }, {
                        "bool": {
                            "should": [{
                                "match_phrase": {
                                    "text": value
                                }
                            } for value in search_values]
                        }
                    }]
                }
            },
            "highlight": {
                "type": "unified",
                "fragment_size": 200,
                "pre_tags": ["{{{"],
                "post_tags": ["}}}"],
                "fields": {
                    "text": {}
                }
            },
            "size": 100,
            "sort": [
                {"session": "asc"},
                {"start": "asc"}
            ],
            "_source": ["session", "sessiondate", "start", "end"]
        }

        response = self.client.search(index=es_vtt_index, body=body)

        per_session = {}
        for item in response["hits"]["hits"]:
            session = item['_source']['session']
            if session not in per_session:
                per_session[session] = {
                    "session": session,
                    "date": item['_source']['sessiondate'],
                    "matches": []
                }

            per_session[session]["matches"].append({
                "start": item['_source']['start'],
                "end": item['_source']['end'],
                "text": item['highlight']['text'][0]
            })

        return list(dict(sorted(per_session.items())).values())

    def diplomaten(self):
        response = self.client.search(
            index=es_diplo_index,
            body={
                "query": {
                    "match_all": {}
                },
                "size": 500,
                "_source": ["id", "titel", "achternaam", "samenvatting", "opnames"],
                "sort": [
                    {"achternaam": {"order": "asc"}}
                ]
            }
        )

        return [item["_source"] for item in response["hits"]["hits"]]
