import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, expect, it, vi } from "vitest";
import type { LiveBoardState } from "./components/board-types";
import AlphaClashChoiceBoardFixture from "./AlphaClashChoiceBoardFixture";
let visibleBoard: LiveBoardState;
vi.mock("./components/Arena3D/Scene", () => ({
  ArenaScene: ({ board }: { board: LiveBoardState }) => {
    visibleBoard = board;
    return <div>Real board scene boundary</div>;
  },
}));
beforeAll(() => {
  window.matchMedia = vi.fn().mockReturnValue({ matches: false });
});
afterEach(cleanup);
function choose(name: string, destination: string) {
  fireEvent.click(screen.getAllByRole("button", { name: `Pick up ${name}` })[0], {
    detail: 0,
  });
  fireEvent.click(screen.getByRole("button", { name: `Place in ${destination}` }));
}
function confirm() {
  fireEvent.click(screen.getByRole("button", { name: "Confirm preview" }));
}
it("resource cards stay ready during the draft and engage only on confirm", () => {
  render(<AlphaClashChoiceBoardFixture kind="resources" />);
  choose("white · resource 1", "White");
  choose("green · resource 2", "Any color");
  expect(visibleBoard.cards.find((c) => c.instanceId === "resource-1")?.ready).toBe(true);
  confirm();
  expect(visibleBoard.cards.find((c) => c.instanceId === "resource-1")).toMatchObject({
    ready: false,
    zone: "resource",
  });
  expect(visibleBoard.cards.find((c) => c.instanceId === "resource-2")).toMatchObject({
    ready: false,
    zone: "resource",
  });
});
it("reveal preserves the selected card zone and inspect does not move cards", () => {
  render(<AlphaClashChoiceBoardFixture kind="destination" />);
  fireEvent.change(screen.getByLabelText("Variant"), { target: { value: "Reveal" } });
  choose("Haven, Hiding in Plain Sight", "Reveal");
  confirm();
  expect(visibleBoard.cards.find((c) => c.instanceId === "hand-1")?.zone).toBe("hand");
});
it("discard moves only the selected card after confirmation", () => {
  render(<AlphaClashChoiceBoardFixture kind="destination" />);
  choose("Haven, Hiding in Plain Sight", "Discard");
  expect(visibleBoard.cards.find((c) => c.instanceId === "hand-1")?.zone).toBe("hand");
  confirm();
  expect(visibleBoard.cards.find((c) => c.instanceId === "hand-1")?.zone).toBe("oblivion");
});
it("changing an optional branch clears dependent choices", () => {
  render(<AlphaClashChoiceBoardFixture kind="optional" />);
  choose("Use", "Use effect?");
  choose("Sonoro", "Top of Oblivion → deck bottom");
  fireEvent.click(screen.getByRole("button", { name: "Remove Use" }));
  choose("Decline", "Use effect?");
  confirm();
  expect(visibleBoard.cards.find((c) => c.instanceId === "pile-1")?.zone).toBe("oblivion");
});
it("Restore permits only the top Oblivion card and moves it to deck", () => {
  render(<AlphaClashChoiceBoardFixture kind="optional" />);
  choose("Use", "Use effect?");
  expect(screen.queryByRole("button", { name: "Pick up Magnate, Cunning Planner" })).toBeNull();
  choose("Sonoro", "Top of Oblivion → deck bottom");
  confirm();
  expect(visibleBoard.cards.find((c) => c.instanceId === "pile-1")?.zone).toBe("deck");
});
it("zero is a valid number and pause prevents confirmation", () => {
  render(<AlphaClashChoiceBoardFixture kind="number" />);
  fireEvent.click(screen.getByLabelText("Pause input"));
  expect(screen.getByRole("button", { name: "Confirm preview" }).hasAttribute("disabled")).toBe(
    true,
  );
  fireEvent.click(screen.getByLabelText("Pause input"));
  confirm();
  expect(screen.getByText("Choose X: 0")).toBeTruthy();
});
it("Barrage blocks incomplete allocation, then records damage on both targets", () => {
  render(<AlphaClashChoiceBoardFixture kind="allocation" />);
  for (let n = 1; n <= 5; n++) choose(`Damage ${n}`, "Avenging Guy, Trying to Help");
  expect(screen.getByRole("button", { name: "Confirm preview" }).hasAttribute("disabled")).toBe(
    true,
  );
  choose("Damage 6", "The Avenging Guy");
  confirm();
  expect(visibleBoard.cards.find((c) => c.instanceId === "enemy-1")?.phaseDamage).toBe(5);
  expect(visibleBoard.cards.find((c) => c.instanceId === "enemy-2")?.phaseDamage).toBe(1);
});
it("search exposes only allowed cards and retrieves one to hand", () => {
  render(<AlphaClashChoiceBoardFixture kind="search" />);
  choose("Sonoro", "Hand");
  confirm();
  expect(visibleBoard.cards.find((c) => c.instanceId === "look-1")?.zone).toBe("hand");
  expect(visibleBoard.players["player-one"].deckSize).toBe(31);
});
it("Foretell requires both permitted cards and keeps groups ordered", () => {
  render(<AlphaClashChoiceBoardFixture kind="foretell" />);
  choose("Sonoro", "Top");
  expect(screen.getByRole("button", { name: "Confirm preview" }).hasAttribute("disabled")).toBe(
    true,
  );
  choose("Magnate, Cunning Planner", "Bottom");
  confirm();
  expect(screen.getByText(/Foretell two cards:/).textContent).toContain('"bottom":["look-2"]');
});
it("Wrath requires its Dragon payment and target after Use", () => {
  render(<AlphaClashChoiceBoardFixture kind="optional" />);
  fireEvent.change(screen.getByLabelText("Variant"), { target: { value: "Wrath" } });
  choose("Use", "Use effect?");
  choose("Anzudak, Aerial Dominator", "Reveal Dragon → deck bottom");
  expect(screen.getByRole("button", { name: "Confirm preview" }).hasAttribute("disabled")).toBe(
    true,
  );
  choose("Target", "The Avenging Guy");
  confirm();
  expect(visibleBoard.cards.find((c) => c.instanceId === "hand-3")?.zone).toBe("deck");
  expect(visibleBoard.cards.find((c) => c.instanceId === "enemy-2")?.phaseDamage).toBe(3);
});
it("Void without an optional payment does not offer Decline", () => {
  render(<AlphaClashChoiceBoardFixture kind="optional" />);
  fireEvent.change(screen.getByLabelText("Variant"), { target: { value: "Void" } });
  expect(screen.queryByRole("button", { name: "Pick up Decline" })).toBeNull();
  choose("Resolve", "Resolve trigger");
  confirm();
  expect(visibleBoard.cards.find((c) => c.instanceId === "look-1")?.zone).toBe("hand");
});
