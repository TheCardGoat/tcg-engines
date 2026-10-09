import { MantineProvider } from "@mantine/core";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vite-plus/test";
import { AlphaClashInteractionPreview } from "./AlphaClashInteractionPreview";

afterEach(cleanup);
function open(scenario: string) {
  render(
    <MantineProvider>
      <AlphaClashInteractionPreview scenario={scenario} />
    </MantineProvider>,
  );
}
test("declining an optional native choice preserves false as no", () => {
  open("option");
  fireEvent.click(screen.getByRole("button", { name: "Decline effect" }));
  expect(screen.getByText(/"optionId": "no"/)).toBeTruthy();
});
test("native count accepts zero rather than treating it as missing", () => {
  open("count");
  fireEvent.change(screen.getByRole("spinbutton", { name: "Amount" }), { target: { value: "0" } });
  fireEvent.click(screen.getByRole("button", { name: "Confirm amount" }));
  expect(screen.getByText(/"optionId": "0"/)).toBeTruthy();
});
test("a native modal choice returns its native option identifier", () => {
  open("modal");
  fireEvent.click(screen.getByRole("radio", { name: "Recover health" }));
  expect(screen.getByText(/"optionId": "recover"/)).toBeTruthy();
});

test("native target selection survives conversion to a command", () => {
  open("target");
  fireEvent.click(screen.getByRole("button", { name: /^Choose card$/ }));
  fireEvent.click(screen.getByRole("button", { name: "Opponent · Crimson Warden, Last Ember" }));
  expect(screen.getByText(/"optionId": "player-two-2"/)).toBeTruthy();
});
test("native division requires the full total and preserves per-card amounts", () => {
  open("division");
  const confirm = screen.getByRole("button", { name: "Confirm allocation" });
  expect(confirm.hasAttribute("disabled")).toBe(true);
  fireEvent.click(
    screen.getByRole("button", {
      name: "Increase allocation for You · Tomi Titan, Tomorrow's Shield",
    }),
  );
  fireEvent.click(
    screen.getByRole("button", {
      name: "Increase allocation for You · Tomi Titan, Tomorrow's Shield",
    }),
  );
  fireEvent.click(
    screen.getByRole("button", {
      name: "Increase allocation for Opponent · Crimson Warden, Last Ember",
    }),
  );
  fireEvent.click(confirm);
  expect(screen.getByText(/"player-one-1": 2/)).toBeTruthy();
  expect(screen.getByText(/"player-two-2": 1/)).toBeTruthy();
});
