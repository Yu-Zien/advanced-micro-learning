#!/bin/zsh

project_dir="$(cd "$(dirname "$0")" && pwd)"
site_url="http://127.0.0.1:4173/#learn"
log_file="/tmp/advanced-micro-learning-server.log"
pid_file="/tmp/advanced-micro-learning-server.pid"
online_url="https://yu-zien.github.io/advanced-micro-learning/#learn"
launch_label="com.yze.advanced-micro-learning"
launch_domain="gui/$(/usr/bin/id -u)"

server_ready() {
  /usr/bin/curl -fsS "http://127.0.0.1:4173/" 2>/dev/null | /usr/bin/grep -q "高微 · 连续学习"
}

python_bin=""
for candidate in /opt/homebrew/bin/python3 /usr/local/bin/python3 /usr/bin/python3; do
  if [[ -x "$candidate" ]] && "$candidate" -c 'import http.server' >/dev/null 2>&1; then
    python_bin="$candidate"
    break
  fi
done

if ! server_ready; then
  if /bin/launchctl print "$launch_domain/$launch_label" >/dev/null 2>&1; then
    /bin/launchctl kickstart -k "$launch_domain/$launch_label" >/dev/null 2>&1
    for attempt in {1..50}; do
      /bin/sleep 0.1
      if server_ready; then
        break
      fi
    done
  fi
fi

if ! server_ready; then
  if /usr/bin/curl -fsS "http://127.0.0.1:4173/" >/dev/null 2>&1; then
    /usr/bin/osascript -e 'display alert "高微网站暂时无法启动" message "端口 4173 正被另一个程序占用。请关闭占用该端口的程序后，再双击“打开高微网站.command”。" as critical' >/dev/null 2>&1
    /usr/bin/open "$online_url"
    exit 1
  fi

  if [[ -z "$python_bin" ]]; then
    /usr/bin/osascript -e 'display alert "缺少可用的 Python 3" message "无法启动本地高微网站。你仍可使用在线版本；安装 Homebrew Python 后，本地入口会自动恢复。" as critical' >/dev/null 2>&1
    /usr/bin/open "$online_url"
    exit 1
  fi

  cd "$project_dir" || exit 1
  /usr/bin/nohup "$python_bin" -m http.server 4173 --bind 127.0.0.1 </dev/null >"$log_file" 2>&1 &!
  server_pid=$!
  print -r -- "$server_pid" >"$pid_file"
  for attempt in {1..50}; do
    /bin/sleep 0.1
    if server_ready; then
      break
    fi
  done
fi

if server_ready; then
  /usr/bin/open "$site_url"
else
  /usr/bin/osascript -e 'display alert "本地高微网站启动失败" message "请查看 /tmp/advanced-micro-learning-server.log。已为你打开在线备用版本。" as critical' >/dev/null 2>&1
  /usr/bin/open "$online_url"
  exit 1
fi
