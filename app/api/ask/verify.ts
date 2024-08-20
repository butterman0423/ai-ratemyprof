export type ChatRecord = {
    role: string, 
    content: string
}

export type RequestBody = {
    history: ChatRecord[],
    incoming: string
}

export function verifyBody(dat?: RequestBody): boolean {
    return dat != undefined
        && 'incoming' in dat
        && 'history' in dat
        && dat.history.every(({ role, content }) => role != undefined && content != undefined);
}