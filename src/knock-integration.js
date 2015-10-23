(function (window) {
    'use strict';

    var isMobile = window.matchMedia('(max-device-width: 960px)').matches;

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
        iframe.className = 'knock-frame';

        modal.appendChild(iframe);
        modal.appendChild(closeButton);
        modalBackdrop.appendChild(modal);
        document.body.appendChild(modalBackdrop);
    }

    function redirectToScheduling(redirectToUrl) {
        var returnToUrl = window.location.href;

        var hasQueryParams = redirectToUrl.indexOf('?') > -1;
        var returnToAppend = hasQueryParams ? '&redirect=' : '?redirect=';

        window.location.href = encodeURI(redirectToUrl + returnToAppend + returnToUrl);
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
                    url += '/listing/'+listingId;
                } else {
                    url += '/company/'+this.companyId;
                }

                url += '?isExternal=true&companyName='+this.companyId+'&s=w';

                document.getElementsByClassName('knock-modal-backdrop')[0].className = 'knock-modal-backdrop show';
                document.getElementsByClassName('knock-modal')[0].className = 'knock-modal';
                document.getElementsByClassName('knock-frame')[0].src = url;
            },
            openScheduling: function(){
                var url = '@@schedulingHost';

                if (url.indexOf('@@') === 0){
                    url = 'http://localhost:9000/#';
                }

                url += '/' + this.companyId;

                if (isMobile) {
                    redirectToScheduling(url);
                } else {
                    document.getElementsByClassName('knock-modal-backdrop')[0].className = 'knock-modal-backdrop show';
                    document.getElementsByClassName('knock-modal')[0].className = 'knock-modal skinny';
                    document.getElementsByClassName('knock-frame')[0].src = url;
                }
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
