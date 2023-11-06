from io import StringIO
from webvtt import WebVTT, Caption
from cachetools import cachedmethod, LRUCache


class Record:
    def __init__(self, index):
        self._index = index
        self._session_paths_cache = LRUCache(maxsize=100)

    @cachedmethod(lambda self: self._session_paths_cache)
    def get_session_path(self, rec, session):
        achternaam = self._index.get_record_achternaam(rec)
        achternaam_fixed = achternaam.replace(' ', '_').replace('-', '_')
        return f'{achternaam_fixed}-{rec}', f'{achternaam_fixed}-{rec}_{session}'

    def get_chapters_vtt(self, rec, session):
        record = self._index.get_record(rec)
        sessie = next(sessie for sessie in record['interviewsessies'] if sessie["Volgorde"] == str(session))

        duur = sessie['Duur']
        data = [(it['tijdstip'], it['onderwerp']) for it in sessie['Inhoud']]
        data.sort(key=lambda d: d[0])

        vtt = WebVTT()
        vtt.captions.extend([Caption(
            tijdstip + '.000',
            (data[i + 1][0] if i + 1 < len(data) else duur) + '.000',
            onderwerp
        ) for i, (tijdstip, onderwerp) in enumerate(data)])

        for i, caption in enumerate(vtt.captions):
            caption.identifier = str(i + 1)

        output = StringIO()
        vtt.write(output)

        return output.getvalue()
