export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return response.status(500).json({ error: 'GEMINI_API_KEY environment variable is not configured. Please add it to your setup.' });
  }

  try {
    // We send the request securely from the backend to the Google API
    const googleRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request.body),
    });

    const data = await googleRes.json();
    
    // Pass the AI's response back to the frontend UI
    return response.status(googleRes.status).json(data);
  } catch (error) {
    console.error("Error communicating with AI provider:", error);
    return response.status(500).json({ error: 'Failed to communicate with the AI model provider.' });
  }
}
