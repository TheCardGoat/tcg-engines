import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vite-plus/test";
import { MantineProvider } from "@mantine/core";
import MatchPanelFixtures from "./MatchPanelFixtures";
afterEach(cleanup);
test("chat sends only to the local fixture and respects disabled input", () => {
  render(
    <MantineProvider>
      <MatchPanelFixtures entities={[]} />
    </MantineProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Ready" }));
  expect(screen.getByRole("log", { name: "Chat messages" }).textContent).toContain("Ready");
  fireEvent.click(screen.getByRole("checkbox", { name: "Allow preview messages" }));
  expect(screen.getByRole("button", { name: "Ready" }).hasAttribute("disabled")).toBe(true);
});
test("drop recovery and reset use local controlled state", () => {
  render(
    <MantineProvider>
      <MatchPanelFixtures entities={[]} />
    </MantineProvider>,
  );
  fireEvent.click(screen.getByRole("checkbox", { name: "Drop claim eligible" }));
  const drop = screen.getByRole("button", { name: "Drop" });
  expect(drop.hasAttribute("disabled")).toBe(false);
  fireEvent.click(drop);
  expect(screen.getByText("Preview drop claimed. No match was changed.")).toBeTruthy();
  expect(drop.hasAttribute("disabled")).toBe(true);
  fireEvent.click(screen.getByRole("button", { name: "Reset panels" }));
  expect(screen.getByDisplayValue("connected")).toBeTruthy();
});
