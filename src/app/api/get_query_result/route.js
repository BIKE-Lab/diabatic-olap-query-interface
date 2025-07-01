import { NextResponse } from 'next/server'

const SparqlClient = require("../sparqlClient/SparqlClient")



export async function POST (request=Request) {
    const {sparql} = await request.json()

    const client = new SparqlClient()

    const result = await client.query(sparql)
    const data = result.data.results.bindings

    return NextResponse.json({data});
}
