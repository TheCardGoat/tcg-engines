// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { GrandArchiveDamageFeedback } from "./GrandArchiveDamageFeedback";
import { grandArchiveDamageImpacts } from "./grand-archive-damage-feedback";
import { GRAND_ARCHIVE_VISUAL_FIXTURES } from "./fixtures";
import type { GrandArchiveHarnessFixture } from "./fixtureProjection";
import { playSimulatorSound } from "@tcg/simulator-presentation/audio/sound-service";
vi.mock("@tcg/simulator-presentation/audio/sound-service", () => ({ playSimulatorSound: vi.fn() }));
vi.mock("@tcg/simulator-presentation/effects", () => ({
  DamageStrikeOverlay: ({
    strike,
    onImpact,
  }: {
    strike: { targets: { amount: number }[] };
    onImpact: () => void;
  }) => <button onClick={onImpact}>Impact {strike.targets[0]!.amount}</button>,
}));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
const before = GRAND_ARCHIVE_VISUAL_FIXTURES.find((entry) => entry.id === "combat-damage")!;
const after = GRAND_ARCHIVE_VISUAL_FIXTURES.find((entry) => entry.id === "combat-result")!;
it("uses resolved native amounts for every simultaneous combat recipient", () => {
  const impacts = grandArchiveDamageImpacts(before, after);
  expect(impacts.length).toBeGreaterThan(0);
  if (after.combatView?.damage.kind !== "dealt") throw new Error("Missing actual damage");
  expect(impacts.reduce((sum, entry) => sum + entry.amount, 0)).toBe(
    after.combatView.damage.amounts.reduce((sum, entry) => sum + entry.amount, 0),
  );
  expect(grandArchiveDamageImpacts(before, before)).toEqual([]);
  expect(grandArchiveDamageImpacts(after, before)).toEqual([]);
});
it("shows actual damage growth after combat cleanup without inventing a source", () => {
  const entity = before.entities.find((entry) => entry.face === "public")!;
  const changed: GrandArchiveHarnessFixture = {
    ...before,
    combatView: null,
    table: {
      ...before.table,
      status: { ...before.table.status, stateVersion: before.table.status.stateVersion + 1 },
    },
    entities: before.entities.map((entry) =>
      entry.id !== entity.id
        ? entry
        : {
            ...entry,
            decorations: [
              ...(entry.decorations ?? []).filter((item) => item.id !== "ga:counter:damage"),
              {
                id: "ga:counter:damage",
                slot: "bottom-end",
                tone: "negative",
                content: { kind: "text", text: "4" },
                ariaLabel: "Damage: 4",
              },
            ],
          },
    ),
  };
  expect(grandArchiveDamageImpacts({ ...before, combatView: null }, changed)).toEqual([
    { targetId: entity.id, amount: 4 },
  ]);
});
it("plays one impact sound per transition and clears overlays on viewer/reset changes", () => {
  const host = document.createElement("div");
  vi.spyOn(host, "getBoundingClientRect").mockReturnValue({
    left: 0,
    top: 0,
    width: 1000,
    height: 800,
    right: 1000,
    bottom: 800,
    x: 0,
    y: 0,
    toJSON() {},
  });
  const positions = new Map(
    [...before.entities, ...after.entities].map((entity) => [
      entity.id,
      { left: 30, top: 30, width: 10, height: 20 },
    ]),
  );
  const ref = { current: host };
  const element = (fixture: GrandArchiveHarnessFixture, resetKey = "p1") => (
    <GrandArchiveDamageFeedback
      fixture={fixture}
      positions={positions}
      host={ref}
      resetKey={resetKey}
    />
  );
  const view = render(element(before));
  view.rerender(element(after));
  const buttons = screen.getAllByRole("button", { name: /Impact/, hidden: true });
  for (const button of buttons) fireEvent.click(button);
  expect(playSimulatorSound).toHaveBeenCalledTimes(1);
  expect(playSimulatorSound).toHaveBeenCalledWith("combat.hit", expect.any(Function));
  const allowed = vi.mocked(playSimulatorSound).mock.calls[0]![1]!;
  expect(allowed()).toBe(true);
  view.rerender(element(after, "p2"));
  expect(screen.queryByRole("button", { name: /Impact/, hidden: true })).toBeNull();
  expect(allowed()).toBe(false);
});
