import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { city } = req.query;
  
  if (!city || typeof city !== 'string') {
    return res.status(400).json({ error: 'Cidade é obrigatória' });
  }

  const API_KEY = process.env.CHAVE_API_KEY;
  const API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=pt_br&cnt=8`;

  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    
    if (data.cod !== "200") {
      throw new Error(data.message || 'Erro na API');
    }
    
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ 
      error: 'Erro ao buscar previsão',
      details: err instanceof Error ? err.message : 'Erro desconhecido'
    });
  }
}