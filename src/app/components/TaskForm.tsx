import React, { useState } from "react";
import { Task } from "../types/Task";
import { HexColorPicker } from "react-colorful";
import { format, parse } from "date-fns";
import { parseISO } from "date-fns";

interface TaskFormProps {
  selectedDate: Date;
  onClose: () => void;
  onAddTask: (task: Task) => void;
  viewType: "daily" | "weekly" | "monthly" | "yearly";
}

export const TaskForm: React.FC<TaskFormProps> = ({
  selectedDate,
  onClose,
  onAddTask,
  viewType,
}) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(format(selectedDate, "yyyy-MM-dd"));
  const [time, setTime] = useState("");
  const [color, setColor] = useState("#3B82F6");
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask = {
      id: Date.now().toString(),
      title,
      date,
      time,
      color,
    };
    console.log("Adding new task:", newTask);
    onAddTask(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl max-w-md w-full shadow-2xl transform transition-all duration-300 ease-in-out">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
          New Task
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Task Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 transition-all duration-200"
            />
          </div>
          {viewType === "yearly" && (
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 transition-all duration-200"
              />
            </div>
          )}
          <div>
            <label
              htmlFor="time"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Time
            </label>
            <input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-10 h-10 rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                style={{ backgroundColor: color }}
              >
                <span className="sr-only">Choose color</span>
              </button>
              <span className="text-sm text-gray-500">{color}</span>
            </div>
            {showColorPicker && (
              <div className="absolute mt-2 z-10">
                <HexColorPicker color={color} onChange={setColor} />
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
