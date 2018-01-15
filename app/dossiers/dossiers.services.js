/*------------------------------------------------------------------------------------
    List of contributors: https://github.com/MSFOCBA
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/


var qryServices = dhisUrl + 'organisationUnitGroupSets/:ougsUID.json?fields=organisationUnitGroups[id,code,displayName]';

dossiersModule.factory('dossiersServicesFactory', ['$resource',
    function($resource) {
        return $resource(qryServices, {
            ougsUID: '@ougsUID'
        }, {
            query: {
                method: 'GET',
                isArray: false
            }
        });
    }
]);


var qryServiceDataSets = dhisUrl + 'dataSets.json?fields=id,displayName,sections[id],attributeValues&paging=false';

dossiersModule.factory('dossiersServiceDataSetsFactory', ['$resource',
    function($resource) {
        return $resource(qryServiceDataSets, {}, {
            query: {
                method: 'GET',
                isArray: false
            }
        });
    }
]);


var qryDossier = dhisUrl + 'organisationUnitGroups/:serviceId.json?fields=displayDescription&paging=false&locale=:languageCode';

dossiersModule.factory('dossiersDossierFactory', ['$resource',
    function($resource) {
        return $resource(qryDossier, {
            languageCode: '@languageCode',
            serviceId: '@serviceId'
        }, {
            query: {
                method: 'GET',
                isArray: true
            }
        });
    }
]);


var qryServiceIndicatorGrps = dhisUrl + 'indicatorGroups.json?fields=id,displayName,attributeValues&paging=false';

dossiersModule.factory('dossiersServiceIndicatorGrpsFactory', ['$resource',
    function($resource) {
        return $resource(qryServiceIndicatorGrps, {}, {
            query: {
                method: 'GET',
                isArray: false
            }
        });
    }
]);

var qryServiceSections = dhisUrl + 'dataSets/:datasetId.json?fields=sections[dataSet,id,displayName,dataElements[id,displayName,displayFormName,displayDescription]]';

dossiersModule.factory('dossiersSectionsFactory', ['$resource',
    function($resource) {
        return $resource(qryServiceSections, {
            datasetId: '@datasetId'
        }, {
            query: {
                method: 'GET',
                isArray: false
            }
        });
    }
]);


var qryIndicatorGrp = dhisUrl + 'indicators.json?fields=displayName,id,displayFormName,displayDescription&filter=indicatorGroups.id\\:eq\\::indicatorGrpId&paging=false';

dossiersModule.factory('dossiersIndicatorGroupFactory', ['$resource',
    function($resource) {
        return $resource(qryIndicatorGrp, {
            indicatorGrpId: '@indicatorGrpId'
        }, {
            query: {
                method: 'GET',
                isArray: false
            }
        });
    }
]);
