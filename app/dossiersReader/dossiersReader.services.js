/*------------------------------------------------------------------------------------
    List of contributors: https://github.com/MSFOCBA
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/

var qryMe = dhisUrl + 'me?fields=userGroups[name]';

dossiersReaderModule.factory("dossiersReaderMeFactory", ['$resource',
    function($resource) {
     	return $resource(qryMe,
     		{},
    		{ get: { method: "GET"} });
    }
]);
