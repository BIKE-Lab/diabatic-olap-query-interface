const deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};


export const remove_agg_func = (selectedMeasures, measureName, aggFuncName)=>{
    var tempMeasures = selectedMeasures.map(measure => {
        if (measure.measureName === measureName) {
            const newAggFunctions = measure.aggFunctions.filter(aggFunc => aggFunc.aggFuncName !== aggFuncName);
            if (newAggFunctions.length === 0) {
                return null;
            }
            return { ...measure, aggFunctions: newAggFunctions };
        }
        return measure;
    });
    return tempMeasures.filter(measure => measure !== null);
}

export const tryToAddLevel = (levelInfo, selectedData) => {
  const { levelName, prefixName, inDimension, rollupSerial, inHierarchy } = levelInfo;

  // Create a deep copy of the selectedData to avoid mutation
  const newSelectedData = { ...selectedData };

  // Check if the dimension exists
  if (!newSelectedData[inDimension]) {
      newSelectedData[inDimension] = {
          dimensionName: inDimension,
          rollupSerial,
          selectedHierarchy: inHierarchy,
          selectedLevels: []
      };
  } else {
      // Create a new copy of the dimension to avoid mutation
      newSelectedData[inDimension] = { ...newSelectedData[inDimension] };
      // Make sure selectedLevels is also a new array
      newSelectedData[inDimension].selectedLevels = [...newSelectedData[inDimension].selectedLevels];
  }

  const selectedLevels = newSelectedData[inDimension].selectedLevels;

  // Check if the level already exists in the selected levels
  const levelExists = selectedLevels.some(l => l.levelName === levelName);

  if (!levelExists) {
      // If not present, add the level with the blank template
      const newLevel = {
          levelName,
          prefixName,
          attributesToBeViewed: [],
          selectedInstances: []
      };

      // Create a new array to avoid mutation
      selectedLevels.push(newLevel);

      // Update the dimension with the new selected levels
      newSelectedData[inDimension].selectedLevels = selectedLevels;
  }

  return newSelectedData;
};



export const removeLevel = (levelName, selectedData) => {
  // Create a deep copy of the selectedData to avoid mutation
  const newSelectedData = deepCopy(selectedData);

  // Iterate over each dimension in newSelectedData
  Object.keys(newSelectedData).forEach(dimensionIRI => {
    // Filter out the level from the selectedLevels array for the current dimension
    newSelectedData[dimensionIRI].selectedLevels = newSelectedData[dimensionIRI].selectedLevels.filter(level => level.levelName !== levelName);
    
    if (newSelectedData[dimensionIRI].selectedLevels.length === 0) {
      delete newSelectedData[dimensionIRI];
    }
  });

  return newSelectedData;
};

export const updateAttributeToBeViewList = (attributeList, levelName, selectedData) => {
  // Create a new copy of the selectedData to avoid mutation
  const newSelectedData = Object.keys(selectedData).reduce((acc, dimensionIRI) => {
    // Create a copy of the selectedLevels array for the current dimension
    const updatedSelectedLevels = selectedData[dimensionIRI].selectedLevels.map(level => {
      if (level.levelName === levelName) {
        return {
          ...level,
          attributesToBeViewed: attributeList
        };
      }
      return level;
    });

    // Create a copy of the current dimension object with the updated selectedLevels
    acc[dimensionIRI] = {
      ...selectedData[dimensionIRI],
      selectedLevels: updatedSelectedLevels
    };

    return acc;
  }, {});

  return newSelectedData;
};


export const updateSelectedInstances = (levelName, attribute, instances, selectedData) => {
  // Create a deep copy of the selectedData to avoid mutation
  const newSelectedData = deepCopy(selectedData);

  // Iterate over each dimension in newSelectedData
  Object.keys(newSelectedData).forEach(dimensionIRI => {
    // Iterate over the selected levels within each dimension
    newSelectedData[dimensionIRI].selectedLevels = newSelectedData[dimensionIRI].selectedLevels.map(level => {
      if (level.levelName === levelName) {
        // Update the selectedInstances for the matching attribute within the level
        const updatedInstances = level.selectedInstances.map(attr => {
          if (attr.prefixIRI === attribute.prefixIRI) {
            return {
              prefixIRI: attr.prefixIRI,
              originalIRI: attr.originalIRI,
              instances
            };
          }
          return attr;
        });

        // Check if the attribute already exists, if not, add it
        const attributeExists = updatedInstances.some(attr => attr.prefixIRI === attribute.prefixIRI);
        if (!attributeExists) {
          updatedInstances.push({
            ...attribute,
            instances
          });
        }

        return {
          ...level,
          selectedInstances: updatedInstances.filter(attr => attr.instances.length > 0)
        };
      }
      return level;
    });
  });

  return newSelectedData;
};

export const splitIRI = (iri)=> {
  const hashIndex = iri.lastIndexOf('#');
  const slashIndex = iri.lastIndexOf('/');

  if (hashIndex > slashIndex) {
    return [iri.slice(0, hashIndex + 1), iri.slice(hashIndex + 1)];
  } else {
    return [iri.slice(0, slashIndex + 1), iri.slice(slashIndex + 1)];
  }
}


export const getFullIRIFromPrefix = (prefix, prefixes) => {
  const [prefixKey, localName] = prefix.split(':');
  const namespace = prefixes[prefixKey];

  if (!namespace) {
    throw new Error(`Unknown prefix: ${prefixKey}`);
  }

  return namespace + localName;
};


const getRandomDeepColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 100%, 30%)`; // deep and vivid
};

export const extractChartData = (results) => {
  const labels = new Set();
  const datasets = {};

  results.forEach((row) => {
    Object.keys(row).forEach((key) => {
      if (row[key].datatype) { // This is a measure
        if (!datasets[key]) {
          const baseColor = getRandomDeepColor();
          datasets[key] = {
            label: key,
            data: [],
            borderColor: baseColor,
            backgroundColor: baseColor.replace('30%)', '30%, 0.6)'), // add alpha
          };
        }
        datasets[key].data.push(parseFloat(row[key].value));
      } else { // Assume this is a label (category)
        labels.add(row[key].value);
      }
    });
  });

  return {
    labels: Array.from(labels),
    datasets: Object.values(datasets),
  };
};

