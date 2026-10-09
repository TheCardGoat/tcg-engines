import { MantineProvider } from "@mantine/core";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, expect, test } from "vite-plus/test";
import InteractionCatalogPage from "./InteractionCatalogPage";

afterEach(cleanup);
function open(scenario: string) {
  render(
    <MantineProvider>
      <MemoryRouter initialEntries={[`/interactions/${scenario}`]}>
        <Routes>
          <Route path="/interactions/:scenario" element={<InteractionCatalogPage />} />
        </Routes>
      </MemoryRouter>
    </MantineProvider>,
  );
}
test("optional decline submits false without a dependent amount and can reset", () => {
  open("conditional");
  fireEvent.click(screen.getByRole("button", { name: "Skip effect" }));
  expect(screen.getByText("Submitted conditional: valid")).toBeTruthy();
  expect(screen.getByText(/"accept": false/)).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Reset" }));
  expect(screen.getByText("No submission")).toBeTruthy();
});
test("allocation can only submit when the required total is assigned", () => {
  open("allocation");
  expect(screen.getByRole("button", { name: "Confirm allocation" }).hasAttribute("disabled")).toBe(
    true,
  );
  fireEvent.click(screen.getByRole("button", { name: "Increase allocation for Card alpha" }));
  fireEvent.click(screen.getByRole("button", { name: "Increase allocation for Card alpha" }));
  fireEvent.click(screen.getByRole("button", { name: "Increase allocation for Card beta" }));
  fireEvent.click(screen.getByRole("button", { name: "Confirm allocation" }));
  expect(screen.getByText("Submitted allocation: valid")).toBeTruthy();
});
test("embedded preview submits in a region without board placement controls", () => {
  open("number?layout=panel");
  expect(screen.getByRole("region", { name: "Current effect" }).getAttribute("data-embedded")).toBe(
    "true",
  );
  fireEvent.click(screen.getByRole("button", { name: "Prompt controls" }));
  expect(screen.queryByText(/Move to (top|bottom)/)).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Confirm amount" }));
  expect(screen.getByText("Submitted number: valid")).toBeTruthy();
});
test("portalled choices retain the host prompt colors", () => {
  open("single-target");
  const prompt = screen.getByTestId("interaction-resolution-prompt");
  prompt.style.setProperty("--interaction-surface", "#ffffff");
  prompt.style.setProperty("--interaction-text", "#0f172a");
  fireEvent.click(screen.getByRole("button", { name: "Choose card" }));
  const backdrop = screen.getByRole("dialog", { name: "Available choices" }).parentElement!;
  expect(backdrop.style.getPropertyValue("--interaction-surface")).toBe("#ffffff");
  expect(backdrop.style.getPropertyValue("--interaction-text")).toBe("#0f172a");
  fireEvent.click(screen.getByRole("button", { name: "Card alpha" }));
  fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
  expect(screen.getByText("Submitted single-target: valid")).toBeTruthy();
});
