import fs from '@zenfs/core';
import type { APIRoute } from 'astro';

export async function GET({ params, request }: Parameters<APIRoute>[0]) {
    let file;
    
    try {
        file = fs.readFileSync(`${params.repo}/.git/` + params.path);
    } catch (e) {
        return new Response(null, {status: 404});
    }

    return new Response(file);
}
