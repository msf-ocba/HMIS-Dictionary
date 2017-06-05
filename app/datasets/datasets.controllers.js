/*------------------------------------------------------------------------------------
    List of contributors: https://github.com/MSFOCBA
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/

/*
 *  @name datasetsMainController
 *  @description Clears the table of content when a data set is selected and adds the scrollto function
 */
datasetsModule.controller('datasetsMainController', ['$scope', '$translate', '$anchorScroll', 'datasetsFactory',
function($scope, $translate, $anchorScroll, datasetsFactory) {
    $('#datasets').tab('show');
    
    /*
     * 	@name addtoTOC
     * 	@description Add an element (section or indicator group) to the Dossier Table Of Content (TOC)
     *  @scope datasetsMainController
     */
    addtoTOC = function(toc, items, parent, type) {
        var index = toc.entries.push({
            'parent': parent,
            'children': items,
            'type': type
        });
        if(type == 'Data Set'){
            toc.dataSets = true;
        }else if(type == 'Indicator Group'){
            toc.indicatorGroups = true;
        }
    };

    /*
     * 	@name $scope.scrollTo
     * 	@description Scroll to an element when clicking on the Dossier Table Of Content (TOC)
     *  @scope datasetsMainController
     */
    $scope.scrollTo = function(id,yOffset) {
        $anchorScroll.yOffset = yOffset; //66;
        $anchorScroll(id);
    };

    startLoadingState(true);

    /*
     *  @name $scope.dataSets
     *  @description Gets the list of data sets
     *  @dependencies datasetsFactory
     *  @scope datasetsMainController
     */
    $scope.datasets = datasetsFactory.get(function() {
        endLoadingState(false);
    });

    /*
     * @name none
     * @description Clear the table of content
     * @scope datasetsMainController
     */
    $scope.$watch('selectedDataset', function() {
        ping();
        $scope.toc = {
            entries: [],
            dataSets: false,
            indicatorGroups: false
        };
    });
}]);

/*
 *  @name dossiersSectionController
 *  @description Gets the dataset data elements and updates the TOC with sections
 */
datasetsModule.controller('datasetSectionController', ['$scope', '$translate', 'datasetsDataelementsFactory', 'Ping', function($scope, $translate, datasetsDataelementsFactory, Ping) {
        
    /*
     *  @name $scope.dataSets
     *  @description Gets the list of data sets
     *  @dependencies datasetsFactory
     *  @scope datasetsMainController
     */
    $scope.stages4TOC = {
        displayName: "",
        id: "sectionContainer",
        index: '0'
    };

    /*
     *  @name $scope.dataSets
     *  @description Gets the list of data sets
     *  @dependencies datasetsFactory
     *  @scope datasetsMainController
     */
    $scope.$watch('selectedDataset', function() {
        ping();
        if ($scope.selectedDataset) {
            startLoadingState(false);
            //Query sections and data elements
            $scope.datasetDataElements = datasetsDataelementsFactory.get({
                datasetId: $scope.selectedDataset.id
            }, function () {
                console.log($scope.datasetDataElements);
                //if there are no sections rearrange/change TOC name
                if ($scope.datasetDataElements.sections.length == 0) $scope.showProgramWithoutSections();    
                else $scope.showProgramWithSections();            
            endLoadingState(true);
        });
        }
    });

    /*
     *  @name $scope.dataSets
     *  @description Gets the list of data sets
     *  @dependencies datasetsFactory
     *  @scope datasetsMainController
     */
   $scope.showProgramWithoutSections = function() {
        $scope.stages4TOC.displayName = "Data elements";
        //line needed to reuse code of the ng-repeat on the view
        $scope.datasetDataElements.sections =  [{displayName: "Data Elements", id:"DataElements", dataElements: $scope.datasetDataElements.dataSetElements}];
        addtoTOC($scope.toc, null, $scope.stages4TOC, "Data Set");
    };

    /*
     *  @name $scope.dataSets
     *  @description Gets the list of data sets
     *  @dependencies datasetsFactory
     *  @scope datasetsMainController
     */
    $scope.showProgramWithSections = function() {
        $scope.stages4TOC.displayName = "Sections";
        addtoTOC($scope.toc, $scope.datasetDataElements.sections, $scope.stages4TOC, "Data Set");
    }
}]);

/*
 * @name dossiersElementsTableController
 * @description
 *
dossiersModule.controller('dossiersElementsTableController', ['$scope', function($scope) {

    /*
     * @name $scope.getElementsInSection
     * @description Lists the dataElements in a section and get the information back
     * @scope dossiersElementsTableController
     *
    $scope.getElementsInSection = function(section) {
        $scope.dataElements = section;
        endLoadingState(true);
    }

}]);

/*
 * @name dossiersIndicatorController
 * @description
 *
dossiersModule.controller('dossiersIndicatorController', ['$scope', 'dossiersIndicatorGroupFactory', function($scope, dossiersIndicatorGroupFactory) {

    $scope.$watch('selectedGrp', function() {
        ping();
        if ($scope.$parent.selectedGrp) {
            $scope.indicatorGrpParent4Toc = {
                displayName: $scope.$parent.selectedGrp.displayName,
                id: $scope.$parent.selectedGrp.id
            }
            $scope.indicatorGroup = dossiersIndicatorGroupFactory.get({
                indicatorGrpId: $scope.$parent.selectedGrp.id
            }, function() {
                addtoTOC($scope.toc, null, $scope.indicatorGrpParent4Toc, "Indicator Group");
                endLoadingState(true);
            });
        }
    });

    // The next three functions are repeated from search controllers!
    // numerator and denominator description is in indicator description
    // (translatation doesn't work for denom and num columns) so have be extracted
    $scope.getNumerator = function(indicator) {
        var re = /(NUM:)(.*)(DENOM:)/;
        var result = re.exec(indicator.displayDescription);
        if (result !== null) {
            return result.length > 1 ? result[2] : "x";
        }
    }

    $scope.getDenominator = function(indicator) {
        var re = /(DENOM:)(.*)/;
        var result = re.exec(indicator.displayDescription);
        if (result !== null) {
            return result.length > 1 ? result[2] : "x";
        }
    }

    $scope.getDescription = function(indicator) {
        var re = /(.*)(NUM:)/;
        var result = re.exec(indicator.displayDescription);
        if (result !== null) {
            return result[1];
        } else {
            return indicator.displayDescription;
        }
    }

    $scope.getIndicatorGroupNames = function(indicator) {
        var indicatorGroupNames;

        angular.forEach(indicator.indicatorGroups, function(indicatorGroup, key) {
            if (key != 0) {
                indicatorGroupNames += "," + indicatorGroup.displayName;
            } else {
                indicatorGroupNames = indicatorGroup.displayName;
            }
        });
        return indicatorGroupNames;
    }
}]);*/
