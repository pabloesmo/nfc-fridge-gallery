import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminLogin() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // 👇 Movido a useEffect, ya no se llama durante el render
  useEffect(() => {
    if (user) {
      navigate("/admin/dashboard");
    }
  }, [user]);

  async function handleGoogleLogin() {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Error al iniciar sesión. Inténtalo de nuevo.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-10 rounded-2xl shadow-xl text-center max-w-sm w-full">
        <div className="text-6xl mb-4">🧲</div>
        <h1 className="text-2xl font-bold text-white mb-2">NFC Fridge Gallery</h1>
        <p className="text-gray-400 mb-8">Panel de administración</p>

        {error && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white text-gray-800 font-semibold py-3 px-6 rounded-xl hover:bg-gray-100 transition flex items-center justify-center gap-3"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-5 h-5"
          />
          Entrar con Google
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;