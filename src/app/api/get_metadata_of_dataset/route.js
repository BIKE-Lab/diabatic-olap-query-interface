import { NextResponse } from 'next/server'

const SparqlClient = require("../sparqlClient/SparqlClient")



export async function POST (request=Request) {
    const {tbox,abox,dataset} = await request.json()

    const client = new SparqlClient()
    const sparql = "PREFIX qb:	<http://purl.org/linked-data/cube#>\r\n"
        + `SELECT distinct(?cuboid) (count(?o) AS ?numobs)\n`
        + `FROM<${tbox}>\nFROM<${abox}>\n`
        + `WHERE {\n` 
        + `\t?o a qb:Observation;\n`
        + `\t\t<http://purl.org/linked-data/cube#dataSet> <${dataset}>.\n`
        + `\t<${dataset}> qb:structure ?cuboid.\n`
        + `\n}`


    const result = await client.query(sparql)
    const data = result.data.results.bindings[0]

    return NextResponse.json({data});
}


// export default handler;