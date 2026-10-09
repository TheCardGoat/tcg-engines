// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { grandArchivePlayerId } from "@tcg/grand-archive-engine/runtime";
import { AnimationPlanV2Schema } from "@tcg/protocol/animations";
import { GrandArchiveSimulatorProviders } from "./App";
import { GrandArchiveTabletop } from "./GrandArchiveTabletop";
import { GRAND_ARCHIVE_VISUAL_FIXTURES } from "./fixtures";
import type { GrandArchiveHarnessFixture } from "./fixtureProjection";
import { grandArchiveCombatAnimation } from "./grand-archive-combat-animation";
const fixture = (id: string) => GRAND_ARCHIVE_VISUAL_FIXTURES.find((entry) => entry.id === id)!;
afterEach(cleanup);
function mount(value: GrandArchiveHarnessFixture) {
  const submit = vi.fn(() => true);
  const element = (current: GrandArchiveHarnessFixture) => (
    <GrandArchiveSimulatorProviders>
      <GrandArchiveTabletop fixture={current} onSubmitProtocolInteraction={submit} />
    </GrandArchiveSimulatorProviders>
  );
  const result = render(element(value));
  return {
    submit,
    update: (next: GrandArchiveHarnessFixture) => result.rerender(element(next)),
    ...result,
  };
}
it("names the actual damage window and current combat step", () => {
  mount(fixture("combat-damage"));
  expect(screen.getByRole("region", { name: "Combat flow" }).textContent).toContain(
    "Before damage",
  );
  expect(document.querySelector('[aria-current="step"]')?.textContent).toBe("Damage");
  expect(screen.getByText("Opportunity · You may act")).toBeTruthy();
});
it("announces the opponent Opportunity without advancing combat", () => {
  const current = fixture("combat-damage");
  const opponent = current.table.seats.find((seat) => seat.perspective === "top")!;
  mount({
    ...current,
    waitState: { kind: "opportunity", playerId: grandArchivePlayerId(opponent.id) },
  });
  expect(screen.getByText("Opportunity · Opponent may act")).toBeTruthy();
});
it.each(["Retaliate", "Take hit"])(
  "submits %s directly, without a confirmation",
  async (choice) => {
    const current = fixture("combat-retaliation");
    const { submit } = mount(current);
    expect(submit).not.toHaveBeenCalled();
    fireEvent.click(await screen.findByRole("button", { name: choice }));
    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
    const call = submit.mock.calls[0];
    expect(call).toBeTruthy();
    expect(screen.queryByTestId("interaction-submit-action")).toBeNull();
  },
);
it("removes the combat rail after cleanup", () => {
  const { update } = mount(fixture("combat-damage"));
  update(fixture("combat-result"));
  expect(screen.queryByRole("region", { name: "Combat flow" })).toBeNull();
});
it("animates authoritative simultaneous damage once, never a forecast or duplicate snapshot", () => {
  const before = fixture("combat-damage");
  const after = fixture("combat-result");
  const plan = grandArchiveCombatAnimation(before, after);
  expect(plan).not.toBeNull();
  expect(AnimationPlanV2Schema.safeParse(plan).success).toBe(true);
  expect(
    plan!.steps.filter((step) => step.type === "combat").every((step) => step.startAtMs === 0),
  ).toBe(true);
  expect(plan!.steps.some((step) => step.type === "valueDelta")).toBe(true);
  expect(grandArchiveCombatAnimation(before, before)).toBeNull();
  expect(grandArchiveCombatAnimation(after, after)).toBeNull();
  expect(grandArchiveCombatAnimation(after, before)).toBeNull();
});

it("does not resubmit rejected retaliation until explicitly retried or reset", async () => {
  const current = fixture("combat-retaliation");
  const submit = vi.fn(() => false);
  render(
    <GrandArchiveSimulatorProviders>
      <GrandArchiveTabletop fixture={current} onSubmitProtocolInteraction={submit} />
    </GrandArchiveSimulatorProviders>,
  );
  fireEvent.click(await screen.findByRole("button", { name: "Take hit" }));
  await screen.findByRole("button", { name: "Retry selection" });
  expect(submit).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole("button", { name: "Retry selection" }));
  expect(submit).toHaveBeenCalledTimes(2);
  fireEvent.click(screen.getByRole("button", { name: "Reset selection" }));
  fireEvent.click(screen.getByRole("button", { name: "Retaliate" }));
  expect(submit).toHaveBeenCalledTimes(3);
});

it("renders combat without an effects-stack zone", () => {
  const current = fixture("combat-damage");
  mount({
    ...current,
    table: {
      ...current.table,
      zones: current.table.zones.filter((zone) => zone.id !== "effects-stack"),
    },
  });
  expect(screen.getByRole("region", { name: "Combat flow" }).textContent).toContain(
    "Before damage",
  );
});
