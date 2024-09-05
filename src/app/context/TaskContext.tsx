"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

interface Task {
  id: string;
  title: string;
  date: Date;
  recurrence: {
    type: "daily" | "weekly" | "monthly" | "yearly";
    interval: number;
    daysOfWeek?: number[];
    nthDay?: number;
  };
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, "id">) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (newTask: Omit<Task, "id">) => {
    const task: Task = { ...newTask, id: Date.now().toString() };
    setTasks([...tasks, task]);
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};
