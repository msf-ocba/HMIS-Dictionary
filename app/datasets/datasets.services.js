/*------------------------------------------------------------------------------------
    List of contributors: https://github.com/MSFOCBA
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/


var qryDatasets = dhisUrl + 'dataSets.json?paging=false';

datasetsModule.factory('datasetsFactory', ['$resource',
    function($resource) {
        return $resource(qryDatasets, {}, {
            query: {
                method: 'GET',
                isArray: false
            }
        });
    }
]);


var qryDatasetDataelements = dhisUrl + 'dataSets/:datasetId?fields=id,displayName,sections[id,displayName,dataElements[displayName,displayFormName,displayDescription,valueType,optionSetValue,optionSet[options[displayName]]]],dataSetElements[dataElement[displayName,displayFormName,displayDescription,valueType,optionSetValue,optionSet[options[displayName]]]]&paging=false'

datasetsModule.factory('datasetsDataelementsFactory', ['$resource',
    function($resource) {
        return $resource(qryDatasetDataelements, {
            datasetId: '@datasetId'
        }, {
            query: {
                method: 'GET',
                isArray: false
            }
        });
    }
]);

/*
//var qryServiceDataSets = dhisUrl + 'dataSets.json?fields=id,displayName,sections[id]&paging=false&filter=attributeValues.value\\:like\\::serviceCode';
var qryServiceDataSets = dhisUrl + 'dataSets.json?fields=id,displayName,sections[id]&paging=false&filter=attributeValues.value\\:$like\\::serviceCode1&filter=attributeValues.value\\:like\\::serviceCode2&rootJunction=OR';


dossiersModule.factory('dossiersServiceDataSetsFactory', ['$resource',
    function($resource) {
        return $resource(qryServiceDataSets, {
            serviceCode1: '@serviceCode1',
            serviceCode2: '@serviceCode2'
        }, {
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


//var qryServiceIndicatorGrps = dhisUrl + 'indicatorGroups.json?fields=id,displayName&paging=false&filter=attributeValues.value\\:like\\::serviceCode';
var qryServiceIndicatorGrps = dhisUrl + 'indicatorGroups.json?fields=id,displayName&paging=false&filter=attributeValues.value\\:$like\\::serviceCode1&filter=attributeValues.value\\:like\\::serviceCode2&rootJunction=OR';

dossiersModule.factory('dossiersServiceIndicatorGrpsFactory', ['$resource',
    function($resource) {
        return $resource(qryServiceIndicatorGrps, {
            serviceCode1: '@serviceCode1',
            serviceCode2: '@serviceCode2'
        }, {
            query: {
                method: 'GET',
                isArray: false
            }
        });
    }
]);

//var qryServiceSections = dhisUrl + 'sections.json?fields=displayName,id,dataElements[id]&paging=false&filter=dataSet.id\\:eq\\::datasetId';
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
]);*/
