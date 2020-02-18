include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-ssr
PKG_RELEASE:=0
PKG_VERSION:=1
PKG_BUILD_DIR := $(BUILD_DIR)/$(PKG_NAME)

include $(INCLUDE_DIR)/package.mk

define Package/$(PKG_NAME)/config

config PACKAGE_$(PKG_NAME)_INCLUDE_ShadowsocksR_Server
	bool "Include ShadowsocksR Server"
	default n

config PACKAGE_$(PKG_NAME)_INCLUDE_ShadowsocksR_Socks
	bool "Include Socks Sever"
	default n
endef

define Package/$(PKG_NAME)
	SECTION:=luci
	CATEGORY:=LuCI
	SUBMENU:=3. Applications
	TITLE:=ShadowsocksR LuCI interface
	PKGARCH:=all
	DEPENDS:=+luci-compat +shadowsocksr-libev-alt +ipset +ip-full +iptables-mod-tproxy +dnsmasq-full +coreutils +coreutils-base64 +pdnsd-alt +wget +lua \
	+PACKAGE_$(PKG_NAME)_INCLUDE_ShadowsocksR_Server:shadowsocksr-libev-server
endef

define Build/Prepare
endef

define Build/Compile
endef

define Package/$(PKG_NAME)/conffiles
/etc/config/ssr
/etc/config/whitedomains.list
/etc/config/blackdomains.list
/etc/config/whiteips.list
/etc/config/blackips.list
endef

define Package/$(PKG_NAME)/install
	$(INSTALL_DIR) $(1)/etc/config
	$(INSTALL_CONF) ./root/etc/config/ssr $(1)/etc/config/ssr
	$(INSTALL_DATA) ./root/etc/config/*.list $(1)/etc/config/

	$(INSTALL_DIR) $(1)/etc/init.d
	$(INSTALL_BIN) ./root/etc/init.d/* $(1)/etc/init.d/

	$(INSTALL_DIR) $(1)/etc/uci-defaults
	$(INSTALL_BIN) ./root/etc/uci-defaults/* $(1)/etc/uci-defaults/

	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) ./root/usr/bin/* $(1)/usr/bin/

	$(INSTALL_DIR) $(1)/usr/share/ssr
	$(INSTALL_BIN) ./root/usr/share/ssr/*.sh $(1)/usr/share/ssr/
	$(INSTALL_DATA) ./root/usr/share/ssr/*.lua $(1)/usr/share/ssr/

	$(INSTALL_DIR) $(1)/usr/lib/lua/luci/controller
	$(INSTALL_DATA) ./luasrc/controller/*.lua $(1)/usr/lib/lua/luci/controller/

	$(INSTALL_DIR) $(1)/usr/lib/lua/luci/model/cbi/ssr
	$(INSTALL_DATA) ./luasrc/model/cbi/ssr/*.lua $(1)/usr/lib/lua/luci/model/cbi/ssr/

	$(INSTALL_DIR) $(1)/usr/lib/lua/luci/view/ssr
	$(INSTALL_DATA) ./luasrc/view/ssr/* $(1)/usr/lib/lua/luci/view/ssr/

	$(INSTALL_DIR) $(1)/usr/lib/lua/luci/i18n
	po2lmo ./po/zh-cn/ssr-plus.po $(1)/usr/lib/lua/luci/i18n/ssr-plus.zh-cn.lmo
endef

define Package/$(PKG_NAME)/postinst
#!/bin/sh
if [ -z "$${IPKG_INSTROOT}" ]; then
	( . /etc/uci-defaults/luci-app-ssr ) && rm -f /etc/uci-defaults/luci-app-ssr
	rm -f /tmp/luci-indexcache
	/etc/init.d/ssr enable >/dev/null 2>&1
fi
exit 0
endef

define Package/$(PKG_NAME)/prerm
#!/bin/sh
if [ -z "$${IPKG_INSTROOT}" ]; then
	/etc/init.d/ssr disable
	/etc/init.d/ssr stop
fi
exit 0
endef

define Package/$(PKG_NAME)/postrm
#!/bin/sh
rm -rf /etc/init.d/ssr /etc/config/ssr /etc/config/whitedomains.list /etc/config/blackdomains.list /etc/config/whiteips.list /etc/config/blackips.list >/dev/null 2>&1
exit 0
endef

$(eval $(call BuildPackage,$(PKG_NAME)))
