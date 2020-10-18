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
PKG_SOURCE_URL:=https://github.com/gw826943555/shadowsocksr-libev
PKG_SOURCE_VERSION:=0e9fc7dd928f3d1ed356e9c9d51d3a06f04b3b5d

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
	TITLE:=shadowsocksr-libev ssr-redir openssl
	VARIANT:=openssl
	URL:=https://github.com/shadowsocksrr/shadowsocksr-libev
	DEPENDS:=+libev +libopenssl +libpthread +libsodium +shadowsocksr-config +libudns +zlib +resolveip
endef

define Package/shadowsocksr-redir-mbedtls
	SECTION:=net
	CATEGORY:=Network
	SUBMENU:=ShadowsocksR
	TITLE:=shadowsocksr-libev ssr-redir mbedtls
	VARIANT:=mbedtls
	URL:=https://github.com/shadowsocksrr/shadowsocksr-libev
	DEPENDS:=+libev +libmbedtls +libpthread +libsodium +shadowsocksr-config +libudns +resolveip
endef

CONFIGURE_ARGS += \
	--disable-documentation \
	--disable-ssp \
	--disable-assert \
	--enable-system-shared-lib

ifeq ($(BUILD_VARIANT),openssl)
	CONFIGURE_ARGS += --with-crypto-library=openssl
endif

ifeq ($(BUILD_VARIANT),mbedtls)
	CONFIGURE_ARGS += --with-crypto-library=mbedtls
endif

TARGET_CFLAGS += -flto
TARGET_LDFLAGS += -Wl,--gc-sections,--as-needed

define Package/shadowsocksr-redir/install
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/src/ss-redir $(1)/usr/bin/ssr-redir
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/server/ss-check $(1)/usr/bin/ssr-check
endef

Package/shadowsocksr-redir-mbedtls/install=$(Package/shadowsocksr-redir/install)

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
  DEPENDS:=+ip +ipset +iptables-mod-tproxy +resolveip
endef

define Package/shadowsocksr-rules/conffiles
/etc/shadowsocksr/dst_ips.bypass
/etc/shadowsocksr/dst_ips.forward
/ect/shadowsocksr/dst_net.bypass
/etc/shadowsocksr/dst_net.forward
endef

define Package/shadowsocksr-rules/install
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) ./files/ssr-rules $(1)/usr/bin

	$(INSTALL_DIR) $(1)/etc/uci-defaults
	$(INSTALL_DATA) ./files/firewall.ssr-rules $(1)/etc
	$(INSTALL_BIN) ./files/ssr-rules.defaults $(1)/etc/uci-defaults

	$(INSTALL_DIR) $(1)/etc/shadowsocksr
	$(INSTALL_CONF) ./files/dst_ips.bypass $(1)/etc/shadowsocksr/dst_ips.bypass
	$(INSTALL_CONF) ./files/dst_ips.forward $(1)/etc/shadowsocksr/dst_ips.forward
	$(INSTALL_CONF) ./files/dst_net.bypass $(1)/etc/shadowsocksr/dst_net.bypass
	$(INSTALL_CONF) ./files/dst_net.forward $(1)/etc/shadowsocksr/dst_net.forward
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
$(eval $(call BuildPackage,shadowsocksr-redir-mbedtls))
$(eval $(call BuildPackage,shadowsocksr-config))
$(eval $(call BuildPackage,shadowsocksr-rules))
