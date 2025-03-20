import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function SignUpForm() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signUp(email, password);
      navigate("/"); // Dopo la registrazione, va alla homepage
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="max-w-md mx-auto p-4 border rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Registrati</h2>
      {error && <p className="text-red-500">{error}</p>}
      <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <Button type="submit" disabled={loading} className="w-full mt-4">
        {loading ? "Caricamento..." : "Registrati"}
      </Button>
      <p className="text-center mt-2 text-sm">
        Hai già un account? <Link to="/signin" className="text-blue-500">Accedi</Link>
      </p>
    </form>
  );
}
