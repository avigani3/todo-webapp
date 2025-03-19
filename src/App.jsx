import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Edit2, User } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FilterProvider, useFilter } from "./FilterContext";
import Navbar from "@/components/Navbar";
import TaskPage from "@/components/TaskPage";
import ProfilePage from "@/components/ProfilePage";
import supabase from "./supabase-client.js";

function TodoApp() {

  // gestione task
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  useEffect(() => {
    async function getTasks() {
      const { data: tasks, error } = await supabase.from('TodoList').select('*');
      
      if (error) {
        console.error('Error fetching tasks:', error);
        return;
      }
      else {
        setTasks(tasks);
        console.log(tasks);
      }
    }
    getTasks();
  }, []);
  
  // gestione filtro
  const { filter, setFilter } = useFilter(); // Usa il contesto per gestire il filtro
  const navigate = useNavigate();

  // gestione aggiunta task
  const addTask = async () => {
    if (task.trim() === "") return;
    const { data, error } = await supabase.from('TodoList').insert([{ text: task, completed: false }]).select();
    if (error) {
      console.error('Error adding task:', error);
      return;
    }
    else{
      setTasks([...tasks, ...data]);
      setTask("");
    }
  };

  // gestione rimozione task
  const removeTask = async (id) => {
    const { error } = await supabase.from('TodoList').delete().eq('id', id);
    if (error) {
      console.error('Error removing task:', error);
      return;
    }
    else{
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  // gestione aggiornamento task
  const toggleTaskCompletion = async (id) => {
    const taskToUpdate = tasks.find((task) => task.id === id);
    const { data, error } = await supabase.from('TodoList').update({ completed: !taskToUpdate.completed }).eq('id', id);
    if (error) {
      console.error('Error updating task:', error);
      return;
    } else {
      setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
    }
  };

  const goToTaskPage = (id) => {
    navigate(`/task/${id}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "notCompleted") return !task.completed;
    return true;
  });

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Todo App</h2>
      <div className="flex space-x-2 mb-4">
        <Input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Aggiungi un task"
        />
        <Button onClick={addTask}>Aggiungi</Button>
      </div>
      <div className="mb-4">
        <Tabs defaultValue={filter}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" onClick={() => setFilter("all")}>Tutti</TabsTrigger>
            <TabsTrigger value="notCompleted" onClick={() => setFilter("notCompleted")}>Incompleti</TabsTrigger>
            <TabsTrigger value="completed" onClick={() => setFilter("completed")}>Completati</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div>
        {filteredTasks.length === 0 ? (
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
                  onClick={(e) => e.stopPropagation()} // Prevent navigation on checkbox click
                />
                <CardContent className={t.completed ? "line-through" : ""}>{t.text}</CardContent>
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

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <FilterProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<TodoApp />} />
        <Route path="/task/:taskId" element={<TaskPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
    </FilterProvider>
    </ThemeProvider>
  );
}
