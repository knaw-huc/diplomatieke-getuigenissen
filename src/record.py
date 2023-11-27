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
        def get_chapter_text(chapter):
            text = chapter['onderwerp']
            if chapter['periodevan'] and not chapter['periodetot']:
                text += f" ({chapter['periodevan']})"
            elif chapter['periodetot'] and not chapter['periodevan']:
                text += f" ({chapter['periodetot']})"
            elif chapter['periodevan'] and chapter['periodetot']:
                text += f" ({chapter['periodevan']} - {chapter['periodetot']})"
            return text

        record = self._index.get_record(rec)
        sessie = next(sessie for sessie in record['interviewsessies'] if sessie["Volgorde"] == str(session))

        duur = sessie['Duur']
        data = [(it['tijdstip'], get_chapter_text(it)) for it in sessie['Inhoud']]
        data.sort(key=lambda d: d[0])

        vtt = WebVTT()
        vtt.captions.extend([Caption(
            tijdstip + '.000',
            (data[i + 1][0] if i + 1 < len(data) else duur) + '.000',
            caption_text
        ) for i, (tijdstip, caption_text) in enumerate(data)])

        for i, caption in enumerate(vtt.captions):
            caption.identifier = str(i + 1)

        output = StringIO()
        vtt.write(output)

        return output.getvalue()
