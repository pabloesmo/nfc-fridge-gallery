import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getCountryFlag, getCountryGradient, formatTravelDates } from "../utils/countryUtils";
import EditMagnetModal from "../components/EditMagnetModal";
import WorldMap from "../components/WorldMap";

function MagnetCard({ magnet, onEdit, onClick }) {
  const flag = getCountryFlag(magnet.country);
  const gradient = getCountryGradient(magnet.country);
  const dates = formatTravelDates(magnet.startDate, magnet.endDate);

  function handleEditClick(e) {
    e.stopPropagation();
    e.preventDefault();
    onEdit(magnet);
  }

  return (
    <div
      className="relative rounded-2xl overflow-hidden cursor-pointer group border border-gray-700 hover:border-gray-500 transition-all duration-300 hover:scale-[1.02]"
      style={{ minHeight: "200px" }}
      onClick={onClick}
    >
      {/* Fondo: portada o degradado */}
      {magnet.coverPhoto ? (
        <>
          <img
            src={magnet.coverPhoto.url}
            alt="Portada"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-80`} />
        </>
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      )}

      {/* Botón editar — separado del onClick de la tarjeta */}
      <div className="absolute top-3 right-3 z-20">
        <button
          type="button"
          onClickCapture={handleEditClick}
          className="bg-black bg-opacity-50 hover:bg-opacity-80 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition"
        >
          ✏️ Editar
        </button>
      </div>

      {/* Contenido */}
      <div className="relative z-10 p-5 flex flex-col justify-between h-full" style={{ minHeight: "200px" }}>
        <div className="text-4xl">{flag}</div>
        <div>
          <h3 className="text-white font-bold text-xl leading-tight">{magnet.city}</h3>
          <p className="text-white text-opacity-80 text-sm">{magnet.country}</p>
          {dates && (
            <p className="text-white text-opacity-60 text-xs mt-1">📅 {dates}</p>
          )}
          <p className="text-white text-opacity-50 text-xs mt-2">
            {magnet.photos?.length || 0} fotos
          </p>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [magnets, setMagnets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMagnet, setEditingMagnet] = useState(null);
  const [newMagnet, setNewMagnet] = useState({ country: "", city: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadMagnets();
  }, []);

  async function loadMagnets() {
    try {
      const snapshot = await getDocs(collection(db, "magnets"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMagnets(data);
    } catch (err) {
      console.error("Error cargando imanes:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateMagnet() {
    if (!newMagnet.country || !newMagnet.city) return;
    setSaving(true);
    try {
      const docRef = await addDoc(collection(db, "magnets"), {
        country: newMagnet.country,
        city: newMagnet.city,
        photos: [],
        createdAt: serverTimestamp()
      });
      setMagnets(prev => [...prev, { id: docRef.id, ...newMagnet, photos: [] }]);
      setNewMagnet({ country: "", city: "" });
      setShowForm(false);
    } catch (err) {
      console.error("Error creando imán:", err);
    } finally {
      setSaving(false);
    }
  }

  function handleSaveEdit(updated) {
    setMagnets(prev => prev.map(m => m.id === updated.id ? updated : m));
  }

  async function handleLogout() {
    await signOut(auth);
    navigate("/admin");
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🧲</span>
          <h1 className="text-xl font-bold">NFC Fridge Gallery</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm hidden sm:block">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-400 hover:text-red-300 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            Mis viajes
            <span className="text-gray-500 text-sm font-normal ml-2">
              ({magnets.length})
            </span>
          </h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
          >
            + Nuevo viaje
          </button>
        </div>

        {/* Formulario nuevo imán */}
        {showForm && (
          <div className="bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-700">
            <h3 className="font-semibold mb-4">Nuevo viaje</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">País</label>
                <input
                  type="text"
                  placeholder="Ej: Japón"
                  value={newMagnet.country}
                  onChange={e => setNewMagnet(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full bg-gray-700 text-white rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Ciudad</label>
                <input
                  type="text"
                  placeholder="Ej: Tokio"
                  value={newMagnet.city}
                  onChange={e => setNewMagnet(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full bg-gray-700 text-white rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCreateMagnet}
                disabled={saving || !newMagnet.country || !newMagnet.city}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
              >
                {saving ? "Guardando..." : "Crear viaje"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-white px-4 py-2 rounded-xl text-sm transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Mapa mundial */}
        {magnets.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">🗺️ Mapa de viajes</h2>
            <WorldMap
              magnets={magnets}
              unlockedId={null}
              isAdmin={true}
              onUnlockedClick={magnet => navigate(`/admin/magnet/${magnet.id}`)}
              onLockedClick={() => {}}
            />
          </div>
        )}

        {/* Lista de álbumes */}
        {loading ? (
          <p className="text-gray-400">Cargando...</p>
        ) : magnets.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <div className="text-5xl mb-4">🧲</div>
            <p>No hay viajes todavía</p>
            <p className="text-sm mt-1">Crea tu primer viaje con el botón de arriba</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {magnets.map(magnet => (
              <MagnetCard
                key={magnet.id}
                magnet={magnet}
                onEdit={setEditingMagnet}
                onClick={() => navigate(`/admin/magnet/${magnet.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal edición */}
      {editingMagnet && (
        <EditMagnetModal
          magnet={editingMagnet}
          onClose={() => setEditingMagnet(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}

export default AdminDashboard;