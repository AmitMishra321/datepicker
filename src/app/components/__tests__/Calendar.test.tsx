import React from "react";
import "@testing-library/jest-dom";
import { render, fireEvent, waitFor } from "@testing-library/react";
import Calendar from "../Calendar";
import { useTaskContext } from "../../context/TaskContext";
import { describe, it, expect, beforeEach, jest } from "@jest/globals";

// Mock the useTaskContext hook
jest.mock("../../context/TaskContext", () => ({
  useTaskContext: jest.fn(),
}));

// Mock the localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};
Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

describe("Calendar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);

    // Set up the mock return value for useTaskContext
    (useTaskContext as jest.Mock).mockReturnValue({
      tasks: [],
      addTask: jest.fn(),
      isLoading: false,
    });
  });

  it("renders correctly and allows view type changes", async () => {
    const { getByText } = render(<Calendar />);

    // Wait for the initial loading state to resolve
    await waitFor(() => expect(getByText("Monthly")).toBeInTheDocument());

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
