
var qryCurrentUserOrganisationUnits = dhisUrl + 'me/organisationUnits?includeDescendants=true';

userModule.factory('currentUserOrganisationUnitsFactory', ['$resource',
	function($resource) {
		return $resource(qryCurrentUserOrganisationUnits, {}, {
			query: {
				method: 'GET',
				isArray: true
			}
		});
	}
]);