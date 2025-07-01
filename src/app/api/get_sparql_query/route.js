import { NextResponse } from 'next/server'
import generateQuery from './generateQuery';

export async function POST (request=Request) {
    
    const everyThingForQuery = await request.json();

    try {
        const sparqlQuery = generateQuery(everyThingForQuery);
        return NextResponse.json({ query: sparqlQuery });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error generating SPARQL query' });
    }
}
