import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import supabase from "../supabase-client.js";

export default function TaskPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [newText, setNewText] = useState("");
  const [loading, setLoading] = useState(true); // Stato per il caricamento
  const [successMessage, setSuccessMessage] = useState(""); // Stato per il messaggio di conferma

  // Carica il task dal database
  useEffect(() => {
    async function fetchTask() {
      setLoading(true);
      const { data, error } = await supabase
        .from("TodoList")
        .select("*")
        .eq("id", taskId)
        .single();

      if (error) {
        console.error("Errore nel recupero del task:", error);
      } else {
        setTask(data);
        setNewText(data.text);
      }
      setLoading(false);
    }

    fetchTask();
  }, [taskId]);

  // Funzione per aggiornare il task
  const updateTask = async () => {
    const { error } = await supabase
      .from("TodoList")
      .update({ text: newText })
      .eq("id", taskId);

    if (error) {
      console.error("Errore nell'aggiornamento:", error);
    } else {
      setTask((prev) => ({ ...prev, text: newText }));
      setSuccessMessage("Salvato con successo");
      setTimeout(() => setSuccessMessage(""), 2000); // Nasconde il messaggio
    }
  };
  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Dettagli Task</h2>
      {loading ? (
        <Skeleton className="h-10 w-full mb-4" />
      ) : (
        <>
          <Input
            type="text"
            value={newText}
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
