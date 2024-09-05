"use client";

import React from "react";
import Calendar from "./components/Calendar";
import { TaskProvider } from "./context/TaskContext";

const TaskManagement: React.FC = () => {
  return (
    <TaskProvider>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Task Management</h1>
        <Calendar />
      </div>
    </TaskProvider>
  );
};

export default TaskManagement;
