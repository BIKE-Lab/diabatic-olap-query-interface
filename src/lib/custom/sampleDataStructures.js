
// Samples
/*
datasetInitialState.treeStructures:{
    "datasetIRI":{
        "dimensions":[
            name:"dimensionIRI",
            hierarchies:[
                {
                    name:"hierarchyIRI",
                    inDimension: dimension.name,
                    rollUpSerial: [ //Basically the same array named levels but reversed
                                {
                                    inDimension:"dimensionIRI",
                                    inHierarchy:"hierarchyIRI",
                                    name:"levelIRI",
                                    parentLevel:"levelIRI", //could be null
                                    rollupRelation:"rollupRelationIRI", //could be null
                                }
                    ]
                    levels: [
                        {
                            inDimension:"dimensionIRI",
                            inHierarchy:"hierarchyIRI",
                            isCuboid: true,
                            name:"levelIRI",
                            parentLevel:"levelIRI",
                            rollupRelation:"rollupRelationIRI", //could be null
                            
                        }

                    ]
                }
            ]
        ]
    }
}
*/

/*
datasetInitialState.selectedLevelData = {
    levelName: "",
    attributes:[
        {
            attributeName:"",
            prefixIRI:"",
            attributeValues:[
                {
                    type: 'literal', 
                    value: '1'
                },
                {
                    type: 'uri',
                    value:'namespace.com/something' 
                }
            ]
        }
    ]
}
*/







// Query Selection

/*
selectionForQueryState.selectedMeasures: [
    {
        measureName: "namespace.com/Country",
        measurePrefixName: "mdProperty:Country",
        range:'namespace.com/range',
        aggFunctions: [
            { aggFuncName: "namespace.com/avg", prefixName: "qb4o:avg" }
        ]
    }
]
*/


/*
selectionForQueryState.selectedLevels: {
    "dimensionIRI": {
      dimensionName: "dimensionIRI",
      rollupSerials: [], // List of rollup serials
      selectedHierarchy: "hierarchyIRI", // Selected hierarchy
      selectedLevels: [
        {
          "levelName": "levelIRI",
          "prefixName": "prefixIRI",
          "attributesToBeViewed": [
            {
              "attributeName": "attributeIRI",
              "prefixName": "prefixIRI"
            }
          ],
          "selectedInstances": [
            {
              "originalIRI": "attributeIRI",
              "prefixIRI": "prefixIRI",
              "instances": [
                {
                  "type": "typeIRI",
                  "value": "valueIRI"
                }
              ]
            }
          ]
        }
      ]
    }
  }
*/