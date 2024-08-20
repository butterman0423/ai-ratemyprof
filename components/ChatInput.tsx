'use client'
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { useState } from 'react';

export type ChatInputOptions = {
    onSubmit: ((msg: string) => void) | ((msg: string) => Promise<void>)
    debounce?: boolean
}

export default function ChatInput({
    onSubmit, debounce
}: ChatInputOptions) {
    const [message, setMessage] = useState<string>('');

    async function handleSubmit() {
        setMessage('');
        onSubmit(message);
    }

    const handleKeyDown = (e : React.KeyboardEvent) => {
        if(e.key === 'Enter') {
          handleSubmit();
      }
    }

    return (
        <Stack direction={'row'} spacing={2}>
          <TextField label="Message" fullWidth value={message} 
            onChange={(e) => setMessage(e.target.value)} onKeyDown={handleKeyDown}/>
          <Button variant="contained" onClick={handleSubmit} disabled={debounce || false}>Send</Button>
        </Stack>
    );
}