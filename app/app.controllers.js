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
    
    $scope.ougsUID = 'g7k6NQmqJY2'; //BtFXTpKRl6n//
    $scope.userAdminGroup = 'Administrators';
    
    

    this.$route = $state;
    this.$location = $location;
    this.$routeParams = $stateParams;

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
        console.log(csv);
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
    
    /* For admin tab */
    /*jQuery.ajax({
        url: dhisUrl + 'me?fields=userGroups[name]',
        contentType: 'json',
        method: 'GET',
        dataType: 'text',
        async: false
    }).success(function(me) {
        me = jQuery.parseJSON(me);
        console.log(me);
        me = me.userGroups[0].name == $scope.userAdminGroup;
        console.log('appModule: User authorised to administrate: ' + $scope.autho);
        if (me) {
            $scope.show_admin = true;
        }
    }).fail(function() {
        console.log('appModule: Failed to check if user is authorised to administrate.')
    });*/
    
}]);
