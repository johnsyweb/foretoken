import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NumericKeypad } from "./NumericKeypad";

describe("NumericKeypad", () => {
  it("renders all digit buttons", () => {
    const onNumberInput = jest.fn();
    const onClear = jest.fn();
    const onEnter = jest.fn();

    render(
      <NumericKeypad
        onNumberInput={onNumberInput}
        onClear={onClear}
        onEnter={onEnter}
      />
    );

    for (let i = 0; i <= 9; i++) {
      expect(screen.getByLabelText(`Enter digit ${i}`)).toBeInTheDocument();
    }
  });

  it("calls onNumberInput when a digit is clicked", async () => {
    const user = userEvent.setup();
    const onNumberInput = jest.fn();
    const onClear = jest.fn();
    const onEnter = jest.fn();

    render(
      <NumericKeypad
        onNumberInput={onNumberInput}
        onClear={onClear}
        onEnter={onEnter}
      />
    );

    await user.click(screen.getByLabelText("Enter digit 5"));
    expect(onNumberInput).toHaveBeenCalledWith("5");
  });

  it("calls onClear when Clear is clicked", async () => {
    const user = userEvent.setup();
    const onNumberInput = jest.fn();
    const onClear = jest.fn();
    const onEnter = jest.fn();

    render(
      <NumericKeypad
        onNumberInput={onNumberInput}
        onClear={onClear}
        onEnter={onEnter}
      />
    );

    await user.click(screen.getByLabelText("Clear input"));
    expect(onClear).toHaveBeenCalled();
  });

  it("calls onEnter when Enter is clicked", async () => {
    const user = userEvent.setup();
    const onNumberInput = jest.fn();
    const onClear = jest.fn();
    const onEnter = jest.fn();

    render(
      <NumericKeypad
        onNumberInput={onNumberInput}
        onClear={onClear}
        onEnter={onEnter}
      />
    );

    await user.click(screen.getByLabelText("Enter position"));
    expect(onEnter).toHaveBeenCalled();
  });
});
