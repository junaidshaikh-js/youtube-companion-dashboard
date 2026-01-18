import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
})

export async function POST(req: NextRequest) {
  try {
    const { title, description } = await req.json()

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      )
    }

    const response = await genAI.models.generateContent({
      model: 'gemini-flash-latest',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `You are a YouTube expert. Generate 3 catchy, high-CTR titles for a video based on its current title and description.
              Return ONLY a JSON array of 3 strings.
              
              Current Title: ${title}
              Description: ${description}`,
            },
          ],
        },
      ],
    })

    const text = response.text
    if (!text) {
      throw new Error('No response from Gemini')
    }

    // Clean up response text in case it includes markdown backticks
    const cleanedJson = text.replace(/```json|```/g, '').trim()
    const suggestions = JSON.parse(cleanedJson)

    return NextResponse.json({
      suggestions: Array.isArray(suggestions) ? suggestions.slice(0, 3) : [],
    })
  } catch (error) {
    console.error('Error generating suggestions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
