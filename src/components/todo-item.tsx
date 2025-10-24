
"use client";

import { useState, useRef } from "react";
import { Check, Edit, Save, Trash2, Tag, Calendar, X, Plus, Subtitles, CheckCheck } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import type { Todo, Subtask } from "./todo-list";
import { getPriorityStyles, getDueDateStyles } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { playSound } from "@/lib/sounds";

interface SubtaskItemProps {
  todoId: string;
  subtask: Subtask;
  onToggleSubtask: (todoId: string, subtaskId: string) => void;
  onDeleteSubtask: (todoId: string, subtaskId: string) => void;
}

const SubtaskItem: React.FC<SubtaskItemProps> = ({ todoId, subtask, onToggleSubtask, onDeleteSubtask }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex items-center gap-2 pl-4 pr-2 py-1.5 rounded-md bg-black/10 hover:bg-white/5"
    >
      <Checkbox
        id={`subtask-${subtask.id}`}
        checked={subtask.completed}
        onCheckedChange={() => onToggleSubtask(todoId, subtask.id)}
        className="w-4 h-4"
      />
      <label
        htmlFor={`subtask-${subtask.id}`}
        className={cn(
          "flex-grow text-sm",
          subtask.completed && "line-through text-muted-foreground"
        )}
      >
        {subtask.text}
      </label>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-muted-foreground hover:text-destructive"
        onClick={() => onDeleteSubtask(todoId, subtask.id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </motion.div>
  );
};


interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, element: HTMLButtonElement | null) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string, dueDate?: Date) => void;
  onAddSubtask: (todoId: string, text: string) => void;
  onToggleSubtask: (todoId: string, subtaskId: string) => void;
  onDeleteSubtask: (todoId: string, subtaskId: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editDueDate, setEditDueDate] = useState(
    todo.dueDate ? new Date(todo.dueDate) : undefined
  );
  const [showAddSubtask, setShowAddSubtask] = useState(false);
  const [newSubtaskText, setNewSubtaskText] = useState("");
  
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

  const handleSubtaskKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onAddSubtask(todo.id, newSubtaskText);
      setNewSubtaskText('');
    }
     if (e.key === 'Escape') {
      setNewSubtaskText('');
      setShowAddSubtask(false);
    }
  };

  const subtasks = todo.subtasks || [];
  const subtaskProgress = subtasks.length > 0 
    ? (subtasks.filter(st => st.completed).length / subtasks.length) * 100
    : 0;

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
      className="flex items-start gap-2 sm:gap-4 p-3 sm:p-4 border-b border-white/10 transition-colors bg-black/10 hover:bg-white/5"
    >
      <Checkbox
        ref={checkboxRef}
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id, checkboxRef.current)}
        aria-label={`Mark "${todo.text}" as ${
          todo.completed ? "incomplete" : "complete"
        }`}
        className="w-5 h-5 sm:w-5 sm:h-5 mt-1"
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
              "flex-grow cursor-pointer text-sm sm:text-base transition-colors pt-0.5",
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
           {subtasks.length > 0 && (
             <div className="flex items-center gap-1">
               <CheckCheck className="h-3 w-3" />
               <span>{subtasks.filter(st => st.completed).length}/{subtasks.length}</span>
             </div>
           )}
        </div>
        {subtasks.length > 0 && !isEditing && (
          <div className="space-y-2 pt-2">
            <Progress value={subtaskProgress} className="h-1" />
            <AnimatePresence>
              {subtasks.map(subtask => (
                <SubtaskItem 
                  key={subtask.id}
                  todoId={todo.id}
                  subtask={subtask}
                  onToggleSubtask={onToggleSubtask}
                  onDeleteSubtask={onDeleteSubtask}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {showAddSubtask && !isEditing && (
           <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
            <div className="flex items-center gap-2 pt-2">
              <Input
                type="text"
                placeholder="Add a new sub-task and press Enter"
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
                onKeyDown={handleSubtaskKeyDown}
                className="h-8 text-sm"
                autoFocus
              />
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                 onAddSubtask(todo.id, newSubtaskText);
                 setNewSubtaskText('');
              }}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

      </div>
      <div className="flex flex-col gap-0 sm:gap-1">
         <Badge variant="outline" className={cn("hidden sm:flex text-xs font-normal mb-1", priorityStyles)}>
          {todo.priority}
        </Badge>
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
           <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setShowAddSubtask(!showAddSubtask);
                playSound('click');
              }}
              aria-label="Add sub-task"
              className="w-8 h-8 sm:w-10 sm:h-10"
            >
              <Subtitles className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEdit}
              aria-label="Edit todo"
              className="w-8 h-8 sm:w-10 sm:h-10"
            >
              <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
           </>
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
