import { type CFContext } from '../env'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
}

export async function onRequest(context: CFContext) {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  const response = await context.next()
  const newResponse = new Response(response.body, response)

  for (const [key, value] of Object.entries(corsHeaders)) {
    newResponse.headers.set(key, value)
  }

  return newResponse
}
