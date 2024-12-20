import fs from "fs"
import { NextRequest, NextResponse } from "next/server"
import path from "path";

export async function GET(
    request: NextRequest
) {
    const spec = request.nextUrl.searchParams.get('spec');
    if (spec) {
        const publicDir = __dirname.split(".next")[0] + "public/"
        const fileUrl = path.join(publicDir, 'specs', `${spec}.png`);
        const data = fs.readFileSync(fileUrl);
        return new NextResponse(data, { status: 404 });
    } else {
        return new NextResponse(null, { status: 404 });
    }
}

// , (error, data) => {
//     if (error) {
//         return new NextResponse(null, { status: 404 });
//     }
//     return new NextResponse(data, { status: 404 });
// }