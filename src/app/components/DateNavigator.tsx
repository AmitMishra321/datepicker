import React from "react";
import { format } from "date-fns";

interface DateNavigatorProps {
  currentDate: Date;
  viewType: "daily" | "weekly" | "monthly" | "yearly";
  onPrevious: () => void;
  onNext: () => void;
}

/**
 * DateNavigator component for navigating between dates
 */
export const DateNavigator: React.FC<DateNavigatorProps> = ({
  currentDate,
  viewType,
  onPrevious,
  onNext,
}) => (
  <div className="flex justify-between items-center mb-6">
    <button
      onClick={onPrevious}
      className="p-2 bg-white rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-md"
    >
      ← Prev
    </button>
    <h2 className="text-3xl font-bold text-gray-800">
      {format(currentDate, viewType === "yearly" ? "yyyy" : "MMMM yyyy")}
    </h2>
    <button
      onClick={onNext}
      className="p-2 bg-white rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-md"
    >
      Next →
    </button>
  </div>
);
