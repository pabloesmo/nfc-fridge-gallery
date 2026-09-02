import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

function EditMagnetModal({ magnet, onClose, onSave }) {
  const [form, setForm] = useState({
    country: magnet.country || "",
    city: magnet.city || "",
    startDate: magnet.startDate || "",
    endDate: magnet.endDate || "",
  });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!form.country || !form.city) return;
    setSaving(true);
    try {
      const docRef = doc(db, "magnets", magnet.id);
      await updateDoc(docRef, {
        country: form.country,
        city: form.city,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
      });
      onSave({ ...magnet, ...form });
      onClose();
    } catch (err) {
      console.error("Error guardando:", err);
      alert("Error al guardar. Revisa la consola.");
    } finally {
      setSaving(false);
    }
  }

  // Cierra al hacer click fuera del modal
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-700">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-lg">Editar álbum</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none transition"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm block mb-1">País</label>
            <input
              type="text"
              value={form.country}
              onChange={e => setForm(prev => ({ ...prev, country: e.target.value }))}
              className="w-full bg-gray-700 text-white rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Japón"
              autoComplete="off"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm block mb-1">Ciudad</label>
            <input
              type="text"
              value={form.city}
              onChange={e => setForm(prev => ({ ...prev, city: e.target.value }))}
              className="w-full bg-gray-700 text-white rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Tokio"
              autoComplete="off"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm block mb-1">Fecha de inicio del viaje</label>
            <input
              type="date"
              value={form.startDate}
              onChange={e => setForm(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full bg-gray-700 text-white rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm block mb-1">Fecha de fin del viaje</label>
            <input
              type="date"
              value={form.endDate}
              onChange={e => setForm(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full bg-gray-700 text-white rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={saving || !form.country || !form.city}
            className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-2 rounded-xl text-sm font-medium transition"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-xl text-sm transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditMagnetModal;