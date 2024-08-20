"use client"

import { Box, Stack } from "@mui/material";
import { useState } from "react";
import ChatInput from "@/components/ChatInput";

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
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Stack direction={'column'} width="500px" height="700px" border="1px solid black" p={2} spacing={3}>
        <Stack direction={'column'} spacing={2} flexGrow={1} overflow="auto" maxHeight="100%">
          {history.map((history, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={history.role === 'model' ? 'flex-start' : 'flex-end'}
            >
              <Box
                bgcolor={history.role === 'model' ? 'primary.main' : 'secondary.main'}
                color="white"
                borderRadius={16}
                p={3}
              >
                {history.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <ChatInput onSubmit={sendMessage} debounce={debounce}/>
      </Stack>
    </Box>
  )
}
