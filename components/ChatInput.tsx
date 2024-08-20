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

    async function handleClick() {
        setMessage('');
        onSubmit(message);
    }

    return (
        <Stack direction={'row'} spacing={2}>
          <TextField label="Message" fullWidth value={message} onChange={(e) => setMessage(e.target.value)} />
          <Button variant="contained" onClick={handleClick} disabled={debounce || false}>Send</Button>
        </Stack>
    );
}