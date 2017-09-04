/*------------------------------------------------------------------------------------
    List of contributors: https://github.com/MSFOCBA
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/

/*
 *  @name dossiersMainController
 *  @description Gets the first elements  when a service is selected and sets scrollTo interaction
 */
dossiersModule.controller('dossiersMainController', ['$scope', '$translate', '$anchorScroll', 'dossiersServicesFactory', 'dossiersServiceDataSetsFactory', 'dossiersDossierFactory', 'dossiersServiceIndicatorGrpsFactory', function($scope, $translate, $anchorScroll, dossiersServicesFactory, dossiersServiceDataSetsFactory, dossiersDossierFactory, dossiersServiceIndicatorGrpsFactory) {
    $('#dossiers').tab('show');
    
    /*
     * 	@name addtoTOC
     * 	@description Add an element (section or indicator group) to the Dossier Table Of Content (TOC)
     *  @scope dossiersMainController
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
     *  @scope dossiersMainController
     */
    $scope.scrollTo = function(id,yOffset) {
        $anchorScroll.yOffset = yOffset; //66;
        $anchorScroll(id);
    };

    startLoadingState(true);

    /*
     *  @name $scope.services
     *  @description Gets the list of services
     *  @dependencies dossiersServicesFactory
     *  @scope dossiersMainController
     */
    $scope.services = dossiersServicesFactory.get({
        ougsUID: $scope.serviceSetUID
    }, function() {
        endLoadingState();
    });

    $scope.serviceDataSets = {};

    /*
     *  @name none
     *  @description When a service is selected triggers actions: populates 3 variables in current scope:
     *  $scope.indicatorGroups | $scope.serviceDataSets | $scope.dossier
     *  @dependencies dossiersServiceIndicatorGrpsFactory | dossiersServiceDataSetsFactory | dossiersDossierFactory
     *  @scope dossiersMainController
     */
    $scope.$watch('selectedService', function() {
        ping();
        $scope.toc = {
            entries: [],
            dataSets: false,
            indicatorGroups: false
        };

        if ($scope.selectedService) {

            startLoadingState(false);

            // indicatorGroups
            $scope.indicatorGroups = dossiersServiceIndicatorGrpsFactory.get({
                serviceCode1: '_' + $scope.selectedService.code.split('_')[2],
                serviceCode2: '_' + $scope.selectedService.code.split('_')[2] + '_'
            });

            // datasets
            $scope.serviceDataSets = dossiersServiceDataSetsFactory.get({
                serviceCode1: '_' + $scope.selectedService.code.split('_')[2],
                serviceCode2: '_' + $scope.selectedService.code.split('_')[2] + '_'
            });

            // Service description
            $scope.dossier = dossiersDossierFactory.get({
                languageCode: $translate.use(),
                serviceId: $scope.selectedService.id
            });
            
            endLoadingState(true);
        }
    });
}]);

/*
 *  @name dossiersSectionController
 *  @description
 */
dossiersModule.controller('dossiersSectionController', ['$scope', '$translate', 'dossiersSectionsFactory', 'Ping', function($scope, $translate, dossiersSectionsFactory, Ping) {

    /*
     *  @name filterSections
     *  @description Takes an array of "sections.sections" and filters the ones that have "filterDisplayName" has a displayName
     *  @scope dossiersSectionController
     */
    filterSections = function(sections, filterDisplayName) {
        var sectionsFiltered = {
            sections: []
        };
        if (sections) {
            sections.sections.forEach(function(section) {
                if (section.displayName != $translate.instant(filterDisplayName)) {
                    sectionsFiltered.sections.push(section);
                }
            });
        }
        return sectionsFiltered;
    };

    /*
     *  @name none
     *  @description Trigger actions when 'selectedSet' is changed in dossiersMainController when a service is selected
     *  1) Gets the sections (thanks to dossiersSectionsFactory)
     *  2) Filters the list of sections recieved (thanks to filterSections)
     *  3) Adds this elements to the table of contents (thanks to addtoTOC)
     *  @dependencies dossiersSectionsFactory | filterSections | addtoTOC | startLoadingState
     *  @scope dossiersSectionController
     *  @todo Check sorting
     */
    $scope.$watch('selectedSet', function() {
        $scope.sections = dossiersSectionsFactory.get({
            datasetId: $scope.$parent.selectedSet.id
        }, function() {
            $scope.sections = filterSections($scope.sections, "dos_Comments");
            addtoTOC($scope.toc, $scope.sections.sections, $scope.$parent.selectedSet, "Data Set");
        });
    });
}]);

/*
 * @name dossiersElementsTableController
 * @description
 */
dossiersModule.controller('dossiersElementsTableController', ['$scope', function($scope) {

    /*
     * @name $scope.getElementsInSection
     * @description Lists the dataElements in a section and get the information back
     * @scope dossiersElementsTableController
     */
    $scope.getElementsInSection = function(section) {
        $scope.dataElements = section;
        endLoadingState(true);
    }

}]);

/*
 * @name dossiersIndicatorController
 * @description
 */
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
}]);
