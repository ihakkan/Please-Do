"use client";

import { useState } from "react";
import { Check, Edit, Save, Trash2, Tag, Zap, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import type { Todo } from "./todo-list";
import { getPriorityStyles } from "@/lib/utils";


interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  
  const priorityStyles = getPriorityStyles(todo.priority);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(todo.id, editText.trim());
      setIsEditing(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 border-b transition-colors hover:bg-muted/20 animate-in fade-in-0 zoom-in-95">
      <Checkbox
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        aria-label={`Mark "${todo.text}" as ${
          todo.completed ? "incomplete" : "complete"
        }`}
      />
      <div className="flex-grow grid gap-2">
        {isEditing ? (
          <Input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            autoFocus
            className="flex-grow"
          />
        ) : (
          <label
            htmlFor={`todo-${todo.id}`}
            className={cn(
              "flex-grow cursor-pointer text-base transition-colors",
              todo.completed && "text-muted-foreground line-through"
            )}
          >
            {todo.text}
          </label>
        )}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
             <Calendar className="h-3 w-3" />
            {formatDistanceToNow(new Date(todo.createdAt), { addSuffix: true })}
          </div>
          <div className="flex items-center gap-1">
            <Tag className="h-3 w-3" />
            <span className="capitalize">{todo.category}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            <span className="capitalize">{todo.priority}</span>
          </div>
        </div>
      </div>
       <Badge variant="outline" className={cn("hidden sm:flex", priorityStyles)}>
        {todo.priority}
      </Badge>
      <div className="flex gap-1">
        {isEditing ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            aria-label="Save todo"
          >
            <Save className="h-5 w-5 text-primary" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEdit}
            aria-label="Edit todo"
          >
            <Edit className="h-5 w-5" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(todo.id)}
          aria-label="Delete todo"
        >
          <Trash2 className="h-5 w-5 text-destructive" />
        </Button>
      </div>
    </div>
  );
};
