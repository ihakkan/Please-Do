"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Priority, Category } from "./todo-list";
import { priorities, categories } from "@/lib/data";

interface AddTodoFormProps {
  onAddTodo: (
    text: string,
    priority: Priority,
    category: Category
  ) => void;
}

export function AddTodoForm({ onAddTodo }: AddTodoFormProps) {
  const [newTodoText, setNewTodoText] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState<Category>("personal");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      onAddTodo(newTodoText.trim(), priority, category);
      setNewTodoText("");
      setPriority("medium");
      setCategory("personal");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
      <Input
        type="text"
        value={newTodoText}
        onChange={(e) => setNewTodoText(e.target.value)}
        placeholder="What needs to be done?"
        aria-label="New todo input"
        className="sm:col-span-2 text-base"
      />
      <Select
        value={priority}
        onValueChange={(value) => setPriority(value as Priority)}
      >
        <SelectTrigger aria-label="Priority">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          {priorities.map((p) => (
            <SelectItem key={p} value={p}>
              <span className="capitalize">{p}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={category}
        onValueChange={(value) => setCategory(value as Category)}
      >
        <SelectTrigger aria-label="Category">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((c) => (
            <SelectItem key={c} value={c}>
              <span className="capitalize">{c}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" aria-label="Add todo" className="sm:col-start-4">
        <Plus className="h-5 w-5" />
        Add Task
      </Button>
    </form>
  );
}
