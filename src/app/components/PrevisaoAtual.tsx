'use client'

import { PrevisaoTempo } from "@/types/weather";
import Image from "next/image";
import { getImagensTempo } from "@/lib/weatherConditions";

interface PrevisaoAtualProps {
  data: PrevisaoTempo
}

export default function PrevisaoAtual({ data }: PrevisaoAtualProps) {
  const imagens = getImagensTempo(data)

  return (
    <div className={`mt-6 rounded-lg p-4 w-full md:h-70 relative ${imagens.colorPrimary}`}>
      <Image
        src={imagens.image}
        alt={imagens.image}
        fill
        className="object-cover rounded-lg z-0"
      />
      <div className="relative z-1 flex flex-col justify-between md:flex-row gap-4 h-full">
        <div className="flex flex-col justify-between">
          <div className="flex">
            <div className={`${imagens.colorSecondary} rounded-full w-16 h-16 mr-4 mt-1`}>
              {data.weather[0]?.icon && (
                <Image
                  src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                  alt={data.weather[0]?.description || 'Condição do tempo'}
                  width={80}
                  height={80}
                  unoptimized
                />
              )}
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-1 text-foreground tracking-tighter">
                <span className="font-medium text-primary-foreground">
                  {data.name}, <span className="font-light text-2xl">{data.sys?.country}</span>
                </span>
              </h1>
              <p className="text-sidebar">
                {data.weather[0]?.description}
              </p>
            </div>
          </div>
          <div className="flex p-0 md:p-4">
            <p className="text-8xl font-medium">
              {Math.round(data.main.temp)}°C
            </p>
            <p className="ml-3 mt-3 bg-card h-8 py-1 px-3 rounded-2xl text-foreground">
              {Math.round(data.main.feels_like)}°C
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-4 mt-4 md:mt-0">
          <div className={`p-4 md:px-12 ${imagens.colorPrimary} rounded-2xl flex flex-col justify-center items-center`}>
            <p>Umidade</p>
            <p className="text-4xl md:text-5xl font-medium">{data.main.humidity}%</p>
          </div>
          <div className={`p-4 md:px-12 ${imagens.colorSecondary} rounded-2xl flex flex-col justify-center items-center`}>
            <p>Vento</p>
            <p className="text-4xl md:text-5xl font-medium">
              {data.wind.speed}<span className="ml-1 text-sm font-light">km/h</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}