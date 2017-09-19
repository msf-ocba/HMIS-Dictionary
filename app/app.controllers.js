/*------------------------------------------------------------------------------------
    List of contributors: https://github.com/MSFOCBA
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/

/*
 * 	@alias appModule.controller
 * 	@type {Controller}
 * 	@description Configures the appModule so it manages translations
 *	@todo
 */
appModule.controller('appSharedController', ['$scope', '$translate', '$state', '$location', '$stateParams', '$http', '$window', function($scope, $translate, $state, $location, $anchorScroll, $stateParams, $http, $window) {

    this.$route = $state;
    this.$location = $location;
    this.$routeParams = $stateParams;

    console.log("appModule: Checking user's rights...");

    jQuery.ajax({
        url: dhisUrl + 'dataStore/HMIS_Dictionary/setup_userGroup',
        contentType: 'json',
        method: 'GET',
        dataType: 'text',
        async: false
    }).success(function(admin) {
        admin = jQuery.parseJSON(admin);
        $scope.userAdminGroup = admin.value;
        if ($scope.userAdminGroup) {
            console.log('appModule: Group of users authorised to administrate: ' + admin.value);
        }else{
            console.log('appModule: Group of users authorised to administrate has not been identified.');
        }
    }).fail(function() {
        console.log('appModule: Group of users authorised to administrate has not been defined yet, go to the admin panel!');

        $scope.show_admin = true;

        // "Dossier" configuration is not mandatory anymore
        /*
        window.location.href = dhisUrl + 'apps/HMIS_Dictionary/index.html#/admin';
        */
    });

    /* For services list */
    jQuery.ajax({
        url: dhisUrl + 'dataStore/HMIS_Dictionary/setup_organisationUnitGroupSet',
        contentType: 'json',
        method: 'GET',
        dataType: 'text',
        async: false
    }).success(function(servicelist) {
        servicelist = jQuery.parseJSON(servicelist);
        $scope.serviceSetUID = servicelist.value;
        if ($scope.serviceSetUID) {
            console.log('appModule: List of services taken from organisationUnitGroupSet: ' + servicelist.value);
        }else{
            console.log('appModule: organisationUnitGroupSet to take the list of services has not been defined yet, go to the admin panel!');
        }
    }).fail(function() {
        console.log('appModule: organisationUnitGroupSet to take the list of services has not been identified.');
    });

    /* For DS blacklist */
    jQuery.ajax({
        url: dhisUrl + 'dataStore/HMIS_Dictionary/blacklist_dataSets',
        contentType: 'json',
        method: 'GET',
        dataType: 'text',
        async: false
    }).success(function(DSlist) {
        DSlist = jQuery.parseJSON(DSlist);
        console.log(DSlist);
        $scope.blacklist_datasets = DSlist;
        if ($scope.blacklist_datasets) {
            console.log('appModule: List of blacklisted dataSets: ' + DSlist.value);
        }else{
            console.log('appModule: List of blacklisted dataSets has not been defined yet, go to the admin panel!');
            $scope.blacklist_datasets = [];
        }
    }).fail(function() {
        console.log('appModule: List of blacklisted dataSets has not been identified.');
        $scope.blacklist_datasets = [];
    });

    /* For IG blacklist */
    jQuery.ajax({
        url: dhisUrl + 'dataStore/HMIS_Dictionary/blacklist_indicatorGroups',
        contentType: 'json',
        method: 'GET',
        dataType: 'text',
        async: false
    }).success(function(IGlist) {
        IGlist = jQuery.parseJSON(IGlist);
        $scope.blacklist_indicatorgroups = IGlist;
        if ($scope.blacklist_indicatorgroups) {
            console.log('appModule: List of blacklisted indicatorGroups: ' + IGlist.value);
        }else{
            console.log('appModule: List of blacklisted indicatorGroups has not been defined yet, go to the admin panel!');
            $scope.blacklist_indicatorgroups = [];
        }
    }).fail(function() {
        console.log('appModule: List of blacklisted indicatorGroups has not been identified.');
        $scope.blacklist_indicatorgroups = [];
    });

    /* For admin tab */
    jQuery.ajax({
        url: dhisUrl + 'me?fields=userGroups[name]',
        contentType: 'json',
        method: 'GET',
        dataType: 'text',
        async: false
    }).success(function(me) {
        me = jQuery.parseJSON(me);
        var authUser = me.userGroups.some(function(userGroup){
            return userGroup.name == $scope.userAdminGroup
        });
        if (authUser) {
            console.log('appModule: User authorised to administrate: ' + authUser);
            $scope.show_admin = true;
        }
    }).fail(function() {
        console.log('appModule: Failed to check if user is authorised to administrate.');
    });

    /* For dossier tab */
    jQuery.ajax({
        url: dhisUrl + 'dataStore/HMIS_Dictionary/setup_dossierConfigComplete',
        contentType: 'json',
        method: 'GET',
        dataType: 'text',
        async: false
    }).success(function(dossierConfigComplete) {
        dossierConfigComplete = jQuery.parseJSON(dossierConfigComplete);
        console.log('appModule: dossierConfigComplete: ', dossierConfigComplete);
        if (dossierConfigComplete.value) {
            $scope.show_dossiers = true;
        }
    }).fail(function() {
        console.log('appModule: Failed to check if dossiers configuration is complete.');
    });

    /*
     * 	@alias appModule.controller~ping
     * 	@type {Function}
     * 	@description Checks if session is not expired, if expired response is login-page(so then reload)
     * 	@todo
     */
    ping = function() {
        $.ajax({
                url: qryPing,
                dataType: "html",
                cache: false
            })
            .done(function(data) {
                if (data !== "pong") {
                    document.location;
                    document.location.reload(true);
                }
            });
    };

    csv_to_json = function(csv) {
        console.log('appModule: csv: ', csv);
        var lines = csv.split("\n");
        var result = [];
        var headers = lines[0].split(",");

        for (var i = 1; i < lines.length; i++) {
            var obj = {};
            var currentline = lines[i].split(",");
            for (var j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j];
            }
            result.push(obj);
        }

        //return result; //JavaScript object
        return JSON.stringify(result); //JSON
    };

    /*
     * 	@alias appModule.controller~tabSwitch
     * 	@type {Function}
     * 	@description Triggers ping and startLoadingState functions
     * 	@todo
     */
    tabSwitch = function() {
        ping();
        startLoadingState(true);
    };

    /*
     * 	@alias appModule.controller~startLoadingState
     * 	@type {Function}
     * 	@description To make sure all emelemnts and indicators are loaded before printing
     * 	@todo
     */
    startLoadingState = function(onlyprint) {
        $(".printButton").prop("disabled", true);
        if (!onlyprint === true) {
            $(".loading").show();
        }
    };

    /*
     * 	@alias appModule.controller~endLoadingState
     * 	@type {Function}
     * 	@description To make sure all emelemnts and indicators are loaded before printing
     * 	@todo
     */
    endLoadingState = function(disableprint) {
        if (disableprint === true) {
            setTimeout(function() {
                $(".printButton").prop("disabled", false)
            }, 1000);
        }
        $(".loading").hide();
    };

}]);
