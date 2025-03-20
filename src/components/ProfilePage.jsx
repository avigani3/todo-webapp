import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/AuthContext";

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/signin"); // Se non è autenticato, va al login
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/signin");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Profilo Utente</h2>

      {loading ? (
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-4">
            <p className="text-lg font-semibold">Email: {user.email}</p>
            <Button className="mt-4 w-full" onClick={handleLogout}>
              Esci
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
