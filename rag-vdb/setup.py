from dotenv import load_dotenv
load_dotenv()

from pinecone import Pinecone, ServerlessSpec
import google.generativeai as genai
import os
import json

# Initial Configuration

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

dat_path = os.getenv('REVIEWS_PATH') or 'reviews.json'
raw_dat = json.load(open(dat_path))


# Pinecone index
if not pc.describe_index("rag"):
    #If you try to create the index again, it will throw an error
    pc.create_index(
        name="rag",
        dimension=768,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1")
    )
# Process data
dat = []
for review in raw_dat['reviews']:
    res = genai.embed_content(
        model='models/text-embedding-004',
        content=review['review']
    )
    
    embedding = res['embedding']
    dat.append({
        "values": embedding,
        "id": review['professor'],
        "metadata": {
            "review": review['review'],
            "subject": review['subject'],
            "stars": review['stars']
        }
    })
# Upsert embeddings into the Pinecone index
index = pc.Index("rag")
upsert_response = index.upsert(
    vectors=dat,
    namespace="ns1",
)

# Print logs
print(f"Upserted count: {upsert_response['upserted_count']}")
print(index.describe_index_stats())