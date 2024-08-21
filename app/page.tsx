"use client"

import { useState } from "react";

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ChatInput from "@/components/ChatInput";
import Bubble from '@/components/Bubble';
import ChatWindow from "@/components/ChatWindow";

export default function Home() {
  const [history, setHistory] = useState([{
    role: "model",
    content: "Hi! I'm the Rate My Professor support assistant. How can I help you today?"
  }])
  const [debounce, setDebounce] = useState(false);

  async function fetchResponse(msg: string) {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ history: history, incoming: msg })
    });

    if(!res.ok) {
      throw Error(`Communication failed with code ${res.status}.`)
    }
    if(!res.body) {
      throw Error('Missing response from server.')
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    let txt = '';
    while(true) {
      const stream = await reader.read();
      if(stream.done) break;

      const raw = stream.value;
      txt += decoder.decode(raw);
    }

    return txt;
  }

  const sendMessage = async (msg: string) => {
    const future = [
      ...history,
      { role: 'user', content: msg }
    ]

    // Takes effect next render
    setHistory(future);
    setDebounce(true);

    (async () => {
      try {
        console.log('Sending message:', msg);
        const res = await fetchResponse(msg);

        console.log('Responded with:', res);
        setHistory([
          ...future,
          { role: 'model', content: res }
        ])
        setDebounce(false);
      }
      catch(e) {
        console.error(e);
      }
    })()
  }

  return (
    <>
      <Container>
        <Box width='100%' mb={5}>
          <Typography variant='h1' textAlign='center'>Rate My Professor Chatbot</Typography>
          <Typography variant='subtitle1' textAlign='center'>Created by Esat Adiloglu, Nathaniel Escaro, Ryan Eshan, Saikarthik Mummadisingu</Typography>
        </Box>
        <Stack direction={'column'} height="700px" border="1px solid black" p={2} spacing={3} justifyContent='center' alignContent='stretch'>
          <ChatWindow width='100%' height='100%'>
            {
              history.map(({ role, content }, idx) => {
                const flushLeft = role === 'model';
                const bgcolor = flushLeft ? 'primary.main' : 'secondary.main';
                return <Bubble key={idx} content={content} bgcolor={bgcolor} flushLeft={flushLeft}/>
              })
            }
          </ChatWindow>
          <ChatInput onSubmit={sendMessage} debounce={debounce}/>
        </Stack>
      </Container>
    </>
  )
}
