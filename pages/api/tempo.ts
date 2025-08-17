import type { NextApiRequest, NextApiResponse } from 'next';

type WeatherData = {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
    icon: string;
    main: string;
  }>;
  wind: {
    speed: number;
  };
  message?: string;
  cod?: number;
  clouds: {
    all: number;
  }
};

type ErrorResponse = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WeatherData | ErrorResponse>
) {
  // Verifica se o método é GET
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { city } = req.query;

  // Validação do parâmetro city
  if (!city || typeof city !== 'string') {
    return res.status(400).json({ error: 'Parâmetro "city" é obrigatório' });
  }

  const API_KEY = process.env.CHAVE_API_KEY;
  
  if (!API_KEY) {
    return res.status(500).json({ error: 'Chave da API não configurada' });
  }

  const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pt_br`;

  try {
    const response = await fetch(API_URL);
    const data: WeatherData = await response.json();

    // Verifica se a API retornou um erro
    if (data.cod && data.cod !== 200) {
      return res.status(400).json({ 
        error: data.message || 'Falha ao buscar dados meteorológicos' 
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Erro na API de tempo:', err);
    return res.status(500).json({ error: 'Erro interno ao processar a requisição' });
  }
}