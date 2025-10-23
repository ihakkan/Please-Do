"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { TodoItem } from "./todo-item";
import { AddTodoForm } from "./add-todo-form";
import { TodoFilters } from "./todo-filters";
import { categories } from "@/lib/data";

export type Priority = "low" | "medium" | "high";
export type Category = "work" | "study" | "personal" | "fitness" | "other";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  createdAt: number;
}

const LOCAL_STORAGE_KEY = "pleaseDoTodosAdvanced";

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [filter, setFilter] = useState<{
    status: "all" | "completed" | "pending";
    categories: Category[];
  }>({ status: "all", categories: [...categories] });

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

  const handleAddTodo = (
    text: string,
    priority: Priority,
    category: Category
  ) => {
    setTodos([
      ...todos,
      {
        id: crypto.randomUUID(),
        text,
        completed: false,
        priority,
        category,
        createdAt: Date.now(),
      },
    ]);
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

  const filteredTodos = useMemo(() => {
    return todos
      .filter((todo) => {
        const statusMatch =
          filter.status === "all" ||
          (filter.status === "completed" && todo.completed) ||
          (filter.status === "pending" && !todo.completed);

        const categoryMatch = filter.categories.includes(todo.category);
        return statusMatch && categoryMatch;
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [todos, filter]);

  const completedCount = todos.filter((t) => t.completed).length;
  const progress = todos.length > 0 ? (completedCount / todos.length) * 100 : 0;

  return (
    <Card className="w-full max-w-4xl shadow-2xl bg-card/80 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-5xl font-bold text-center bg-gradient-to-r from-primary via-blue-400 to-cyan-300 text-transparent bg-clip-text">
          Please Do
        </CardTitle>
        <CardDescription className="text-center text-lg">
          Your Ultimate Task Manager
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <AddTodoForm onAddTodo={handleAddTodo} />
        
        <Separator className="my-4" />

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Tasks</h3>
            <span className="text-sm text-muted-foreground">{completedCount} / {todos.length} completed</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <TodoFilters filter={filter} onFilterChange={setFilter} />

        <div className="max-h-[40vh] overflow-y-auto pr-2">
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo) => (
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
              No tasks match your filters.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
