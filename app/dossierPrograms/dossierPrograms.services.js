/*------------------------------------------------------------------------------------
    List of contributors: https://github.com/MSFOCBA
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/

var qryPrograms = dhisUrl + 'programs.json?fields=id,displayName,programStages[id]&paging=false';

var qryProgramStageSections = dhisUrl + 'programStages/:programStageId.json?fields=id,displayName,programStageSections[id,displayName,dataElements[displayName,displayFormName,displayDescription,valueType,optionSetValue,optionSet[options[displayName]]]],programStageDataElements[dataElement[displayName,displayFormName,displayDescription,valueType,optionSetValue,optionSet[options[displayName]]]]&paging=false';

var qryProgramIndicators = dhisUrl + 'programs/:programId.json?fields=programIndicators[displayName,displayDescription,expression,filter]';

var qryProgramIndicatorExpressions = dhisUrl + 'programIndicators/expression/description'
var qryProgramIndicatorFilters = dhisUrl + 'programIndicators/filter/description'

// Only public EventReports and EventCharts
var qryEventReports = dhisUrl + 'eventReports.json?filter=program.id\\:eq\\::programId&filter=publicAccess\\:^like\\:r&fields=id,displayName,displayDescription&paging=false'
var qryEventCharts = dhisUrl + 'eventCharts.json?filter=program.id\\:eq\\::programId&filter=publicAccess\\:^like\\:r&fields=id,displayName,displayDescription&paging=false'

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

dossierProgramsModule.factory('dossiersProgramEventReportFactory', ['$resource',
    function($resource) {
        return $resource(qryEventReports, {
            programId: '@programId'
        }, {
            query: {
                method: 'GET',
                isArray: false
            }
        });
    }
]);

dossierProgramsModule.factory('dossiersProgramEventChartFactory', ['$resource',
    function($resource) {
        return $resource(qryEventCharts, {
            programId: '@programId'
        }, {
            query: {
                method: 'GET',
                isArray: false
            }
        });
    }
]);
