import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <Link to="/" className="text-lg font-bold">Todo App</Link>
      <div className="flex items-center gap-4">
        <Link to="/profile" className="text-lg">
          <Button variant="outline" size="icon">
            <User className="w-4 h-4" />
          </Button>
        </Link>
        <ModeToggle />
      </div>
    </nav>
  );
}