-- Copyright 2020 William <gw826943555@qq.com>
-- Licensed to the public under the Apache License 2.0.
--
module("luci.controller.transparent-proxy", package.seeall)

function index()
	entry({"admin", "vpn", "transparent-proxy"},
		alias("admin", "vpn", "transparent-proxy", "settings"),
		_("Transparent Proxy"), 59)

    entry({"admin", "vpn", "transparent-proxy", "settings"}, 
        cbi("transparent-proxy/settings"),
        _("Basic Settings"), 1).dependent = true

    entry({"admin", "vpn", "transparent-proxy", "advanced"}, 
        cbi("transparent-proxy/advanced"),
        _("Advanced"), 100)
end