import type { QueryResponse } from "@pinecone-database/pinecone";
import type { Embedding } from "./ai";

import { Pinecone, RecordMetadata } from "@pinecone-database/pinecone";

export type RAGMetadata = {
    review: string,
    subject: string,
    stars: number
}

export const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY || ''
});

const index = pc.index('rag').namespace('ns1');

export async function queryRAG(embeding: Embedding[], k?: number) {
    return index.query({
        topK: k || 5,
        includeMetadata: true,
        vector: embeding
    });
}

export function formatQueryResults(q: QueryResponse<RecordMetadata>) {
    return q.matches
        .map(({ id, metadata }) => {
            if(!metadata) {
                console.warn(`Missing metadata for ${id}`);
                return '';
            }
            const dat = metadata as RAGMetadata;

            return `
            Returned Results:
            Professor: ${id}
            Review: ${ dat.review }
            Subject: ${ dat.subject }
            Stars: ${ dat.stars }
            \n\n
            `
        })
        .join('');
}