#
# Copyright (C) 2021 William <gw826943555@qq.com>
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=xray-core
PKG_VERSION:=1.2.0
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION).tar.gz
PKG_SOURCE_URL:=https://codeload.github.com/XTLS/Xray-core/tar.gz/v$(PKG_VERSION)?
PKG_HASH:=1e32fac7a4c669751087aa6b32d922ea312afcde025866099d56cea936761d51

PKG_LICENSE:=MPL
PKG_LICENSE_FILES:=LICENSE
PKG_MAINTAINER:=William <gw826943555@qq.com>

PKG_BUILD_DEPENDS:=golang/host
PKG_BUILD_PARALLEL:=1
PKG_USE_MIPS16:=0

GO_PKG:=github.com/xtls/xray-core

include $(INCLUDE_DIR)/package.mk
include $(TOPDIR)/feeds/packages/lang/golang/golang-package.mk

define Package/xray-core/Default
	TITLE:=A platform for building proxies
	SECTION:=net
	CATEGORY:=Network
	SUBMENU:=Project X
endef

define Package/xray-core/Default/description
Project X originates from XTLS protocol, provides a set of network tools such as Xray-core and Xray-flutter.
It secures your network connections and thus protects your privacy.
endef

define Package/xray-core
	$(call Package/xray-core/Default)
	TITLE+= (full)
	DEPENDS:=$(GO_ARCH_DEPENDS) +ca-certificates
endef

define Package/xray-core/description
$(call Package/xray-core/Default/description)

	This package contains Xray, geoip.dat and geosite.dat.
endef

GEOIP_VER:=202101070033
GEOIP_FILE:=geoip.dat.$(GEOIP_VER)

define Download/geoip
	URL:=https://github.com/v2ray/geoip/releases/download/$(GEOIP_VER)/
	URL_FILE:=geoip.dat
	FILE:=$(GEOIP_FILE)
	HASH:=4effe8211bb0165c1aa99cd90af0824ec4e017fbb8853babcc0db27f4391ca86
endef
$(eval $(call Download,geoip))

GEOSITE_VER:=20210106164413
GEOSITE_FILE:=dlc.dat.$(GEOSITE_VER)

define Download/geosite
	URL:=https://github.com/v2ray/domain-list-community/releases/download/$(GEOSITE_VER)/
	URL_FILE:=dlc.dat
	FILE:=$(GEOSITE_FILE)
	HASH:=e74665d055b6f20be776a2a43b8534eee15223cd418f76a7ccf97d3f963c0c32
endef
$(eval $(call Download,geosite))

define Build/Prepare
	cp $(DL_DIR)/$(GEOIP_FILE) $(PKG_BUILD_DIR)/geoip.dat
	cp $(DL_DIR)/$(GEOSITE_FILE) $(PKG_BUILD_DIR)/geosite.dat
endef

GO_PKG_LDFLAGS:=-s -w
GO_PKG_LDFLAGS_X:= \
	$(GO_PKG)/core.version=$(PKG_VERSION) \
	$(GO_PKG)/core.codename=OpenWrt

define Build/Compile
	$(eval GO_PKG_BUILD_PKG:=$(GO_PKG)/main)
	$(call GoPackage/Build/Compile)
	mv -f $(GO_PKG_BUILD_BIN_DIR)/main $(GO_PKG_BUILD_BIN_DIR)/xray
endef

define Package/xray-core/install
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) $(GO_PKG_BUILD_BIN_DIR)/xray $(1)/usr/bin

	$(INSTALL_DIR) $(1)/usr/share/xray
	$(INSTALL_DATA) $(PKG_BUILD_DIR)/{geoip,geosite}.dat $(1)/usr/share/xray
endef

$(eval $(call GoBinPackage,$(PKG_NAME)))
$(eval $(call BuildPackage,$(PKG_NAME)))