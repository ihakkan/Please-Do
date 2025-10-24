
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SlidersHorizontal } from "lucide-react";
import type { Category } from "./todo-list";
import { categories } from "@/lib/data";
import { playSound } from "@/lib/sounds";
import { motion } from "framer-motion";

interface TodoFiltersProps {
  filter: {
    status: "all" | "completed" | "pending";
    categories: Category[];
  };
  onFilterChange: (filter: TodoFiltersProps["filter"]) => void;
}

export function TodoFilters({ filter, onFilterChange }: TodoFiltersProps) {
  const handleStatusChange = (status: "all" | "completed" | "pending") => {
    playSound("click");
    onFilterChange({ ...filter, status });
  };

  const handleCategoryToggle = (category: Category) => {
    playSound("click");
    const newCategories = filter.categories.includes(category)
      ? filter.categories.filter((c) => c !== category)
      : [...filter.categories, category];
    onFilterChange({ ...filter, categories: newCategories });
  };
  
  const allCategoriesSelected = filter.categories.length === categories.length;

  const handleAllCategoriesToggle = () => {
    playSound("click");
    onFilterChange({ ...filter, categories: allCategoriesSelected ? [] : [...categories] })
  }
  
  const filters: ("all" | "completed" | "pending")[] = ["all", "pending", "completed"];


  return (
    <div className="flex items-center justify-between gap-4 p-2 rounded-lg bg-background/50 backdrop-blur-sm border border-white/10">
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 bg-muted/50 p-1 rounded-lg">
        {filters.map((status) => (
          <Button
            key={status}
            variant={"ghost"}
            size="sm"
            onClick={() => handleStatusChange(status)}
            className="text-foreground capitalize relative transition-colors duration-300"
          >
            {status}
            {filter.status === status && (
              <motion.div
                layoutId="filter-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </Button>
        ))}
      </div>
      <DropdownMenu onOpenChange={(open) => playSound(open ? "open" : "click")}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary flex-shrink-0">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Category</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuContent className="bg-background/80 backdrop-blur-xl border-primary/50 text-foreground">
          <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
          <DropdownMenuSeparator />
           <DropdownMenuCheckboxItem
            checked={allCategoriesSelected}
            onCheckedChange={handleAllCategoriesToggle}
          >
            All Categories
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
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
