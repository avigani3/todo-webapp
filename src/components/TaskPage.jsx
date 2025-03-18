import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit2, User } from "lucide-react";

export default function TaskPage() {
    const { taskId } = useParams();
    const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem("tasks")) || []);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState(tasks[taskId]?.text || "");
  
    const updateTask = () => {
      const updatedTasks = [...tasks];
      updatedTasks[taskId].text = editedTask;
      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      setIsEditing(false);
    };
  
    const toggleTaskCompletion = () => {
      const updatedTasks = [...tasks];
      updatedTasks[taskId].completed = !updatedTasks[taskId].completed;
      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    };
  
    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        updateTask();
      }
    };
  
    return (
      <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow-lg relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Task {taskId}</h2>
          <Button variant="ghost" onClick={() => setIsEditing(true)}>
            <Edit2 className="w-4 h-4 text-blue-500" />
          </Button>
        </div>
        {isEditing ? (
          <div className="flex space-x-2 mb-4">
            <Input
              type="text"
              value={editedTask}
              onChange={(e) => setEditedTask(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button onClick={updateTask}>Salva</Button>
          </div>
        ) : (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={tasks[taskId]?.completed}
              onChange={toggleTaskCompletion}
            />
            <p className={tasks[taskId]?.completed ? "line-through ml-2" : "ml-2"}>{editedTask}</p>
          </div>
        )}
      </div>
    );
  }
  