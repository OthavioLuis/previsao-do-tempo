'use client'

import { PrevisaoHora } from "@/types/weather"
import { useState, useEffect } from "react"
import Image from "next/image";

export default function PrevisaoHoraria({cidade}: { cidade: string }) {
  const [ dados, setDados ] = useState<PrevisaoHora[]>([]);
  const [ carregando, setCarregando ] = useState(false);
  const [ erro, setErro ] = useState('');

  useEffect(() => {
    const buscarPrevisao = async () => {
      if (!cidade) return;

      setCarregando(true);
      setErro('');
      setDados([]); // Ele meio que limpa os dados anteriores

      try {
        const response = await fetch(
          `/api/previsao-horaria?city=${encodeURIComponent(cidade)}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Falha ao buscar previsão')
        }

        const data = await response.json();
        setDados(data.list.slice(0, 8)); // Próximas 24h (8 períodos de 3h)
      } catch (err) {
        setErro(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setCarregando(false)
      }
    };

    buscarPrevisao()
  }, [cidade]);

  if (!cidade) return null;

  return (
    <div className="mt-9">
      <h3 className="text-xl font bold text-foreground">Próximas previsões a cada 3 horas</h3>

      {erro && (
        <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg">
          <p>{erro}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm underline"
          >
            Tentar novamente
          </button>
        </div>
      )}

      <div className="flex overflow-x-auto gap-4 py-4">
        {carregando ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="bg-muted/50 p-3 rounded-lg min-w-[100px] h-[120px] animate-pulse" />
          ))
        ) : dados.length > 0 ? (
          dados.map((hora) => (
            <div key={hora.dt} className="bg-card border justify-items-center p-4 rounded min-w-[150px]">
              <p className="text-muted-foreground text-lg">{new Date(hora.dt * 1000).toLocaleTimeString('pt-br', { hour: '2-digit'})}h</p>
              <Image 
                src={`https://openweathermap.org/img/wn/${hora.weather[0].icon}.png`}
                alt={hora.weather[0].description}
                className="mx-auto"
                width={50}
                height={50}
                unoptimized 
              />
              <p className="text-2xl font-medium text-foreground">{Math.round(hora.main.temp)}°C</p>
              <p className="capitalize text-sm text-muted-foreground">{hora.weather[0].description}</p>
              
            </div>
          ))
        ) : (
          !erro && <p className="text-muted-foreground">Nenhum dado disponível meu nobre</p>
        )}
      </div>
    </div>
  )
}