import { PrevisaoTempo } from "@/types/weather";

type CondicaoDoTempo = {
  image: string;
  altText: string;
  colorPrimary: string;
  colorSecondary: string;
}

export const getImagensTempo = (data: PrevisaoTempo): CondicaoDoTempo => {
  const { weather, main, clouds } = data;
  const condition = weather[0].main;
  const description = weather[0].description.toLowerCase();
  const humidity = main.humidity;
  const cloudCover = clouds.all;

  if (condition === "Thunderstorm") { // Para condições extremas
    return {
      image: "/weather/tempestade.png",
      altText: "Tempestade com raios",
      colorPrimary: "bg-gray-900 text-popover",
      colorSecondary: "bg-gray-700",
    }
  }

  if (condition === "Rain") { // Condição chuva
    if (description.includes("forte") || description.includes("intensa")) {
      return {
        image: "/weather/chuva-forte.png",
        altText: "Chuva intensa",
        colorPrimary: "bg-blue-900 text-popover",
        colorSecondary: "bg-blue-700",
      }
    }
    if (description.includes("leve") || description.includes("chuvisco")) {
      return {
        image: "/weather/chuva-leve.png",
        altText: "Chuva leve",
        colorPrimary: "bg-blue-700 text-popover",
        colorSecondary: "bg-blue-900",
      }
    }
    return {
      image: "/weather/chuva.png",
      altText: "Chuva moderada",
      colorPrimary: "bg-blue-800 text-popover",
      colorSecondary: "bg-blue-600",
    }
  }

  if (condition === "Snow") { // Condição neve
    if (description.includes("leve")) {
      return {
        image: "/weather/neve-leve.png",
        altText: "Neve leve",
        colorPrimary: "bg-blue-100 text-accent-foreground",
        colorSecondary: "bg-blue-300",
      }
    }
    return {
      image: "/weather/neve.png",
      altText: "Nevando",
      colorPrimary: "bg-blue-100 text-accent-foreground",
      colorSecondary: "bg-blue-300",
    }
  }

  if (["Mist", "Fog", "Haze"].includes(condition)) { // Condição neblina / névoa
    return {
      image: "/weather/nevoa.png",
      altText: "Névoa",
      colorPrimary: "bg-gray-300 text-accent-foreground",
      colorSecondary: "bg-gray-200",
    }
  }

  if (condition === "Clouds") { // Condição nublado
    if (description.includes("nublado") || cloudCover > 70) {
      return {
        image: "/weather/nublado.png",
        altText: "Totalmente nublado",
        colorPrimary: "bg-gray-600 text-popover",
        colorSecondary: "bg-gray-900",
      }
    }
    if (description.includes("parcialmente")) {
      return {
        image: "/weather/parcialmente-nublado.png",
        altText: "Parcialmente nublado",
        colorPrimary: "bg-blue-200 text-accent-foreground",
        colorSecondary: "bg-blue-300",
      }
    }
  }

  if (condition === "Clear") { // Condição céu limpo
    if (humidity > 70) {
      return {
        image: "/weather/humido.png",
        altText: "Céu limpo mas úmido",
        colorPrimary: "bg-blue-400 text-popover",
        colorSecondary: "bg-blue-500",
      }
    }
    return {
      image: "/weather/ensolarado.png",
      altText: "Céu limpo",
      colorPrimary: "bg-blue-400 text-popover",
      colorSecondary: "bg-blue-500",
    }
  }

  return { // Fallback genérica
    image: "/weather/generico.png",
    altText: description || "Condição climática",
    colorPrimary: "bg-gray-400 text-popover",
    colorSecondary: "bg-gray-700",
  }
}