/*------------------------------------------------------------------------------------
    List of contributors: https://github.com/MSFOCBA
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/

adminModule.controller('adminMainController', ['$scope', '$translate', 'adminOUGSFactory', 'adminUGFactory', 'adminAFactory', 'adminOUGFactory', 'adminDSFactory', 'adminIGFactory', function($scope, $translate, adminOUGSFactory, adminUGFactory, adminAFactory, adminOUGFactory, adminDSFactory, adminIGFactory) {
    $('#admin').tab('show');
    
    $scope.loaded = false;
    startLoadingState(false);
    
    
    $scope.UGList = adminUGFactory.get_UG.query(function(response) {
        console.log(response);
        adminUGFactory.get_UG_set.query(function(response){
            console.log(response);
            if (response.value) {
                $scope.userAdminGroup = response.value;
                $scope.UGList.userGroups.forEach(function(ug) {
                    if (ug.id == response.object.id) {
                        $scope.selectedUG = ug;      
                    }
                });
                $('#divUG').removeClass('alert-warning');
                $('#divUG').removeClass('alert-danger');
                $('#divUG').addClass('alert-success');
            }
        }, function() {
            $('#divUG').removeClass('alert-warning');
            $('#divUG').removeClass('alert-success');
            $('#divUG').addClass('alert-danger');
        });
        endLoadingState();
    });

    $scope.OUGSList = adminOUGSFactory.get_OUGS.query(function(response) {
        console.log(response);
        adminOUGSFactory.get_OUGS_set.query(function(response){
            console.log(response);
            if (response.value) {
                $scope.ougsUID = response.value; //BtFXTpKRl6n//
                $scope.OUGSList.organisationUnitGroupSets.forEach(function(ougs) {
                    if (ougs.id == response.object.id) {
                        $scope.selectedOUGS = ougs;      
                    }
                });
                $('#divOUGS').removeClass('alert-warning');
                $('#divOUGS').removeClass('alert-danger');
                $('#divOUGS').addClass('alert-success');
                
                adminOUGFactory.get({
                    ougsUID: $scope.ougsUID
                }, function(result) {
                    var test = true;
                    if(result.organisationUnitGroups.length > 0){
                        result.organisationUnitGroups.forEach(function(oug) {
                            if(!oug.code){
                                test = false;
                            }
                        });
                    }else{
                        test = false;
                    }
                    if (test) {
                        $('#divOUG').removeClass('alert-warning');
                        $('#divOUG').removeClass('alert-danger');
                        $('#divOUG').addClass('alert-success');
                    }else{
                        $('#divOUG').removeClass('alert-success');
                        $('#divOUG').removeClass('alert-warning');
                        $('#divOUG').addClass('alert-danger');
                    }
                    endLoadingState(false);
                });
            }
        }, function() {
            $('#divOUGS').removeClass('alert-warning');
            $('#divOUGS').removeClass('alert-success');
            $('#divOUGS').addClass('alert-danger');
            
            $('#divOUG').removeClass('alert-warning');
            $('#divOUG').removeClass('alert-success');
            $('#divOUG').addClass('alert-danger');
        });
        endLoadingState();
    });

    
    
    $scope.$watch('selectedUG', function() {
        if (!($scope.selectedUG == undefined)) {
            $('#submitUG').removeClass('disabled');
        }
    });
    $scope.$watch('selectedOUGS', function() {
        if (!($scope.selectedOUGS == undefined)) {
            $('#submitOUGS').removeClass('disabled');
        }
    });
    
    $scope.submitUG = function() {
        console.log($scope.selectedUG);
        var payload = '{"value":"' + $scope.selectedUG.name + '", "object":'+ JSON.stringify($scope.selectedUG) +'}';
        if ($scope.userAdminGroup) {
            adminUGFactory.upd_UG.query(payload,function(response){
                console.log(response);
                if (response) {
                    $scope.userAdminGroup = $scope.selectedUG.name;    
                    $('#divUG').removeClass('alert-warning');
                    $('#divUG').removeClass('alert-danger');
                    $('#divUG').addClass('alert-success');
                }
            });
        }else{    
            adminUGFactory.set_UG.query(payload,function(response){
                console.log(response);
                if (response) {
                    $scope.userAdminGroup = $scope.selectedUG.name;    
                    $('#divUG').removeClass('alert-warning');
                    $('#divUG').removeClass('alert-danger');
                    $('#divUG').addClass('alert-success');
                }
            });
        }
        window.location.reload(true);
    };
    
    $scope.submitOUGS = function() {
        console.log($scope.selectedOUGS);
        var payload = '{"value":"' + $scope.selectedOUGS.id + '", "object":'+ JSON.stringify($scope.selectedOUGS) +'}';
        if ($scope.ougsUID) {
            adminOUGSFactory.upd_OUGS.query(payload,function(response){
                console.log(response);
                if (response) {
                    $scope.ougsUID = $scope.selectedOUGS.id;   
                    $('#divOUGS').removeClass('alert-warning');
                    $('#divOUGS').removeClass('alert-danger');
                    $('#divOUGS').addClass('alert-success');
                }
            });
        }else{
            adminOUGSFactory.set_OUGS.query(payload,function(response){
                console.log(response);
                if (response) {
                    $scope.ougsUID = $scope.selectedOUGS.id;    
                    $('#divOUGS').removeClass('alert-warning');
                    $('#divOUGS').removeClass('alert-danger');
                    $('#divOUGS').addClass('alert-success');
                }
            });
        }
        window.location.reload(true);
    };
    
    adminAFactory.get(function(result) {
        console.log(result);
        var test = false;
        result.attributes.forEach(function(attr) {
            if (attr.name == "serviceCode" && attr.dataSetAttribute && attr.indicatorGroupAttribute) {
                test = true;
            }
        });
        if (test) {
            $('#divA').removeClass('alert-warning');
            $('#divA').removeClass('alert-danger');
            $('#divA').addClass('alert-success');
        }else{
            $('#divA').removeClass('alert-warning');
            $('#divA').removeClass('alert-success');
            $('#divA').addClass('alert-danger');
        };
        endLoadingState(false);
    });
    
    if ($scope.blacklist_datasets) {
        $scope.selectedDS = JSON.stringify($scope.blacklist_datasets);
    }
    
    $scope.submitDS = function() {
        console.log($scope.selectedDS);
        adminDSFactory.get_DS_set.query($scope.selectedDS).$promise.then(function(response1){
            return adminDSFactory.upd_DS.query($scope.selectedDS,function(response2){
                console.log(response2);
                if (response2) {
                    $scope.blacklist_datasets = $scope.selectedDS;    
                }
            });
        }, function() {   
            return adminDSFactory.set_DS.query($scope.selectedDS,function(response2){
                console.log(response2);
                if (response2) {
                    $scope.blacklist_datasets = $scope.selectedDS;
                }
            });
        }).then(function(){
            window.location.reload(true)
        });
    };
    
    if ($scope.blacklist_indicatorgroups) {
        $scope.selectedIG = JSON.stringify($scope.blacklist_indicatorgroups);
    }
    
    $scope.submitIG = function() {
        console.log($scope.selectedIG);
        adminIGFactory.get_IG_set.query($scope.selectedIG).$promise.then(function(response1){
            return adminIGFactory.upd_IG.query($scope.selectedIG,function(response2){
                console.log(response2);
                if (response2) {
                    $scope.blacklist_indicatorgroups = $scope.selectedIG;    
                }
            });
        }, function() {  
            return adminIGFactory.set_IG.query($scope.selectedIG,function(response){
                console.log(response);
                if (response) {
                    $scope.blacklist_indicatorgroups = $scope.selectedIG;    
                }
            });
        }).then(function(){
            window.location.reload(true)
        });
    };
}]);
