import React from "react";
import { Task } from "../types/Task";
import { format, parseISO } from "date-fns";

interface TaskCardProps {
  task: Task;
  isYearlyView?: boolean;
}

/**
 * TaskCard component for displaying individual tasks
 */
export const TaskCard: React.FC<TaskCardProps> = ({ task, isYearlyView }) => (
  <div
    className="text-xs p-2 mt-1 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105"
    style={{ backgroundColor: task.color }}
  >
    {isYearlyView ? (
      <>
        <div className="font-semibold mb-1 ">
          {format(parseISO(task.date), "MMM d")} at {task.time}
        </div>
        <span className="font-medium">{task.title}</span>
      </>
    ) : (
      <div className="flex justify-between">
        <span className="font-medium">{task.title}</span>
        <span className="font-semibold mr-0 ml-auto">{task.time}</span>
      </div>
    )}
  </div>
);
