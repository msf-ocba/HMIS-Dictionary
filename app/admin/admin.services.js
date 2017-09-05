/*------------------------------------------------------------------------------------
    List of contributors: https://github.com/MSFOCBA
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/

var qry_get_UG = dhisUrl + 'userGroups.json?fields=name,id&paging=false';
var qry_set_UG = dhisUrl + 'dataStore/HMIS_Dictionary/setup_userGroup';

adminModule.factory('adminUGFactory', ['$resource', function($resource) {
    return {
        get_UG:       $resource(qry_get_UG, {}, { query: { method: 'GET', isArray: false  } }),
        get_UG_set:   $resource(qry_set_UG, {}, { query: { method: 'GET', isArray: false  } }),
        set_UG:       $resource(qry_set_UG, {}, { query: { method: 'POST', isArray: false  } }),
        upd_UG:       $resource(qry_set_UG, {}, { query: { method: 'PUT', isArray: false  } }),
    };
}]);

var qry_get_OUGS = dhisUrl + 'organisationUnitGroupSets.json?fields=name,id&paging=false';
var qry_set_OUGS = dhisUrl + 'dataStore/HMIS_Dictionary/setup_organisationUnitGroupSet';

adminModule.factory('adminOUGSFactory', ['$resource', function($resource) {
    return {
        get_OUGS:       $resource(qry_get_OUGS, {}, { query: { method: 'GET', isArray: false  } }),
        get_OUGS_set:   $resource(qry_set_OUGS, {}, { query: { method: 'GET', isArray: false  } }),
        set_OUGS:       $resource(qry_set_OUGS, {}, { query: { method: 'POST', isArray: false  } }),
        upd_OUGS:       $resource(qry_set_OUGS, {}, { query: { method: 'PUT', isArray: false  } }),
    };
}]);

var qry_set_DS = dhisUrl + 'dataStore/HMIS_Dictionary/blacklist_dataSets';

adminModule.factory('adminDSFactory', ['$resource', function($resource) {
    return {
        get_DS_set:   $resource(qry_set_DS, {}, { query: { method: 'GET', isArray: true  } }),
        set_DS:       $resource(qry_set_DS, {}, { query: { method: 'POST', isArray: false  } }),
        upd_DS:       $resource(qry_set_DS, {}, { query: { method: 'PUT', isArray: false  } }),
    };
}]);

var qry_set_IG = dhisUrl + 'dataStore/HMIS_Dictionary/blacklist_indicatorGroups';

adminModule.factory('adminIGFactory', ['$resource', function($resource) {
    return {
        get_IG_set:   $resource(qry_set_IG, {}, { query: { method: 'GET', isArray: true  } }),
        set_IG:       $resource(qry_set_IG, {}, { query: { method: 'POST', isArray: false  } }),
        upd_IG:       $resource(qry_set_IG, {}, { query: { method: 'PUT', isArray: false  } }),
    };
}]);

var qry_get_A = dhisUrl + 'attributes.json?fields=name,id,dataSetAttribute,indicatorGroupAttribute&paging=false';

adminModule.factory('adminAFactory', ['$resource',
    function($resource) {
        return $resource(qry_get_A, {
        }, {
            query: {
                method: 'GET',
                isArray: false
            }
        });
    }
]);

var qry_get_OUG = dhisUrl + 'organisationUnitGroupSets/:ougsUID.json?fields=organisationUnitGroups[id,code,name]';

adminModule.factory('adminOUGFactory', ['$resource',
    function($resource) {
        return $resource(qry_get_OUG, {
            ougsUID: '@ougsUID'
        }, {
            query: {
                method: 'GET',
                isArray: false
            }
        });
    }
]);

var qry_set_dossierConfigComplete = dhisUrl + 'dataStore/HMIS_Dictionary/setup_dossierConfigComplete';

adminModule.factory('adminDossierConfigCompleteFactory', ['$resource', function($resource) {
    return {
        get_dossierConfigComplete_set:   $resource(qry_set_dossierConfigComplete, {}, { query: { method: 'GET', isArray: false  } }),
        set_dossierConfigComplete:       $resource(qry_set_dossierConfigComplete, {}, { query: { method: 'POST', isArray: false  } }),
        upd_dossierConfigComplete:       $resource(qry_set_dossierConfigComplete, {}, { query: { method: 'PUT', isArray: false  } }),
    };
}]);
