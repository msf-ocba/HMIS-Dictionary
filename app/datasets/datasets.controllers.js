/*------------------------------------------------------------------------------------
    List of contributors: https://github.com/MSFOCBA
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/

/*
 *  @name datasetsMainController
 *  @description Clears the table of content when a data set is selected and adds the scrollto function
 */
datasetsModule.controller('datasetsMainController', ['$scope', '$translate', '$anchorScroll', 'datasetsFactory', 'datasetsDataelementsFactory',
function($scope, $translate, $anchorScroll, datasetsFactory, datasetsDataelementsFactory) {
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
        $anchorScroll.yOffset = 66; //66;
        $anchorScroll(id);
    };

    startLoadingState(false);

    /*
     *  @name $scope.dataSets
     *  @description Gets the list of data sets
     *  @dependencies datasetsFactory
     *  @scope datasetsMainController
     */
    $scope.datasets = datasetsFactory.get({blackList: $scope.blacklist_datasets}, function() {
        endLoadingState(true);
    });

    $scope.datasetDataElements = {};

    /*
     * @name none
     * @description Clear the table of content, get the dataset sections and data elements
     *  @dependencies datasetsDataelementsFactory
     * @scope datasetsMainController
     */
    $scope.$watch('selectedDataset', function() {
        ping();
        if ($scope.selectedDataset) {
            $scope.categoryComboIDs = [];
            $scope.toc = {
                entries: [],
                dataSets: false,
                indicatorGroups: false
            };
            //digest is triggered before the variable is stored
            startLoadingState(false);
            var aux = datasetsDataelementsFactory.get({
                datasetId: $scope.selectedDataset.id
            }, function() {
                $scope.datasetDataElements = aux;
                endLoadingState(true);
            });
        }
    });
}]);

/*
 *  @name dossiersSectionController
 *  @description Updates the TOC with sections
 */
datasetsModule.controller('datasetSectionController', ['$scope', '$translate', 'datasetsDataelementsFactory', 'Ping', function($scope, $translate, datasetsDataelementsFactory, Ping) {
        
    $scope.stages4TOC = {
        displayName: "",
        id: "sectionContainer",
        index: '0'
    };

    /*
     * @name none
     * @description add the sections to the TOC, show them
     * @scope datasetsMainController
     */
    $scope.$watch('datasetDataElements', function() {
        ping();
        if (typeof $scope.datasetDataElements.dataSetElements != 'undefined') {
            //if there are no sections rearrange/change TOC name
            if ($scope.datasetDataElements.sections.length == 0) $scope.showWithoutSections();    
            else $scope.showWithSections();                    
        }
    });

    /*
     *  @name $scope.showWithoutSections
     *  @description Rearranges the data elements in case there were no sections in the data set so they can be shown in the view, adds it to the TOC
     *  @scope datasetsMainController
     */
   $scope.showWithoutSections = function() {
        $scope.stages4TOC.displayName = "Data elements";
        //line needed to reuse code of the ng-repeat on the view
        $scope.datasetDataElements.sections =  [{displayName: "Data Elements", id:"DataElements", dataElements: $scope.datasetDataElements.dataSetElements}];
        addtoTOC($scope.toc, null, $scope.stages4TOC, "Data Set");
    };

    /*
     *  @name $scope.dataSets
     *  @description Adds the sections to the TOC
     *  @scope datasetsMainController
     */
    $scope.showWithSections = function() {
        $scope.stages4TOC.displayName = "Sections";
        addtoTOC($scope.toc, $scope.datasetDataElements.sections, $scope.stages4TOC, "Data Set");
    }

    /*
     *  @name $scope.getCategoryCombination
     *  @description Gets the category combination for a data element, updates the array of categoryCombos
     *  @scope datasetsMainController
     */
    $scope.getCategoryCombination = function(id, sectionIndex, dataElementIndex) {
        var result;
        //search for overrides
        for (i = 0; i < $scope.datasetDataElements.dataSetElements.length; ++i) {
             if ($scope.datasetDataElements.dataSetElements[i].dataElement.id == id) {
                result = $scope.datasetDataElements.dataSetElements[i].categoryCombo;
                break;
            }
        }
        //if there wasn't an override
        if (typeof result == "undefined") {
            //search for normal combination
            result = $scope.datasetDataElements.sections[sectionIndex].dataElements[dataElementIndex].categoryCombo;
            //check without sections
            if (typeof result == "undefined") result = $scope.datasetDataElements.sections[sectionIndex].dataElements[dataElementIndex].dataElement.categoryCombo;
        }
        var CCID = result.id;
        if ($scope.categoryComboIDs.indexOf(CCID) == -1) $scope.categoryComboIDs.push(CCID);
        return result;
    }
}]);

