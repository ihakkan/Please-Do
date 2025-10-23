"use client";

import type { FC, useState } from "react";
import { Check, Pencil, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Todo } from "./todo-list";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

export const TodoItem: FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

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
    <div className="flex items-center gap-4 p-4 border-b transition-colors hover:bg-muted/50 animate-in fade-in-0 zoom-in-95">
      <Checkbox
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        aria-label={`Mark "${todo.text}" as ${
          todo.completed ? "incomplete" : "complete"
        }`}
      />
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
            <Pencil className="h-5 w-5" />
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
