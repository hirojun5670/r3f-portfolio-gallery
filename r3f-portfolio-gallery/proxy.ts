import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";

const UNAUTHORIZED = new NextResponse("Unauthorized", {
    status: 401,
    headers: {
        "WWW-Authenticate": 'Basic realm="Admin Area"',
    },
});

export function proxy(request: NextRequest) {
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
        console.error(
            "[middleware] ADMIN_PASSWORD is not set. All access to /admin is denied."
        );
        return UNAUTHORIZED;
    }

    const authHeader = request.headers.get("authorization");

    if (authHeader && authHeader.startsWith("Basic ")) {
        const base64Credentials = authHeader.slice("Basic ".length);
        const credentials = Buffer.from(base64Credentials, "base64").toString(
            "utf-8"
        );
        const colonIndex = credentials.indexOf(":");
        const password = colonIndex >= 0 ? credentials.slice(colonIndex + 1) : "";

        const expectedBuf = Buffer.from(adminPassword, "utf-8");
        const actualBuf = Buffer.from(password, "utf-8");
        if (
            expectedBuf.length === actualBuf.length &&
            timingSafeEqual(expectedBuf, actualBuf)
        ) {
            return NextResponse.next();
        }
    }

    return UNAUTHORIZED;
}

export const config = {
    matcher: ["/admin/:path*", "/api/works/:path*"]
};
