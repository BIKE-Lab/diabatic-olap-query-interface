import { NextResponse } from 'next/server'

const SparqlClient = require("../sparqlClient/SparqlClient")



export async function POST (request=Request) {
    const {tbox,abox,dataset} = await request.json()

    const client = new SparqlClient()
    const sparql = `
prefix qb: <http://purl.org/linked-data/cube#>
prefix qb4o: <http://purl.org/qb4olap/cubes#>
prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n\n`
    +  `SELECT DISTINCT ?dimension ?hierarchy ?parent ?rollupProperty ?child ?isCuboidLevel\n`
    +  `FROM <${tbox}>\n`
    // +  `FROM<${abox}>\n`
    +  `WHERE {\n`
    +  `\t<${dataset}> rdf:type qb:DataSet;\n`
    +  `\t\tqb:structure ?cuboid.\n`

    +  `\t?cuboid qb:component ?BNodeForCuboidLevel;\n`
    +  `\t\tqb4o:isCuboidOf ?cube.\n`

    +  `\t?BNodeForCuboidLevel qb4o:level ?cuboidLevel.\n`

    +  `\t?cuboidHierarchy qb4o:hasLevel ?cuboidLevel;\n`
    +  `\t\tqb4o:inDimension ?dimension.\n`

    +  `\t?cube rdf:type qb:DataStructureDefinition;\n`
    +  `\t\tqb:component ?BNodeForDimension.\n`

    +  `\t?BNodeForDimension qb4o:dimension ?dimension.\n`

    +  `\t?dimension qb4o:hasHierarchy ?hierarchy.\n`

    +  `\t?hierarchy qb4o:hasLevel ?child.\n`
    +  `OPTIONAL {\n`
    +  `\t\t?hierarchy qb4o:hasLevel ?parent.\n`
    +  `\t\t?hStep rdf:type qb4o:HierarchyStep;\n`
    +  `\t\t\tqb4o:parentLevel ?parent;\n`
    +  `\t\t\tqb4o:childLevel ?child;\n`
    +  `\t\t\tqb4o:rollup ?rollupProperty.\n`
    +  `\t}\n`
    +  `BIND(IF(?cuboidLevel = ?child, "yes", "no") AS ?isCuboidLevel)`
    +  `\n}\n`
    +  `ORDER BY ?dimension ?hierarchy ?parent`

    // console.log(sparql)
    const result = await client.query(sparql)
    const data = result.data.results.bindings

    return NextResponse.json({treeStructure:mergeResults(data) });
}

const mergeResults = (data) => {
    const mergedData = {};

    // Step 1: Merge data into a hierarchical structure
    data.forEach(item => {
        const dimensionUrl = item.dimension.value;
        const hierarchyUrl = item.hierarchy.value;
        const childLevel = item.child.value;
        const parentLevel = item.parent ? item.parent.value : null;
        const rollupProperty = item.rollupProperty ? item.rollupProperty.value : null;
        const isCuboidLevel = item.isCuboidLevel.value === "yes";

        if (!mergedData[dimensionUrl]) {
            mergedData[dimensionUrl] = {
                name: dimensionUrl,
                hierarchies: {}
            };
        }

        if (!mergedData[dimensionUrl].hierarchies[hierarchyUrl]) {
            mergedData[dimensionUrl].hierarchies[hierarchyUrl] = {
                name: hierarchyUrl,
                levels: {}
            };
        }

        if (!mergedData[dimensionUrl].hierarchies[hierarchyUrl].levels[childLevel]) {
            mergedData[dimensionUrl].hierarchies[hierarchyUrl].levels[childLevel] = {
                name: childLevel,
                parentLevel: null,
                rollupRelation: null,
                isCuboid: false,
                inDimension: dimensionUrl,
                inHierarchy: hierarchyUrl
            };
        }

        mergedData[dimensionUrl].hierarchies[hierarchyUrl].levels[childLevel].parentLevel = parentLevel;
        mergedData[dimensionUrl].hierarchies[hierarchyUrl].levels[childLevel].rollupRelation = rollupProperty;
        mergedData[dimensionUrl].hierarchies[hierarchyUrl].levels[childLevel].isCuboid = isCuboidLevel;

        // Also add the parent level if not already added (to ensure all levels are present)
        if (parentLevel && !mergedData[dimensionUrl].hierarchies[hierarchyUrl].levels[parentLevel]) {
            mergedData[dimensionUrl].hierarchies[hierarchyUrl].levels[parentLevel] = {
                name: parentLevel,
                parentLevel: null,
                rollupRelation: null,
                isCuboid: false,
                inDimension: dimensionUrl,
                inHierarchy: hierarchyUrl
            };
        }
    });

    // Step 2: Sort levels within each hierarchy
    Object.values(mergedData).forEach(dimension => {
        Object.values(dimension.hierarchies).forEach(hierarchy => {
            const levelsMap = hierarchy.levels;
            const levels = Object.values(levelsMap);

            // Create a map of child to parent
            const parentMap = {};
            levels.forEach(level => {
                if (level.parentLevel) {
                    parentMap[level.name] = level.parentLevel;
                }
            });

            // Find the root levels (levels that are not a child of any other level)
            const rootLevels = levels.filter(level => !Object.keys(parentMap).includes(level.name));

            // Sort levels starting from the root level
            let sortedLevels = [];
            const visited = new Set();

            const addLevel = (level) => {
                if (!visited.has(level.name)) {
                    visited.add(level.name);
                    sortedLevels.push(level);
                    const children = levels.filter(l => l.parentLevel === level.name);
                    children.forEach(addLevel);
                }
            };

            rootLevels.forEach(addLevel);

            let cuboidIndex = -1;
            sortedLevels.forEach((level, index) => {
                if (level.isCuboid && cuboidIndex === -1) {
                    cuboidIndex = index;
                }
            });

            if (cuboidIndex !== -1) {
                sortedLevels = sortedLevels.slice(0, cuboidIndex + 1);
            }
            // Reverse sortedLevels once
            const reversedSortedLevels = [...sortedLevels].reverse();

            // Adding rollUpSerial to each level
            // sortedLevels = sortedLevels.map((l) => {
            //     return { ...l, rollUpSerial: reversedSortedLevels }
            // });

            hierarchy.levels = sortedLevels;
            hierarchy.rollUpSerial = reversedSortedLevels
        });
    });

    // Convert mergedData to the desired structure
    const result = {
        dimensions: Object.values(mergedData).map(dimension => ({
            name: dimension.name,
            hierarchies: Object.values(dimension.hierarchies).map(hierarchy => ({
                name: hierarchy.name,
                levels: hierarchy.levels,
                rollUpSerial: hierarchy.rollUpSerial,
                inDimension: dimension.name
            }))
        }))
    };

    return result;
};


// export default handler;