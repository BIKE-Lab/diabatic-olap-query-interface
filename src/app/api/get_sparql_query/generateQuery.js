
export default function generateQuery(everyThingForQuery) {
    
    const {selectedMeasures, selectedLevels, selectedDataset, abox, tbox} = everyThingForQuery

    let prefixes = `PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX qb4o: <http://purl.org/qb4olap/cubes#>`;

    let selectClause =  `
SELECT `
    let groupByClause = `
GROUP BY `
    let orderByClause = `
ORDER BY `
    let whereClause = "WHERE {\n"
                    + `\t\t?o a qb:Observation . \n`
                    + `\t\t?o qb:dataSet <${selectedDataset}> .\n`;
    let filterClause = "";


    const sortedLevels = sortLevelsByRollupSerial(selectedLevels);

    Object.keys(sortedLevels).forEach(dimensionIRI => {

        const {rollupSerial} = sortedLevels[dimensionIRI];
        const levels = sortedLevels[dimensionIRI].selectedLevels;

        let highestLevelFound = false;

        rollupSerial.forEach((level, index) => {
            const levelVar = getVarName(level.name);
            if(highestLevelFound == false){
                if (index === 0) {
                    // Cuboid level
                    whereClause += `\n\t\t?o <${level.name}> ?${levelVar} .\n`;
                }
                if(levels[0].levelName === level.name) highestLevelFound = true
                else{
                    // Higher levels
                    const parentVar = getVarName(level.parentLevel);
                    whereClause += `\t\t?${levelVar} qb4o:memberOf <${level.name}> .\n`;
                    whereClause += `\t\t?${levelVar} <${level.rollupRelation}> ?${parentVar} .\n`;
                }
            }
          });
        
        const addedAttributes = new Set();

        levels.forEach((level, index) => {
            const levelVar = getVarName(level.levelName);

            // Attributes to be viewed
            level.attributesToBeViewed.forEach(attr => {
                const attrVar = getVarName(attr.attributeName);
                whereClause += `\t\t?${levelVar} <${attr.attributeName}> ?${attrVar} .\n`;
                selectClause += `?${attrVar} `;
                groupByClause += `?${attrVar} `;
                orderByClause += `?${attrVar} `;
                addedAttributes.add(attrVar);
            });
    
            
            // Selected instances
            if (level.selectedInstances.length > 0) {
                filterClause += '\tFILTER ( ';
                level.selectedInstances.forEach((attr, idx) => {
                const attrVarForInstances = getVarName(attr.originalIRI);
                if (!addedAttributes.has(attrVarForInstances)) {
                    whereClause += `\t?${levelVar} <${attr.originalIRI}> ?${attrVarForInstances} .\n`;
                    addedAttributes.add(attrVarForInstances);
                }
                attr.instances.forEach((instance, id) => {
                    if (idx > 0 || id > 0) filterClause += ' || ';
                    if (instance.type === 'uri') {
                    filterClause += `(?${attrVarForInstances} = <${instance.value}>) `;
                    } else {
                    filterClause += `(REGEX (?${attrVarForInstances}, "${instance.value}", "i")) `;
                    }
                });
                });
                filterClause += ')\n';
            }
        });

        if (groupByClause === `
GROUP BY `){
            groupByClause = '';
        }
          if(orderByClause === `
ORDER BY `){
                orderByClause = '';
            }


      })

      selectedMeasures.forEach((measure, idx) => {
        const measureVar = getVarName(measure.measureName);
        measure.aggFunctions.map((aggFunc, idx2) => {
            const aggFunctionName = aggFunc.prefixName.split(':')[1]
            selectClause += `${aggFunctionName}(<${measure.range}>(?${measureVar})) as ?${aggFunctionName+'_'+ measureVar} `;
            if(idx2==0){
                whereClause += `\n\t\t?o <${measure.measureName}> ?${measureVar} .\n`;
            }
        })
    });


    // Adding filter clause
    whereClause += `\n${filterClause}`;
    
    // Closing WHERE clause
    whereClause += '\n}\n';

    const query =
`${prefixes}
${selectClause}

FROM <${abox}>
FROM <${tbox}>

${whereClause}
${groupByClause}
${orderByClause}
    `;

    return query
}


const sortLevelsByRollupSerial = (selectedLevels) => {
    const sortedLevels = {};
  
    Object.keys(selectedLevels).forEach(dimensionIRI => {
      const rollupSerial = selectedLevels[dimensionIRI].rollupSerial;
  
      // Reverse the rollupSerial array
      const reversedRollupSerial = [...rollupSerial].reverse();
  
      // Create a map for quick lookup of the rollupSerial order
      const rollupSerialOrder = reversedRollupSerial.reduce((acc, level, index) => {
        acc[level.name] = index;
        return acc;
      }, {});
  
      sortedLevels[dimensionIRI] = { ...selectedLevels[dimensionIRI] };
      
      // Sort selectedLevels based on the reversed rollupSerial order
      sortedLevels[dimensionIRI].selectedLevels = sortedLevels[dimensionIRI].selectedLevels.sort((a, b) => {
        return rollupSerialOrder[a.levelName] - rollupSerialOrder[b.levelName];
      });
    });
  
    return sortedLevels;
  }
  

const getVarName = iri => {
  const hashIndex = iri.lastIndexOf('#');
  const slashIndex = iri.lastIndexOf('/');

  const splitIndex = Math.max(hashIndex, slashIndex);
  return iri.substring(splitIndex + 1);
};
