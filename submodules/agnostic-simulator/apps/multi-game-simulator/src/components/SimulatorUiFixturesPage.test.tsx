import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vite-plus/test";

import SimulatorUiFixturesPage from "./SimulatorUiFixturesPage";

describe("SimulatorUiFixturesPage", () => {
  test("renders the requested deterministic disconnected state", async () => {
    window.history.replaceState({}, "", "/simulator-ui-fixtures?state=disconnected");
    render(<SimulatorUiFixturesPage />);

    await waitFor(() => {
      expect(screen.getByRole("main").getAttribute("data-fixture-state")).toBe("disconnected");
    });
    expect(screen.getByRole("timer", { name: "You: 00:09" })).toBeTruthy();
    const connectionTriggers = screen.getAllByLabelText("You connection status: Disconnected");
    expect(connectionTriggers).toHaveLength(2);

    fireEvent.click(connectionTriggers[0]);
    expect(screen.getByRole("dialog", { name: "You connection details" })).toBeTruthy();
    expect(connectionTriggers[0].getAttribute("aria-expanded")).toBe("true");

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "You connection details" })).toBeNull();
    expect(document.activeElement).toBe(connectionTriggers[0]);
  });
});
