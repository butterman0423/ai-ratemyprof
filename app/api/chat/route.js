import {NextResponse} from 'next/server'
import { Pinecone } from '@pinecone-database/pinecone'
import OpenAI from 'openai'

const systemPrompt = `
You are a helpful and knowledgeable assistant designed to assist students in finding the best professors based on their specific queries. Your task is to understand the student’s question and retrieve the top 3 professors who best match their needs. You will use a Retrieval-Augmented Generation (RAG) approach, ensuring that your answers are accurate, relevant, and well-structured.

For each query:

Analyze the student's request to understand their preferences (e.g., subject, rating, teaching style, etc.).
Retrieve information about professors that best match the query.
Rank the top 3 professors based on their suitability and provide detailed information about them, including their name, subject, rating (out of 5), and a brief review.
Your responses should be concise and informative, helping the student make an informed decision.

Example Query:

Student: "I’m looking for a good computer science professor who is known for clear explanations."
Example Response:

Professor: Dr. Robert Brown
Subject: Computer Science
Rating: 5/5
Review: "Excellent professor! His coding exercises really helped me understand the material."

Professor: Dr. Emily Davis
Subject: Computer Science
Rating: 4/5
Review: "Engaging lectures and supportive during office hours. A good choice for CS majors."

Professor: Dr. Alan Johnson
Subject: Computer Science
Rating: 4/5
Review: "Good lecturer but sometimes hard to follow. Provides detailed notes and resources."
`


export async function POST(req){
    const data = await req.json()

    const pc = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
    })
    const index = pc.index('rag').namespace('ns1')
    const openai = new OpenAI()

    const text = data[data.length-1].content

    const embedding = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
        encoding_format: 'float',
      })


    const results = await index.query({
        topK: 3,
        includeMetadata: true,
        vector: embedding.data[0].embedding
    })


    let resultString = '\n\nReturned results from vector db (done automatically):'
    results.matches.forEach((match) => {
        resultString +=`
        \n
        Professor: ${match.id}
        Review: ${match.metadata.stars}
        Subject: ${match.metadata.subject}
        Stars: ${match.metadata.stars}
        \n\n
        `
    })

    const lastMessage = data[data.length - 1]
    const lastMessageContent = lastMessage.content + resultString
    const lastDataWithoutLastMessage = data.slice(0, data.length - 1)


    const completion = await openai.chat.completions.create({
        messages: [
          {role: 'system', content: systemPrompt},
          ...lastDataWithoutLastMessage,
          {role: 'user', content: lastMessageContent},
        ],
        model: 'gpt-3.5-turbo',
        stream: true,
      })


      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder()
          try {
            for await (const chunk of completion) {
              const content = chunk.choices[0]?.delta?.content
              if (content) {
                const text = encoder.encode(content)
                controller.enqueue(text)
              }
            }
          } catch (err) {
            controller.error(err)
          } finally {
            controller.close()
          }
        },
      })
    return new NextResponse(stream)
}