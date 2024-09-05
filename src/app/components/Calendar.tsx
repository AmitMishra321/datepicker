"use client";

import React, { useState, useEffect } from "react";
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
  eachDayOfInterval,
  addWeeks,
  addYears,
  startOfMonth as startOfMonthFn,
  parseISO,
  startOfDay,
} from "date-fns";
import { TaskCard } from "./TaskCard";
import { TaskForm } from "./TaskForm";
import { DateNavigator } from "./DateNavigator";
import { useTaskContext } from "../context/TaskContext";

const Calendar: React.FC = () => {
  const { tasks, addTask, isLoading } = useTaskContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewType, setViewType] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("monthly");

  useEffect(() => {
    console.log("Current tasks in Calendar:", tasks);
    console.log("Is loading:", isLoading);
  }, [tasks, isLoading]);

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsFormOpen(true);
  };

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
                const taskDate = parseISO(task.date);
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
    const dayStart = startOfDay(day);
    const dayTasks = tasks.filter((task) => {
      const taskDate = startOfDay(parseISO(task.date));
      return isSameDay(taskDate, dayStart);
    });
    return dayTasks.map((task) => (
      <TaskCard
        key={task.id}
        task={task}
        isYearlyView={viewType === "yearly"}
      />
    ));
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
      <DateNavigator
        currentDate={currentDate}
        viewType={viewType}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
      {renderCalendar()}
      {isFormOpen && selectedDate && (
        <TaskForm
          selectedDate={selectedDate}
          onClose={() => setIsFormOpen(false)}
          onAddTask={addTask}
          viewType={viewType}
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
