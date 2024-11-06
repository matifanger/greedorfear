import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const [cryptoResponse, stockResponse] = await Promise.all([
      fetch('https://api.alternative.me/fng/?limit=100'),
      fetch('https://fear-and-greed-index.p.rapidapi.com/v1/fgi', {
        headers: {
          'X-RapidAPI-Host': process.env.RAPIDAPI_HOST as string,
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY as string
        }
      })
    ]);

    if (!cryptoResponse.ok || !stockResponse.ok) {
      throw new Error('One or more API requests failed');
    }

    const [cryptoIndex, stockIndex] = await Promise.all([
      cryptoResponse.json(),
      stockResponse.json()
    ]);

    // Validate data structure
    if (!cryptoIndex?.data || !stockIndex?.fgi) {
      throw new Error('Invalid data structure received from APIs');
    }

    res.status(200).json({ cryptoIndex, stockIndex });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch market data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 