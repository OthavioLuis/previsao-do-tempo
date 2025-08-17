export interface PrevisaoTempo {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    feels_like:number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
    main: string;
  }[];
  wind: {
    speed: number;
  }
  message?: string;
  cod?: number;
  clouds: {
    all: number;
  }
}

export interface PrevisaoHora {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
    main: string;
  }[];
  wind: {
    speed: number;
  };
  pop?: number;
}

export interface PrevisaoHorariaResponse {
  list: PrevisaoHora[];
  city: {
    name: string;
    country: string;
  }
}