/*------------------------------------------------------------------------------------
    List of contributors: https://github.com/MSFOCBA
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/


var qryDatasets = dhisUrl + 'dataSets.json?paging=false';

datasetsModule.factory('datasetsFactory', ['$resource',
    function($resource) {
        return $resource(qryDatasets, {}, {
            query: {
                method: 'GET',
                isArray: false
            }
        });
    }
]);


var qryDatasetDataelements = dhisUrl + 'dataSets/:datasetId?fields=id,displayName,sections[id,displayName,dataElements[id,displayName,displayFormName,displayDescription,valueType,optionSetValue,optionSet[options[displayName]],categoryCombo[id,displayName]]],dataSetElements[categoryCombo[id,displayName],dataElement[id,displayName,displayFormName,displayDescription,valueType,optionSetValue,optionSet[options[displayName]],categoryCombo[id,displayName]]]&paging=false'

datasetsModule.factory('datasetsDataelementsFactory', ['$resource',
    function($resource) {
        return $resource(qryDatasetDataelements, {
            datasetId: '@datasetId'
        }, {
            query: {
                method: 'GET',
                isArray: false
            }
        });
    }
]);

var qryCategoryCombos = dhisUrl + 'categoryCombos?filter=:ids&fields=id,displayName,categories[displayName,items[displayName]]&paging=false'

datasetsModule.factory('datasetsCategoryCombosFactory', ['$resource',
    function($resource) {
        return $resource(qryCategoryCombos, {
            ids: '@ids'
        }, {
            query: {
                method: 'GET',
                isArray: false
            }
        });
    }
]);