require("luci.sys")

m = Map("transparent-proxy", translate("NJIT Client"), translate("Configure NJIT 802.11x client."))

s = m:section(TypedSection, "login", "")
s.addremove = false
s.anonymous = true

enable = s:option(Flag, "enable", translate("Enable"))
name = s:option(Value, "username", translate("Username"))
pass = s:option(Value, "password", translate("Password"))
pass.password = true
domain = s:option(Value, "domain", translate("Domain"))

ifname = s:option(ListValue, "ifname", translate("Interfaces"))
for k, v in ipairs(luci.sys.net.devices()) do
    if v ~= "lo" then
        ifname:value(v)
    end
end

local apply = luci.http.formvalue("cbi.apply")
if apply then
    io.popen("/etc/init.d/njitclient restart")
end

return m