#
# Copyright (C) 2017-2020 William <gw826943555@qq.com>
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=shadowsocksr-libev
PKG_VERSION:=2.5.6
PKG_RELEASE:=6

PKG_SOURCE_PROTO:=git
PKG_SOURCE_URL:=https://github.com/shadowsocksrr/shadowsocksr-libev
PKG_SOURCE_VERSION:=d63ff863800a5645aca4309d5dd5962bd1e95543
PKG_SOURCE_SUBDIR:=$(PKG_NAME)-$(PKG_VERSION)-$(PKG_SOURCE_VERSION)
PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION)-$(PKG_SOURCE_VERSION).tar.xz

PKG_LICENSE:=GPL-3.0-or-later
PKG_LICENSE_FILES:=LICENSE

PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_NAME)/$(BUILD_VARIANT)/$(PKG_NAME)-$(PKG_VERSION)-$(PKG_SOURCE_VERSION)

PKG_INSTALL:=1
PKG_FIXUP:=autoreconf
PKG_USE_MIPS16:=0
PKG_BUILD_PARALLEL:=1

include $(INCLUDE_DIR)/package.mk

define Package/shadowsocksr-libev-config
	SECTION:=net
	CATEGORY:=Network
	SUBMENU:=ShadowsocksR
	TITLE:=shadowsocksr-libev config scripts
	URL:=https://github.com/shadowsocksrr/shadowsocksr-libev
	#todo
	DEPENDS:=+libudns +zlib 
endef

define Package/shadowsocksr-libev-config/conffiles
/etc/config/shadowsocksr-libev
endef

define Package/shadowsocksr-libev-config/install
	$(INSTALL_DIR) $(1)/etc/config
	$(INSTALL_DATA) ./files/shadowsocksr-libev.config $(1)/etc/config/shadowsocksr-libev
	$(INSTALL_DIR) $(1)/etc/init.d
	$(INSTALL_BIN) ./files/shadowsocksr-libev.init $(1)/etc/init.d/shadowsocksr-libev
endef

define Package/shadowsocksr-libev/Default
  define Package/shadowsocksr-libev-$(1)
    SECTION:=net
    CATEGORY:=Network
    SUBMENU:=ShadowsocksR
    TITLE:=shadowsocksr-libev $(1)
    URL:=https://github.com/shadowsocksrr/shadowsocksr-libev
    DEPENDS:=+libev +libopenssl +libpthread +libsodium +shadowsocksr-libev-config $(DEPENDS_$(1))
  endef

  define Package/shadowsocksr-libev-$(1)/install
	$$(INSTALL_DIR) $$(1)/usr/bin
	$$(INSTALL_BIN) $$(PKG_INSTALL_DIR)/usr/bin/$(1) $$(1)/usr/bin
  endef

endef

DEPENDS_ssr-local = +libpcre
DEPENDS_ssr-server = +libcares +libpcre

#SHADOWSOCKSR_COMPONENTS:=ssr-local ssr-redir ssr-tunnel ssr-server
SHADOWSOCKSR_COMPONENTS:=ssr-redir
define shadowsocksr-libev/templates
  $(foreach component,$(SHADOWSOCKSR_COMPONENTS),
    $(call Package/shadowsocksr-libev/Default,$(component))
  )
endef
$(eval $(call shadowsocksr-libev/templates))


define Package/shadowsocksr-libev-ssr-rules
  SECTION:=net
  CATEGORY:=Network
  SUBMENU:=ShadowsocksR
  TITLE:=shadowsocksr-libev ssr-rules
  URL:=https://github.com/shadowsocksrr/shadowsocksr-libev
  DEPENDS:=+ip +ipset +iptables-mod-tproxy +resolveip +shadowsocksr-libev-ssr-redir +shadowsocksr-libev-config
endef

define Package/shadowsocksr-libev-ssr-rules/install
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) ./files/ssr-rules $(1)/usr/bin
	$(INSTALL_DIR) $(1)/etc/uci-defaults
	$(INSTALL_DATA) ./files/firewall.ssr-rules $(1)/etc
	$(INSTALL_BIN) ./files/ssr-rules.defaults $(1)/etc/uci-defaults
endef

define Package/shadowsocksr-libev-ssr-rules/prerm
#!/bin/sh
s=firewall.ssr_rules
uci get "$$s" >/dev/null || exit 0
uci batch <<-EOF
	delete $$s
	commit firewall
EOF
endef

define Build/Prepare
	$(call Build/Prepare/Default)
	$(FIND) $(PKG_BUILD_DIR) \
			   -name '*.o' \
			-o -name '*.lo' \
			-o -name '.deps' \
			-o -name '.libs' \
		| $(XARGS) rm -rvf
endef

CONFIGURE_ARGS += \
	--disable-documentation \
	--disable-ssp \
	--disable-assert \
	--enable-system-shared-lib

TARGET_CFLAGS += -flto
TARGET_LDFLAGS += -Wl,--gc-sections,--as-needed

$(eval $(call BuildPackage,shadowsocksr-libev-config))
$(eval $(call BuildPackage,shadowsocksr-libev-ssr-rules))
$(foreach component,$(SHADOWSOCKSR_COMPONENTS), \
  $(eval $(call BuildPackage,shadowsocksr-libev-$(component))) \
)
