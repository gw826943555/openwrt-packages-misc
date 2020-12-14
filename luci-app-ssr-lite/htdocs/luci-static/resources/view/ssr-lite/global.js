'use strict';
'require view';
'require poll';
'require form';
'require uci';
'require fs';
'require network';
'require rpc';

function ucival_to_bool(val) {
	return val === 'true' || val === '1' || val === 'yes' || val === 'on';
}

return view.extend({
	values_serverlist: function(o) {
		uci.sections('shadowsocksr', 'server', function(sdata) {
			var cfg = sdata['name'],
				ping = sdata['ping'],
				sname = sdata['name'];
			var desc = '[%s ms] %s'.format(ping, sname);
				o.value(cfg, desc);
		});
	},
	load: function() {
		return Promise.all([
			uci.load('shadowsocksr')
		]);
	},
	render: function(stats) {
		var m, s, o;

		m = new form.Map('shadowsocksr', _('全局设置'));

		s = m.section(form.NamedSection, 'global', 'ssr_redir');
		s.anonymous = false;
		s.addremove = false;
		
		o = s.option(form.Button, 'disabled', _('启用/禁用'));
		o.modalonly = false;
		o.editable = true;
		o.inputtitle = function(section_id) {
			var s = uci.get('shadowsocksr', section_id);
			if (ucival_to_bool(s['disabled'])) {
				this.inputstyle = 'reset';
				return _('禁用');
			}
			this.inputstyle = 'save';
			return _('启用');
		}
		o.onclick = function(ev) {
			var inputEl = ev.target.parentElement.nextElementSibling;
			inputEl.value = ucival_to_bool(inputEl.value) ? '0' : '1';
			return this.map.save();
		}

		o = s.option(form.ListValue, 'server_cfg', _('远程服务器'))
		this.values_serverlist(o)

		o = s.option(form.Value, 'local_address', _('本地监听地址'));
		o.datatype = 'ipaddr';
		o.placeholder = '0.0.0.0';
		
		o = s.option(form.Value, 'local_port', _('本地监听端口'));
		o.datatype = 'port';

		o = s.option(form.Value, 'timeout', _('超时 (秒)'));
		o.datatype = 'uinteger';
		
		o = s.option(form.Value, 'threads', _('线程数'));
		o.datatype = 'uinteger';
		
		s.option(form.Flag, 'reuse_port', _('启用 SO_REUSEPORT'));

		s.option(form.Flag, 'fast_open', _('启用 TCP Fast Open'));

		s.option(form.Flag, 'verbose', _('Verbose'));
		
		return m.render();
	},
});
