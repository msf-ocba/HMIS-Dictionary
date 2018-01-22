/*------------------------------------------------------------------------------------
    List of contributors: https://github.com/MSFOCBA
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/

searchModule.controller('searchController', ['ExcelFactory', '$timeout', '$scope', '$translate', 'NgTableParams', 'searchAllFactory', function (ExcelFactory, $timeout, $scope, $translate, NgTableParams, searchAllFactory) {

    $('#search').tab('show');
    

    if ($scope.show_dossiers) {
        console.log("searchModule: Service set defined " + $scope.serviceSetUID);
        searchAllFactory.get_organisationUnitGroupSets.query({
            ougsUID: $scope.serviceSetUID
        }, function (response) {
            var temp = {};
            response.organisationUnitGroups.forEach(function (serv) {
                temp[serv.code.split('_')[2]] = {
                    service_id: serv.id,
                    service_code: serv.code,
                    service_name: serv.displayName
                };
            });
            $scope.servicesList = temp;
            load_table_info();
        });
    } else {
        console.log("searchModule: Service set is not defined");
        load_table_info();
    }

    var concatObjects = function (tablesList) {
        var temp = [];
        tablesList.forEach(function (table) {
            table.a.forEach(function (elem) {
                elem.type = table.t;
                temp.push(elem);
            });
        });
        return temp;
    };

    /*
     * Filter dataElements and indicators that are not associated to a dataSet or an indicatorGroup

    var blacklist_datasets = [
        'AjwuNAGMSFM', // HIV program
        'kraMkBJg3JI', // Hospital Ward Multiservice SRH comp - Monthly
        'Hp68S9muoCn', // Intentional Violence
    ];
    var blacklist_indicatorgroups = [
        'rD7MJ3LaakW', // Individual Indicators
        'vnoUusJDY1Z', // Vaccination
        'vCfO0z5igGT'  // Vaccination 2015
    ];
    */
    console.log("searchModule: Blacklisted dataSets: " + $scope.blacklist_datasets);
    console.log("searchModule: Blacklisted indicatorGroups: " + $scope.blacklist_indicatorgroups);
    var filterObjects = function (obj, type) {
        if (type == 'dataElement') {
            var temp = obj.dataSetElements.length > 0;
            if (temp && $scope.blacklist_datasets.length > 0) {
                temp = false;
                obj.dataSetElements.forEach(function (dse) {
                    temp = temp || ($scope.blacklist_datasets.indexOf(dse.dataSet.id) == -1);
                });
            }
            return temp;
        } else if (type == 'indicator') {
            var temp = obj.indicatorGroups.length > 0;
            if (temp && $scope.blacklist_indicatorgroups.length > 0) {
                temp = false;
                obj.indicatorGroups.forEach(function (ig) {
                    temp = temp || ($scope.blacklist_indicatorgroups.indexOf(ig.id) == -1);
                });
            }
            return temp;
        }
    };

    var self = this;
    self.isFiltersVisible = false;

    self.applyGlobalSearch = function () {
        var term = self.globalSearchTerm;
        //var term_or = self.globalSearchTerm.split('||');
        var filter_content = self.tableParams.filter();
        filter_content.$ = term;
        self.tableParams.filter(filter_content);
    };

    startLoadingState(false);


    $scope.cols_object = {
        object_type: true,
        object_name: true,
        object_form: true
    };
    $scope.cols_object_advanced = {
        object_id: true,
        object_code: true,
        object_ICD10: false
    };
    $scope.cols_object_desc = {
        object_description: true,
        object_den_formula: true,
        object_num_formula: true
    };
    $scope.cols_objectGroup = {
        objectGroup_name: true
    };
    $scope.cols_objectGroup_advanced = {
        objectGroup_id: true,
        objectGroup_code: true
    };
    $scope.cols_service = {
        service_name: true
    };
    $scope.cols_service_advanced = {
        service_id: true,
        service_code: true
    };

    self.tableParams = new NgTableParams();

    $scope.loaded = {
        //dataElements
        get_dataElements: false,
        get_dataElementsDescriptions: false,
        get_dataElementsGroups: false,
        //indicators
        get_indicators: false,
        get_indicatorsDescriptions: false,
        get_indicatorGroups: false
    };

    $scope.allObjects = [];
    $scope.$watch('allObjects', function () {
        //console.log('$scope.allObjects update', $scope.allObjects);
        var loaded_array = Object.keys($scope.loaded).map(function (key) { return $scope.loaded[key]; });
        if (loaded_array.indexOf(false) == -1) {
            self.tableParams.settings({
                filterOptions: { filterFilterName: "filterOR" },
                dataset: $scope.allObjects
            });
            if ($scope.table.cols) {
                $scope.table.cols.forEach(function (col) {
                  //  console.log(col);
                    col.code = Object.keys(col.filter())[0];
                });
            }
            endLoadingState();
        }
    });

    $scope.parseFormula = function (formula, dataElements, categoryOptionCombos, programIndicators) {
        var operatorRegex = /}\s*[\+\-\*]\s*(#|I)/g;
        var dataElementRegex = /#\{\w*}/g;
        var dataElementCatRegex = /#\{\w*.\w*}/g;
        var programIndicatorRegex = /I\{\w*}/g;
        return formula
            .replace(operatorRegex, function (nexus) {
                var operator = nexus.split("}")[1].trim().charAt(0);
                var nextItemType = nexus.charAt(nexus.length - 1);
                return "}<br><b>" + operator + "</b> " + nextItemType;
            })
            .replace(dataElementRegex, function (dataElementWithCurlyBraces) {
                var deId = dataElementWithCurlyBraces.substr(0, dataElementWithCurlyBraces.length - 1).substr(2);

                return dataElements[deId] ? getDataElementHtml(dataElements[deId]) : deId;
            })
            .replace(dataElementCatRegex, function (dataElementCatWithCurlyBraces) {
                var deId = dataElementCatWithCurlyBraces.split("{")[1].split(".")[0];
                var catId = dataElementCatWithCurlyBraces.split(".")[1].split("}")[0];

                var dataElement = dataElements[deId] ? getDataElementHtml(dataElements[deId]) : deId;
                var categoryOptionCombo = categoryOptionCombos[catId] ? categoryOptionCombos[catId].object_name : catId;

                return dataElement + " <i>(" + categoryOptionCombo + ")</i>";
            })
            .replace(programIndicatorRegex, function (programIndicatorWithCurlyBraces) {
                var piId = programIndicatorWithCurlyBraces.substr(0, programIndicatorWithCurlyBraces.length - 1).substr(2);

                return programIndicators[piId] ? getProgramIndicatorHtml(programIndicators[piId]) : piId;
            });
    };

    function getDataElementHtml(dataElementObject) {
        return "<span class='tooltipcontainer'>" + dataElementObject.object_name +
            "<span class='tooltiptext'>" + dataElementObject.object_description +
            "</span>" +
            "</span>";
    }

    function getProgramIndicatorHtml(programIndicatorObject) {
        return "<span>" + programIndicatorObject.object_name +
            "</span>";
    }

    function load_table_info() {

        var start = new Date();

        var temp = {};
        var categoryOptionCombosTemp = {};
        var programIndicatorsTemp = {};

        searchAllFactory.qry_dataElementsAll.query().$promise.then(function (response) {
            response.dataElements.forEach(function (obj) {

                if (filterObjects(obj, "dataElement")) {
                    var attribute = "";
                    //objectGroup + service
                    var temp_arr = {
                        objectGroup_id: [],
                        objectGroup_code: [],
                        objectGroup_name: [],
                        service_id: [],
                        service_code: [],
                        service_name: []
                    };

                    obj.dataSetElements.forEach(function (grp) {
                        if ($scope.servicesList && grp.dataSet.attributeValues.length > 0 && grp.dataSet.attributeValues[0].value) {
                            var servicesCode = grp.dataSet.attributeValues[0].value.split('_');
                            servicesCode.shift();
                            servicesCode.forEach(function (code) {
                                if ($scope.servicesList[code]) {
                                    temp_arr.service_id.push($scope.servicesList[code].service_id);
                                    temp_arr.service_code.push($scope.servicesList[code].service_code);
                                    temp_arr.service_name.push($scope.servicesList[code].service_name);
                                } else {
                                    console.log("searchModule: Cannot find any service with code: " + code);
                                }
                            });
                        }
                        temp_arr.objectGroup_id.push(grp.dataSet.id);
                        temp_arr.objectGroup_code.push(grp.dataSet.code);
                        temp_arr.objectGroup_name.push(grp.dataSet.displayName);
                    });


                    if (obj.attributeValues != undefined) {

                        obj.attributeValues.forEach(function (att) {

                            if (att.attribute.id == "zC3TBJnSxar") {
                                attribute = att.value;
                                $scope.cols_object_advanced.object_ICD10 = true;
                            } else { attribute = "" }

                        });
                    }



                    temp[obj.id] = {
                        object_type: 'dataElement',
                        object_id: obj.id,
                        object_code: obj.code,
                        object_ICD10: attribute,
                        object_name: obj.displayName,
                        object_form: obj.displayFormName,
                        object_description: obj.displayDescription,
                        objectGroup_id: temp_arr.objectGroup_id.join(', '),
                        objectGroup_code: temp_arr.objectGroup_code.join(', '),
                        objectGroup_name: temp_arr.objectGroup_name.join(', '),
                        service_id: temp_arr.service_id.join(', '),
                        service_code: temp_arr.service_code.join(', '),
                        service_name: temp_arr.service_name.join(', ')
                    };


                }
            });

            $scope.loaded.get_dataElements = true;
            $scope.loaded.get_dataElementsDescriptions = true;
            $scope.loaded.get_dataElementsGroups = true;

            console.log("searchModule: Data Elements loaded")

            return "done";

        }).then(function () {
            return searchAllFactory.get_categoryOptionCombosAll.query().$promise.then(function (response) {
                response.categoryOptionCombos.forEach(function (obj) {
                    categoryOptionCombosTemp[obj.id] = {
                        id: obj.id,
                        object_name: obj.displayName
                    }
                });
            });
        }).then(function() {
            return searchAllFactory.get_programIndicatorsAll.query().$promise.then(function (response) {
                response.programIndicators.forEach(function (obj) {
                    programIndicatorsTemp[obj.id] = {
                        id: obj.id,
                        object_name: obj.displayName
                    }
                });
            });
        }).then(function () {
            return searchAllFactory.get_indicatorsAll.query().$promise.then(function (response) {
                response.indicators.forEach(function (obj) {

                    if (filterObjects(obj, "indicator")) {

                        //objectGroup + service
                        var temp_arr = {
                            objectGroup_id: [],
                            objectGroup_code: [],
                            objectGroup_name: [],
                            service_id: [],
                            service_code: [],
                            service_name: []
                        };

                        obj.indicatorGroups.forEach(function (grp) {
                            if ($scope.servicesList && grp.attributeValues.length > 0 && grp.attributeValues[0].value) {
                                var servicesCode = grp.attributeValues[0].value.split('_');
                                servicesCode.shift();
                                servicesCode.forEach(function (code) {
                                    if ($scope.servicesList[code]) {
                                        temp_arr.service_id.push($scope.servicesList[code].service_id);
                                        temp_arr.service_code.push($scope.servicesList[code].service_code);
                                        temp_arr.service_name.push($scope.servicesList[code].service_name);
                                    } else {
                                        console.log("searchModule: Cannot find any service with code: " + code);
                                    }
                                });
                            }
                            temp_arr.objectGroup_id.push(grp.id);
                            temp_arr.objectGroup_code.push(grp.code);
                            temp_arr.objectGroup_name.push(grp.displayName);
                        });

                        temp[obj.id] = {
                            object_type: 'indicator',
                            object_id: obj.id,
                            object_code: obj.code,
                            object_name: obj.displayName,
                            object_form: obj.displayFormName,
                            object_den_formula: $scope.parseFormula(obj.denominator, temp, categoryOptionCombosTemp, programIndicatorsTemp),
                            object_num_formula: $scope.parseFormula(obj.numerator, temp, categoryOptionCombosTemp, programIndicatorsTemp),
                            object_description: obj.displayDescription,
                            objectGroup_id: temp_arr.objectGroup_id.join(', '),
                            objectGroup_code: temp_arr.objectGroup_code.join(', '),
                            objectGroup_name: temp_arr.objectGroup_name.join(', '),
                            service_id: temp_arr.service_id.join(', '),
                            service_code: temp_arr.service_code.join(', '),
                            service_name: temp_arr.service_name.join(', ')
                        };

                    }

                });

                $scope.loaded.get_indicators = true;
                $scope.loaded.get_indicatorsDescriptions = true;
                $scope.loaded.get_indicatorGroups = true;
                $scope.allObjects = Object.keys(temp).map(function (key) { return temp[key]; });

                console.log("searchModule: Indicators loaded")

                return "done";
            });
        }).then(function log() {
            console.log("searchModule: Loading time of search table: " + (Date.now() - start) + " milliseconds.");
        });
    }

    $scope.exportToExcel = function (tableId) { // ex: '#my-table'
        var exportHref = ExcelFactory.tableToExcel(tableId, 'hmis_table');
        var a = document.createElement('a');
        a.href = exportHref;
        a.download = 'hmis_table.xls';
        a.click();
    }
}])
