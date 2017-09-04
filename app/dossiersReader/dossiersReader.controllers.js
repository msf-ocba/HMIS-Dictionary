/*------------------------------------------------------------------------------------
    List of contributors: https://github.com/MSFOCBA
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/

dossiersReaderModule.controller('dossiersReaderMainController', ['$scope', '$sce', '$translate', 'dossiersReaderMeFactory', 'dossiersDossierFactory', function($scope, $sce, $translate, dossiersReaderMeFactory, dossiersDossierFactory) {
    ping();

    $scope.trustAsHtml = function(string) {
        return $sce.trustAsHtml(string);
    };

    var me = dossiersReaderMeFactory.get({},function() {
        $scope.autho = me.userGroups[0].name == $scope.userAdminGroup;
        console.log('dossiersReader: User authorised to edit: ' + $scope.autho);
    });

    $scope.$watch('selectedService', function() {
        $scope.dossier = dossiersDossierFactory.get({
            languageCode: $translate.use(),
            serviceId: $scope.selectedService.id
        });
    });

    endLoadingState(true);
}]);
