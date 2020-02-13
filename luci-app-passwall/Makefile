# Copyright (C) 2018-2020 Lienol <lawlienol@gmail.com>
#
# This is free software, licensed under the GNU General Public License v3.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-passwall
PKG_VERSION:=3.3
PKG_RELEASE:=41-20200207

PKG_BUILD_DIR := $(BUILD_DIR)/$(PKG_NAME)-$(PKG_VERSION)

include $(INCLUDE_DIR)/package.mk

define Package/$(PKG_NAME)/config
menu "Configuration"
	
config PACKAGE_$(PKG_NAME)_INCLUDE_Shadowsocks
	bool "Include Shadowsocks Redir (ss-redir)"
	default n
	
config PACKAGE_$(PKG_NAME)_INCLUDE_ShadowsocksR
	bool "Include ShadowsocksR Redir (ssr-redir)"
	default y

config PACKAGE_$(PKG_NAME)_INCLUDE_Shadowsocks_socks
	bool "Include Shadowsocks Socks (ss-local)"
	default n
	
config PACKAGE_$(PKG_NAME)_INCLUDE_ShadowsocksR_socks
	bool "Include ShadowsocksR Socks (ssr-local)"
	default n
	
config PACKAGE_$(PKG_NAME)_INCLUDE_V2ray
	bool "Include V2ray"
	default n
	
config PACKAGE_$(PKG_NAME)_INCLUDE_pdnsd
	bool "Include pdnsd"
	default y

endmenu
endef

define Package/$(PKG_NAME)
  CATEGORY:=LuCI
  SUBMENU:=3. Applications
  TITLE:=LuCI support for PassWall By Lienol
  PKGARCH:=all
  DEPENDS:=+luci-lib-ipkg +wget +curl +libmbedtls +iptables-mod-tproxy +kmod-ipt-tproxy +iptables-mod-ipopt +kmod-ipt-ipopt +ip +ipset +coreutils +coreutils-base64 +coreutils-nohup +luci-lib-jsonc \
  +bash +wget +resolveip +unzip +dnsmasq-full +tcping \
  +PACKAGE_$(PKG_NAME)_INCLUDE_Shadowsocks:shadowsocks-libev-ss-redir \
  +PACKAGE_$(PKG_NAME)_INCLUDE_ShadowsocksR:shadowsocksr-libev-alt \
  +PACKAGE_$(PKG_NAME)_INCLUDE_Shadowsocks_socks:shadowsocks-libev-ss-local \
  +PACKAGE_$(PKG_NAME)_INCLUDE_ShadowsocksR_socks:shadowsocksr-libev-ssr-local \
  +PACKAGE_$(PKG_NAME)_INCLUDE_V2ray:v2ray \
  +PACKAGE_$(PKG_NAME)_INCLUDE_pdnsd:pdnsd-alt
endef

define Build/Prepare
endef
 
define Build/Configure
endef
 
define Build/Compile
endef

define Package/$(PKG_NAME)/install
	$(INSTALL_DIR) $(1)/
	cp -pR ./root/* $(1)/
	
	$(INSTALL_DIR) $(1)/usr/lib/lua/luci
	cp -pR ./luasrc/* $(1)/usr/lib/lua/luci/
	
	$(INSTALL_DIR) $(1)/usr/lib/lua/luci/i18n
	po2lmo ./po/zh-cn/passwall.po $(1)/usr/lib/lua/luci/i18n/passwall.zh-cn.lmo
endef

define Package/$(PKG_NAME)/postinst
#!/bin/sh
chmod a+x $${IPKG_INSTROOT}/usr/share/passwall/* >/dev/null 2>&1
exit 0
endef

$(eval $(call BuildPackage,$(PKG_NAME)))
