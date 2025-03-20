import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function SignInForm() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signIn(email, password);
      navigate("/"); // Dopo il login, va alla homepage
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow-lg">
    <form onSubmit={handleSignIn}>
      <h2 className="text-xl font-bold mb-4 text-center">Accedi</h2>
      {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
      <Input className="mb-4" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Input className="mb-4" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Caricamento..." : "Accedi"}
      </Button>
      <p className="text-center mt-4 text-sm">
        Non hai un account? <Link to="/signup" className="text-blue-500">Registrati</Link>
      </p>
    </form>
    </div>
  );
}

