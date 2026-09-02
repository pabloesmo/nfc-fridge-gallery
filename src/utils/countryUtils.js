// Convierte nombre de país a emoji de bandera
export function getCountryFlag(countryName) {
    const countries = {
      "españa": "🇪🇸", "japan": "🇯🇵", "japón": "🇯🇵", "france": "🇫🇷", "francia": "🇫🇷",
      "italy": "🇮🇹", "italia": "🇮🇹", "germany": "🇩🇪", "alemania": "🇩🇪",
      "portugal": "🇵🇹", "usa": "🇺🇸", "estados unidos": "🇺🇸", "uk": "🇬🇧",
      "reino unido": "🇬🇧", "mexico": "🇲🇽", "méxico": "🇲🇽", "argentina": "🇦🇷",
      "brazil": "🇧🇷", "brasil": "🇧🇷", "china": "🇨🇳", "india": "🇮🇳",
      "australia": "🇦🇺", "canada": "🇨🇦", "canadá": "🇨🇦", "greece": "🇬🇷",
      "grecia": "🇬🇷", "turkey": "🇹🇷", "turquía": "🇹🇷", "thailand": "🇹🇭",
      "tailandia": "🇹🇭", "netherlands": "🇳🇱", "holanda": "🇳🇱", "switzerland": "🇨🇭",
      "suiza": "🇨🇭", "austria": "🇦🇹", "belgium": "🇧🇪", "bélgica": "🇧🇪",
      "sweden": "🇸🇪", "suecia": "🇸🇪", "norway": "🇳🇴", "noruega": "🇳🇴",
      "denmark": "🇩🇰", "dinamarca": "🇩🇰", "finland": "🇫🇮", "finlandia": "🇫🇮",
      "poland": "🇵🇱", "polonia": "🇵🇱", "czech republic": "🇨🇿", "república checa": "🇨🇿",
      "hungary": "🇭🇺", "hungría": "🇭🇺", "croatia": "🇭🇷", "croacia": "🇭🇷",
      "morocco": "🇲🇦", "marruecos": "🇲🇦", "egypt": "🇪🇬", "egipto": "🇪🇬",
      "south africa": "🇿🇦", "sudáfrica": "🇿🇦", "kenya": "🇰🇪", "colombia": "🇨🇴",
      "peru": "🇵🇪", "perú": "🇵🇪", "chile": "🇨🇱", "vietnam": "🇻🇳",
      "indonesia": "🇮🇩", "philippines": "🇵🇭", "filipinas": "🇵🇭", "singapore": "🇸🇬",
      "singapur": "🇸🇬", "south korea": "🇰🇷", "corea del sur": "🇰🇷", "taiwan": "🇹🇼",
      "new zealand": "🇳🇿", "nueva zelanda": "🇳🇿", "ireland": "🇮🇪", "irlanda": "🇮🇪",
      "scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "escocia": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "iceland": "🇮🇸", "islandia": "🇮🇸",
      "russia": "🇷🇺", "rusia": "🇷🇺", "ukraine": "🇺🇦", "ucrania": "🇺🇦",
      "cuba": "🇨🇺", "dominican republic": "🇩🇴", "república dominicana": "🇩🇴",
    };
    return countries[countryName.toLowerCase()] || "🌍";
  }
  
  // Genera un degradado único y bonito por país
  export function getCountryGradient(countryName) {
    const gradients = {
      "españa": "from-red-800 via-yellow-700 to-red-800",
      "japón": "from-red-900 via-pink-800 to-red-900",
      "japan": "from-red-900 via-pink-800 to-red-900",
      "francia": "from-blue-900 via-indigo-800 to-red-900",
      "france": "from-blue-900 via-indigo-800 to-red-900",
      "italia": "from-green-900 via-gray-800 to-red-900",
      "italy": "from-green-900 via-gray-800 to-red-900",
      "alemania": "from-gray-900 via-gray-800 to-yellow-900",
      "germany": "from-gray-900 via-gray-800 to-yellow-900",
      "portugal": "from-green-900 via-green-800 to-red-900",
      "estados unidos": "from-blue-900 via-blue-800 to-red-900",
      "usa": "from-blue-900 via-blue-800 to-red-900",
      "reino unido": "from-blue-900 via-indigo-900 to-blue-900",
      "uk": "from-blue-900 via-indigo-900 to-blue-900",
      "grecia": "from-blue-900 via-sky-800 to-blue-900",
      "greece": "from-blue-900 via-sky-800 to-blue-900",
      "marruecos": "from-red-900 via-green-900 to-red-900",
      "morocco": "from-red-900 via-green-900 to-red-900",
      "turquía": "from-red-900 via-red-800 to-red-900",
      "turkey": "from-red-900 via-red-800 to-red-900",
      "tailandia": "from-blue-900 via-red-900 to-blue-900",
      "thailand": "from-blue-900 via-red-900 to-blue-900",
      "méxico": "from-green-900 via-gray-800 to-red-900",
      "mexico": "from-green-900 via-gray-800 to-red-900",
      "argentina": "from-sky-900 via-white via-sky-900 to-sky-900",
      "brasil": "from-green-900 via-yellow-800 to-green-900",
      "brazil": "from-green-900 via-yellow-800 to-green-900",
      "australia": "from-blue-900 via-indigo-900 to-red-900",
      "china": "from-red-900 via-red-800 to-yellow-900",
      "india": "from-orange-900 via-gray-800 to-green-900",
      "suiza": "from-red-900 via-red-800 to-red-900",
      "switzerland": "from-red-900 via-red-800 to-red-900",
      "islandia": "from-blue-900 via-indigo-900 to-blue-900",
      "iceland": "from-blue-900 via-indigo-900 to-blue-900",
      "noruega": "from-red-900 via-blue-900 to-red-900",
      "norway": "from-red-900 via-blue-900 to-red-900",
      "suecia": "from-blue-900 via-yellow-800 to-blue-900",
      "sweden": "from-blue-900 via-yellow-800 to-blue-900",
      "colombia": "from-yellow-800 via-blue-900 to-red-900",
      "vietnam": "from-red-900 via-red-800 to-yellow-900",
      "corea del sur": "from-blue-900 via-gray-800 to-red-900",
      "south korea": "from-blue-900 via-gray-800 to-red-900",
    };
    return gradients[countryName.toLowerCase()] || "from-gray-800 via-gray-700 to-gray-800";
  }
  
  // Formatea fechas de viaje
  export function formatTravelDates(startDate, endDate) {
    if (!startDate) return null;
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
  
    const options = { day: "numeric", month: "short", year: "numeric" };
    const startStr = start.toLocaleDateString("es-ES", options);
  
    if (!end) return startStr;
    if (start.getFullYear() === end.getFullYear()) {
      if (start.getMonth() === end.getMonth()) {
        return `${start.getDate()} - ${end.toLocaleDateString("es-ES", options)}`;
      }
      return `${start.toLocaleDateString("es-ES", { day: "numeric", month: "short" })} - ${end.toLocaleDateString("es-ES", options)}`;
    }
    return `${startStr} - ${end.toLocaleDateString("es-ES", options)}`;
  }