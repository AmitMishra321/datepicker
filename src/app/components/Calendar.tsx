"use client";

import React, { useState } from "react";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isSameDay,
  addMonths,
  setDate,
  getDay,
  eachDayOfInterval,
  addWeeks,
  addYears,
  startOfMonth as startOfMonthFn,
  endOfMonth as endOfMonthFn,
  parse,
} from "date-fns";
import { useTaskContext } from "../context/TaskContext";
import { HexColorPicker } from "react-colorful";
import { TaskCard } from "./TaskCard";

interface Task {
  id: string;
  title: string;
  date: Date;
  time: string;
  color: string;
  recurrence?: {
    type: "daily" | "weekly" | "monthly" | "yearly";
    interval: number;
    daysOfWeek?: number[];
    nthDay?: number;
  };
}

const Calendar: React.FC = () => {
  const { tasks, addTask } = useTaskContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewType, setViewType] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("monthly");

  const renderCalendar = () => {
    switch (viewType) {
      case "daily":
        return renderDailyView();
      case "weekly":
        return renderWeeklyView();
      case "monthly":
        return renderMonthlyView();
      case "yearly":
        return renderYearlyView();
    }
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsFormOpen(true);
  };

  const renderDailyView = () => {
    return (
      <div
        className="bg-white p-4 rounded-lg shadow cursor-pointer"
        onClick={() => handleDateClick(currentDate)}
      >
        <h3 className="text-xl font-bold mb-4">
          {format(currentDate, "MMMM d, yyyy")}
        </h3>
        {renderTasks(currentDate)}
      </div>
    );
  };

  const renderWeeklyView = () => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <div
            key={day.toString()}
            className="bg-white p-2 rounded-lg shadow cursor-pointer"
            onClick={() => handleDateClick(day)}
          >
            <h4 className="text-sm font-bold mb-2">{format(day, "EEE d")}</h4>
            {renderTasks(day)}
          </div>
        ))}
      </div>
    );
  };

  const renderMonthlyView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        days.push(
          <div
            key={day.toString()}
            className={`p-2 border border-gray-200 cursor-pointer transition-all duration-200 ease-in-out hover:shadow-lg
              ${
                !isSameMonth(day, monthStart)
                  ? "text-gray-400 bg-gray-50"
                  : "hover:bg-gray-100"
              }
              ${
                isSameDay(day, new Date())
                  ? "bg-blue-100 hover:bg-blue-200"
                  : ""
              }
              ${
                selectedDate && isSameDay(day, selectedDate)
                  ? "bg-blue-200 hover:bg-blue-300 ring-2 ring-blue-500"
                  : ""
              }`}
            onClick={() => handleDateClick(cloneDay)}
          >
            <span className="text-sm font-medium">{format(day, "d")}</span>
            {renderTasks(day)}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="mt-4">{rows}</div>;
  };

  const renderYearlyView = () => {
    const months = Array.from({ length: 12 }, (_, i) =>
      addMonths(new Date(currentDate.getFullYear(), 0, 1), i)
    );

    return (
      <div className="grid grid-cols-4 gap-4">
        {months.map((month) => (
          <div
            key={month.toString()}
            className="bg-white p-2 rounded-lg shadow cursor-pointer"
            onClick={() => handleDateClick(startOfMonthFn(month))}
          >
            <h4 className="text-sm font-bold mb-2">{format(month, "MMMM")}</h4>
            {tasks
              .filter((task) => {
                const taskDate = new Date(task.date);
                return (
                  taskDate.getMonth() === month.getMonth() &&
                  taskDate.getFullYear() === month.getFullYear()
                );
              })
              .map((task) => (
                <TaskCard key={task.id} task={task} isYearlyView={true} />
              ))}
          </div>
        ))}
      </div>
    );
  };

  const renderTasks = (day: Date) => {
    const dayTasks = tasks.filter((task) =>
      isSameDay(new Date(task.date), day)
    );
    return dayTasks.map((task) => (
      <TaskCard
        key={task.id}
        task={task}
        isYearlyView={viewType === "yearly"}
      />
    ));
  };

  const TaskForm: React.FC<{ selectedDate: Date; onClose: () => void }> = ({
    selectedDate,
    onClose,
  }) => {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState(format(selectedDate, "yyyy-MM-dd"));
    const [time, setTime] = useState("");
    const [color, setColor] = useState("#3B82F6");
    const [showColorPicker, setShowColorPicker] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const taskDate = parse(date, "yyyy-MM-dd", new Date());
      addTask({
        id: Date.now().toString(),
        title,
        date: taskDate,
        time,
        color,
        recurrence: {
          type: "daily",
          interval: 1,
        },
      });
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
                  className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  style={{ backgroundColor: color }}
                >
                  <span className="sr-only">Choose color</span>
                </button>
                <span className="text-sm text-gray-500">{color}</span>
              </div>
              {showColorPicker && (
                <div className="absolute z-10 mt-2">
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

  const handlePrevious = () => {
    switch (viewType) {
      case "daily":
        setCurrentDate(addDays(currentDate, -1));
        break;
      case "weekly":
        setCurrentDate(addWeeks(currentDate, -1));
        break;
      case "monthly":
        setCurrentDate(addMonths(currentDate, -1));
        break;
      case "yearly":
        setCurrentDate(addYears(currentDate, -1));
        break;
    }
  };

  const handleNext = () => {
    switch (viewType) {
      case "daily":
        setCurrentDate(addDays(currentDate, 1));
        break;
      case "weekly":
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case "monthly":
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case "yearly":
        setCurrentDate(addYears(currentDate, 1));
        break;
    }
  };

  return (
    <div className="container mx-auto p-4 font-sans bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handlePrevious}
          className="p-2 bg-white rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-md"
        >
          ← Prev
        </button>
        <h2 className="text-3xl font-bold text-gray-800">
          {format(currentDate, viewType === "yearly" ? "yyyy" : "MMMM yyyy")}
        </h2>
        <button
          onClick={handleNext}
          className="p-2 bg-white rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-md"
        >
          Next →
        </button>
      </div>
      {renderCalendar()}
      {isFormOpen && selectedDate && (
        <TaskForm
          selectedDate={selectedDate}
          onClose={() => setIsFormOpen(false)}
        />
      )}
      <div className="mt-6 flex justify-center space-x-4">
        {(["daily", "weekly", "monthly", "yearly"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setViewType(type)}
            className={`px-4 py-2 rounded-md transition-colors ${
              viewType === type
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
