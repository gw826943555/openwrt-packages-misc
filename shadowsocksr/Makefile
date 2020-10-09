#
# Copyright (C) 2017-2020 William <gw826943555@qq.com>
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=shadowsocksr
PKG_VERSION:=2.5.6
PKG_RELEASE:=6

PKG_SOURCE_PROTO:=git
PKG_SOURCE_URL:=https://github.com/shadowsocksrr/shadowsocksr-libev
PKG_SOURCE_VERSION:=d63ff863800a5645aca4309d5dd5962bd1e95543
PKG_SOURCE_SUBDIR:=$(PKG_NAME)-$(PKG_VERSION)-$(PKG_SOURCE_VERSION)
PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION)-$(PKG_SOURCE_VERSION).tar.xz

PKG_LICENSE:=GPL-3.0-or-later
PKG_LICENSE_FILES:=LICENSE

PKG_INSTALL:=1
PKG_FIXUP:=autoreconf
PKG_USE_MIPS16:=0
PKG_BUILD_PARALLEL:=1

include $(INCLUDE_DIR)/package.mk

define Package/shadowsocksr-redir
	SECTION:=net
	CATEGORY:=Network
	SUBMENU:=ShadowsocksR
	TITLE:=shadowsocksr-libev ssr-redir
	URL:=https://github.com/shadowsocksrr/shadowsocksr-libev
	DEPENDS:=+libev +libopenssl +libpthread +libsodium +shadowsocksr-config +libudns +zlib 
endef

CONFIGURE_ARGS += \
	--disable-documentation \
	--disable-ssp \
	--disable-assert \
	--enable-system-shared-lib

TARGET_CFLAGS += -flto
TARGET_LDFLAGS += -Wl,--gc-sections,--as-needed

define Package/shadowsocksr-redir/install
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/src/ss-redir $(1)/usr/bin/ssr-redir
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/server/ss-check $(1)/usr/bin/ssr-check
endef

define Package/shadowsocksr-config
	SECTION:=net
	CATEGORY:=Network
	SUBMENU:=ShadowsocksR
	TITLE:=shadowsocksr-libev config scripts
	URL:=https://github.com/shadowsocksrr/shadowsocksr-libev
endef

define Package/shadowsocksr-config/conffiles
/etc/config/shadowsocksr
endef

define Package/shadowsocksr-config/install
	$(INSTALL_DIR) $(1)/etc/config
	$(INSTALL_DATA) ./files/shadowsocksr-libev.config $(1)/etc/config/shadowsocksr
	$(INSTALL_DIR) $(1)/etc/init.d
	$(INSTALL_BIN) ./files/shadowsocksr-libev.init $(1)/etc/init.d/shadowsocksr
endef

define Package/shadowsocksr-rules
  SECTION:=net
  CATEGORY:=Network
  SUBMENU:=ShadowsocksR
  TITLE:=shadowsocksr-libev ssr-rules
  URL:=https://github.com/shadowsocksrr/shadowsocksr-libev
  DEPENDS:=+ip +ipset +iptables-mod-tproxy +resolveip +shadowsocksr-redir +shadowsocksr-config
endef

define Package/shadowsocksr-rules/install
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) ./files/ssr-rules $(1)/usr/bin
	$(INSTALL_DIR) $(1)/etc/uci-defaults
	$(INSTALL_DATA) ./files/firewall.ssr-rules $(1)/etc
	$(INSTALL_BIN) ./files/ssr-rules.defaults $(1)/etc/uci-defaults
endef

define Package/shadowsocksr-rules/prerm
#!/bin/sh
s=firewall.ssr_rules
uci get "$$s" >/dev/null || exit 0
uci batch <<-EOF
	delete $$s
	commit firewall
EOF
endef

$(eval $(call BuildPackage,shadowsocksr-redir))
$(eval $(call BuildPackage,shadowsocksr-config))
$(eval $(call BuildPackage,shadowsocksr-rules))
