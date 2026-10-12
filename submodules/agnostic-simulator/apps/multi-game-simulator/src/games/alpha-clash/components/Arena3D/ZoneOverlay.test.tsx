// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vite-plus/test";
import { ZoneOverlay } from "./ZoneOverlay";
import type { ArenaZone } from "./zones";

const player = { name: "Player", health: 20, maxHealth: 30, deckSize: 40, handSize: 3 };
const players = { "player-one": player, "player-two": player };
const accessory: ArenaZone = {
  id: "player-one:accessory",
  seat: "player-one",
  zone: "accessory",
  name: "Accessories",
  count: 2,
  x: 0,
  y: 0,
  width: 200,
  height: 100,
  captionY: 60,
  scaleX: false,
  counter: false,
};
const anchors = [
  {
    id: accessory.id,
    left: 10,
    top: 10,
    width: 200,
    height: 100,
    captionLeft: 110,
    captionTop: 120,
  },
];
afterEach(cleanup);
test("keyboard focus highlights the scene zone and click opens its contents without a tooltip", () => {
  const onOpen = vi.fn();
  const onHighlight = vi.fn();
  render(
    <ZoneOverlay
      players={players}
      zones={[accessory]}
      anchors={anchors}
      viewer="player-one"
      onHighlight={onHighlight}
      onOpen={onOpen}
    />,
  );
  const button = screen.getByRole("button", { name: "Your accessories · 2 cards" });
  fireEvent.focus(button);
  expect(onHighlight).toHaveBeenLastCalledWith(accessory.id);
  expect(screen.queryByRole("tooltip")).toBeNull();
  fireEvent.click(button);
  expect(onOpen).toHaveBeenCalledWith(accessory);
  fireEvent.blur(button);
  expect(onHighlight).toHaveBeenLastCalledWith(null);
});
test("accessible zone counts update when cards arrive without visible HTML labels", () => {
  const props = {
    players,
    anchors,
    viewer: "player-one" as const,
    onHighlight: vi.fn(),
    onOpen: vi.fn(),
  };
  const { rerender } = render(<ZoneOverlay {...props} zones={[{ ...accessory, count: 0 }]} />);
  expect(screen.getByRole("button", { name: "Your accessories · 0 cards" })).toBeDefined();
  rerender(<ZoneOverlay {...props} zones={[accessory]} />);
  expect(screen.getByRole("button", { name: "Your accessories · 2 cards" })).toBeDefined();
  expect(screen.queryByText("Accessories")).toBeNull();
});

test("retrieval enables only its native destination, including an empty zone", () => {
  const opponent: ArenaZone = { ...accessory, id: "player-two:accessory", seat: "player-two" };
  const onOpen = vi.fn();
  render(
    <ZoneOverlay
      players={players}
      zones={[{ ...accessory, count: 0 }, opponent]}
      anchors={[...anchors, { ...anchors[0], id: opponent.id }]}
      viewer="player-one"
      destinationIds={new Set([accessory.id])}
      onOpen={onOpen}
      onHighlight={vi.fn()}
    />,
  );
  expect(screen.getAllByRole("button")).toHaveLength(1);
  fireEvent.click(
    screen.getByRole("button", { name: "Place card here · Your accessories · 0 cards" }),
  );
  expect(onOpen).toHaveBeenCalledWith(expect.objectContaining({ id: accessory.id, count: 0 }));
});

test("contender label uses current health instead of card count", () => {
  const contender = { ...accessory, zone: "contender" as const, name: "Contender" };
  render(
    <ZoneOverlay
      zones={[contender]}
      anchors={anchors}
      viewer="player-one"
      players={players}
      onOpen={vi.fn()}
      onHighlight={vi.fn()}
    />,
  );
  expect(screen.getByRole("button", { name: "Your contender · 20 health" })).toBeDefined();
});

test.each([false, true])(
  "pile targets stay ordered and separate for both seats (compact=%s)",
  (compact) => {
    const seats = ["player-one", "player-two"] as const;
    const piles = ["deck", "oblivion", "banished"] as const;
    const zones = seats.flatMap((seat) =>
      piles.map((zone) => ({
        ...accessory,
        id: `${seat}:${zone}`,
        seat,
        zone,
        name: zone,
        count: 0,
      })),
    );
    const pileAnchors = zones.map((zone, index) => ({
      ...anchors[0],
      id: zone.id,
      captionLeft: 800 + (index % 3) * 70,
      captionTop: zone.seat === "player-one" ? 500 : 120,
    }));
    render(
      <ZoneOverlay
        zones={zones}
        anchors={pileAnchors}
        viewer="player-one"
        players={players}
        compact={compact}
        onOpen={vi.fn()}
        onHighlight={vi.fn()}
      />,
    );
    for (const owner of ["Your", "Opponent's"]) {
      const targets = piles.map((zone) =>
        screen.getByRole("button", { name: `${owner} ${zone} · 0 cards` }),
      );
      const top = targets[0].style.top;
      for (let index = 0; index < targets.length; index++) {
        expect(targets[index].style.top).toBe(top);
        expect(parseFloat(targets[index].style.width)).toBeGreaterThanOrEqual(44);
        if (index > 0) {
          const previous = targets[index - 1];
          expect(parseFloat(targets[index].style.left)).toBeGreaterThan(
            parseFloat(previous.style.left) + parseFloat(previous.style.width),
          );
        }
      }
    }
  },
);
