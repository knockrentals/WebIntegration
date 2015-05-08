(function (window) {
    'use strict';

    function injectCSS(){
        var link = document.createElement('link');
        // cssFileUrl is injected by grunt based on environment
        var cssFileUrl = '@@cssFileUrl';

        if (cssFileUrl.indexOf('@@') === 0){
            cssFileUrl = './src/knock-integration.css';
        }

        link.href = cssFileUrl;
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.media = 'screen,print';

        try {
            document.getElementsByTagName('head')[0].appendChild(link);
        } catch(e) {
            console.log('Knock integration requires "head" tag!');
        }
    }

    function createModal(){
        var modal = document.createElement('div');
        modal.className = 'knock-modal hide';

        var closeButton = document.createElement('div');
        closeButton.className = 'close-button';
        closeButton.innerHTML = '&times;';
        closeButton.onclick = function(){
            modal.className = 'knock-modal hide';
        };

        var iframe = document.createElement('iframe');
        iframe.className = 'knock-frame';

        modal.appendChild(iframe);
        modal.appendChild(closeButton);
        document.body.appendChild(modal);
    }

    function initializeNamespace(){
        window.knock = {
            companyId: null,
            init: function(companyId){
                this.companyId = companyId;
            },
            open: function(listingId){
                if (!this.companyId){
                    throw 'init must be called with company ID before opening modal!';
                }

                // knockHost is injected by grunt based on environment
                var url = '@@knockHost' || '';
                if (url.indexOf('@@') === 0){
                    url = 'http://localhost:9000';
                }

                if (listingId){
                    url += '/listing/'+listingId;
                } else {
                    url += '/company/'+this.companyId;
                }

                url += '?isExternal=true&companyName='+this.companyId;

                document.getElementsByClassName('knock-modal')[0].className = 'knock-modal show';
                document.getElementsByClassName('knock-frame')[0].src = url;
            }
        };
    }

    initializeNamespace();

    var tid = setInterval( function () {
        if (document.readyState !== 'complete'){
            return;
        }

        clearInterval( tid );
        injectCSS();
        createModal();
    }, 100 );

})(window);