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
            var aux = datasetsDataelementsFactory.get({
                datasetId: $scope.selectedDataset.id
            }, function() {
                $scope.datasetDataElements = aux;
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
            startLoadingState(false);
            //if there are no sections rearrange/change TOC name
            if ($scope.datasetDataElements.sections.length == 0) $scope.showWithoutSections();    
            else $scope.showWithSections();            
            endLoadingState(true);
        
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
     *  @name $scope.getCategoryCombinationName
     *  @description Gets the category combination name for a data element
     *  @scope datasetsMainController
     */
    $scope.getCategoryCombinationName = function(id) {
        for (i = 0; i < $scope.datasetDataElements.dataSetElements.length; ++i) {
             if ($scope.datasetDataElements.dataSetElements[i].dataElement.id == id) {
                return $scope.datasetDataElements.dataSetElements[i].categoryCombo.displayName;
            }
        }
        return '-';
    }

        /*
     *  @name $scope.getCategoryCombinationID
     *  @description Gets the category combination ID for a data element
     *  @scope datasetsMainController
     */
    $scope.getCategoryCombinationID = function(id) {
        for (i = 0; i < $scope.datasetDataElements.dataSetElements.length; ++i) {
             if ($scope.datasetDataElements.dataSetElements[i].dataElement.id == id) {
                return $scope.datasetDataElements.dataSetElements[i].categoryCombo.id;
            }
        }
        return '-';
    }

}]);

/*
 *  @name dossiersSectionController
 *  @description Gets the dataset data elements and updates the TOC with sections
 */
datasetsModule.controller('datasetCategoryComboController', ['$scope', '$translate', 'datasetsCategoryCombosFactory', 'Ping', function($scope, $translate, datasetsCategoryCombosFactory, Ping) {
    
    $scope.categoryCombos4TOC = {
        displayName: "Category combinations",
        id: "categoryCombinations",
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
        if (typeof $scope.datasetDataElements.dataSetElements != 'undefined') {
            //get the category combination ids from the different data elements without repetitions
            for (i = 0; i < $scope.datasetDataElements.dataSetElements.length; ++i) {
                var CCID = $scope.datasetDataElements.dataSetElements[i].categoryCombo.id;
                if ($scope.categoryComboIDs.indexOf(CCID) == -1) $scope.categoryComboIDs.push(CCID);
            }
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
