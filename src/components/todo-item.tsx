
"use client";

import { useState, useRef } from "react";
import { Check, Edit, Save, Trash2, Tag, Zap, Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import type { Todo } from "./todo-list";
import { getPriorityStyles, getDueDateStyles } from "@/lib/utils";
import { motion } from "framer-motion";
import { playSound } from "@/lib/sounds";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, element: HTMLButtonElement | null) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string, dueDate?: Date) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editDueDate, setEditDueDate] = useState(
    todo.dueDate ? new Date(todo.dueDate) : undefined
  );
  const checkboxRef = useRef<HTMLButtonElement>(null);

  const priorityStyles = getPriorityStyles(todo.priority);
  const dueDateStyles = getDueDateStyles(todo.dueDate, todo.completed);

  const handleEdit = () => {
    playSound("click");
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(todo.id, editText.trim(), editDueDate);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditText(todo.text);
      setEditDueDate(todo.dueDate ? new Date(todo.dueDate) : undefined);
      setIsEditing(false);
    }
  };
  
  const handleResetDueDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditDueDate(undefined);
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      layout
      className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 border-b border-white/10 transition-colors bg-black/10 hover:bg-white/5"
    >
      <Checkbox
        ref={checkboxRef}
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id, checkboxRef.current)}
        aria-label={`Mark "${todo.text}" as ${
          todo.completed ? "incomplete" : "complete"
        }`}
        className="w-5 h-5 sm:w-5 sm:h-5"
      />
      <div className="flex-grow grid gap-2">
        {isEditing ? (
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="flex-grow bg-transparent h-auto"
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  size="sm"
                  className={cn(
                    "justify-start text-left font-normal h-auto text-xs",
                    !editDueDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {editDueDate ? format(editDueDate, "PPP") : <span>Set date</span>}
                  {editDueDate && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 absolute right-0.5"
                      onClick={handleResetDueDate}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarPicker
                  mode="single"
                  selected={editDueDate}
                  onSelect={setEditDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <label
            htmlFor={`todo-${todo.id}`}
            className={cn(
              "flex-grow cursor-pointer text-sm sm:text-base transition-colors",
              todo.completed && "text-muted-foreground line-through"
            )}
          >
            {todo.text}
          </label>
        )}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
             <Calendar className="h-3 w-3" />
            {formatDistanceToNow(new Date(todo.createdAt), { addSuffix: true })}
          </div>
          <div className="flex items-center gap-1">
            <Tag className="h-3 w-3" />
            <span className="capitalize">{todo.category}</span>
          </div>
           {todo.dueDate && !todo.completed && (
            <div className={cn("flex items-center gap-1", dueDateStyles.textColor)}>
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(todo.dueDate), "MMM d")}</span>
            </div>
          )}
        </div>
      </div>
       <Badge variant="outline" className={cn("hidden sm:flex text-xs font-normal", priorityStyles)}>
        {todo.priority}
      </Badge>
      <div className="flex gap-0 sm:gap-1">
        {isEditing ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            aria-label="Save todo"
            className="w-8 h-8 sm:w-10 sm:h-10"
          >
            <Save className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEdit}
            aria-label="Edit todo"
            className="w-8 h-8 sm:w-10 sm:h-10"
          >
            <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(todo.id)}
          aria-label="Delete todo"
          className="w-8 h-8 sm:w-10 sm:h-10"
        >
          <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
        </Button>
      </div>
    </motion.div>
  );
};
