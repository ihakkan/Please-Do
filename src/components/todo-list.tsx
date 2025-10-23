"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TodoItem } from "./todo-item";
import { Separator } from "./ui/separator";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const LOCAL_STORAGE_KEY = "pleaseDoTodos";

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    try {
      const storedTodos = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      }
    } catch (error) {
      console.error("Failed to parse todos from localStorage:", error);
      setTodos([]);
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
      } catch (error) {
        console.error("Failed to save todos to localStorage:", error);
      }
    }
  }, [todos, isMounted]);

  const handleAddTodo = (e: FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      setTodos([
        ...todos,
        {
          id: crypto.randomUUID(),
          text: newTodoText.trim(),
          completed: false,
        },
      ]);
      setNewTodoText("");
    }
  };

  const handleToggleComplete = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleEditTodo = (id: string, newText: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  };

  const completedCount = todos.filter(t => t.completed).length;
  const pendingCount = todos.length - completedCount;

  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-4xl font-headline font-bold text-center">
          Please Do
        </CardTitle>
        <CardDescription className="text-center">
          A simple and beautiful way to manage your tasks.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddTodo} className="flex gap-2 mb-6">
          <Input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="What needs to be done?"
            aria-label="New todo input"
            className="text-base"
          />
          <Button type="submit" aria-label="Add todo">
            <Plus className="h-5 w-5" />
          </Button>
        </form>
        
        <Separator className="my-4" />

        <div>
          {todos.length > 0 ? (
            todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggleComplete}
                onDelete={handleDeleteTodo}
                onEdit={handleEditTodo}
              />
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Your task list is empty. Add a task to get started!
            </p>
          )}
        </div>
      </CardContent>
      {todos.length > 0 && (
        <CardFooter className="text-sm text-muted-foreground justify-between">
           <span>{pendingCount} pending</span>
           <span>{completedCount} completed</span>
        </CardFooter>
      )}
    </Card>
  );
}
