/*------------------------------------------------------------------------------------
    List of contributors: https://github.com/MSFOCBA
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/


var qryTranslations = dhisUrl + 'organisationUnitGroups/:serviceId.json?fields=translations';

dossiersEditorModule.factory('dossiersEditorTranslationsFactory', ['$resource',
    function($resource) {
        return $resource(qryTranslations, {
            serviceId: '@serviceId'
        }, {
            query: {
                method: 'GET',
                isArray: true
            }
        });
    }
]);


var qryUpdateDescription = dhisUrl + 'organisationUnitGroups/:serviceId/translations';

dossiersEditorModule.factory('dossiersEditorUpdateDescriptionFactory', ['$resource',
    function($resource) {
        return $resource(qryUpdateDescription, {
            serviceId: '@serviceId'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);


var qryCreateDescription = dhisUrl + 'translations/';

dossiersEditorModule.factory('dossiersEditorCreateDescriptionFactory', ['$resource',
    function($resource) {
        return $resource(qryCreateDescription, {
        }, {
            create: {
                method: 'POST'
            }
        });
    }
]);
