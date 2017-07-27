/*------------------------------------------------------------------------------------
    List of contributors: https://github.com/MSFOCBA
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/
var qryPrograms = dhisUrl + 'programs.json?fields=id,displayName,programStages[id]&paging=false';

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

var qryProgramStageSections = dhisUrl + 'programStages/:programStageId.json?fields=programStageSections[id,displayName,dataElements[displayName,displayFormName,displayDescription,valueType,optionSetValue,optionSet[options[displayName]]]],programStageDataElements[dataElement[displayName,displayFormName,displayDescription,valueType,optionSetValue,optionSet[options[displayName]]]]&paging=false';

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

var qryProgramIndicators = dhisUrl + 'programs/:programId.json?fields=programIndicators[displayName,displayDescription,expression,filter]';

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

var qryProgramIndicatorExpressions = dhisUrl + 'programIndicators/expression/description'

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

var qryProgramIndicatorFilters = dhisUrl + 'programIndicators/filter/description'

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

var qryProgramGlobalIndicators = dhisUrl + 'indicators?fields=displayName,indicatorType[displayName],description,numerator,numeratorDescription,denominator,denominatorDescription&paging=false'

datasetsModule.factory('programGlobalIndicators', ['$resource',
    function($resource) {
        return $resource(qryProgramGlobalIndicators, {}, {
            query: {
                method: 'GET',
                isArray: false
            }
        });
    }
]);

var qryProgramIndicatorExpression = dhisUrl + 'expressions/description?expression=:expression'

datasetsModule.factory('programIndicatorExpression', ['$resource',
    function($resource) {
        return $resource(qryProgramIndicatorExpression, {
            expression: '@expression'
        }, {
            query: {
                method: 'GET',
                isArray: false
            }
        });
    }
]);
