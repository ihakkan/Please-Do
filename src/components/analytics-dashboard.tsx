"use client";

import { useState, useEffect, useMemo } from "react";
import type { Todo, Category } from "@/components/todo-list";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { BarChart, PieChart, Bar, XAxis, YAxis, CartesianGrid, Pie, Cell } from "recharts";
import { subDays, startOfMonth, format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { categories } from "@/lib/data";

const LOCAL_STORAGE_KEY = "pleaseDoTodosAdvanced";
type FilterType = "7days" | "month" | "all";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"];

export function AnalyticsDashboard() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [filter, setFilter] = useState<FilterType>("7days");

  useEffect(() => {
    try {
      const storedTodos = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      }
    } catch (error) {
      console.error("Failed to parse todos from localStorage:", error);
    }
    setIsMounted(true);
  }, []);

  const filteredTodos = useMemo(() => {
    const now = new Date();
    if (filter === "7days") {
      const sevenDaysAgo = subDays(now, 7);
      return todos.filter(t => new Date(t.createdAt) >= sevenDaysAgo);
    }
    if (filter === "month") {
      const startOfThisMonth = startOfMonth(now);
      return todos.filter(t => new Date(t.createdAt) >= startOfThisMonth);
    }
    return todos;
  }, [todos, filter]);

  const totalTasksCompleted = filteredTodos.filter(t => t.completed).length;
  const totalTasks = filteredTodos.length;
  const completionRate = totalTasks > 0 ? (totalTasksCompleted / totalTasks) * 100 : 0;
  
  const categoryData = useMemo(() => {
    return categories.map(category => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: filteredTodos.filter(t => t.category === category && t.completed).length,
    })).filter(c => c.value > 0);
  }, [filteredTodos]);

  const completionRateData = useMemo(() => {
    if (filter === '7days') {
        const last7Days = Array.from({ length: 7 }).map((_, i) => subDays(new Date(), i)).reverse();
        return last7Days.map(day => {
            const dayStr = format(day, 'MMM d');
            const tasksOnDay = filteredTodos.filter(t => format(new Date(t.createdAt), 'MMM d') === dayStr);
            const completedOnDay = tasksOnDay.filter(t => t.completed).length;
            return {
                name: dayStr,
                "Tasks Completed": completedOnDay,
            }
        });
    }
    // Basic aggregation for month/all
    return [{ name: "Total", "Tasks Completed": totalTasksCompleted, "Tasks Pending": totalTasks - totalTasksCompleted }];
  }, [filteredTodos, filter, totalTasksCompleted, totalTasks]);


  if (!isMounted) {
    return <div className="flex items-center justify-center min-h-screen text-lg text-primary">Loading Analytics...</div>;
  }

  return (
    <div className="p-4 sm:p-8 pt-20 sm:pt-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-4xl font-bold text-primary">Analytics</h1>
        <div className="flex items-center gap-2 p-1 rounded-lg bg-background/50 border border-white/10">
          <Button variant={filter === '7days' ? 'secondary' : 'ghost'} onClick={() => setFilter('7days')} className="text-foreground">Last 7 days</Button>
          <Button variant={filter === 'month' ? 'secondary' : 'ghost'} onClick={() => setFilter('month')} className="text-foreground">This Month</Button>
          <Button variant={filter === 'all' ? 'secondary' : 'ghost'} onClick={() => setFilter('all')} className="text-foreground">All Time</Button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-background/30 backdrop-blur-xl border-primary/20">
            <CardHeader>
              <CardTitle className="text-foreground/80">Total Tasks Completed</CardTitle>
              <CardDescription>Over the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold text-cyan-300">{totalTasksCompleted}</p>
            </CardContent>
          </Card>
           <Card className="bg-background/30 backdrop-blur-xl border-primary/20">
            <CardHeader>
              <CardTitle className="text-foreground/80">Completion Rate</CardTitle>
              <CardDescription>Percentage of tasks completed</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold text-fuchsia-400">{completionRate.toFixed(1)}%</p>
            </CardContent>
          </Card>
          <Card className="bg-background/30 backdrop-blur-xl border-primary/20">
            <CardHeader>
              <CardTitle className="text-foreground/80">Streak</CardTitle>
              <CardDescription>Coming Soon!</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold text-primary">🔥 0</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-background/30 backdrop-blur-xl border-primary/20">
          <CardHeader>
            <CardTitle className="text-foreground/80">Task Completion Rate</CardTitle>
             <CardDescription>{filter === '7days' ? 'Completed tasks over the last 7 days' : 'Overview of completed vs. pending tasks'}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px] w-full">
              <AnimatePresence>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={filter}>
              <BarChart data={completionRateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.3)" />
                <XAxis dataKey="name" stroke="hsl(var(--foreground)/0.7)" />
                <YAxis stroke="hsl(var(--foreground)/0.7)" />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={{ fill: "hsl(var(--primary)/0.1)" }}
                />
                <Bar dataKey="Tasks Completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                {filter !== '7days' && <Bar dataKey="Tasks Pending" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />}
              </BarChart>
              </motion.div>
              </AnimatePresence>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="bg-background/30 backdrop-blur-xl border-primary/20">
          <CardHeader>
            <CardTitle className="text-foreground/80">Category Productivity</CardTitle>
            <CardDescription>Completed tasks by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px] w-full">
              {categoryData.length > 0 ? (
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                  <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={{ fill: 'hsl(var(--foreground))' }}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">No completed tasks in any category for this period.</div>
              )}
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
