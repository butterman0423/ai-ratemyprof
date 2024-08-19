import type { NextRequest } from 'next/server';
import type { RequestBody } from './verify';

import { NextResponse } from "next/server";
import { verifyBody } from './verify';

export async function POST(req: NextRequest) {
    const dat = (await req.json()) as RequestBody;

    if(!verifyBody(dat)) {
        return new NextResponse('Missing data or data fields in request.', { status: 400 });
    }
}