import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useParams } from "react-router-dom";
import WorldMap from "../components/WorldMap";

function LockedModal({ magnet, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-2xl p-6 max-w-sm w-full text-center border border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-5xl mb-3">🔒</div>
        <h2 className="text-white font-bold text-lg mb-2">{magnet.city}</h2>
        <p className="text-gray-400 text-sm mb-4">
          Este álbum está bloqueado. Busca el imán de <strong className="text-white">{magnet.city}</strong> en la nevera y escanéalo con tu móvil para verlo.
        </p>
        <button
          onClick={onClose}
          className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-xl text-sm transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

function Lightbox({ photos, initialIndex, onClose }) {
  const [current, setCurrent] = useState(initialIndex);

  function prev() { setCurrent(i => (i === 0 ? photos.length - 1 : i - 1)); }
  function next() { setCurrent(i => (i === photos.length - 1 ? 0 : i + 1)); }

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
      <button onClick={onClose} className="absolute top-4 right-4 text-white text-3xl z-10">×</button>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
        {current + 1} / {photos.length}
      </div>
      <button onClick={prev} className="absolute left-4 text-white text-4xl p-2">‹</button>
      <img
        src={photos[current].url}
        alt=""
        className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
      />
      <button onClick={next} className="absolute right-4 text-white text-4xl p-2">›</button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] px-2">
        {photos.map((photo, i) => (
          <img
            key={i}
            src={photo.url}
            alt=""
            onClick={() => setCurrent(i)}
            className={`w-12 h-12 object-cover rounded-lg cursor-pointer flex-shrink-0 transition ${
              i === current ? "ring-2 ring-white opacity-100" : "opacity-50 hover:opacity-80"
            }`}
          />
        ))}
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

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      // Carga el imán actual
      const docRef = doc(db, "magnets", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setMagnet({ id: docSnap.id, ...docSnap.data() });
      }

      // Carga todos los imanes para el mapa
      const snapshot = await getDocs(collection(db, "magnets"));
      const all = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setAllMagnets(all);
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400">Cargando...</p>
      </div>
    );
  }

  if (!magnet) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-5xl mb-4">🧲</div>
          <h1 className="text-xl font-bold mb-2">Imán no encontrado</h1>
          <p className="text-gray-400 text-sm">Este chip NFC no está registrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="px-6 py-8 text-center">
        <div className="text-5xl mb-3">📍</div>
        <h1 className="text-3xl font-bold">{magnet.city}</h1>
        <p className="text-gray-400 mt-1">{magnet.country}</p>
        <p className="text-gray-500 text-sm mt-3">{magnet.photos?.length || 0} fotos</p>
      </div>

      {/* Toggle mapa */}
      <div className="px-4 mb-4 flex justify-center">
        <button
          onClick={() => setShowMap(v => !v)}
          className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition"
        >
          {showMap ? "🖼️ Ver fotos" : "🗺️ Ver mapa de viajes"}
        </button>
      </div>

      {/* Mapa */}
      {showMap && (
        <div className="px-4 mb-6">
          <WorldMap
            magnets={allMagnets}
            unlockedId={id}
            isAdmin={false}
            onUnlockedClick={() => setShowMap(false)}
            onLockedClick={setLockedMagnet}
          />
          <p className="text-gray-500 text-xs text-center mt-2">
            Escanea los imanes de la nevera para desbloquear más álbumes
          </p>
        </div>
      )}

      {/* Galería */}
      {!showMap && (
        <div className="px-4 pb-8">
          {!magnet.photos?.length ? (
            <div className="text-center py-12 text-gray-500">
              <p>Aún no hay fotos de este viaje</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {magnet.photos.map((photo, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-xl overflow-hidden bg-gray-800 cursor-pointer"
                  onClick={() => setSelectedPhoto(index)}
                >
                  <img
                    src={photo.url}
                    alt=""
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          )}
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

      {/* Modal álbum bloqueado */}
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