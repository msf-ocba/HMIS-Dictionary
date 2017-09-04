/*------------------------------------------------------------------------------------
    List of contributors: https://github.com/MSFOCBA
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/

graphModule.service("graphCreateService", function() {

    this.node = function(id, group, name, description) {
        return {
            "id":           id,
            "group":        group,
            "name":         name,
            "description":  description
        }
    };

    this.link = function(sourceNode, targetNode) {
        return {
            "source":       sourceNode.id,
            "sourceGroup":  sourceNode.group,
            "target":       targetNode.id,
            "targetGroup":  targetNode.group
        }
    }

});

graphModule.service("graphQueriesService", function() {

    this.array = function(id, group, name, description) {
        return {
            "id":           id,
            "group":        group,
            "name":         name,
            "description":  description
        }
    };

    this.simple = function(sourceNode, targetNode) {
        return {
            "source":       sourceNode.id,
            "sourceGroup":  sourceNode.group,
            "target":       targetNode.id,
            "targetGroup":  targetNode.group
        }
    }

});
