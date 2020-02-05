local sys  = require "luci.sys"
local util = require "luci.util"

local m, s, o

m = Map("transparent-proxy", translate("Transparent Proxy"),
    translate("Configuration of servers for the transparent proxy package"))

-- [[ Global Settings ]]--
s = m:section(TypedSection, "server", translate("Server Settings"),
              translate("Global server settings"))
s.anonymous = true
s.addremove = false

o1 = s:option(Flag, "enable", translate("Enable"))
o1.default = o1.disabled
o1.rmempty = false

return m



--s:tab("basic", translate("Basic Options"))

--o = s:taboption("basic", Flag, "enabled", translate("Enabled"))
--o.rmempty = false