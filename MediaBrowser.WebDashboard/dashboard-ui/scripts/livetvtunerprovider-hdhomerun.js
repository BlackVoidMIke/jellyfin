﻿(function ($, document, window) {

    function reload(page, providerId) {

        page.querySelector('.txtDevicePath').value = '';
        page.querySelector('.chkFavorite').checked = false;

        if (providerId) {
            ApiClient.getNamedConfiguration("livetv").done(function (config) {

                var info = config.TunerHosts.filter(function (i) {
                    return i.Id == providerId;
                })[0];

                page.querySelector('.txtDevicePath').value = info.Url || '';
                page.querySelector('.chkFavorite').checked = info.ImportFavoritesOnly;

            });
        }
    }

    function submitForm(page) {

        Dashboard.showLoadingMsg();

        var info = {
            Type: 'hdhomerun',
            Url: page.querySelector('.txtDevicePath').value,
            ImportFavoritesOnly: page.querySelector('.chkFavorite').checked
        };

        var id = getParameterByName('id');

        if (id) {
            info.Id = id;
        }

        ApiClient.ajax({
            type: "POST",
            url: ApiClient.getUrl('LiveTv/TunerHosts'),
            data: JSON.stringify(info),
            contentType: "application/json"

        }).done(function (result) {

            Dashboard.processServerConfigurationUpdateResult();
            Dashboard.navigate('livetvstatus.html');

        }).fail(function () {
            Dashboard.alert({
                message: Globalize.translate('ErrorSavingTvProvider')
            });
        });

    }

    $(document).on('pageinitdepends', "#liveTvTunerProviderHdHomerunPage", function () {

        var page = this;

        $('form', page).on('submit', function () {
            submitForm(page);
            return false;
        });

    }).on('pageshowready', "#liveTvTunerProviderHdHomerunPage", function () {

        var providerId = getParameterByName('id');
        var page = this;
        reload(page, providerId);
    });

})(jQuery, document, window);
