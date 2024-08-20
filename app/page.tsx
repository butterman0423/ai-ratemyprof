"use client"

import { Box, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [history, setHistory] = useState([{
    role: "model",
    content: "Hi! I'm the Rate My Professor support assistant. How can I help you today?"
  }])
  const [message, setMessage] = useState("");
  const [debounce, setDebounce] = useState(false);

  async function fetchResponse() {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ history: history, incoming: message })
    });

    if (!res.ok) {
      throw Error(`Communication failed with code ${res.status}.`)
    }
    if (!res.body) {
      throw Error('Missing response from server.')
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    let txt = '';
    while (true) {
      const stream = await reader.read();
      if (stream.done) break;

      const raw = stream.value;
      txt += decoder.decode(raw);
    }

    return txt;
  }

  const sendMessage = async () => {
    const future = [
      ...history,
      { role: 'user', content: message }
    ]

    // Takes effect next render
    setMessage('');
    setHistory(future);
    setDebounce(true);

    (async () => {
      try {
        console.log('Sending message:', message);
        const res = await fetchResponse();

        console.log('Responded with:', res);
        setHistory([
          ...future,
          { role: 'model', content: res }
        ])
        setDebounce(false);
      } catch (e) {
        console.error(e);
      }
    })()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  }

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" position="relative">
      {/* Sign in*/}
      <Button
        variant="outlined"
        color="primary"
        sx={{
          position: "absolute",
          top: 16,
          right: 16
        }}
      >
        Sign In
      </Button>

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
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button variant="contained" onClick={sendMessage} disabled={debounce}>
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
