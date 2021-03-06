# openwrt-packages-misc

个人收集的软件包，需要openwrt版本大于19.07

# 使用方法
在feeds.conf.default文件中添加

`src-git misc https://github.com/gw826943555/openwrt-packages-misc.git`

执行

`./scripts/feeds update -a`

`./scripts/feeds install -a`
