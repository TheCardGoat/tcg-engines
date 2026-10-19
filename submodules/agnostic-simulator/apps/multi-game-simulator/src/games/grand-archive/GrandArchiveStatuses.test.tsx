// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MantineProvider } from "@mantine/core";
import type { SimulatorEntityDecoration } from "@tcg/simulator-contract";
import { GrandArchivePlayerStatuses } from "./GrandArchivePlayerStatuses";
import { GrandArchiveStatuses } from "./GrandArchiveStatuses";

afterEach(cleanup);
const statuses: SimulatorEntityDecoration[] = ["prepared", "distant", "negated"].map(
  (state, index) => ({
    id: `ga:${index === 2 ? "activation" : "state"}:${state}`,
    slot: "top-start",
    content: { kind: "text", text: state },
    ariaLabel: `${index === 2 ? "Activation" : "Object"} state: ${state}`,
    tone: "neutral",
  }),
);
describe("Grand Archive status inspection", () => {
  it("opens all scoped states by keyboard without triggering a card action", async () => {
    const user = userEvent.setup();
    const select = vi.fn();
    render(
      <MantineProvider env="test">
        <div onClick={select}>
          <GrandArchiveStatuses title="Ally" statuses={statuses} />
        </div>
      </MantineProvider>,
    );
    const button = screen.getByRole("button", { name: /^Inspect states on Ally/ });
    expect(button.textContent).toContain("+1");
    button.focus();
    await user.keyboard("{Enter}");
    const region = await screen.findByRole("region", { name: "States on Ally" });
    expect(region.textContent).toContain("Object state: prepared");
    expect(region.textContent).toContain("Activation state: negated");
    await user.click(within(region).getByRole("button", { name: "Close states" }));
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(select).not.toHaveBeenCalled();
  });
});

it("shows player state and mastery details through shared badges", async () => {
  const user = userEvent.setup();
  render(
    <MantineProvider env="test">
      <GrandArchivePlayerStatuses
        seat={{
          id: "p1",
          label: "Player One",
          perspective: "bottom",
          role: "human",
          counters: [],
          activeEffects: [
            {
              id: "agility",
              label: "Agility",
              detail: "Agility",
              sourceLabel: "Player state",
              targetKind: "seat",
              targetId: "p1",
              tone: "neutral",
            },
            {
              id: "mastery",
              label: "Shifting Currents",
              detail: "Shifting Currents · Wind: 2",
              sourceLabel: "Mastery",
              targetKind: "seat",
              targetId: "p1",
              tone: "neutral",
            },
          ],
        }}
      />
    </MantineProvider>,
  );
  await user.click(screen.getByRole("button", { name: "Inspect player states for Player One" }));
  const region = await screen.findByRole("region", { name: "Player states for Player One" });
  expect(region.textContent).toContain("Player state: Agility");
  expect(region.textContent).toContain("Mastery: Shifting Currents · Wind: 2");
});
