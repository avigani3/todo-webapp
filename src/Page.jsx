
import { useState, useEffect } from 'react'
import supabase from './supabase-client.js'

function Page() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    async function getTodos() {
      const { data: todos, error } = await supabase.from('TodoList').select('*');
      
      if (error) {
        console.error('Error fetching todos:', error);
        return;
      }
      else {
        setTodos(todos);
        console.log(todos);
      }
    }

    getTodos();
  }, []);

  return (
    <div>
      <ul>
      {todos.map((todo, index) => (
        <div key={index} className='bg-gray-200 p-2 m-2'>
        <li>{todo.text}</li>
        <li>{todo.completed ? 'Completed' : 'Not Completed'}</li>
        </div>
      ))}
      </ul>
    </div>
    );
}

export default Page;

