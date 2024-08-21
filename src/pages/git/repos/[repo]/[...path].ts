import fs from '@zenfs/core';
// import fs from "node:fs";

export async function GET({ params, request }) {
    let file;
    
    try {
        // file = fs.readFileSync("/Users/jacobzwang/Documents/GitHub/freestyle-github/.git/" + params.path);
        file = fs.readFileSync(`${params.repo}/.git/` + params.path);
    } catch (e) {
        return new Response(null, {status: 404});
    }
    
    console.log(params.path, file.toString());
    return new Response(file.toString());
}
