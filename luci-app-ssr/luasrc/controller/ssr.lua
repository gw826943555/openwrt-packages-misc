-- Copyright (C) 2017 yushi studio <ywb94@qq.com>
-- Licensed to the public under the GNU General Public License v3.

module("luci.controller.ssr", package.seeall)

function index()
	if not nixio.fs.access("/etc/config/ssr") then
		return
	end
	entry({"admin", "services", "shadowsocksr"}, alias("admin", "services", "shadowsocksr", "basic"),_("ShadowSocksR"), 10).dependent = true
	entry({"admin", "services", "shadowsocksr", "basic"}, cbi("ssr/basic"),_("Basic Settings"), 10).leaf = true
end
