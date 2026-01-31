import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AboutBox } from "./AboutBox";

describe("AboutBox", () => {
  const defaultProps = {
    isOpen: false,
    onToggle: jest.fn(),
    ariaLabel: "Toggle About",
    toggleText: "Toggle Text",
    children: "Compelling content.",
  };

  it("renders closed by default (content hidden)", () => {
    render(<AboutBox {...defaultProps} />);
    expect(screen.getByText("Toggle Text")).toBeInTheDocument();
    expect(screen.queryByText("Compelling content.")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Toggle About" })
    ).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("+")).toBeInTheDocument();
  });

  it("renders open when isOpen is true (content visible)", () => {
    render(<AboutBox {...defaultProps} isOpen={true} />);
    expect(screen.getByText("Compelling content.")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Toggle About" })
    ).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("−")).toBeInTheDocument();
  });

  it("calls onToggle when button is clicked", async () => {
    const onToggle = jest.fn();
    const user = userEvent.setup();
    render(<AboutBox {...defaultProps} onToggle={onToggle} />);
    const button = screen.getByRole("button", { name: "Toggle About" });
    await user.click(button);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("renders custom ariaLabel and toggleText", () => {
    render(
      <AboutBox
        {...defaultProps}
        ariaLabel="Custom Label"
        toggleText="Show Info"
      />
    );
    expect(
      screen.getByRole("button", { name: "Custom Label" })
    ).toBeInTheDocument();
    expect(screen.getByText("Show Info")).toBeInTheDocument();
  });

  it("renders children as content when open", () => {
    render(<AboutBox {...defaultProps} isOpen={true} />);
    expect(screen.getByText("Compelling content.")).toBeInTheDocument();
  });

  it("does not render children when closed", () => {
    render(<AboutBox {...defaultProps} isOpen={false} />);
    expect(screen.queryByText("Compelling content.")).not.toBeInTheDocument();
  });

  it("renders toggle icon as '+' when closed and '−' when open", () => {
    const { rerender } = render(<AboutBox {...defaultProps} isOpen={false} />);
    expect(screen.getByText("+")).toBeInTheDocument();
    rerender(<AboutBox {...defaultProps} isOpen={true} />);
    expect(screen.getByText("−")).toBeInTheDocument();
  });
});
