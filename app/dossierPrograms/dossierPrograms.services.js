/*------------------------------------------------------------------------------------
    List of contributors: https://github.com/MSFOCBA
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/

var qryServiceSections = dhisUrl + 'sections.json?fields=displayName,id,dataElements[id]&paging=false&filter=dataSet.id\\:eq\\::datasetId';
var qryServiceDataSets = dhisUrl + 'dataSets.json?fields=id,displayName,sections[id]&paging=false&filter=attributeValues.value\\:like\\::serviceCode';
var qryDossier = dhisUrl + 'organisationUnitGroups/:serviceId.json?fields=displayDescription&paging=false&locale=:languageCode';
var qryServiceIndicatorGrps = dhisUrl + 'indicatorGroups.json?fields=id,displayName&paging=false&filter=attributeValues.value\\:like\\::serviceCode';
var qryDataElements = dhisUrl + 'dataElements.json?fields=displayName,displayFormName,displayDescription,id,section[id]&paging=false&filter=id\\:in::IdList';
var qryIndicatorGrp = dhisUrl + 'indicators.json?fields=displayName,id,displayFormName,displayDescription&filter=indicatorGroups.id\\:eq\\::indicatorGrpId&paging=false';

//var qryServices = dhisUrl + 'organisationUnitGroupSets/aLxsg9H28ws.json?fields=organisationUnitGroups[id,code,displayName]';
var qryPrograms = dhisUrl + 'programs.json?fields=id,displayName,programStages[id]&paging=false';
//var qryServiceDataSets = dhisUrl + 'dataSets.json?fields=id,displayName,sections[id]&paging=false&filter=attributeValues.value\\:like\\::serviceCode';
var qryProgramStageSections = dhisUrl + 'programStages/:programStageId.json?fields=programStageSections[id,displayName,programStageDataElements[dataElement[displayName,formName,description]]]&paging=false';

var qryProgramIndicators = dhisUrl + 'programs/:programId.json?fields=programIndicators[displayName,description,expression,filter]';

var qryIndicatorExpressions = dhisUrl + 'programIndicators/expression/description'
var qryIndicatorFilters = dhisUrl + 'programIndicators/filter/description'

dossierProgramsModule.factory('dossiersProgramsFactory', ['$resource',
    function($resource) {
        return $resource(qryPrograms, {}, {
            query: {
                method: 'GET',
                isArray: false
            }
        });
    }
]);

dossierProgramsModule.factory('dossiersProgramStageSectionsFactory', ['$resource',
    function($resource) {
        return $resource(qryProgramStageSections, {
            programStageId: '@programStageId'
        }, {
            query: {
                method: 'GET',
                isArray: false
            }
        });
    }
]);

dossierProgramsModule.factory('dossiersProgramIndicatorsFactory', ['$resource',
    function($resource) {
        return $resource(qryProgramIndicators, {
            programId: '@programId'
        }, {
            query: {
                method: 'GET',
                isArray: false
            }
        });
    }
]);

dossierProgramsModule.factory('dossiersExpressionFactory', ['$resource',
    function($resource) {
        return $resource(qryIndicatorExpressions, {
        }, {
            save: {
                method: 'POST',
                data: '@expression',
                isArray: false
            }
        });
    }
]);

dossierProgramsModule.factory('dossiersFilterFactory', ['$resource',
    function($resource) {
        return $resource(qryIndicatorFilters, {
        }, {
            save: {
                method: 'POST',
                data: '@filter',
                isArray: false
            }
        });
    }
]);
