#!/bin/sh

for file in /app/frontend/dist/assets/*.js; do
  if [ ! -f $file.tmpl.js ]; then
    cp $file $file.tmpl.js
  fi

  envsubst '$VITE_API_BASE,$VITE_ZOTERO_KEY' <$file.tmpl.js >$file
done

uwsgi --http :5000 --master -p 4 -w app:app
