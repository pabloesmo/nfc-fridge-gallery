import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";
import { useParams, useNavigate } from "react-router-dom";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "../cloudinary";

function AdminMagnetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [magnet, setMagnet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    loadMagnet();
  }, [id]);

  async function loadMagnet() {
    try {
      const docRef = doc(db, "magnets", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setMagnet({ id: docSnap.id, ...docSnap.data() });
      } else {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      console.error("Error cargando imán:", err);
    } finally {
      setLoading(false);
    }
  }

  async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", `nfc-fridge-gallery/${id}`);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );

    if (!response.ok) throw new Error("Error subiendo imagen");
    return await response.json();
  }

  async function handleFileChange(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const newPhotos = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const result = await uploadToCloudinary(file);
        newPhotos.push({
          url: result.secure_url,
          publicId: result.public_id,
          uploadedAt: new Date().toISOString()
        });
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }

      // Guardar en Firestore
      const docRef = doc(db, "magnets", id);
      await updateDoc(docRef, {
        photos: arrayUnion(...newPhotos)
      });

      // Actualizar estado local
      setMagnet(prev => ({
        ...prev,
        photos: [...(prev.photos || []), ...newPhotos]
      }));

    } catch (err) {
      console.error("Error subiendo fotos:", err);
      alert("Error al subir algunas fotos. Inténtalo de nuevo.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
      e.target.value = "";
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="text-gray-400 hover:text-white transition"
        >
          ← Volver
        </button>
        <div>
          <h1 className="font-bold text-lg">{magnet.city}</h1>
          <p className="text-gray-400 text-sm">{magnet.country}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Info del chip NFC */}
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700 mb-6">
          <h2 className="font-semibold mb-2">URL para el chip NFC</h2>
          <p className="text-gray-400 text-sm mb-2">
            Programa esta URL en tu chip NFC:
          </p>
          <div className="bg-gray-900 rounded-xl px-4 py-3 font-mono text-sm text-blue-400 break-all">
            {window.location.origin}/magnet/{id}
          </div>
        </div>

        {/* Subir fotos */}
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700 mb-6">
          <h2 className="font-semibold mb-4">Subir fotos</h2>

          <label className="block w-full border-2 border-dashed border-gray-600 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-500 transition">
            <div className="text-4xl mb-2">📷</div>
            <p className="text-gray-400 text-sm">
              Haz click para seleccionar fotos
            </p>
            <p className="text-gray-600 text-xs mt-1">
              Puedes seleccionar varias a la vez
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>

          {uploading && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Subiendo fotos...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Galería */}
        <div>
          <h2 className="font-semibold mb-4">
            Fotos ({magnet.photos?.length || 0})
          </h2>

          {!magnet.photos?.length ? (
            <div className="text-center py-12 text-gray-500">
              <p>No hay fotos todavía</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {magnet.photos.map((photo, index) => (
                <div key={index} className="aspect-square rounded-xl overflow-hidden bg-gray-800">
                  <img
                    src={photo.url}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminMagnetDetail;