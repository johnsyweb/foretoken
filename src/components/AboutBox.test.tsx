import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AboutBox } from "./AboutBox";

describe("AboutBox", () => {
  it("renders closed by default", () => {
    render(<AboutBox />);
    expect(screen.getByText("What is this?")).toBeInTheDocument();
    expect(screen.queryByText("About Foretoken")).not.toBeInTheDocument();
  });

  it("can be toggled open", async () => {
    const user = userEvent.setup();
    render(<AboutBox />);
    const toggle = screen.getByLabelText("Show app information");
    await user.click(toggle);
    expect(screen.getByText("About Foretoken")).toBeInTheDocument();
    expect(screen.getByText("Hide")).toBeInTheDocument();
  });

  it("can be toggled closed", async () => {
    const user = userEvent.setup();
    render(<AboutBox />);
    const toggle = screen.getByLabelText("Show app information");
    await user.click(toggle);
    expect(screen.getByText("About Foretoken")).toBeInTheDocument();
    await user.click(screen.getByLabelText("Hide app information"));
    expect(screen.queryByText("About Foretoken")).not.toBeInTheDocument();
  });

  it("contains usage instructions", async () => {
    const user = userEvent.setup();
    render(<AboutBox />);
    const toggle = screen.getByLabelText("Show app information");
    await user.click(toggle);
    expect(screen.getByText("How to use")).toBeInTheDocument();
    expect(screen.getByText(/Navigate:/)).toBeInTheDocument();
    expect(screen.getByText(/Enter position:/)).toBeInTheDocument();
  });
});
