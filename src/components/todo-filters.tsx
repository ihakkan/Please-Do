"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SlidersHorizontal } from "lucide-react";
import type { Category } from "./todo-list";
import { categories } from "@/lib/data";

interface TodoFiltersProps {
  filter: {
    status: "all" | "completed" | "pending";
    categories: Category[];
  };
  onFilterChange: (filter: TodoFiltersProps["filter"]) => void;
}

export function TodoFilters({ filter, onFilterChange }: TodoFiltersProps) {
  const handleStatusChange = (status: "all" | "completed" | "pending") => {
    onFilterChange({ ...filter, status });
  };

  const handleCategoryToggle = (category: Category) => {
    const newCategories = filter.categories.includes(category)
      ? filter.categories.filter((c) => c !== category)
      : [...filter.categories, category];
    onFilterChange({ ...filter, categories: newCategories });
  };
  
  const allCategoriesSelected = filter.categories.length === categories.length;

  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-white/10">
      <div className="flex items-center gap-2">
        <Button
          variant={filter.status === "all" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => handleStatusChange("all")}
          className="text-foreground"
        >
          All
        </Button>
        <Button
          variant={filter.status === "pending" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => handleStatusChange("pending")}
           className="text-foreground"
        >
          Pending
        </Button>
        <Button
          variant={filter.status === "completed" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => handleStatusChange("completed")}
           className="text-foreground"
        >
          Completed
        </Button>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="border-primary/50 text-primary">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-background/80 backdrop-blur-xl border-primary/50">
          <DropdownMenuLabel>Category</DropdownMenuLabel>
          <DropdownMenuSeparator />
           <DropdownMenuCheckboxItem
            checked={allCategoriesSelected}
            onCheckedChange={() => onFilterChange({ ...filter, categories: allCategoriesSelected ? [] : [...categories] })}
          >
            All
          </DropdownMenuCheckboxItem>
          {categories.map((category) => (
            <DropdownMenuCheckboxItem
              key={category}
              checked={filter.categories.includes(category)}
              onCheckedChange={() => handleCategoryToggle(category)}
            >
              <span className="capitalize">{category}</span>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
