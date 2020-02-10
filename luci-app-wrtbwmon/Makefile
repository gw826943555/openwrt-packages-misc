# Copyright (C) 2016 Openwrt.org
#
# This is free software, licensed under the Apache License, Version 2.0 .
#

include $(TOPDIR)/rules.mk

LUCI_TITLE:=LuCI support for Wrtbwmon
LUCI_DEPENDS:=+luci-app-nlbwmon
LUCI_PKGARCH:=all
PKG_VERSION:=1.0
PKG_RELEASE:=7

define Package/luci-app-wrtbwmon/install
	po2lmo ./po/zh-cn/wrtbwmon.po $(1)/usr/lib/lua/luci/i18n/wrtbwmon.zh-cn.lmo
endef

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature

