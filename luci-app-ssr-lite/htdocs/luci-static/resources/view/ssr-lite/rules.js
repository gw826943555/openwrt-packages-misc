'use strict';
'require view';
'require uci';
'require fs';
'require form';
'require tools.widgets as widgets';

var conf = 'shadowsocksr';

function src_dst_option(s /*, ... */) {
	var o = s.taboption.apply(s, L.varargs(arguments, 1));
	o.datatype = 'or(ipaddr,cidr)';
}

return view.extend({
	load: function() {
		return Promise.all([
			L.resolveDefault(fs.stat('/usr/lib/iptables/libxt_recent.so'), {}),
            L.resolveDefault(fs.read_direct('/etc/shadowsocksr/dst_net.bypass'), ''),
            L.resolveDefault(fs.read_direct('/etc/shadowsocksr/dst_net.forward'), ''),
			uci.load(conf).then(function() {
				if (!uci.get_first(conf, 'ssr_rules')) {
					uci.set(conf, uci.add(conf, 'ssr_rules', 'ssr_rules'), 'disabled', '1');
				}
			})
		]);
	},
	render: function(stats) {
		var m, s, o;

		m = new form.Map(conf, _('转发规则'),
            _('本页面用于配置转发规则。全局规则优先级最高，内网规则其次，外网规则最低。<br/> \
            bypass：绕过，不转发 <br/> forward：转发 <br/> checkdst：继续匹配低优先级规则 <br/>'));

		s = m.section(form.NamedSection, 'ssr_rules', 'ssr_rules');
		s.tab('general', _('全局设置'));
		s.tab('src', _('内网设置'));
		s.tab('dst', _('外网设置'));
        s.tab('dns', _('域名设置'));

		s.taboption('general', form.Flag, 'disabled', _('禁用'));

		o = s.taboption('general', form.ListValue, 'local_default',
			_('全局默认规则'));
        o.value('bypass');
        o.value('forwaard');
        o.value('checkdst');

		o = s.taboption('general', widgets.DeviceSelect, 'ifnames',
			_('接口'),
			_('只对选定的接口应用规则'));
		o.multiple = true;
		o.noaliases = true;
		o.noinactive = true;

		src_dst_option(s, 'src', form.DynamicList, 'src_ips_bypass',
			_('绕过列表'),
			_('列表中的主机数据包将不会被转发'));
		src_dst_option(s, 'src', form.DynamicList, 'src_ips_forward',
			_('转发列表'),
			_('列表中的主机数据包会被转发'));
		src_dst_option(s, 'src', form.DynamicList, 'src_ips_checkdst',
			_('匹配外网规则'),
			_('列表中的主机数据包将继续匹配外网规则'));
		o = s.taboption('src', form.ListValue, 'src_default',
			_('默认规则'),
			_('不在以上列表中主机的默认规则'));
        o.value('bypass');
        o.value('forwaard');
        o.value('checkdst');

		src_dst_option(s, 'dst', form.DynamicList, 'dst_ips_bypass',
			_('绕过列表'),
			_('绕过列表中的地址'));
		src_dst_option(s, 'dst', form.DynamicList, 'dst_ips_forward',
			_('转发列表'),
            _('转发列表中的地址'));
        s.taboption('dst', form.Value, 'dst_ports_args',
			_('端口参数'),
			_('设置转发的端口参数。谨慎填写！'));

		o = s.taboption('dst', form.ListValue, 'dst_default',
			_('默认规则'),
			_('没有匹配的地址的默认规则'));
        o.value('bypass');
        o.value('forwaard');

		if (stats[0].type === 'file') {
			o = s.taboption('dst', form.Flag, 'dst_forward_recentrst');
		} else {
			uci.set(conf, 'ss_rules', 'dst_forward_recentrst', '0');
			o = s.taboption('dst', form.Button, '_install');
			o.inputtitle = _('Install package iptables-mod-conntrack-extra');
			o.inputstyle = 'apply';
			o.onclick = function() {
				window.open(L.url('admin/system/opkg') +
					'?query=iptables-mod-conntrack-extra', '_blank', 'noopener');
			}
		}
		o.title = _('Forward recentrst');
		o.description = _('Forward those packets whose dst have recently sent to us multiple tcp-rst');

        o = s.taboption('dns', form.Value, 'dst_net_dns_server',
            _('DNS服务器'),
            _('需要转发的域名使用的DNS服务器'));
        o.datatype = 'ipaddr';

        o = s.taboption('dns', form.Value, 'dst_net_dns_port',
            _('端口'),
            _('DNS服务器端口'));
        o.datatype = 'port';

		return m.render();
	},
});
