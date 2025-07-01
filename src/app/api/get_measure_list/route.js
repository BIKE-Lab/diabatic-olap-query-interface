import { NextResponse } from 'next/server'
import { splitIRI } from "@/lib/custom/helper"

const SparqlClient = require("../sparqlClient/SparqlClient")



export async function POST (request=Request) {
    const {tbox,dataset} = await request.json()

    const client = new SparqlClient()
    const sparql = `PREFIX qb:	<http://purl.org/linked-data/cube#>\n`
        + `prefix qb4o: <http://purl.org/qb4olap/cubes#>\n`
        + `prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n`
        + `prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n\n`
        + `SELECT DISTINCT ?measure ?range ?aggFunc\n`
        + `FROM<${tbox}>\n`
        + `WHERE {\n`
        + `\t<${dataset}> rdf:type qb:DataSet;\n`
        + `\t\tqb:structure ?cuboid.\n`
        + `\t?cuboid qb:component ?BNodeForMeasure.\n`
        + `\t?BNodeForMeasure qb:measure ?measure;\n`
        + `\t\tqb4o:aggregateFunction ?aggFunc.\n`
        + `\t?measure rdfs:range ?range`
        + `}\n`
        + `ORDER BY ?measure`;

        // console.log(sparql)
    const result = await client.query(sparql)
    const data = result.data.results.bindings
    return NextResponse.json({Measures:mergeMeasures(data)});
}

const mergeMeasures = (data) => {
    const mergedData = data.reduce((acc, item) => {
      const measureUrl = item.measure.value;
      const aggFuncUrl = item.aggFunc.value;
      const rangeUrl = item.range.value;
  
      // Find the measure in the accumulator
      let measure = acc.find(m => m.measureName === measureUrl);
  
      if (!measure) {
        // If the measure doesn't exist, create a new entry
        measure = {
          measureName: measureUrl,
          range:{
            rangeName: rangeUrl,
            rangeValue: splitIRI(rangeUrl)[1]
          },
          aggFunctions: []
        };
        acc.push(measure);
      }
  
      // Add the aggregation function to the measure's aggFunctions array
      measure.aggFunctions.push({
        aggFuncName: aggFuncUrl
      });
  
      return acc;
    }, []);
  
    return mergedData ;
  };
  