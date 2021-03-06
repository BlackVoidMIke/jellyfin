define(["jQuery", "loading", "libraryMenu", "fnchecked", "emby-checkbox", "emby-linkbutton"], function($, loading, libraryMenu) {
    "use strict";

    function loadPage(page, config) {
        config.MergeMetadataAndImagesByName ? $(".fldImagesByName", page).hide() : $(".fldImagesByName", page).show(), $("#chkSaveMetadataHidden", page).checked(config.SaveMetadataHidden), $("#txtMetadataPath", page).val(config.MetadataPath || ""), $("#txtMetadataNetworkPath", page).val(config.MetadataNetworkPath || ""), loading.hide()
    }

    function loadMetadataConfig(page, config) {
        $("#selectDateAdded", page).val(config.UseFileCreationTimeForDateAdded ? "1" : "0")
    }

    function loadFanartConfig(page, config) {
        $("#txtFanartApiKey", page).val(config.UserApiKey || "")
    }

    function saveFanart(form) {
        ApiClient.getNamedConfiguration("fanart").then(function(config) {
            config.UserApiKey = $("#txtFanartApiKey", form).val(), ApiClient.updateNamedConfiguration("fanart", config)
        })
    }

    function saveMetadata(form) {
        ApiClient.getNamedConfiguration("metadata").then(function(config) {
            config.UseFileCreationTimeForDateAdded = "1" === $("#selectDateAdded", form).val(), ApiClient.updateNamedConfiguration("metadata", config)
        })
    }

    function alertText(options) {
        require(["alert"], function(alert) {
            alert(options)
        })
    }

    function onSubmitFail(response) {
        loading.hide(), response && 404 === response.status ? alertText("The metadata path entered could not be found. Please ensure the path is valid and try again.") : response && 500 === response.status && alertText("The metadata path entered is not valid. Please ensure the path exists and that Jellyfin server has write access to the folder.")
    }

    function onSubmit() {
        loading.show();
        var form = this;
        return ApiClient.getServerConfiguration().then(function(config) {
            config.SaveMetadataHidden = $("#chkSaveMetadataHidden", form).checked(), config.EnableTvDbUpdates = $("#chkEnableTvdbUpdates", form).checked(), config.EnableTmdbUpdates = $("#chkEnableTmdbUpdates", form).checked(), config.EnableFanArtUpdates = $("#chkEnableFanartUpdates", form).checked(), config.MetadataPath = $("#txtMetadataPath", form).val(), config.MetadataNetworkPath = $("#txtMetadataNetworkPath", form).val(), config.FanartApiKey = $("#txtFanartApiKey", form).val(), ApiClient.updateServerConfiguration(config).then(Dashboard.processServerConfigurationUpdateResult, onSubmitFail)
        }), saveMetadata(form), saveFanart(form), !1
    }

    function getTabs() {
        return [{
            href: "library.html",
            name: Globalize.translate("HeaderLibraries")
        }, {
            href: "librarydisplay.html",
            name: Globalize.translate("TabDisplay")
        }, {
            href: "metadataimages.html",
            name: Globalize.translate("TabMetadata")
        }, {
            href: "metadatanfo.html",
            name: Globalize.translate("TabNfoSettings")
        }, {
            href: "librarysettings.html",
            name: Globalize.translate("TabAdvanced")
        }]
    }
    return function(view, params) {
        $("#btnSelectMetadataPath", view).on("click.selectDirectory", function() {
            require(["directorybrowser"], function(directoryBrowser) {
                var picker = new directoryBrowser;
                picker.show({
                    path: $("#txtMetadataPath", view).val(),
                    networkSharePath: $("#txtMetadataNetworkPath", view).val(),
                    callback: function(path, networkPath) {
                        path && ($("#txtMetadataPath", view).val(path), $("#txtMetadataNetworkPath", view).val(networkPath)), picker.close()
                    },
                    validateWriteable: !0,
                    header: Globalize.translate("HeaderSelectMetadataPath"),
                    instruction: Globalize.translate("HeaderSelectMetadataPathHelp"),
                    enableNetworkSharePath: !0
                })
            })
        }), $(".librarySettingsForm").off("submit", onSubmit).on("submit", onSubmit), view.addEventListener("viewshow", function() {
            libraryMenu.setTabs("librarysetup", 4, getTabs), loading.show();
            var page = this;
            ApiClient.getServerConfiguration().then(function(config) {
                loadPage(page, config)
            }), ApiClient.getNamedConfiguration("metadata").then(function(metadata) {
                loadMetadataConfig(page, metadata)
            }), ApiClient.getNamedConfiguration("fanart").then(function(metadata) {
                loadFanartConfig(page, metadata)
            }), ApiClient.getSystemInfo().then(function(info) {
                "Windows" === info.OperatingSystem ? page.querySelector(".fldSaveMetadataHidden").classList.remove("hide") : page.querySelector(".fldSaveMetadataHidden").classList.add("hide")
            })
        })
    }
});
