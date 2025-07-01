import { NextResponse } from 'next/server'

const SparqlClient = require("../sparqlClient/SparqlClient")



export async function POST (request=Request) {

    const {tbox} = await request.json()

    const client = new SparqlClient()
    let sparql = `prefix qb: <http://purl.org/linked-data/cube#>\n
prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n\n
SELECT distinct ?dataset\n`
    sparql += `\tFROM<${tbox}>\n`
    sparql += `\tWHERE {\n
        \t\t?dataset rdf:type qb:DataSet.\n
        \t}
    `
    const result = await client.query(sparql)
    const data = result.data.results
    const datasets = data.bindings
    const datasetList = []
    datasets.forEach(dataset => {
        datasetList.push(dataset['dataset'].value)
    })
    
    return NextResponse.json({datasetList});
}


// export default handler;