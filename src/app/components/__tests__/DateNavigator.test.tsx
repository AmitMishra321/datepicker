import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { DateNavigator } from "../DateNavigator";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom";
/// <reference types="@testing-library/jest-dom" />

describe("DateNavigator", () => {
  it("renders correctly", () => {
    const { getByText } = render(
      <DateNavigator
        currentDate={new Date(2023, 0, 1)}
        viewType="monthly"
        onPrevious={() => {}}
        onNext={() => {}}
      />
    );

    expect(getByText("January 2023")).toBeInTheDocument();
    expect(getByText("← Prev")).toBeInTheDocument();
    expect(getByText("Next →")).toBeInTheDocument();
  });

  it("calls onPrevious when previous button is clicked", () => {
    const onPrevious = jest.fn();
    const { getByText } = render(
      <DateNavigator
        currentDate={new Date(2023, 0, 1)}
        viewType="monthly"
        onPrevious={onPrevious}
        onNext={() => {}}
      />
    );

    fireEvent.click(getByText("← Prev"));
    expect(onPrevious).toHaveBeenCalled();
  });

  it("calls onNext when next button is clicked", () => {
    const onNext = jest.fn();
    const { getByText } = render(
      <DateNavigator
        currentDate={new Date(2023, 0, 1)}
        viewType="monthly"
        onPrevious={() => {}}
        onNext={onNext}
      />
    );

    fireEvent.click(getByText("Next →"));
    expect(onNext).toHaveBeenCalled();
  });
});
