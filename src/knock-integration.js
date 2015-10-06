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
        var modalBackdrop = document.createElement('div');
        modalBackdrop.className = 'knock-modal-backdrop hide';

        var modal = document.createElement('div');
        modal.className = 'knock-modal';

        var closeButton = document.createElement('div');
        closeButton.className = 'close-button';
        closeButton.innerHTML = '&times;';
        closeButton.onclick = function(){
            modalBackdrop.className = 'knock-modal-backdrop hide';
        };

        var iframe = document.createElement('iframe');
        iframe.setAttribute('sandbox', 'allow-top-navigation allow-scripts allow-same-origin allow-forms allow-popups');
        iframe.className = 'knock-frame';

        modal.appendChild(iframe);
        modal.appendChild(closeButton);
        modalBackdrop.appendChild(modal);
        document.body.appendChild(modalBackdrop);
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

                var url = '@@companyHost';

                // knockHost is injected by grunt based on environment
                if (url.indexOf('@@') === 0){
                    url = 'http://localhost:9000';
                }

                if (listingId){
                    url += '/listing/'+listingId+'?s=w';
                } else {
                    url += '/company/'+this.companyId+'?s=w';
                }

                url += '?isExternal=true&companyName='+this.companyId;

                document.getElementsByClassName('knock-modal-backdrop')[0].className = 'knock-modal-backdrop show';
                document.getElementsByClassName('knock-modal')[0].className = 'knock-modal';
                document.getElementsByClassName('knock-frame')[0].src = url;
            },
            openScheduling: function(){
                var url = '@@schedulingHost';

                if (url.indexOf('@@') === 0){
                    url = 'http://localhost:9100/#';
                }

                url += '/' + this.companyId;

                document.getElementsByClassName('knock-modal-backdrop')[0].className = 'knock-modal-backdrop show';
                document.getElementsByClassName('knock-modal')[0].className = 'knock-modal skinny';
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
