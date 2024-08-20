"use client"

import { Box, Stack } from "@mui/material";
import { useState } from "react";
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

  /*
  const handleKeyDown = (e : React.KeyboardEvent) => {
    if(e.key === 'Enter') {
      sendMessage();
  }
}
  */

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Stack direction={'column'} width="500px" height="700px" border="1px solid black" p={2} spacing={3}>
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
    </Box>
  )
}
