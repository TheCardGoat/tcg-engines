// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vite-plus/test";
import type { LiveBoardState } from "../board-types";
import { ArenaTurnHud } from "./ArenaTurnHud";

const board: LiveBoardState = {
  cards: [],
  players: {
    "player-one": { name: "One", health: 30, maxHealth: 30, handSize: 4, deckSize: 40 },
    "player-two": { name: "Two", health: 30, maxHealth: 30, handSize: 4, deckSize: 40 },
  },
  activePlayer: "player-one",
  turnNumber: 5,
  phaseName: "primary",
  portalOpen: false,
  clash: null,
  standbyCount: 0,
};

afterEach(cleanup);

test("shows response priority separately from the active turn", () => {
  render(
    <ArenaTurnHud
      board={{
        ...board,
        responseWindow: { openFor: "player-two", passedSeats: ["player-one"] },
      }}
      viewerSeat="player-two"
      participantNames={{ p1: "Aster", p2: "Nova" }}
      status="YOUR RESPONSE"
      waiting={false}
      reducedMotion={false}
    />,
  );
  const hud = screen.getByRole("status");
  expect(hud.getAttribute("aria-label")).toBe(
    "YOUR RESPONSE. Turn 5. Aster’s turn. Primary. Priority: You. Passed: Aster.",
  );
  expect(hud.getAttribute("data-owner")).toBe("local");
  expect(screen.getByTitle("Aster · passed")).toBeDefined();
  expect(screen.getByTitle("Nova · has priority")).toBeDefined();
});

test("a flipped viewer uses the active seat as priority outside a response", () => {
  render(
    <ArenaTurnHud
      board={board}
      viewerSeat="player-two"
      status="OPPONENT’S TURN"
      waiting
      reducedMotion
    />,
  );
  const hud = screen.getByRole("status");
  expect(hud.getAttribute("aria-label")).toContain("Opponent’s turn. Primary. Priority: Opponent.");
  expect(hud.getAttribute("data-owner")).toBe("rival");
  expect(hud.getAttribute("data-reduced-motion")).toBe("true");
  expect(screen.queryByText("Your turn")).toBeNull();
});

test("native expansion and clash phases keep their exact phase labels", () => {
  const props = {
    viewerSeat: "player-one" as const,
    status: "YOUR TURN",
    waiting: false,
    reducedMotion: true,
  };
  const { rerender } = render(
    <ArenaTurnHud {...props} board={{ ...board, phaseName: "expansion" }} />,
  );
  expect(screen.getByRole("status").getAttribute("aria-label")).toContain("Expansion.");
  expect(screen.getByTitle("Expansion · current phase")).toBeDefined();
  rerender(
    <ArenaTurnHud
      {...props}
      board={{
        ...board,
        phaseName: "clash",
        clash: { attackerId: "attacker", targetId: "target", step: "beforeDamage" },
      }}
    />,
  );
  expect(screen.getByRole("status").getAttribute("aria-label")).toContain("Clash · Before damage.");
  expect(screen.getByTitle("Primary · current phase")).toBeDefined();
});

test("turn details can be pinned, dismissed with Escape, and reopened without changing priority", () => {
  render(
    <ArenaTurnHud
      board={board}
      viewerSeat="player-one"
      status="YOUR TURN"
      waiting={false}
      reducedMotion
    />,
  );
  const trigger = screen.getByRole("button", { name: "Turn and priority details" });
  const hud = screen.getByRole("status");
  expect(trigger.getAttribute("aria-expanded")).toBe("false");
  fireEvent.click(trigger);
  expect(trigger.getAttribute("aria-expanded")).toBe("true");
  fireEvent.keyDown(trigger, { key: "Escape" });
  expect(trigger.getAttribute("aria-expanded")).toBe("false");
  expect(hud.getAttribute("data-dismissed")).toBe("true");
  fireEvent.click(trigger);
  expect(trigger.getAttribute("aria-expanded")).toBe("true");
  fireEvent.mouseDown(document.body);
  expect(trigger.getAttribute("aria-expanded")).toBe("false");
  expect(hud.getAttribute("data-priority-seat")).toBe("player-one");
});

test("setup and match completion do not announce playable priority", () => {
  const props = {
    viewerSeat: "player-one" as const,
    waiting: false,
    reducedMotion: true,
  };
  const { rerender } = render(
    <ArenaTurnHud {...props} board={{ ...board, phaseName: "setup" }} status="OPENING HAND" />,
  );
  expect(screen.getByRole("status").getAttribute("aria-label")).toBe("OPENING HAND. You.");
  expect(screen.queryByTitle("Primary · current phase")).toBeNull();
  rerender(
    <ArenaTurnHud {...props} board={{ ...board, phaseName: "complete" }} status="MATCH COMPLETE" />,
  );
  expect(screen.getByRole("status").getAttribute("aria-label")).toBe("Match complete. Turn 5.");
  expect(screen.queryByText("YOUR PRIORITY")).toBeNull();
});

test("native decision ownership stays separate from an open response priority", () => {
  render(
    <ArenaTurnHud
      board={{
        ...board,
        decisionSeat: "player-one",
        responseWindow: { openFor: "player-two", passedSeats: [] },
      }}
      viewerSeat="player-one"
      status="YOUR CHOICE"
      waiting={false}
      reducedMotion
    />,
  );
  const hud = screen.getByRole("status");
  expect(hud.getAttribute("aria-label")).toContain("Priority: Opponent. Decision: You.");
  expect(hud.getAttribute("data-owner")).toBe("local");
  expect(screen.getByText("Your decision")).toBeDefined();
});

test("native obstruction decision replaces the active-turn fallback", () => {
  render(
    <ArenaTurnHud
      board={{
        ...board,
        decisionSeat: "player-two",
        clash: { attackerId: "war", targetId: "magnate", step: "obstruct" },
      }}
      viewerSeat="player-two"
      status="CHOOSE OBSTRUCTORS"
      waiting={false}
      reducedMotion
    />,
  );
  expect(screen.getByRole("status").getAttribute("aria-label")).toContain(
    "Priority: You. Decision: You.",
  );
  expect(screen.getByText("Your decision")).toBeDefined();
});
