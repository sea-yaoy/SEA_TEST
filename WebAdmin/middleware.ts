/* eslint-disable @next/next/no-server-import-in-page */
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const {
  CSRF_SECRET = (() => {
    throw new Error("CSRF_SECRET Required.")
  })(),
} = process.env

const SALT_LENGTH = 8

const CHARS = "0123456789abcde"

const rdmSalt = () => {
  return Array.from({ length: SALT_LENGTH }, () =>
    CHARS.charAt(Math.floor(Math.random() * CHARS.length)),
  ).join("")
}

async function createHash(message: string) {
  // Encode the message string as a Uint8Array
  const msgBuffer = new TextEncoder().encode(message)

  // Hash the message using SHA-1
  const hashBuffer = await crypto.subtle.digest("SHA-1", msgBuffer)

  // Convert the ArrayBuffer to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .substring(0, 24)

  return hashHex.replace(/(.{4})(?=.{4})/g, "$&-")
}

const createToken = async () => {
  const salt = rdmSalt()
  const hash = await createHash(`${CSRF_SECRET}-${salt}`)

  return `${salt}-${hash}`
}

const validateToken = async (token: string) => {
  const index = token.indexOf("-")
  const salt = token.substring(0, index)

  const verifyHash = await createHash(`${CSRF_SECRET}-${salt}`)
  const verifyToken = `${salt}-${verifyHash}`

  return verifyToken === token
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const token = request.cookies.get("CSRF-TOKEN")

  // check result
  if (request.nextUrl.pathname.startsWith("/api")) {
    const isValidToken = await validateToken(token)

    if (isValidToken && token) return response

    request.nextUrl.searchParams.set("from", request.nextUrl.pathname)
    request.nextUrl.pathname = "/api/get-validate-csrf"

    return NextResponse.rewrite(request.nextUrl)
  }

  if (!token) {
    const newToken = await createToken()
    response.cookies.set("CSRF-TOKEN", newToken)
  }

  return response
}
