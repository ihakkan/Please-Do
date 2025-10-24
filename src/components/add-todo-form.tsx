"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Priority, Category } from "./todo-list";
import { priorities, categories } from "@/lib/data";
import { playSound } from "@/lib/sounds";

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
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      onAddTodo(newTodoText.trim(), priority, category);
      setNewTodoText("");
      setPriority("medium");
      setCategory("personal");
      setIsOpen(false);
    }
  };

  const handleOpen = () => {
    playSound("open");
    setIsOpen(true);
  }

  return (
    <>
      <Button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 h-16 w-16 rounded-full bg-gradient-to-br from-primary via-fuchsia-500 to-cyan-400 text-white shadow-lg shadow-primary/40 transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-2xl hover:shadow-primary/50 focus:scale-110 animate-pulse-slow"
      >
        <Plus className="h-8 w-8" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] bg-background/80 backdrop-blur-xl border-primary/50">
          <DialogHeader>
            <DialogTitle className="text-primary">Add New Task</DialogTitle>
            <DialogDescription>
              What do you need to get done?
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <Input
              id="new-todo"
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="e.g. Design a new UI"
              className="col-span-3"
              autoFocus
            />
            <div className="grid grid-cols-2 gap-4">
              <Select
                value={priority}
                onValueChange={(value) => {
                  playSound("click");
                  setPriority(value as Priority)
                }}
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
                onValueChange={(value) => {
                  playSound("click");
                  setCategory(value as Category)
                }}
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
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">Add Task</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
