import Box from '@mui/material/Box';
import Markdown from 'react-markdown';

export type BubbleOptions = {
    content: string,
    bgcolor: string
    color?: string,
    flushLeft?: boolean
}

export default function Bubble({
    content, color, bgcolor, flushLeft
}: BubbleOptions) {
    return (
        <Box display='flex' justifyContent={flushLeft ? 'flex-start' : 'flex-end'}>
            <Box 
                color={color || 'white'} 
                bgcolor={bgcolor}
                borderRadius={16}
                p={3} >
                <Markdown>{ content }</Markdown>
            </Box>
        </Box>
    );
}