import React from "react";

interface ViewTypeSelectorProps {
  viewType: "daily" | "weekly" | "monthly" | "yearly";
  onViewTypeChange: (type: "daily" | "weekly" | "monthly" | "yearly") => void;
}

/**
 * ViewTypeSelector component for selecting calendar view type
 */
export const ViewTypeSelector: React.FC<ViewTypeSelectorProps> = ({
  viewType,
  onViewTypeChange,
}) => (
  <div className="mt-6 flex justify-center space-x-4">
    {(["daily", "weekly", "monthly", "yearly"] as const).map((type) => (
      <button
        key={type}
        onClick={() => onViewTypeChange(type)}
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
);
