import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const openai = new OpenAI({
  baseURL: `http://127.0.0.1:5000/v1`,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      stream: true,
      messages: [
        {
          role: 'system',
          content: `You are a professional storyteller who has been hired to write a series of short stories for a new anthology. The stories should be captivating, imaginative, and thought-provoking. They should explore a variety of themes and genres, from science fiction and fantasy to mystery and romance. Each story should be unique and memorable, with compelling characters and unexpected plot twists.`,
        },
        ...messages,
      ],
    });

    const stream = OpenAIStream(response);
    const streamingResponse = new StreamingTextResponse(stream);

    streamingResponse.pipe(res);
  } catch (error) {
    console.error('Error in POST /api/chat/chat:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}