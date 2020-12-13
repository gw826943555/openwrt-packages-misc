'use strict';
'require view';
'require form';
'require uci';
'require ui';

var conf = 'shadowsocksr';

var methods = [
	// aead
	'aes-128-gcm',
	'aes-192-gcm',
	'aes-256-gcm',
	'chacha20-ietf-poly1305',
	'xchacha20-ietf-poly1305',
	// stream
	'table',
	'rc4',
	'rc4-md5',
	'aes-128-cfb',
	'aes-192-cfb',
	'aes-256-cfb',
	'aes-128-ctr',
	'aes-192-ctr',
	'aes-256-ctr',
	'bf-cfb',
	'camellia-128-cfb',
	'camellia-192-cfb',
	'camellia-256-cfb',
	'salsa20',
	'chacha20',
	'chacha20-ietf',
];

var obfs = [
    'plain', 
    'http_simple', 
    'http_post', 
    'tls1.2_ticket_auth', 
    'tls1.2_ticket_fastauth',
]

var protocol = [
    'origin', 
    'verify_deflat',, 
    'auth_sha1_v4',
    'auth_aes128_sha1', 
    'auth_aes128_md5', 
    'auth_chain_a', 
    'auth_chain_b',
]

function parse_uri(uri) {
    var scheme = 'ssr://';
    if (uri && uri.indexOf(scheme) === 0) {
        const link = Buffer.from(uri.replace(/^ssr:\/\//, ''),'base64',).toString();
        var hashPos = uri.lastIndexOf('#'), tag;
        if(hashPos !== -1) {
            tag = uri.slice(hashPos + 1);
        }
        const [server, port, protocol, method, obfs, pwd_and_params] = link.split(':');

        const [pwd, params] = (({ query, pathname } = {}) => [
            Buffer.from(pathname, 'base64').toString(),
            Object.entries(qs.parse(query)).map(([key, val]) => [
                key,
                Buffer.from(val.toString(), 'base64').toString(),
            ]),
        ])(url.parse(pwd_and_params))

        var config = {
            server: server,
            server_port: port,
            password: pwd,
            encryption: method,
            protocol: protocol,
            obfs: obfs,
        }

        return [config, tag];
    }
    return null;
};

function options_server(s, opts) {
    var o, optfunc,
        tab = opts && opts.tab || null;

    if (!tab) {
        optfunc = function(/* ... */) {
            var o = s.option.apply(s, arguments);
            o.editable = true;
            return o;
        };
    } else {
        optfunc = function(/* ... */) {
            var o = s.taboption.apply(s, L.varargs(arguments, 0, tab));
            o.editable = true;
            return o;
        };
	}
	
	o = optfunc(form.Value, 'name', _('名称'));
	o.datatype = 'string';

	o = optfunc(form.Value, 'group', _('组'));
	o.datatype = 'string';

    o = optfunc(form.Value, 'server', _('服务器'));
    o.datatype = 'host';
    o.size = 16;

    o = optfunc(form.Value, 'server_port', _('端口'));
    o.datatype = 'port';
	o.size = 5;
	o.modalonly = true;;

    o = optfunc(form.Value, 'password', _('密码'));
    o.datatype = 'string';
	o.size = 12;
	o.modalonly = true;;

    o = optfunc(form.ListValue, 'encryption', _('加密方式'));
    methods.forEach(function(m) {
        o.value(m);
	});
	o.modalonly = true;;

    o = optfunc(form.ListValue, 'protocol', _('协议'));
    protocol.forEach(function(m) {
        o.value(m);
	});
	o.modalonly = true;;

    o = optfunc(form.Value, "protocol_param", _('协议参数'))
	o.datatype = 'string';
	o.modalonly = true;;

    o = optfunc(form.ListValue, 'obfs', _('混淆方式'));
    obfs.forEach(function(m) {
        o.value(m);
	});
	o.modalonly = true;;

    o = optfunc(form.Value, "obfs_param", _('混淆参数'))
	o.datatype = 'string';
	o.modalonly = true;;
};

return view.extend({
	render: function() {
		var m, s, o;

		m = new form.Map(conf, _('服务器设置'),
			_('远程服务器设置'));

		s = m.section(form.GridSection, 'server');
		s.anonymous = true;
		s.addremove = true;
		s.handleLinkImport = function() {
			var textarea = new ui.Textarea();
			ui.showModal(_('Import Links'), [
				textarea.render(),
				E('div', { class: 'right' }, [
					E('button', {
						class: 'btn',
						click: ui.hideModal
					}, [ _('Cancel') ]),
					' ',
					E('button', {
						class: 'btn cbi-button-action',
						click: ui.createHandlerFn(this, function() {
							textarea.getValue().split('\n').forEach(function(s) {
								var config = parse_uri(s);
								if (config) {
									var tag = config[1];
									if (tag && !tag.match(/^[a-zA-Z0-9_]+$/)) tag = null;
									var sid = uci.add(conf, 'server', tag);
									config = config[0];
									Object.keys(config).forEach(function(k) {
										uci.set(conf, sid, k, config[k]);
									});
								}
							});
							return uci.save()
								.then(L.bind(this.map.load, this.map))
								.then(L.bind(this.map.reset, this.map))
								.then(L.ui.hideModal)
								.catch(function() {});
						})
					}, [ _('Import') ])
				])
			]);
		};
		s.renderSectionAdd = function(extra_class) {
			var el = form.GridSection.prototype.renderSectionAdd.apply(this, arguments);
			el.appendChild(E('button', {
				'class': 'cbi-button cbi-button-add',
				'title': _('Import Links'),
				'click': ui.createHandlerFn(this, 'handleLinkImport')
			}, [ _('Import Links') ]));
			return el;
		};

		o = s.option(form.Flag, 'disabled', _('禁用'));
		o.editable = true;

		options_server(s);

		return m.render();
	},
	addFooter: function() {
		var p = '#edit=';
		if (location.hash.indexOf(p) === 0) {
			var section_id = location.hash.substring(p.length);
			var editBtn = document.querySelector('#cbi-shadowsocksr-' + section_id + ' button.cbi-button-edit');
			if (editBtn)
				editBtn.click();
		}
		return this.super('addFooter', arguments);
	}
});
