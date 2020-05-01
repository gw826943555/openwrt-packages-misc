'use strict';
'require view';

return view.extend({
        render:function() {
                return E('iframe', {
                        src: 'http://' + window.location.hostname + ':19999',
                        style: 'width: 100%; min-height: 1200px; border: none; border-radius: 3px;'
                });
        },
        handleSaveApply: null,
        handleSave: null,
        handleReset: null
});
