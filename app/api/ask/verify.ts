export type ChatRecord = {
    role: string, 
    message: string
}

export type RequestBody = {
    history: ChatRecord[],
    incoming: string
}

export function verifyBody(dat?: RequestBody): boolean {
    return dat != undefined
        && 'incoming' in dat
        && 'history' in dat
        && dat.history.every(({ role, message }) => role != undefined && message != undefined);
}