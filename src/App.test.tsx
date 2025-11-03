import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App", () => {
  it("renders the app header", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: "Foretoken" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("parkrun finish token generator")
    ).toBeInTheDocument();
  });

  it("displays default position 1", () => {
    render(<App />);
    expect(screen.getByText("P")).toBeInTheDocument();
    const input = screen.getByLabelText(
      "Edit finish token number"
    ) as HTMLInputElement;
    expect(input.value).toBe("0001");
  });

  it("updates position when editing the token number", async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByLabelText(
      "Edit finish token number"
    ) as HTMLInputElement;
    await user.clear(input);
    await user.type(input, "308");
    await user.keyboard("{Enter}");

    expect(input.value).toBe("0308");
  });

  it("only accepts numeric input", async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByLabelText(
      "Edit finish token number"
    ) as HTMLInputElement;
    await user.clear(input);
    await user.type(input, "abc123");
    expect(input.value).toBe("123");
  });
});
