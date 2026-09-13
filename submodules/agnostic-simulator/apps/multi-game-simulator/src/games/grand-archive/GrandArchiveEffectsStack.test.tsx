// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { GrandArchiveSimulatorProviders } from "./App";
import { GRAND_ARCHIVE_VISUAL_FIXTURES } from "./fixtures";
import { GrandArchiveEffectsStack } from "./GrandArchiveEffectsStack";

afterEach(cleanup);
const fixture = GRAND_ARCHIVE_VISUAL_FIXTURES.find((entry) => entry.id === "effects-stack")!;
const zone = fixture.table.zones.find((entry) => entry.id === "effects-stack")!;
const source = fixture.entities.find((entry) => entry.id === zone.entityIds[0])!;
const entities = [source, { ...source, id: "response", title: "Response", ownerId: "opponent" }];

function mount(candidateIds: string[] = []) {
  const onSelect = vi.fn();
  const onPreview = vi.fn();
  const element = (ids: readonly string[]) => (
    <GrandArchiveSimulatorProviders>
      <GrandArchiveEffectsStack
        zone={{ ...zone, entityIds: [...ids] }}
        entities={entities}
        viewerId={source.ownerId}
        candidateIds={candidateIds}
        selectedIds={[]}
        selectedOrder={new Map()}
        onSelect={onSelect}
        onPreview={onPreview}
      />
    </GrandArchiveSimulatorProviders>
  );
  const result = render(element(entities.map((entry) => entry.id)));
  return { onSelect, onPreview, update: (ids: readonly string[]) => result.rerender(element(ids)) };
}

it("shows the last added effect first, expands for inspection, and cycles placement", () => {
  mount();
  const panel = screen.getByRole("region", { name: "Effects Stack, 2 layers" });
  expect(
    within(panel)
      .getAllByRole("button", { name: /controlled by/ })[0]
      ?.getAttribute("aria-label"),
  ).toContain("Response, layer 2, resolves next, controlled by Opponent");
  fireEvent.click(screen.getByRole("button", { name: "Expand Effects Stack" }));
  expect(
    screen.getByRole("button", { name: "Collapse Effects Stack" }).getAttribute("aria-expanded"),
  ).toBe("true");
  fireEvent.click(screen.getByRole("button", { name: "Move Effects Stack to top" }));
  expect(panel.getAttribute("data-placement")).toBe("top");
  fireEvent.click(screen.getByRole("button", { name: "Move Effects Stack to bottom" }));
  fireEvent.click(screen.getByRole("button", { name: "Move Effects Stack to center" }));
  expect(panel.getAttribute("data-placement")).toBe("center");
});

it("inspects with keyboard or touch without submitting a game action and clears removed previews", () => {
  const { onPreview, onSelect, update } = mount();
  const response = screen.getByRole("button", { name: /Response, layer 2/ });
  fireEvent.focus(response);
  expect(onPreview).toHaveBeenLastCalledWith(entities[1]);
  fireEvent.keyDown(response, { key: "Escape" });
  expect(onPreview).toHaveBeenLastCalledWith(undefined);
  fireEvent.click(response);
  expect(onPreview).toHaveBeenLastCalledWith(entities[1]);
  expect(onSelect).not.toHaveBeenCalled();
  update([source.id]);
  expect(onPreview).toHaveBeenLastCalledWith(undefined);
  update([]);
  expect(screen.queryByRole("region", { name: /Effects Stack/ })).toBeNull();
});

it("keeps legal stack targets exposed and selects stack item ids without reordering", () => {
  const { onSelect } = mount([source.id]);
  const panel = screen.getByRole("region", { name: "Effects Stack, 2 layers" });
  expect(panel.getAttribute("data-expanded")).toBe("true");
  expect(screen.queryByRole("button", { name: /Collapse Effects Stack/ })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: new RegExp(`${source.title}, layer 1`) }));
  expect(onSelect).toHaveBeenCalledExactlyOnceWith(source.id);
  fireEvent.click(screen.getByRole("button", { name: /Response, layer 2/ }));
  expect(onSelect).toHaveBeenCalledTimes(1);
});
