import { NextResponse } from 'next/server'

const SparqlClient = require("../sparqlClient/SparqlClient")



export async function POST (request=Request) {

    const client = new SparqlClient()
    const sparql = `
        SELECT distinct ?g 
        WHERE {
            GRAPH ?g {?s ?p ?o}
        }
    `
    const result = await client.query(sparql)
    const data = result.data.results
    const graphs = data.bindings
    const graphNames = []
    graphs.forEach(graph => {
        graphNames.push(graph['g'].value)
    })

    return NextResponse.json({graphNames });
}
