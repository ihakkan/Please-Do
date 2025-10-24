
"use client";

import { useState, useEffect } from "react";
import { PenSquare, Calendar as CalendarIcon, X } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import type { Priority, Category } from "./todo-list";
import { priorities, categories } from "@/lib/data";
import { playSound } from "@/lib/sounds";
import { useIsMobile } from "@/hooks/use-mobile";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AddTodoFormProps {
  onAddTodo: (
    text: string,
    priority: Priority,
    category: Category,
    dueDate?: Date
  ) => void;
}

export function AddTodoForm({ onAddTodo }: AddTodoFormProps) {
  const [newTodoText, setNewTodoText] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState<Category>("personal");
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [isOpen, setIsOpen] = useState(false);
  const [showMobileTooltip, setShowMobileTooltip] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      setShowMobileTooltip(true);
      const timer = setTimeout(() => {
        setShowMobileTooltip(false);
      }, 3000); // Show for 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      onAddTodo(newTodoText.trim(), priority, category, dueDate);
      setNewTodoText("");
      setPriority("medium");
      setCategory("personal");
      setDueDate(undefined);
      setIsOpen(false);
    }
  };

  const handleOpen = () => {
    playSound("open");
    setIsOpen(true);
  };
  
  const handleResetDueDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDueDate(undefined);
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip open={showMobileTooltip} onOpenChange={isMobile ? setShowMobileTooltip : undefined}>
          <TooltipTrigger asChild>
            <Button
              onClick={handleOpen}
              className="fixed bottom-10 right-4 h-16 w-16 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/40 transition-transform duration-300 ease-in-out hover:scale-110 focus:scale-110"
              aria-label="Add new task"
            >
              <PenSquare className="h-8 w-8" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add new task</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                value={priority}
                onValueChange={(value) => {
                  playSound("click");
                  setPriority(value as Priority);
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
                  setCategory(value as Category);
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
             <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "justify-start text-left font-normal relative",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a due date</span>}
                  {dueDate && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 absolute right-1"
                      onClick={handleResetDueDate}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <DialogFooter>
              <Button type="submit" className="w-full">Add Task</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
