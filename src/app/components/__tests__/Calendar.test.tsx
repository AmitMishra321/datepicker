import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Calendar from "../Calendar";
import { TaskProvider } from "../../context/TaskContext";

describe("Calendar", () => {
  it("renders correctly and allows view type changes", () => {
    const { getByText } = render(
      <TaskProvider>
        <Calendar />
      </TaskProvider>
    );

    // Check if the default view (monthly) is rendered
    expect(getByText("Monthly")).toHaveClass("bg-blue-500");

    // Change view type to weekly
    fireEvent.click(getByText("Weekly"));
    expect(getByText("Weekly")).toHaveClass("bg-blue-500");

    // Change view type to daily
    fireEvent.click(getByText("Daily"));
    expect(getByText("Daily")).toHaveClass("bg-blue-500");

    // Change view type to yearly
    fireEvent.click(getByText("Yearly"));
    expect(getByText("Yearly")).toHaveClass("bg-blue-500");
  });
});