/*
 *  @name dossiersSectionController
 *  @description Gets the dataset data elements and updates the TOC with sections
 */
datasetsModule.controller('datasetCategoryComboController', ['$scope', '$translate', 'datasetsCategoryCombosFactory', 'Ping', function($scope, $translate, datasetsCategoryCombosFactory, Ping) {
    
    $scope.categoryCombos4TOC = {
        displayName: "Category combinations",
        id: "categoryComboContainer",
        index: '1'
    };

    /*
     *  @name none
     *  @description Gets the category combo information and shows it
     *  @dependencies datasetsCategoryCombosFactory
     *  @scope datasetCategoryComboController
     */
    $scope.$watch('datasetDataElements', function() {
        ping();
        if (typeof $scope.datasetDataElements.sections !== 'undefined') {
            startLoadingState(false);
            //Query category combination information
            $scope.categoryCombos = datasetsCategoryCombosFactory.get({
                ids: 'id:in:'+'['+$scope.categoryComboIDs.toString()+']',
            }, function () {
                addtoTOC($scope.toc, null, $scope.categoryCombos4TOC, "Category combination");     
                endLoadingState(true);
            },true);
        }
    });


}]);

    datasetsModule.controller('datasetsIndicatorsController', ['$scope', '$translate', 'datasetsIndicatorsFactory', 'datasetsIndicatorExpressionFactory' , 'Ping', function($scope, $translate, datasetsIndicatorsFactory, datasetsIndicatorExpressionFactory, Ping) {
    
    $scope.indicators4TOC = {
        displayName: "Indicators",
        id: "indicatorContainer",
        index: '2'
    };

    /*
     *  @name recursiveAssignNumerator
     *  @description Gets the "readable" expressions for each indicator numerator
     *  @scope datasetsIndicatorsController
     */
    recursiveAssignNumerator = function(i) {
        if (i >= $scope.indicators.length) return;
        datasetsIndicatorExpressionFactory.get({
                expression: $scope.indicators[i].numerator,
            }, function (data) {
                $scope.indicators[i].numerator = data.description;
                recursiveAssignNumerator(i+1);
            },true);

    }

    /*
     *  @name recursiveAssignNumerator
     *  @description Gets the "readable" expressions for each indicator denominator
     *  @scope datasetsIndicatorsController
     */
    recursiveAssignDenominator = function(i) {
        if (i >= $scope.indicators.length) return;
        datasetsIndicatorExpressionFactory.get({
                expression: $scope.indicators[i].denominator,
            }, function (data) {
                $scope.indicators[i].denominator = data.description;
                recursiveAssignDenominator(i+1);
            },true);
    }

    $scope.indicators = [];

    /*
     *  @name none
     *  @description Gets the indicator information, translates it and shows it
     *  @dependencies datasetsCategoryCombosFactory
     *  @scope datasetsIndicatorsController
     */
    $scope.$watch('datasetDataElements', function() {
        ping();
        if (typeof $scope.datasetDataElements.dataSetElements != 'undefined') {
            startLoadingState(false);
            $scope.indicators = [];
            //Query indicator information
            $scope.allIndicators = datasetsIndicatorsFactory.get(function () {     
                endLoadingState(true);
                $scope.datasetDataElements.dataSetElements.forEach(function(dataElement) {
                    $scope.allIndicators.indicators.forEach(function(indicator) {
                        const regex = /#{(\w+)\.?\w+?}/g;
                        const num = indicator.numerator;
                        const den = indicator.denominator;
                        let m;
                        while ((m = regex.exec(num)) !== null) {
                            // This is necessary to avoid infinite loops with zero-width matches
                            if (m.index === regex.lastIndex) {
                                regex.lastIndex++;
                            }
                            if (m[1] == dataElement.dataElement.id) {
                                if ($scope.indicators.indexOf(indicator) == -1) $scope.indicators.push(indicator);
                                return;
                            }
                        }

                        while ((m = regex.exec(den)) !== null) {
                            // This is necessary to avoid infinite loops with zero-width matches
                            if (m.index === regex.lastIndex) {
                                regex.lastIndex++;
                            }
                            if (m[1] == dataElement.dataElement.id) {
                                if ($scope.indicators.indexOf(indicator) == -1) $scope.indicators.push(indicator);
                                return;
                            }
                        }
                    }, this);
                }, this);
                if ($scope.indicators.length > 0) {
                    addtoTOC($scope.toc, null, $scope.indicators4TOC, "Indicators");
                    recursiveAssignNumerator(0);
                    recursiveAssignDenominator(0);
                }
            });
            
        }
    });
}]);