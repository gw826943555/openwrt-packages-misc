#
# Copyright (C) 2021 William <gw826943555@qq.com>
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=xray-core
PKG_VERSION:=1.2.1
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION).tar.gz
PKG_SOURCE_URL:=https://codeload.github.com/xtls/xray-core/tar.gz/v$(PKG_VERSION)?
PKG_HASH:=eebea67d9176cc016d21de2d8123b0a6ab795ec82af2c6b8d7467212841bdc56

PKG_LICENSE:=MPL
PKG_LICENSE_FILES:=LICENSE
PKG_MAINTAINER:=William <gw826943555@qq.com>

PKG_BUILD_DEPENDS:=golang/host
PKG_BUILD_PARALLEL:=1
PKG_USE_MIPS16:=0

GO_PKG:=github.com/xtls/xray-core
GO_PKG_BUILD_PKG:=$(GO_PKG)/main
GO_PKG_LDFLAGS:=-s -w
GO_PKG_LDFLAGS_X:= \
	$(GO_PKG)/core.version=$(PKG_VERSION) \
	$(GO_PKG)/core.codename=OpenWrt

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
	URL:=https://github.com/v2fly/geoip/releases/download/$(GEOIP_VER)/
	URL_FILE:=geoip.dat
	FILE:=$(GEOIP_FILE)
	HASH:=4effe8211bb0165c1aa99cd90af0824ec4e017fbb8853babcc0db27f4391ca86
endef
$(eval $(call Download,geoip))

GEOSITE_VER:=20210111031038
GEOSITE_FILE:=dlc.dat.$(GEOSITE_VER)

define Download/geosite
	URL:=https://github.com/v2fly/domain-list-community/releases/download/$(GEOSITE_VER)/
	URL_FILE:=dlc.dat
	FILE:=$(GEOSITE_FILE)
	HASH:=ef09e558d619650f6c0c6666dfc62581d7f17f43fa87b4610f64bffb14761f4c
endef
$(eval $(call Download,geosite))

PKG_UNPACK:=$(HOST_TAR) -C $(PKG_BUILD_DIR) --strip-components=1 -xzf $(DL_DIR)/$(PKG_SOURCE)

define Package/xray-core/install
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) $(GO_PKG_BUILD_BIN_DIR)/main $(1)/usr/bin/xray

	$(INSTALL_DIR) $(1)/usr/share/xray
	$(INSTALL_DATA) $(DL_DIR)/$(GEOIP_FILE) $(1)/usr/share/xray/geoip.dat
	$(INSTALL_DATA) $(DL_DIR)/$(GEOSITE_FILE) $(1)/usr/share/xray/geosite.dat
endef

$(eval $(call GoBinPackage,$(PKG_NAME)))
$(eval $(call BuildPackage,$(PKG_NAME)))