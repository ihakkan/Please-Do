
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TodoItem } from "./todo-item";
import { AddTodoForm } from "./add-todo-form";
import { TodoFilters } from "./todo-filters";
import { categories } from "@/lib/data";
import { AnimatePresence, motion } from "framer-motion";
import { LineChart } from "lucide-react";
import { playSound } from "@/lib/sounds";
import { useIsMobile } from "@/hooks/use-mobile";

export type Priority = "low" | "medium" | "high";
export type Category = "work" | "study" | "personal" | "fitness" | "other";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  createdAt: number;
  completedAt?: number;
  dueDate?: number;
}

const LOCAL_STORAGE_KEY = "pleaseDoTodosAdvanced";

interface CompletionAnimationProps {
  id: number;
  position: { x: number; y: number };
}

function CompletionAnimation({ id, position }: CompletionAnimationProps) {
  return (
    <motion.div
      key={id}
      initial={{ 
        opacity: 1, 
        y: position.y,
        x: position.x,
        scale: 0.5 
      }}
      animate={{ opacity: 0, y: position.y - 100, scale: 1.5 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="fixed top-0 left-0 z-50 flex flex-col items-center pointer-events-none"
      style={{
        transform: 'translateX(-50%)', // Center the animation on the x-axis
      }}
    >
      <div className="text-5xl">👍</div>
      <div className="text-lg font-semibold text-white bg-black/50 rounded-lg px-3 py-1 mt-2">
        Well done!
      </div>
    </motion.div>
  );
}


export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [filter, setFilter] = useState<{
    status: "all" | "completed" | "pending";
    categories: Category[];
  }>({ status: "all", categories: [...categories] });
  const [showMobileTooltip, setShowMobileTooltip] = useState(false);
  const isMobile = useIsMobile();
  const [completionAnimation, setCompletionAnimation] = useState<{ id: number; position: { x: number; y: number } } | null>(null);

  useEffect(() => {
    if (isMobile) {
      const timer = setTimeout(() => {
        setShowMobileTooltip(true);
      }, 1000); // Show after 1 second
      const hideTimer = setTimeout(() => {
        setShowMobileTooltip(false);
      }, 4000); // Hide after 4 seconds
      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
  }, [isMobile]);

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
    category: Category,
    dueDate?: Date
  ) => {
    playSound("add");
    setTodos([
      {
        id: crypto.randomUUID(),
        text,
        completed: false,
        priority,
        category,
        createdAt: Date.now(),
        dueDate: dueDate?.getTime(),
      },
      ...todos,
    ]);
  };

  const handleToggleComplete = (id: string, element: HTMLButtonElement | null) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      playSound(todo.completed ? "incomplete" : "complete");
      if (!todo.completed && element) {
        const rect = element.getBoundingClientRect();
        const position = {
          x: rect.left + rect.width / 2,
          y: rect.top,
        };
        setCompletionAnimation({ id: Date.now(), position });
      }
    }
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed, completedAt: !todo.completed ? Date.now() : undefined } : todo
      )
    );
  };

  const handleDeleteTodo = (id: string) => {
    playSound("delete");
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleEditTodo = (id: string, newText: string, newDueDate?: Date) => {
    playSound("click");
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: newText, dueDate: newDueDate?.getTime() } : todo
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
      .sort((a, b) => {
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        if (a.dueDate && b.dueDate) {
          return a.dueDate - b.dueDate;
        }
        if (a.dueDate) {
          return -1;
        }
        if (b.dueDate) {
          return 1;
        }
        return b.createdAt - a.createdAt;
      });
  }, [todos, filter]);

  const completedCount = todos.filter((t) => t.completed).length;
  const progress = todos.length > 0 ? (completedCount / todos.length) * 100 : 0;
  
  const title = "Please Do";
  const titleContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const titleCharVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };


  if (!isMounted) return null;

  return (
    <>
      <Card className="w-full max-w-4xl min-h-[calc(100vh-2rem)] sm:min-h-[80vh] m-auto sm:my-10 bg-background/30 backdrop-blur-xl border-2 border-primary/20 shadow-2xl shadow-primary/10 rounded-none sm:rounded-2xl">
        <CardHeader className="text-center pt-8 sm:pt-6 relative">
          <CardTitle className="text-5xl font-bold bg-gradient-to-r from-primary via-fuchsia-400 to-cyan-300 text-transparent bg-clip-text pb-2">
             <motion.div
              variants={titleContainerVariants}
              initial="hidden"
              animate="visible"
              aria-label={title}
              className="flex justify-center"
            >
              {title.split("").map((char, index) => (
                <motion.span
                  key={index}
                  variants={titleCharVariants}
                  style={{ display: "inline-block", whiteSpace: "pre" }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>
          </CardTitle>
          <CardDescription className="text-lg text-foreground/80">
            Get it done.
          </CardDescription>
          <div className="absolute top-4 right-4">
             <TooltipProvider>
              <Tooltip open={showMobileTooltip} onOpenChange={isMobile ? setShowMobileTooltip : undefined}>
                <TooltipTrigger asChild>
                  <Link href="/dashboard" passHref>
                    <Button onClick={() => playSound("navigate")} variant="ghost" size="icon" className="text-primary hover:bg-primary/10 hover:text-primary">
                      <LineChart className="h-7 w-7" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Analytics</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-4 sm:p-6">
          <div className="space-y-2">
             <div className="flex justify-between items-center px-1">
              <h3 className="text-lg font-semibold text-foreground/80">Progress</h3>
              <span className="text-sm text-muted-foreground">{completedCount} / {todos.length} completed</span>
            </div>
            <Progress value={progress} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:via-fuchsia-400 [&>div]:to-cyan-300" />
          </div>
          
          <TodoFilters filter={filter} onFilterChange={setFilter} />

          <div className="max-h-[calc(100vh-350px)] sm:max-h-[calc(80vh-320px)] overflow-y-auto pr-2 rounded-lg border border-white/5">
            <AnimatePresence>
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
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-muted-foreground py-16"
                >
                  No tasks match your filters. Time to chill?
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
      <AddTodoForm onAddTodo={handleAddTodo} />
      <AnimatePresence>
        {completionAnimation ? (
          <CompletionAnimation 
            key={completionAnimation.id} 
            id={completionAnimation.id} 
            position={completionAnimation.position} 
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
