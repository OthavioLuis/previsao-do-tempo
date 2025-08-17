'use client'

import { useState } from "react";
import { PrevisaoTempo } from "@/types/weather";
import PrevisaoHoraria from "./PrevisaoHoraria";
import PrevisaoAtual from "./PrevisaoAtual";
import Image from "next/image";

export default function Tempo() {
  const [cidade, setCidade] = useState('');
  const [previsaoData, setPrevisaoData] = useState<PrevisaoTempo | null>(null);
  const [mostrarPrevisaoHoraria, setMostrarPrevisaoHoraria] = useState(false)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPrevisao = async () => {
    if (!cidade.trim()) {
      setError('Digite uma cidade válida.');
      return;
    }

    setLoading(true);
    setError('');
    setMostrarPrevisaoHoraria(false)

    try {
      const response = await fetch(`/api/tempo?city=${encodeURIComponent(cidade)}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao buscar dados')
      }
      const data: PrevisaoTempo = await response.json()
      setPrevisaoData(data)
      setMostrarPrevisaoHoraria(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setPrevisaoData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-card">
      <div className="mt-10">
        <h1 className="text-4xl md:text-6xl font-bold">Previsão do <span className="text-primary">Tempo</span></h1>
        <p className="mt-3 text-muted-foreground">Tá na dúvida se leva guarda-chuva? Digite sua cidade e vou te fornecer a previsão!</p>
      </div>
      <div className="mt-10 flex gap-2">
        <input
          type="text"
          className="border border-input text-foreground placeholder:text-muted-foreground px-3 h-9 w-full py-1 bg-transparent rounded-md"
          placeholder="Digite a cidade aqui..."
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchPrevisao()}
        />
        <button
          onClick={fetchPrevisao}
          disabled={loading || !cidade.trim()}
          className="inline-flex items-center justify-center text-sm bg-primary px-4 py-2 font-medium text-primary-foreground rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {error && <p className="mt-2 text-destructive">{error}</p>}

      <div className="relative">
        {!previsaoData && (
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/home.png"
              alt="Aguardando dados"
              width={450}
              height={450}
              className="opacity-80"
            />
          </div>
        )}
      </div>

      {previsaoData && <PrevisaoAtual data={previsaoData} />}

      {mostrarPrevisaoHoraria && previsaoData && (
        <PrevisaoHoraria cidade={previsaoData.name} />
      )}
    </div>
  );
}