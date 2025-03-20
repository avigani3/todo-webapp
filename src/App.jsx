import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Edit2, User } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FilterProvider, useFilter } from "./context/FilterContext";
import Navbar from "@/components/Navbar";
import TaskPage from "@/components/TaskPage";
import ProfilePage from "@/components/ProfilePage";
import supabase from "./utils/supabase-client.js";
import SignUpForm from "@/components/SignUpForm";
import SignInForm from "./components/SignInForm";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Skeleton } from "./components/ui/skeleton";

function TodoApp() {
  const { user } = useAuth(); // Recupera l'utente autenticato
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(true);
  const { filter, setFilter } = useFilter();
  const navigate = useNavigate();

  // Recupera i task dell'utente loggato
  useEffect(() => {
    async function getTasks() {
      if (!user) return;
      setLoading(true);
      const { data: tasks, error } = await supabase
        .from("TodoList")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Errore nel recupero dei task:", error);
      } else {
        setTasks(tasks);
      }
      setLoading(false);
    }

    getTasks();
  }, [user]);

  // Aggiungi un task con user_id
  const addTask = async () => {
    if (task.trim() === "" || !user) return;
    const { data, error } = await supabase
      .from("TodoList")
      .insert([{ text: task, completed: false, user_id: user.id }])
      .select();

    if (error) {
      console.error("Errore nell'aggiunta del task:", error);
    } else {
      setTasks([...tasks, ...data]);
      setTask("");
    }
  };

  // Rimuovi un task
  const removeTask = async (id) => {
    const { error } = await supabase.from("TodoList").delete().eq("id", id);
    if (error) {
      console.error("Errore nella rimozione del task:", error);
    } else {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  // Aggiorna il completamento del task
  const toggleTaskCompletion = async (id) => {
    const taskToUpdate = tasks.find((task) => task.id === id);
    const { error } = await supabase
      .from("TodoList")
      .update({ completed: !taskToUpdate.completed })
      .eq("id", id);

    if (error) {
      console.error("Errore nell'aggiornamento del task:", error);
    } else {
      setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
    }
  };

  const goToTaskPage = (id) => navigate(`/task/${id}`);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") addTask();
  };

  // Filtraggio task
  const filteredTasks = tasks.filter((t) =>
    filter === "completed" ? t.completed : filter === "notCompleted" ? !t.completed : true
  );

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Todo App</h2>
      
      <div className="flex space-x-2 mb-4">
        <Input type="text" value={task} onChange={(e) => setTask(e.target.value)} onKeyPress={handleKeyPress} placeholder="Aggiungi un task" />
        <Button onClick={addTask}>Aggiungi</Button>
      </div>

      <Tabs defaultValue={filter}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" onClick={() => setFilter("all")}>Tutti</TabsTrigger>
          <TabsTrigger value="notCompleted" onClick={() => setFilter("notCompleted")}>Incompleti</TabsTrigger>
          <TabsTrigger value="completed" onClick={() => setFilter("completed")}>Completati</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-4">
        {loading ? (
          // Skeleton mentre carica i dati
          <div className="flex flex-col space-y-2">
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <p className="text-center text-gray-500">Nessun task</p>
        ) : (
          filteredTasks.map((t) => (
            <Card key={t.id} className="mb-2 flex-row justify-between p-2 items-center cursor-pointer" onClick={() => goToTaskPage(t.id)}>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleTaskCompletion(t.id);
                  }}
                  onClick={(e) => e.stopPropagation()} // Evita navigazione
                />
                <CardContent className={t.completed ? "line-through" : ""}>
                  {t.text.length > 30 ? `${t.text.slice(0, 30)}...` : t.text}
                </CardContent>
              </div>
              <Button variant="ghost" onClick={(e) => { e.stopPropagation(); removeTask(t.id); }}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function PrivateRoute({ element }) {
  const { user, loading } = useAuth();
  
  if (loading) return <p>Loading...</p>; // Evita il redirect prima che il controllo sia completato
  return user ? element : <Navigate to="/signin" />;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <Routes>
      <Route path="/" element={user ? <TodoApp /> : <Navigate to="/signin" />} />
      <Route path="/task/:taskId" element={<PrivateRoute element={<TaskPage />} />} />
      <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
      <Route path="/signup" element={<SignUpForm />} />
      <Route path="/signin" element={<SignInForm />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <FilterProvider>
          <Router>
            <Navbar />
            <AppRoutes />
          </Router>
        </FilterProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

