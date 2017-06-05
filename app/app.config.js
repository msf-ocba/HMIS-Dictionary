/*------------------------------------------------------------------------------------
    List of contributors: https://github.com/MSFOCBA
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/

/*var graphModule = angular.module('graphModule', ['angucomplete-alt']);*/
var adminModule = angular.module('adminModule', []);

var dossiersEditorModule = angular.module('dossiersEditorModule', ['ui.tinymce']);
var dossiersReaderModule = angular.module('dossiersReaderModule', []);
var searchModule = angular.module('searchModule', ['ngTable', 'ui.bootstrap']);
var dossiersModule = angular.module('dossiersModule', ['dossiersEditorModule','dossiersReaderModule']);
var dossierProgramsModule = angular.module('dossierProgramsModule', []);
var datasetsModule = angular.module('datasetsModule', [])

var appModule = angular.module('appModule', ['ui.router', 'd2Menu', 'ngSanitize', 'pascalprecht.translate', 'ngResource', 'dossiersModule', 'dossierProgramsModule', 'datasetsModule','searchModule', 'adminModule'/*, 'graphModule'*/]);

/*
 * 	@alias appModule.config
 * 	@type {Config}
 * 	@description Configures the appModule so it manages routes and translations
 *	@todo
 */
appModule.config(['$stateProvider', '$urlRouterProvider', '$translateProvider', function($stateProvider, $urlRouterProvider, $translateProvider) {

    $urlRouterProvider.otherwise("/dossiers")

    $stateProvider
        .state('dossiers', {
            url:'/dossiers',
            abstract: true,
            templateUrl: 'app/dossiers/dossiers.view.html'
        })
            .state('dossiers.reader', {
                url:'',
                templateUrl: 'app/dossiersReader/dossiersReader.template.html'
            })
            .state('dossiers.editor', {
                url:'/editor',
                templateUrl: 'app/dossiersEditor/dossiersEditor.template.html'
            })
        .state('dossierPrograms', {
            url:'/dossierPrograms',
            templateUrl: 'app/dossierPrograms/dossierPrograms.view.html'
        })
        .state('datasets', {
            url:'/datasets',
            templateUrl: 'app/datasets/datasets.view.html'
        })
        .state('search', {
            url:'/search',
            templateUrl: 'app/search/search.view.html',
        })
        .state('admin', {
            url:'/admin',
            templateUrl: 'app/admin/admin.view.html'
        })
        /*.state('graph', {
            url:'/graph',
            templateUrl: 'app/graph/graph.view.html',
        })*/;

    $translateProvider.useStaticFilesLoader({
        prefix: 'languages/',
        suffix: '.json'
    });

    $translateProvider.useSanitizeValueStrategy(null);

    $translateProvider.registerAvailableLanguageKeys(
        ['es', 'fr', 'en', 'pt'], {
            'en*': 'en',
            'es*': 'es',
            'fr*': 'fr',
            'pt*': 'pt',
            '*': 'en' // must be last!
        }
    );

    $translateProvider.fallbackLanguage(['en']);

    jQuery.ajax({
        url: dhisUrl + 'userSettings/keyUiLocale/',
        contentType: 'text/plain',
        method: 'GET',
        dataType: 'text',
        async: false
    }).success(function(uiLocale) {
        if (uiLocale == '') {
            $translateProvider.determinePreferredLanguage();
        } else {
            $translateProvider.use(uiLocale);
        }
    }).fail(function() {
        $translateProvider.determinePreferredLanguage();
    });

}]);
