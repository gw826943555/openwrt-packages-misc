#!/bin/sh
NAME=ssr
LOG_FILE=/tmp/ssr.log
SSR_CONF=/var/etc/ssr.json

_log() {
	echo "$(date "+%Y-%m-%d %H:%M:%S") $1" >> $LOG_FILE
}

ssr_start() {
	[ "$(uci get ssr.@shadowsocksr[0].enabled 2>/dev/null)" = "1" ] || { _log "ShadowsocksR is not enabled."; return 1;}

	local remote_server=$(uci get ssr.@shadowsocksr[0].remote_server 2>/dev/null)
	local hostip=$(ping $remote_server -s 1 -c 1 | grep PING | cut -d'(' -f 2 | cut -d')' -f1)
	_log "hostip:$hostip"

	cat <<-EOF >$SSR_CONF
		{
		"server": "$hostip",
		"server_port": "$(uci get ssr.@shadowsocksr[0].remote_port)",
		"local_address": "$(uci get ssr.@shadowsocksr[0].local_server)",
		"local_port": "$(uci get ssr.@shadowsocksr[0].local_port)",
		"password": "$(uci get ssr.@shadowsocksr[0].password)",
		"timeout": "60",
		"method": "$(uci get ssr.@shadowsocksr[0].method)",
		"protocol": "$(uci get ssr.@shadowsocksr[0].protocol)",
		"protocol_param": "$(uci get ssr.@shadowsocksr[0].protocol_param)",
		"obfs": "$(uci get ssr.@shadowsocksr[0].obfs)",
		"obfs_param": "$(uci get ssr.@shadowsocksr[0].obfs_param)",
		"reuse_port": true,
		"fast_open": "$(uci get ssr.@shadowsocksr[0].fast_open)"
		}
	EOF
	sleep 1
#	/usr/bin/ssr-redir -c $SSR_CONF -f /var/run/ssr-retcp.pid >/dev/null 2>&1
}

start() {
	ssr_start
}

stop() {killall -q -9 ssr-redir}

case $1 in
stop)
	stop
	;;
start)
	start
	;;
boot)
	start
	;;
*)
	echo "Usage: $0 (start|stop|restart)"
	;;
esac
