import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useParams } from "react-router-dom";
import { getCountryFlag, getCountryGradient, formatTravelDates } from "../utils/countryUtils";
import WorldMap from "../components/WorldMap";

function LockedModal({ magnet, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-t-3xl p-6 w-full max-w-lg border-t border-gray-700 pb-10"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-gray-600 rounded-full mx-auto mb-5" />
        <div className="text-4xl text-center mb-3">🔒</div>
        <h2 className="text-white font-bold text-lg text-center mb-2">{magnet.city}</h2>
        <p className="text-gray-400 text-sm text-center mb-6">
          Busca el imán de <span className="text-white font-medium">{magnet.city}</span> en la nevera y escanéalo para desbloquear este álbum.
        </p>
        <button
          onClick={onClose}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-2xl text-sm font-medium transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

function Lightbox({ photos, initialIndex, onClose }) {
  const [current, setCurrent] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState(null);

  function prev() { setCurrent(i => (i === 0 ? photos.length - 1 : i - 1)); }
  function next() { setCurrent(i => (i === photos.length - 1 ? 0 : i + 1)); }

  // Soporte swipe en móvil
  function handleTouchStart(e) { setTouchStart(e.touches[0].clientX); }
  function handleTouchEnd(e) {
    if (!touchStart) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    setTouchStart(null);
  }

  useEffect(() => {
    // Bloquea el scroll de la página mientras el lightbox está abierto
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
  
    function handleKey(e) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
  
    return () => {
      // Restaura el scroll al cerrar
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black z-50 flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4">
        <button onClick={onClose} className="text-white text-sm bg-gray-800 px-3 py-1.5 rounded-full">
          ✕ Cerrar
        </button>
        <span className="text-gray-400 text-sm">{current + 1} / {photos.length}</span>
        <div className="w-16" />
      </div>

      {/* Imagen principal */}
      <div className="flex-1 flex items-center justify-center px-4">
        <img
          src={photos[current].url}
          alt=""
          className="max-w-full max-h-full object-contain rounded-2xl"
        />
      </div>

      {/* Miniaturas */}
      <div className="px-4 pb-10 pt-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {photos.map((photo, i) => (
            <img
              key={i}
              src={photo.url}
              alt=""
              onClick={() => setCurrent(i)}
              className={`w-14 h-14 object-cover rounded-xl cursor-pointer flex-shrink-0 transition ${
                i === current
                  ? "ring-2 ring-white opacity-100"
                  : "opacity-40 hover:opacity-70"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MagnetView() {
  const { id } = useParams();
  const [magnet, setMagnet] = useState(null);
  const [allMagnets, setAllMagnets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [lockedMagnet, setLockedMagnet] = useState(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => { loadData(); }, [id]);

  async function loadData() {
    try {
      const docRef = doc(db, "magnets", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setMagnet({ id: docSnap.id, ...docSnap.data() });

      const snapshot = await getDocs(collection(db, "magnets"));
      setAllMagnets(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse">🧲</div>
          <p className="text-gray-500 text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!magnet) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white px-6">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-xl font-bold mb-2">Imán no encontrado</h1>
          <p className="text-gray-500 text-sm">Este chip NFC no está registrado</p>
        </div>
      </div>
    );
  }

  const flag = getCountryFlag(magnet.country);
  const gradient = getCountryGradient(magnet.country);
  const dates = formatTravelDates(magnet.startDate, magnet.endDate);

  return (
    <div className="min-h-screen bg-gray-900 text-white">

      {/* Hero header */}
      <div className={`relative w-full bg-gradient-to-b ${gradient}`} style={{ minHeight: "260px" }}>
        {magnet.coverPhoto && (
          <>
            <img
              src={magnet.coverPhoto.url}
              alt="Portada"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-b ${gradient} opacity-75`} />
          </>
        )}

        {/* Contenido del header */}
        <div className="relative z-10 px-5 pt-14 pb-6 flex flex-col justify-end h-full" style={{ minHeight: "260px" }}>
          <div className="text-5xl mb-2">{flag}</div>
          <h1 className="text-3xl font-bold leading-tight">{magnet.city}</h1>
          <p className="text-white text-opacity-70 text-base">{magnet.country}</p>
          {dates && (
            <p className="text-white text-opacity-50 text-sm mt-1">📅 {dates}</p>
          )}
          <p className="text-white text-opacity-40 text-xs mt-1">
            {magnet.photos?.length || 0} fotos
          </p>
        </div>
      </div>

      {/* Barra de navegación */}
      <div className="flex border-b border-gray-800 bg-gray-900 sticky top-0 z-20">
        <button
          onClick={() => setShowMap(false)}
          className={`flex-1 py-3.5 text-sm font-medium transition ${
            !showMap ? "text-white border-b-2 border-white" : "text-gray-500"
          }`}
        >
          🖼️ Fotos
        </button>
        <button
          onClick={() => setShowMap(true)}
          className={`flex-1 py-3.5 text-sm font-medium transition ${
            showMap ? "text-white border-b-2 border-white" : "text-gray-500"
          }`}
        >
          🗺️ Mapa
        </button>
      </div>

      {/* Vista fotos */}
      {!showMap && (
        <div className="pb-10">
          {!magnet.photos?.length ? (
            <div className="text-center py-16 text-gray-600">
              <div className="text-4xl mb-3">📷</div>
              <p className="text-sm">Aún no hay fotos de este viaje</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-0.5 mt-0.5">
              {magnet.photos.map((photo, index) => (
                <div
                  key={index}
                  className="aspect-square bg-gray-800 cursor-pointer overflow-hidden"
                  onClick={() => setSelectedPhoto(index)}
                >
                  <img
                    src={photo.url}
                    alt=""
                    className="w-full h-full object-cover hover:opacity-90 active:opacity-70 transition"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Vista mapa */}
      {showMap && (
        <div className="px-4 py-4">
          <WorldMap
            magnets={allMagnets}
            unlockedId={id}
            isAdmin={false}
            onUnlockedClick={() => setShowMap(false)}
            onLockedClick={setLockedMagnet}
          />
          <p className="text-gray-600 text-xs text-center mt-3">
            Escanea los imanes de la nevera para desbloquear más álbumes
          </p>
        </div>
      )}

      {/* Lightbox */}
      {selectedPhoto !== null && (
        <Lightbox
          photos={magnet.photos}
          initialIndex={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}

      {/* Modal bloqueado */}
      {lockedMagnet && (
        <LockedModal
          magnet={lockedMagnet}
          onClose={() => setLockedMagnet(null)}
        />
      )}
    </div>
  );
}

export default MagnetView;