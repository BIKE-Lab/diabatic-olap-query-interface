import { NextResponse } from 'next/server'

const SparqlClient = require("../sparqlClient/SparqlClient")



export async function POST (request=Request) {
    const {tbox,abox,level} = await request.json()

    const client = new SparqlClient()
    const sparql = `PREFIX qb4o: <http://purl.org/qb4olap/cubes#>\n`
        + `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n\n`
        + `SELECT DISTINCT ?attribute ?value\n`
        + `FROM<${tbox}>\nFROM<${abox}>\n`
        + `WHERE {\n`
        + `\t<${level}> qb4o:hasAttribute ?attribute.\n`
        + `\t?levelID rdf:type qb4o:LevelMember;\n`
        + `\t\tqb4o:memberOf <${level}>;\n`
        + `\t\t?attribute ?value.\n`
        + `\n}`
        + `ORDER BY ?attribute ?value`

    const result = await client.query(sparql)
    const data = result.data.results.bindings

    return NextResponse.json({levelData:{levelName:level,attributes: mergeAttributes(data)} });
}


const mergeAttributes = (data) => {
  const mergedData = data.reduce((acc, item) => {
    const attributeUrl = item.attribute.value;
    const valueObj = { type: item.value?.type || '', value: item.value?.value || '' };

    // Find the attribute in the accumulator
    let attribute = acc.find(a => a.attributeName === attributeUrl);

    if (!attribute) {
      // If the attribute doesn't exist, create a new entry
      attribute = {
        attributeName: attributeUrl,
        attributeValues: []
      };
      acc.push(attribute);
    }

    // Add the value to the attribute's attributeValues array
    attribute.attributeValues.push(valueObj);

    return acc;
  }, []);

  return mergedData;
};