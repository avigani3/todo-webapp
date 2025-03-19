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
    setTasks([...tasks, ...data]);
    setTask("");
  };

  // gestione rimozione task
  const removeTask = async (index) => {
    const taskToRemove = tasks[index];
    const { error } = await supabase.from('TodoList').delete().eq('id', taskToRemove.id);
    if (error) {
      console.error('Error removing task:', error);
      return;
    }
    setTasks(tasks.filter((_, i) => i !== index));
  };

  // gestione aggiornamento task
  const toggleTaskCompletion = async (index) => {
    const updatedTasks = [...tasks];
    const taskToUpdate = updatedTasks[index];
    const { data, error } = await supabase.from('TodoList').update({ completed: !taskToUpdate.completed }).eq('id', taskToUpdate.id);
    if (error) {
      console.error('Error updating task:', error);
      return;
    }
    updatedTasks[index].completed = !taskToUpdate.completed;
    setTasks(updatedTasks);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  const goToTaskPage = (index) => {
    navigate(`/task/${index}`);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const filteredTasks = tasks
  .map((t, index) => ({ ...t, originalIndex: index })) // Salviamo l'indice originale
  .filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
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
            <TabsTrigger value="all" onClick={() => handleFilterChange("all")}>Tutti</TabsTrigger>
            <TabsTrigger value="incomplete" onClick={() => handleFilterChange("incomplete")}>Incompleti</TabsTrigger>
            <TabsTrigger value="completed" onClick={() => handleFilterChange("completed")}>Completati</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div>
        {filteredTasks.length === 0 ? (
          <p className="text-center text-gray-500">Nessun task</p>
        ) : (
          filteredTasks.map((t) => (
            <Card key={t.originalIndex} className="mb-2 flex-row justify-between p-2 items-center cursor-pointer" onClick={() => goToTaskPage(t.originalIndex)}>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleTaskCompletion(t.originalIndex);
                  }}
                  onClick={(e) => e.stopPropagation()} // Prevent navigation on checkbox click
                />
                <CardContent className={t.completed ? "line-through" : ""}>{t.text}</CardContent>
              </div>
              <Button variant="ghost" onClick={(e) => { e.stopPropagation(); removeTask(t.originalIndex); }}>
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
