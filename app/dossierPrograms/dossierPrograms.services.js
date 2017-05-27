/*------------------------------------------------------------------------------------
    List of contributors: https://github.com/MSFOCBA
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/

var qryPrograms = dhisUrl + 'programs.json?fields=id,displayName,programStages[id]&paging=false';
var qryProgramStageSections = dhisUrl + 'programStages/:programStageId.json?fields=programStageSections[id,displayName,programStageDataElements[dataElement[displayName,formName,description,valueType,optionSetValue,optionSet[options[displayName]]]&paging=false';
var qryProgramStageDataElements = dhisUrl + 'programStages/:programStageId.json?fields=programStageDataElements[dataElement[displayName,formName,description,valueType,optionSetValue,optionSet[options[displayName]]]'

var qryProgramIndicators = dhisUrl + 'programs/:programId.json?fields=programIndicators[displayName,description,expression,filter]';

var qryProgramIndicatorExpressions = dhisUrl + 'programIndicators/expression/description'
var qryProgramIndicatorFilters = dhisUrl + 'programIndicators/filter/description'

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

dossierProgramsModule.factory('dossiersProgramStageDataElementsFactory', ['$resource',
    function($resource) {
        return $resource(qryProgramStageDataElements, {
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

dossierProgramsModule.factory('dossiersProgramExpressionFactory', ['$resource',
    function($resource) {
        return $resource(qryProgramIndicatorExpressions, {
        }, {
            save: {
                method: 'POST',
                data: '@expression',
                isArray: false
            }
        });
    }
]);

dossierProgramsModule.factory('dossiersProgramFilterFactory', ['$resource',
    function($resource) {
        return $resource(qryProgramIndicatorFilters, {
        }, {
            save: {
                method: 'POST',
                data: '@filter',
                isArray: false
            }
        });
    }
]);
