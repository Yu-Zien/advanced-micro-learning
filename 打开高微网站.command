#!/bin/zsh

project_dir="$(cd "$(dirname "$0")" && pwd)"
site_url="http://127.0.0.1:4173/#learn"
log_file="/tmp/advanced-micro-learning-server.log"

if ! /usr/bin/curl -fsS "http://127.0.0.1:4173/" >/dev/null 2>&1; then
  cd "$project_dir" || exit 1
  /usr/bin/nohup /usr/bin/env python3 -m http.server 4173 --bind 127.0.0.1 >"$log_file" 2>&1 &
  for attempt in {1..30}; do
    /bin/sleep 0.1
    if /usr/bin/curl -fsS "http://127.0.0.1:4173/" >/dev/null 2>&1; then
      break
    fi
  done
fi

/usr/bin/open "$site_url"
