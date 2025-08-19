'use client'

import { useState } from "react";
import { PrevisaoTempo } from "@/types/weather";
import PrevisaoHoraria from "./PrevisaoHoraria";
import PrevisaoAtual from "./PrevisaoAtual";
import Image from "next/image";
import { RotateCw } from "lucide-react";

export default function Tempo() {
  const [cidade, setCidade] = useState('');
  const [previsaoData, setPrevisaoData] = useState<PrevisaoTempo | null>(null);
  const [mostrarPrevisaoHoraria, setMostrarPrevisaoHoraria] = useState(false)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<Date | null>(null)

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
      setUltimaAtualizacao(new Date())
      setMostrarPrevisaoHoraria(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setPrevisaoData(null);
    } finally {
      setLoading(false);
    }
  }

  const handleAtualizar = async () => {
    if(!cidade) return;

    setLoading(true)
    try {
      const response =await fetch(`/api/tempo?city=${encodeURIComponent(cidade)}`)

      if(!response.ok) {
        throw new Error('Falha ao atualizar dados.')
      }
      const data: PrevisaoTempo = await response.json()
      setPrevisaoData(data)
      setUltimaAtualizacao(new Date())
    } catch (err) {
      setError('Erro ao atualizar os dados')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-card">
      <div className="mt-10">
        <h1 className="text-4xl md:text-6xl font-bold">Previsão do <span className="text-primary">Tempo</span></h1>
        <p className="mt-3 text-muted-foreground">Tá na dúvida se leva guarda-chuva? Digite sua cidade e vou te fornecer a previsão!</p>
      </div>
      {previsaoData && (
        <button
          onClick={handleAtualizar}
          disabled={loading}
          className="flex items-center gap-2 my-3 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Atualizar dados"
        >
          <RotateCw size={18} className={loading ? "animate-spin" : ""} />
          {loading ? "Atualizando" : "Atualizar"}
        </button>
      )}

      <div className="mt-3 flex gap-2">
        <input
          type="text"
          className="border border-input text-foreground placeholder:text-muted-foreground px-3 h-10 w-full py-1 bg-transparent rounded-md"
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

      {ultimaAtualizacao && (
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            {previsaoData?.name}, {previsaoData?.sys?.country} •
            Ultima atualização: {ultimaAtualizacao.toLocaleTimeString('pt-BR')} •
            Próxima atualizar automática: {new Date(ultimaAtualizacao.getTime() + 30 * 6000).toLocaleTimeString('pt-BR')}
          </p>
        </div>
      )}

      {mostrarPrevisaoHoraria && previsaoData && (
        <PrevisaoHoraria cidade={previsaoData.name} />
      )}
    </div>
  );
}