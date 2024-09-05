"use client";

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { Task } from "../types/Task";

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, "id">) => void;
  isLoading: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTasks = () => {
      const storedTasks = localStorage.getItem("tasks");
      if (storedTasks) {
        try {
          const parsedTasks = JSON.parse(storedTasks);
          setTasks(parsedTasks);
          console.log("Loaded tasks:", parsedTasks); // Debug log
        } catch (error) {
          console.error("Error parsing stored tasks:", error);
        }
      } else {
        console.log("No tasks found in localStorage"); // Debug log
      }
      setIsLoading(false);
    };

    loadTasks();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
      console.log("Saved tasks:", tasks); // Debug log
    }
  }, [tasks, isLoading]);

  const addTask = (newTask: Omit<Task, "id">) => {
    const task: Task = { ...newTask, id: Date.now().toString() };
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks, task];
      console.log("Added task, new tasks:", updatedTasks); // Debug log
      return updatedTasks;
    });
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, isLoading }}>
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
