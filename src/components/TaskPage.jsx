import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import supabase from "../utils/supabase-client.js";
import { useAuth } from "../context/AuthContext.jsx"; // Importa il contesto utente
import { Textarea } from "./ui/textarea.jsx";

export default function TaskPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // Ottieni l'utente loggato
  const [task, setTask] = useState(null);
  const [newText, setNewText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // Stato per eventuali errori
  const [successMessage, setSuccessMessage] = useState(""); 

  // Carica il task dal database
  useEffect(() => {
    async function fetchTask() {
      if (!user) return; // Non caricare nulla se l'utente non è autenticato
      setLoading(true);

      const { data, error } = await supabase
        .from("TodoList")
        .select("*")
        .eq("id", taskId)
        .eq("user_id", user.id) // Assicura che il task appartenga all'utente
        .single();

      if (error || !data) {
        console.error("Errore nel recupero del task:", error);
        setError("Task non trovato");
      } else {
        setTask(data);
        setNewText(data.text);
      }

      setLoading(false);
    }

    fetchTask();
  }, [taskId, user]);

  // Funzione per aggiornare il task
  const updateTask = async () => {
    if (!task) return;

    const { error } = await supabase
      .from("TodoList")
      .update({ text: newText })
      .eq("id", taskId)
      .eq("user_id", user.id); // Verifica che l'utente possa modificarlo

    if (error) {
      console.error("Errore nell'aggiornamento:", error);
      setError("Errore nel salvataggio. Riprova.");
    } else {
      setTask((prev) => ({ ...prev, text: newText }));
      setSuccessMessage("Salvato con successo!");
      setTimeout(() => setSuccessMessage(""), 2000);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Dettagli Task</h2>

      {loading ? (
        <Skeleton className="h-[200px] w-full mb-4" />
      ) : error ? (
        <p className="text-red-600 text-center">{error}</p>
      ) : (
        <>
          <Textarea
            value={newText}
            className="w-full p-2 border rounded-md resize-none overflow-hidden"
            style={{ minHeight: "200px" }} // Altezza minima
            onChange={(e) => setNewText(e.target.value)}
          />
          {successMessage && (
            <p className="text-green-600 text-sm mt-2">{successMessage}</p>
          )}
          <div className="flex justify-between mt-4">
            <Button onClick={updateTask}>Salva</Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              Torna indietro
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
