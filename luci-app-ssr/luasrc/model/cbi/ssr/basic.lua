-- Copyright (C) 2017 yushi studio <ywb94@qq.com> github.com/ywb94
-- Copyright (C) 2018 lean <coolsnowwolf@gmail.com> github.com/coolsnowwolf
-- Licensed to the public under the GNU General Public License v3.

local m, s, sec, o, kcp_enable
local uci = luci.model.uci.cursor()

local sys = require "luci.sys"

local methods = {
	"rc4-md5",
	"rc4-md5-6",
	"rc4",
	"table",
	"aes-128-cfb",
	"aes-192-cfb",
	"aes-256-cfb",
	"aes-128-ctr",
	"aes-192-ctr",
	"aes-256-ctr",
	"bf-cfb",
	"camellia-128-cfb",
	"camellia-192-cfb",
	"camellia-256-cfb",
	"cast5-cfb",
	"des-cfb",
	"idea-cfb",
	"rc2-cfb",
	"seed-cfb",
	"salsa20",
	"chacha20",
	"chacha20-ietf",
}

local protocols = {
	"origin",
	"verify_deflate",
	"auth_sha1_v4",
	"auth_aes128_sha1",
	"auth_aes128_md5",
	"auth_chain_a",
}

local obfs = {
	"plain",
	"http_simple",
	"http_post",
	"random_head",
	"tls1.2_ticket_auth",
	"tls1.2_ticket_fastauth",
}

m = Map("ssr", translate("ShadowSocksR Settings"))

-- [[ Basic Settings ]]--
s = m:section(TypedSection, "shadowsocksr", translate("Server Settings"))
s.anonymous = true

o = s:option(Flag, "enabled", translate("Enable"))
o.rmempty = false

o = s:option(Value, "remote_server", translate("Remote Server Address"))
o.optional = false
o.datatype = "host"
o.rmempty = false

o = s:option(Value, "remote_port", translate("Remote Server Port"))
o.datatype = "range(1,65535)"
o.optional = false
o.rmempty = false

o = s:option(ListValue, "method", translate("Encryption Method"))
for _, v in ipairs(methods) do o:value(v) end
o.rmempty = false

o = s:option(Value, "password", translate("Password"))
o.password = true

o = s:option(ListValue, "protocol", translate("Protocol"))
for _, v in ipairs(protocols) do o:value(v) end
o.rmempty = true

o = s:option(Value, "protocol_param", translate("Protocol param(optional)"))

o = s:option(ListValue, "obfs", translate("Obfs"))
for _, v in ipairs(obfs) do o:value(v) end
o.rmempty = true

o = s:option(Value, "obfs_param", translate("Obfs param(optional)"))

o = s:option(Flag, "reuse_port", translate("Reuse Port"))
o.rmempty = false

o = s:option(Flag, "fast_open", translate("TCP Fast Open"))
o.rmempty = false

o = s:option(Value, "local_server", translate("Local Server Address"))
o.optional = false
o.datatype = "host"
o.rmempty = false

o = s:option(Value, "local_port", translate("Local Server Port"))
o.datatype = "range(1,65535)"
o.optional = false
o.rmempty = false

return m
