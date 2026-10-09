// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vite-plus/test";
import { ZoneOverlay } from "./ZoneOverlay";
import type { ArenaZone } from "./zones";

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
  const props = { anchors, viewer: "player-one" as const, onHighlight: vi.fn(), onOpen: vi.fn() };
  const { rerender } = render(<ZoneOverlay {...props} zones={[{ ...accessory, count: 0 }]} />);
  expect(screen.getByRole("button", { name: "Your accessories · 0 cards" })).toBeDefined();
  rerender(<ZoneOverlay {...props} zones={[accessory]} />);
  expect(screen.getByRole("button", { name: "Your accessories · 2 cards" })).toBeDefined();
  expect(screen.queryByText("Accessories")).toBeNull();
});
