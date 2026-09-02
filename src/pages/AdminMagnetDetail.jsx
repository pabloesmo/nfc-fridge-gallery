import { useState, useEffect, useCallback } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useParams, useNavigate } from "react-router-dom";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "../cloudinary";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Componente de foto individual con drag & drop
function SortablePhoto({ photo, index, onDelete, onSetCover, onOpen, isCover }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: photo.publicId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group aspect-square rounded-xl overflow-hidden bg-gray-800"
    >
      {/* Imagen */}
      <img
        src={photo.url}
        alt={`Foto ${index + 1}`}
        className="w-full h-full object-cover cursor-pointer"
        onClick={() => onOpen(index)}
      />

      {/* Handle drag */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 bg-black bg-opacity-50 rounded-lg p-1 cursor-grab opacity-0 group-hover:opacity-100 transition"
        title="Arrastrar para reordenar"
      >
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </div>

      {/* Badge portada */}
      {isCover && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
          ⭐ Portada
        </div>
      )}

      {/* Botones acción */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 opacity-0 group-hover:opacity-100 transition flex gap-2 justify-end">
        <button
          onClick={() => onSetCover(photo)}
          className="bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded-lg transition"
          title="Establecer como portada"
        >
          ⭐
        </button>
        <button
          onClick={() => onDelete(photo)}
          className="bg-red-600 hover:bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-lg transition"
          title="Eliminar foto"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

// Carrusel lightbox
function Lightbox({ photos, initialIndex, onClose }) {
  const [current, setCurrent] = useState(initialIndex);

  function prev() {
    setCurrent(i => (i === 0 ? photos.length - 1 : i - 1));
  }

  function next() {
    setCurrent(i => (i === photos.length - 1 ? 0 : i + 1));
  }

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
      {/* Cerrar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-3xl leading-none hover:text-gray-300 transition z-10"
      >
        ×
      </button>

      {/* Contador */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
        {current + 1} / {photos.length}
      </div>

      {/* Flecha izquierda */}
      <button
        onClick={prev}
        className="absolute left-4 text-white text-4xl hover:text-gray-300 transition p-2"
      >
        ‹
      </button>

      {/* Imagen */}
      <img
        src={photos[current].url}
        alt={`Foto ${current + 1}`}
        className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
      />

      {/* Flecha derecha */}
      <button
        onClick={next}
        className="absolute right-4 text-white text-4xl hover:text-gray-300 transition p-2"
      >
        ›
      </button>

      {/* Miniaturas */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] px-2">
        {photos.map((photo, i) => (
          <img
            key={i}
            src={photo.url}
            alt=""
            onClick={() => setCurrent(i)}
            className={`w-12 h-12 object-cover rounded-lg cursor-pointer flex-shrink-0 transition ${
              i === current
                ? "ring-2 ring-white opacity-100"
                : "opacity-50 hover:opacity-80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// Página principal
function AdminMagnetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [magnet, setMagnet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

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

  async function handleFiles(files) {
    if (!files.length) return;
    setUploading(true);
    setUploadProgress(0);

    try {
      const newPhotos = [];
      for (let i = 0; i < files.length; i++) {
        const result = await uploadToCloudinary(files[i]);
        newPhotos.push({
          url: result.secure_url,
          publicId: result.public_id,
          uploadedAt: new Date().toISOString()
        });
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }

      const updatedPhotos = [...(magnet.photos || []), ...newPhotos];
      const docRef = doc(db, "magnets", id);
      await updateDoc(docRef, { photos: updatedPhotos });
      setMagnet(prev => ({ ...prev, photos: updatedPhotos }));
    } catch (err) {
      console.error("Error subiendo fotos:", err);
      alert("Error al subir algunas fotos.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }

  async function handleDelete(photoToDelete) {
    if (!confirm("¿Eliminar esta foto?")) return;
    const updatedPhotos = magnet.photos.filter(
      p => p.publicId !== photoToDelete.publicId
    );
    const updates = { photos: updatedPhotos };
    if (magnet.coverPhoto?.publicId === photoToDelete.publicId) {
      updates.coverPhoto = null;
    }
    const docRef = doc(db, "magnets", id);
    await updateDoc(docRef, updates);
    setMagnet(prev => ({ ...prev, ...updates }));
  }

  async function handleSetCover(photo) {
    const docRef = doc(db, "magnets", id);
    await updateDoc(docRef, { coverPhoto: photo });
    setMagnet(prev => ({ ...prev, coverPhoto: photo }));
  }

  async function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = magnet.photos.findIndex(p => p.publicId === active.id);
    const newIndex = magnet.photos.findIndex(p => p.publicId === over.id);
    const reordered = arrayMove(magnet.photos, oldIndex, newIndex);

    setMagnet(prev => ({ ...prev, photos: reordered }));
    const docRef = doc(db, "magnets", id);
    await updateDoc(docRef, { photos: reordered });
  }

  // Drag & drop desde el sistema de archivos
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(f =>
      f.type.startsWith("image/")
    );
    handleFiles(files);
  }, [magnet]);

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
        <div className="flex-1">
          <h1 className="font-bold text-lg">{magnet.city}</h1>
          <p className="text-gray-400 text-sm">{magnet.country}</p>
        </div>
        {magnet.coverPhoto && (
          <img
            src={magnet.coverPhoto.url}
            alt="Portada"
            className="w-10 h-10 rounded-lg object-cover ring-2 ring-yellow-500"
          />
        )}
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* URL NFC */}
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700 mb-6">
          <h2 className="font-semibold mb-2">URL para el chip NFC</h2>
          <div className="bg-gray-900 rounded-xl px-4 py-3 font-mono text-sm text-blue-400 break-all">
            {window.location.origin}/nfc-fridge-gallery/magnet/{id}
          </div>
        </div>

        {/* Zona de subida */}
        <div
          className={`rounded-2xl p-8 border-2 border-dashed mb-6 text-center transition ${
            isDragOver
              ? "border-blue-400 bg-blue-900 bg-opacity-20"
              : "border-gray-600 bg-gray-800"
          }`}
          onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
        >
          <div className="text-4xl mb-3">📷</div>
          <p className="text-white font-medium mb-1">
            Arrastra fotos aquí o selecciónalas
          </p>
          <p className="text-gray-500 text-sm mb-4">
            Puedes subir una carpeta entera o varias fotos a la vez
          </p>

          <div className="flex gap-3 justify-center flex-wrap">
            {/* Seleccionar archivos */}
            <label className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer">
              Seleccionar fotos
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={e => handleFiles(Array.from(e.target.files))}
                disabled={uploading}
              />
            </label>

            {/* Seleccionar carpeta entera */}
            <label className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer">
              Subir carpeta
              <input
                type="file"
                accept="image/*"
                multiple
                webkitdirectory=""
                className="hidden"
                onChange={e => handleFiles(Array.from(e.target.files))}
                disabled={uploading}
              />
            </label>
          </div>

          {uploading && (
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Subiendo fotos...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Galería */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">
            Fotos ({magnet.photos?.length || 0})
          </h2>
          {magnet.photos?.length > 0 && (
            <p className="text-gray-500 text-xs">
              Arrastra para reordenar · ⭐ para portada · 🗑️ para eliminar
            </p>
          )}
        </div>

        {!magnet.photos?.length ? (
          <div className="text-center py-12 text-gray-500">
            <p>No hay fotos todavía</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={magnet.photos.map(p => p.publicId)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {magnet.photos.map((photo, index) => (
                  <SortablePhoto
                    key={photo.publicId}
                    photo={photo}
                    index={index}
                    isCover={magnet.coverPhoto?.publicId === photo.publicId}
                    onDelete={handleDelete}
                    onSetCover={handleSetCover}
                    onOpen={setLightboxIndex}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          photos={magnet.photos}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}

export default AdminMagnetDetail;