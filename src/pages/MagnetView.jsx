import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useParams } from "react-router-dom";

function MagnetView() {
  const { id } = useParams();
  const [magnet, setMagnet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    loadMagnet();
  }, [id]);

  async function loadMagnet() {
    try {
      const docRef = doc(db, "magnets", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setMagnet({ id: docSnap.id, ...docSnap.data() });
      }
    } catch (err) {
      console.error("Error cargando imán:", err);
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
        <p className="text-gray-500 text-sm mt-3">
          {magnet.photos?.length || 0} fotos
        </p>
      </div>

      {/* Galería */}
      {!magnet.photos?.length ? (
        <div className="text-center py-12 text-gray-500">
          <p>Aún no hay fotos de este viaje</p>
        </div>
      ) : (
        <div className="px-4 pb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {magnet.photos.map((photo, index) => (
              <div
                key={index}
                className="aspect-square rounded-xl overflow-hidden bg-gray-800 cursor-pointer"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img
                  src={photo.url}
                  alt={`Foto ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <img
            src={selectedPhoto.url}
            alt="Foto ampliada"
            className="max-w-full max-h-full object-contain rounded-xl"
          />
          <button
            className="absolute top-4 right-4 text-white text-3xl leading-none"
            onClick={() => setSelectedPhoto(null)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

export default MagnetView;