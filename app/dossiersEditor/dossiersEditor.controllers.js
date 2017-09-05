/*------------------------------------------------------------------------------------
    List of contributors: https://github.com/MSFOCBA
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/

dossiersEditorModule.controller('dossiersEditorMainController', ['$scope', 'dossiersReaderMeFactory', 'dossiersServicesFactory', 'dossiersDossierFactory', 'dossiersEditorTranslationsFactory', 'dossiersEditorUpdateDescriptionFactory', 'dossiersEditorCreateDescriptionFactory', function($scope, dossiersReaderMeFactory, dossiersServicesFactory, dossiersDossierFactory, dossiersEditorTranslationsFactory, dossiersEditorUpdateDescriptionFactory, dossiersEditorCreateDescriptionFactory) {
    startLoadingState();

    /*
     * @name $scope.tinymceOptions
     * @description Defines the settings of TinyMCE
     */
    $scope.tinymceOptions = {
        menu: {},
        plugins: 'link image table textcolor preview wordcount lists advlist',
        toolbar: 'insertfile undo redo | styleselect | fontsizeselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | table | preview',
        fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
        //statusbar: false,
        content_css: 'app/app.css.css, assets/fonts/rajdhani.css',
        resize: true,
        setup: function(ed) {
            ed.on('change', function(e) {
                $('#saveButton').removeClass('btn-default');
                $('#saveButton').addClass('btn-warning');
            });
        }
    };

    /*
     * @name me
     * @description Checks if the user is member of the Administrators group an thus have right to edit services descriptions
     * @dependencies dossiersReaderMeFactory
     */
    var me = dossiersReaderMeFactory.get({},function() {
        $scope.autho = me.userGroups[0].name == $scope.userAdminGroup;
        console.log('dossiersEditor: User authorised to edit: ' + $scope.autho);
    });

    /*
     * @name $scope.languages
     * @description Lists the languages used in DHIS2...
     * @todo Should not be hardcoded / it is a duplicate from $translateProvider.registerAvailableLanguageKeys in app.config.js
     */
    $scope.languages = {
        "languages": [{
            "language": "EN",
            "code": "en"
        }, {
            "language": "FR",
            "code": "fr"
        }, {
            "language": "ES",
            "code": "es"
        }, {
            "language": "PT",
            "code": "pt"
        }]
    };

    /*
     * @name $scope.services
     * @description Gets the list of services
     * @dependencies dossiersServicesFactory
     */
    $scope.services = dossiersServicesFactory.get(function() {
        endLoadingState(false);
    });

    /*
     * @name none
     * @description Trigger actions when 'selectedService' or 'selectedLanguage' are changed
     * 1) saveButton and saveIcon actualization
     * 2) loads description into TinyMCE from $scope.dossier
     * @dependencies dossiersDossierFactory
     * @todo Timeout to manage query delay / async behaviour is not 100% bulletproof...
     */
    $scope.$watchGroup(['selectedService', 'selectedLanguage'], function(newValues, oldValues) {
        ping();

        $('#saveButton').removeClass('btn-success');
        $('#saveButton').removeClass('btn-warning');
        $('#saveButton').removeClass('btn-danger');
        $('#saveButton').addClass('btn-default');
        $('#saveButton').addClass('disabled');
        $('#saveIcon').removeClass('glyphicon-floppy-disk');
        $('#saveIcon').addClass('glyphicon-time');

        if (!angular.isUndefined($scope.selectedLanguage) && !angular.isUndefined($scope.selectedService)) {
            startLoadingState();

            $scope.dossier = dossiersDossierFactory.get({
                languageCode: $scope.selectedLanguage.code,
                serviceId: $scope.selectedService.id
            }, function() {
                $scope.tinymceModel = $scope.dossier.displayDescription;

                setTimeout(function(){
                    $('#saveButton').removeClass('btn-success');
                    $('#saveButton').removeClass('btn-warning');
                    $('#saveButton').removeClass('btn-danger');
                    $('#saveButton').addClass('btn-default');
                    $('#saveButton').removeClass('disabled');
                    $('#saveIcon').removeClass('glyphicon-time');
                    $('#saveIcon').addClass('glyphicon-floppy-disk');

                    endLoadingState(false);
                }, 500);
            });
        }
    });

    /*
     * @name $scope.saveDescription
     * @description Action triggered when saveButton is clicked
     * @dependencies dossiersEditorTranslationsFactory | dossiersEditorUpdateDescriptionFactory
     */
    $scope.saveDescription = function() {
        if (!angular.isUndefined($scope.selectedLanguage) && !angular.isUndefined($scope.selectedService)) {
            startLoadingState(false);

            var translationsArray = [];
            if($scope.tinymceModel){
                translationsArray.push({
                    "property": "DESCRIPTION",
                    "locale": $scope.selectedLanguage.code,
                    "value": $scope.tinymceModel
                });
            }

            $scope.translation = dossiersEditorTranslationsFactory.get({
                serviceId: $scope.selectedService.id
            }, function() {
                console.log("original", $scope.translation.translations);
                $scope.translation.translations.forEach(function(translation) {
                    if(translation.locale != $scope.selectedLanguage.code || translation.property != "DESCRIPTION"){
                        translationsArray.push(translation);
                    }
                });
                console.log("update", translationsArray);

                dossiersEditorUpdateDescriptionFactory.update({
                    serviceId: $scope.selectedService.id
                },{
                  "translations": translationsArray
                }, function() {
                    $('#saveButton').removeClass('btn-warning');
                    $('#saveButton').removeClass('btn-danger');
                    $('#saveButton').addClass('btn-success');
                    endLoadingState();
                });
            });

        }
    };
}]);
