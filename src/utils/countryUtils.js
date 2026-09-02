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
    "slovenia": "🇸🇮", "eslovenia": "🇸🇮",
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
    "eslovenia": "from-blue-900 via-white to-red-900",
    "slovenia": "from-blue-900 via-white to-red-900",
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

export function getCountryCoordinates(countryName) {
  const coords = {
    "españa": [40.4168, -3.7038], "spain": [40.4168, -3.7038],
    "japón": [35.6762, 139.6503], "japan": [35.6762, 139.6503],
    "francia": [48.8566, 2.3522], "france": [48.8566, 2.3522],
    "italia": [41.9028, 12.4964], "italy": [41.9028, 12.4964],
    "alemania": [52.5200, 13.4050], "germany": [52.5200, 13.4050],
    "portugal": [38.7169, -9.1399],
    "estados unidos": [37.0902, -95.7129], "usa": [37.0902, -95.7129],
    "reino unido": [51.5074, -0.1278], "uk": [51.5074, -0.1278],
    "méxico": [19.4326, -99.1332], "mexico": [19.4326, -99.1332],
    "argentina": [-34.6037, -58.3816],
    "brasil": [-15.7801, -47.9292], "brazil": [-15.7801, -47.9292],
    "china": [39.9042, 116.4074],
    "india": [28.6139, 77.2090],
    "australia": [-35.2809, 149.1300],
    "canadá": [45.4215, -75.6972], "canada": [45.4215, -75.6972],
    "grecia": [37.9838, 23.7275], "greece": [37.9838, 23.7275],
    "turquía": [39.9334, 32.8597], "turkey": [39.9334, 32.8597],
    "tailandia": [13.7563, 100.5018], "thailand": [13.7563, 100.5018],
    "holanda": [52.3676, 4.9041], "netherlands": [52.3676, 4.9041],
    "suiza": [46.9481, 7.4474], "switzerland": [46.9481, 7.4474],
    "austria": [48.2082, 16.3738],
    "bélgica": [50.8503, 4.3517], "belgium": [50.8503, 4.3517],
    "suecia": [59.3293, 18.0686], "sweden": [59.3293, 18.0686],
    "noruega": [59.9139, 10.7522], "norway": [59.9139, 10.7522],
    "dinamarca": [55.6761, 12.5683], "denmark": [55.6761, 12.5683],
    "finlandia": [60.1699, 24.9384], "finland": [60.1699, 24.9384],
    "polonia": [52.2297, 21.0122], "poland": [52.2297, 21.0122],
    "república checa": [50.0755, 14.4378], "czech republic": [50.0755, 14.4378],
    "hungría": [47.4979, 19.0402], "hungary": [47.4979, 19.0402],
    "croacia": [45.8150, 15.9819], "croatia": [45.8150, 15.9819],
    "eslovenia": [46.0569, 14.5058], "slovenia": [46.0569, 14.5058],
    "marruecos": [33.9716, -6.8498], "morocco": [33.9716, -6.8498],
    "egipto": [30.0444, 31.2357], "egypt": [30.0444, 31.2357],
    "sudáfrica": [-25.7461, 28.1881], "south africa": [-25.7461, 28.1881],
    "kenya": [-1.2921, 36.8219],
    "colombia": [4.7110, -74.0721],
    "perú": [-12.0464, -77.0428], "peru": [-12.0464, -77.0428],
    "chile": [-33.4489, -70.6693],
    "vietnam": [21.0285, 105.8542],
    "indonesia": [-6.2088, 106.8456],
    "filipinas": [14.5995, 120.9842], "philippines": [14.5995, 120.9842],
    "singapur": [1.3521, 103.8198], "singapore": [1.3521, 103.8198],
    "corea del sur": [37.5665, 126.9780], "south korea": [37.5665, 126.9780],
    "taiwán": [25.0330, 121.5654], "taiwan": [25.0330, 121.5654],
    "nueva zelanda": [-41.2865, 174.7762], "new zealand": [-41.2865, 174.7762],
    "irlanda": [53.3498, -6.2603], "ireland": [53.3498, -6.2603],
    "islandia": [64.1355, -21.8954], "iceland": [64.1355, -21.8954],
    "rusia": [55.7558, 37.6173], "russia": [55.7558, 37.6173],
    "cuba": [23.1136, -82.3666],
    "república dominicana": [18.4861, -69.9312],
  };
  return coords[countryName.toLowerCase()] || null;
}