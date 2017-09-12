/*------------------------------------------------------------------------------------
    List of contributors: https://github.com/MSFOCBA
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/

dossierProgramsModule.controller('dossierProgramsMainController', ['$scope', '$translate', '$anchorScroll', 'dossiersProgramsFactory', 'dossiersProgramStageSectionsFactory', 'dossiersProgramIndicatorsFactory', 'dossiersProgramExpressionFactory',
function($scope, $translate, $anchorScroll, dossiersProgramsFactory, dossiersProgramStageSectionsFactory, dossiersProgramIndicatorsFactory, dossiersProgramExpressionFactory) {
    $('#dossiersPrograms').tab('show');

    /*
     * 	@alias appModule.controller~addtoTOC
     * 	@type {Function}
     * 	@description Add an element (section or indicator group) to the Dossier Table Of Content (TOC)
     *	@todo Move to dossier controller
     */
    addtoTOC = function(toc, items, parent, type) {
        var index = toc.entries.push({
            'parent': parent,
            'children': items
        });
    };

    /*
     * 	@alias appModule.controller~scrollTo
     * 	@type {Function}
     * 	@description Scroll to an element when clicking on the Dossier Table Of Content (TOC)
     *	@todo Move to dossier controller
     *	@todo Take header into accounts
     */
    $scope.scrollTo = function(id) {
        $anchorScroll.yOffset = 66;
        $anchorScroll(id);
    };

    //service = program
    //indicatorGroups = indicators
    //Datasets = dataElements
    startLoadingState(false);
    $scope.programs = dossiersProgramsFactory.get(function() {
        endLoadingState(false);
    });

    //Clear the TOC
    $scope.$watch('selectedProgram', function() {
        ping();
        $scope.toc = {
            entries: []
        };
    });
}]);

dossierProgramsModule.controller('dossiersProgramSectionController', ['$scope', '$q', '$translate', 'dossiersProgramStageSectionsFactory', 'Ping',
function($scope, $q, $translate, dossiersProgramStageSectionsFactory, Ping) {

    $scope.$watch('selectedProgram', function() {
        ping();
        console.log("selected " + $scope.selectedProgram)
        if ($scope.selectedProgram) {
            startLoadingState(false);
            //Query sections and data elements
            var stageSectionPromises = $scope.selectedProgram.programStages.map(function (stage) {
                return dossiersProgramStageSectionsFactory.get({programStageId: stage.id}).$promise;
            });

            $q.all(stageSectionPromises).then(function (stages) {
                $scope.stages = stages.map(function (stage, index) {
                    if(stage.programStageSections.length == 0) 
                        return createStageWithoutSections(stage, index);
                    else 
                        return createStageWithSections(stage, index);
                });
                endLoadingState(true);
            });
        }
    });

    function createStageWithoutSections (stage, index) {
        var resultStage = {};
        var toc = {
            displayName: "Data Elements",
            id: "sectionContainer-" + stage.id,
            index: index
        };
        resultStage.programStageSections =  [{displayName: "Data Elements", id:"DataElements", dataElements: stage.programStageDataElements}];
        for (i = 0; i < resultStage.programStageSections[0].dataElements.length; ++i) {
            resultStage.programStageSections[0].dataElements[i] = resultStage.programStageSections[0].dataElements[i].dataElement;
        }
        addtoTOC($scope.toc, null, toc, "programs")
        return resultStage;
    }

    function createStageWithSections (stage, index) {
        var toc = {
            displayName: "Stage: " + stage.displayName,
            id: "sectionContainer-" + stage.id,
            index: index
        };
        addtoTOC($scope.toc, stage.programStageSections, toc, "programs");
        return stage;
    }

}]);




dossierProgramsModule.controller('dossiersProgramIndicatorController', ['$scope', 'dossiersProgramExpressionFactory', 'dossiersProgramFilterFactory', 'dossiersProgramIndicatorsFactory', function($scope, dossiersProgramExpressionFactory, dossiersProgramFilterFactory, dossiersProgramIndicatorsFactory) {

    $scope.indicators4TOC = {
                displayName: "Program indicators",
                id: "IndicatorGroupsContainer",
                index: '1'
                };

    //gets the "readable" expressions for each indicator expression
    recursiveAssignExpression = function(i) {
        if (i >= $scope.indicators.programIndicators.length) return;
        dossiersProgramExpressionFactory.save({}, $scope.indicators.programIndicators[i].expression,
                         function (data) {
                            $scope.indicators.programIndicators[i].expression = data.description;
                            recursiveAssignExpression(i+1);
                        });

    }

    //gets the "readable" expressions for each indicator expression and filter
    recursiveAssignFilter = function(i) {
        if (i >= $scope.indicators.programIndicators.length) return;
        if (typeof($scope.indicators.programIndicators[i].filter) === 'undefined') {
            recursiveAssignFilter(i+1);
            return;
        }
        dossiersProgramFilterFactory.save({}, $scope.indicators.programIndicators[i].filter,
                         function (data) {
                            $scope.indicators.programIndicators[i].filter = data.description;
                            recursiveAssignFilter(i+1);
                        });

    }

    $scope.$watch('selectedProgram', function() {
        ping();
        if ($scope.selectedProgram) {
            startLoadingState(false);
            //get indicators, add to TOC
            $scope.indicators = dossiersProgramIndicatorsFactory.get({
                programId: $scope.selectedProgram.id
            }, function() {
                if ($scope.indicators.programIndicators.length > 0) {
                    addtoTOC($scope.toc,null,$scope.indicators4TOC,"Indicators");
                    recursiveAssignExpression(0);
                    recursiveAssignFilter(0);
                }
                endLoadingState(true);
            });
        }
    });

}]);



dossierProgramsModule.controller('dossiersProgramAnalysisController', ['$scope', '$q', 'dossiersProgramEventReportFactory', 'dossiersProgramEventChartFactory', 
        function($scope, $q, dossiersProgramEventReportFactory, dossiersProgramEventChartFactory) {

    $scope.eventReports4TOC = {   
        displayName: "Event Reports",
        id: "EventReportsContainer",
        index: '2'
    };

    $scope.eventCharts4TOC = {   
        displayName: "Event Charts",
        id: "EventChartsContainer",
        index: '3'
    };

    getEventReportUrl = function(eventReportId) {
        return dhisroot + '/dhis-web-event-reports/index.html?id=' + eventReportId;
    }

    getEventChartUrl = function(eventChartId) {
        return dhisroot + '/dhis-web-event-visualizer/index.html?id=' + eventChartId;
    }

    $scope.$watch('selectedProgram', function() {
        ping();
        if ($scope.selectedProgram) {
            startLoadingState(false);
            
            var analysisElementPromises = [
                dossiersProgramEventReportFactory.get({programId: $scope.selectedProgram.id}).$promise,
                dossiersProgramEventChartFactory.get({programId: $scope.selectedProgram.id}).$promise
            ]

            $q.all(analysisElementPromises).then(function(data) {
                $scope.eventReports = data[0].eventReports.map(function(eventReport){
                    eventReport.url = getEventReportUrl(eventReport.id);
                    return eventReport;
                });
                $scope.eventCharts = data[1].eventCharts.map(function(eventChart){
                    eventChart.url = getEventChartUrl(eventChart.id);
                    return eventChart;
                });

                if($scope.eventReports.length > 0) { addtoTOC($scope.toc, null, $scope.eventReports4TOC, "Event Reports") }
                if($scope.eventCharts.length > 0) { addtoTOC($scope.toc, null, $scope.eventCharts4TOC, "Event Charts") }
            });
        }
    });
}]);