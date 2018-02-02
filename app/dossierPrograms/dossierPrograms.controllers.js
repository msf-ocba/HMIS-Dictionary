/*------------------------------------------------------------------------------------
    List of contributors: https://github.com/MSFOCBA
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/

dossierProgramsModule.controller('dossierProgramsMainController', ['$scope', '$translate', '$anchorScroll', 'dossiersProgramsFactory','dossiersProgramStageSectionsFactory', 'dossiersProgramIndicatorsFactory', 'dossiersProgramExpressionFactory','currentUserOrganisationUnitsFactory','Config',
function($scope, $translate, $anchorScroll, dossiersProgramsFactory,dossiersProgramStageSectionsFactory, dossiersProgramIndicatorsFactory, dossiersProgramExpressionFactory,currentUserOrganisationUnitsFactory,Config) {
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
    // $scope.programs = dossiersProgramsFactory.get(function() {
    //     endLoadingState(false);
    // });

  var removeEmptyAndDuplicateTemplates = function(templates) {
    return _(templates)
      .filter(_.negate(_.isEmpty))
      .uniqBy('id')
      .value();
  };

  if(Config.showUserRelatedFormsOnly) {
    currentUserOrganisationUnitsFactory.query(function(response) {
      var dataSets = _(response)
        .map('programs')
        .flatten()
        .value();
      $scope.programs = removeEmptyAndDuplicateTemplates(dataSets);
      endLoadingState(true);
    });
  } else {
    dossiersProgramsFactory.get().$promise.then(function(data) {
      $scope.programs = data.programs;
      endLoadingState(true);
    })
  }

    //Clear the TOC
    $scope.$watch('selectedProgram', function() {
        ping();
        $scope.toc = {
            entries: []
        };
    });
}]);

dossierProgramsModule.controller('dossiersProgramSectionController', ['$scope', '$translate','dossiersProgramStageFactory','dossiersProgramStageSectionsFactory', 'Ping', 
function($scope, $translate,dossiersProgramStageFactory,dossiersProgramStageSectionsFactory, Ping) {

    $scope.stages4TOC = {
        displayName: "",
        id: "sectionContainer",
        index: '0'
    };

    $scope.$watch('selectedProgram', function() {
        ping();
        if ($scope.selectedProgram) {
            startLoadingState(false);
            //Query sections and data elements
          dossiersProgramStageFactory.query({
              programId: $scope.selectedProgram.id
            },function(response) {
              $scope.sections = dossiersProgramStageSectionsFactory.get({
                programStageId: response.programStages[0].id
            }, function () {
                //if there are no sections rearrange/change TOC name
                if ($scope.sections.programStageSections.length == 0) $scope.showProgramWithoutSections();    
                else $scope.showProgramWithSections();            
            endLoadingState(true);
            });
            });
        }
    });

   $scope.showProgramWithoutSections = function() {
        $scope.stages4TOC.displayName = "Data elements";
        //line needed to reuse code of the ng-repeat on the view
        $scope.sections.programStageSections =  [{displayName: "Data Elements", id:"DataElements", dataElements: $scope.sections.programStageDataElements}];
        console.log($scope.sections);
        for (i = 0; i < $scope.sections.programStageSections[0].dataElements.length; ++i) {
            $scope.sections.programStageSections[0].dataElements[i] = $scope.sections.programStageSections[0].dataElements[i].dataElement;
        }
        console.log("out");
        console.log($scope.sections);
        addtoTOC($scope.toc, null, $scope.stages4TOC, "programs");
    };

    $scope.showProgramWithSections = function() {
        $scope.stages4TOC.displayName = "Program Sections";
        addtoTOC($scope.toc, $scope.sections.programStageSections, $scope.stages4TOC, "programs");
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

    };

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
