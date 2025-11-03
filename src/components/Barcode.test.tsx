import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BarcodeDisplay } from "./Barcode";

describe("BarcodeDisplay", () => {
  const mockOnPositionChange = jest.fn();
  const mockOnNext = jest.fn();
  const mockOnPrevious = jest.fn();

  const defaultProps = {
    position: 1,
    onPositionChange: mockOnPositionChange,
    onNext: mockOnNext,
    onPrevious: mockOnPrevious,
    canGoNext: true,
    canGoPrevious: false,
  };

  beforeEach(() => {
    mockOnPositionChange.mockClear();
    mockOnNext.mockClear();
    mockOnPrevious.mockClear();
  });

  it("displays the token prefix P", () => {
    render(<BarcodeDisplay {...defaultProps} />);
    expect(screen.getByText("P")).toBeInTheDocument();
  });

  it("displays the numeric part for position 1", () => {
    render(<BarcodeDisplay {...defaultProps} />);
    const input = screen.getByLabelText(
      "Edit finish token number"
    ) as HTMLInputElement;
    expect(input.value).toBe("0001");
  });

  it("displays the numeric part for position 308", () => {
    render(
      <BarcodeDisplay {...defaultProps} position={308} canGoPrevious={true} />
    );
    const input = screen.getByLabelText(
      "Edit finish token number"
    ) as HTMLInputElement;
    expect(input.value).toBe("0308");
  });

  it("has toggle buttons for barcode types", () => {
    render(<BarcodeDisplay {...defaultProps} />);
    expect(screen.getByLabelText("Switch to 1D barcode")).toBeInTheDocument();
    expect(screen.getByLabelText("Switch to QR code")).toBeInTheDocument();
  });

  it("can toggle between barcode types", async () => {
    const user = userEvent.setup();
    render(<BarcodeDisplay {...defaultProps} />);
    const qrButton = screen.getByLabelText("Switch to QR code");
    await user.click(qrButton);
    expect(qrButton).toHaveClass("active");
  });

  it("allows editing the numeric part", async () => {
    const user = userEvent.setup();
    render(<BarcodeDisplay {...defaultProps} />);
    const input = screen.getByLabelText(
      "Edit finish token number"
    ) as HTMLInputElement;
    await user.click(input);
    await user.type(input, "308");
    await user.keyboard("{Enter}");
    expect(mockOnPositionChange).toHaveBeenCalledWith(308);
  });

  it("has navigation buttons", () => {
    render(<BarcodeDisplay {...defaultProps} />);
    expect(screen.getByLabelText("Previous position")).toBeInTheDocument();
    expect(screen.getByLabelText("Next position")).toBeInTheDocument();
  });

  it("calls onNext when next button is clicked", async () => {
    const user = userEvent.setup();
    render(<BarcodeDisplay {...defaultProps} />);
    const nextButton = screen.getByLabelText("Next position");
    await user.click(nextButton);
    expect(mockOnNext).toHaveBeenCalled();
  });

  it("calls onPrevious when previous button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <BarcodeDisplay {...defaultProps} position={308} canGoPrevious={true} />
    );
    const prevButton = screen.getByLabelText("Previous position");
    await user.click(prevButton);
    expect(mockOnPrevious).toHaveBeenCalled();
  });

  it("disables previous button when canGoPrevious is false", () => {
    render(<BarcodeDisplay {...defaultProps} />);
    const prevButton = screen.getByLabelText(
      "Previous position"
    ) as HTMLButtonElement;
    expect(prevButton.disabled).toBe(true);
  });

  it("does not disable next button as there is no maximum position", () => {
    render(
      <BarcodeDisplay {...defaultProps} position={9999} canGoNext={true} />
    );
    const nextButton = screen.getByLabelText(
      "Next position"
    ) as HTMLButtonElement;
    expect(nextButton.disabled).toBe(false);
  });
});
