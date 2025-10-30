export async function handler(event, context) {
  const response = await fetch('https://api.frontendexpert.io/api/fe/wordle-words')
  const data = await response.json()

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(data),
  }
}
