// @vitest-environment jsdom
import { useState } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MantineProvider } from "@mantine/core";
import { afterEach, expect, it } from "vite-plus/test";
import { getCard } from "@tcg/alpha-clash-cards";
import type { AcJudgeCommand, MatchState } from "@tcg/alpha-clash-engine";
import { AC_JUDGE_COUNTERS } from "@tcg/alpha-clash-engine";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { AlphaClashServerEngine } from "@tcg/alpha-clash-server-adapter";
import { GameStateCorrection, type CorrectionSession } from "./components/GameStateCorrection";
import { parseProjectedState } from "./pages/LiveMatch.page";

afterEach(cleanup);
const hero = getCard("ac-st-001"),
  body = getCard("ac-ac1-027"),
  weapon = getCard("ac-ac6-162");
const context = {
  gameId: "correction-matrix",
  sourceAuthority: "server" as const,
  correctionModeEnabled: true,
};
type Move = AcJudgeCommand["type"];
const labels = {
  manualSetHealth: "Set health",
  manualSetDamage: "Set damage",
  manualSetCounter: "Set counters",
  manualReadyCard: "Ready card",
  manualExertCard: "Engage card",
  manualReadyAll: "Ready all",
  manualMoveCard: "Move card",
  manualSetCardFace: "Set card face",
  manualDrawCard: "Draw cards",
  manualShuffleDeck: "Shuffle deck",
  manualAttachWeapon: "Attach Weapon",
  manualDetachWeapon: "Detach Weapon",
  manualSetPortal: "Set Portal",
  manualResetOncePerTurn: "Reset ability use",
} satisfies Record<Move, string>;
function fixture(move: Move) {
  const ready = move !== "manualReadyCard" && move !== "manualReadyAll";
  const g = Spec.fromFixture({
    playerOne: {
      contender: hero,
      clash: [{ card: body, ready }],
      accessory: [weapon],
      deck: [body, weapon, body, body, weapon],
    },
    playerTwo: { clash: [{ card: body, ready: false }], deck: [body, weapon, body, weapon] },
  });
  const bodyId = g.playerOne.at(body, "clash").instanceId;
  const weaponId = g.playerOne.at(weapon, "accessory").instanceId;
  if (move === "manualDetachWeapon")
    g.run({ type: "manualAttachWeapon", playerId: "player-one", weaponId, targetId: bodyId });
  if (move === "manualResetOncePerTurn") {
    g.run({
      type: "activateAbility",
      playerId: "player-one",
      cardId: g.playerOne.contender().instanceId,
      abilityIndex: 1,
    });
    while (g.state.responseWindow) g.asPlayer(g.state.responseWindow.openFor).passRound();
    expect(Object.values(g.state.oncePerTurnUsed).some(Boolean)).toBe(true);
  }
  const engine = new AlphaClashServerEngine(g.state, { p1: "player-one", p2: "player-two" });
  return { engine, bodyId, weaponId };
}
function Harness({ engine }: { engine: AlphaClashServerEngine }) {
  const [version, setVersion] = useState(engine.getStateID());
  const [error, setError] = useState("");
  const board = parseProjectedState(engine.getViewerState({ role: "player", actorId: "p1" }));
  if (!board) throw new Error("Missing board");
  const session: CorrectionSession = {
    enabled: true,
    proposal: null,
    request: () => false,
    exit: () => false,
    accept: () => false,
    decline: () => false,
    execute(move, payload) {
      const result = engine.dispatch(move, "p1", payload, context);
      setError(result.success ? "" : (result.error ?? "Rejected"));
      setVersion(engine.getStateID());
      return result.success;
    },
  };
  return (
    <MantineProvider env="test">
      <GameStateCorrection
        board={board}
        viewerSeat="player-one"
        session={session}
        disabled={false}
      />
      <output>{version}</output>
      {error && <div role="alert">{error}</div>}
    </MantineProvider>
  );
}
function controls() {
  const user = userEvent.setup();
  return {
    async select(label: string, name: string) {
      await user.click(screen.getByRole("combobox", { name: label }));
      await user.click(await screen.findByRole("option", { name }));
    },
    async number(label: string, amount: number) {
      const input = screen.getByRole("textbox", { name: label });
      await user.clear(input);
      await user.type(input, String(amount));
    },
    apply: () => user.click(screen.getByRole("button", { name: "Apply correction" })),
  };
}
function changed(engine: AlphaClashServerEngine, before: MatchState, move: Move) {
  expect(screen.queryByRole("alert")).toBeNull();
  expect(engine.getStateID()).toBe((before.stateID ?? before.moveLog.length) + 1);
  expect(engine.state.moveLog.at(-1)?.type).toBe(move);
  expect(engine.state.pendingChoices).toEqual(before.pendingChoices);
  expect(engine.state.pendingTriggers).toEqual(before.pendingTriggers);
}
it.each(Object.keys(labels) as Move[])("submits %s through its actual controls", async (move) => {
  const { engine, bodyId, weaponId } = fixture(move);
  const before = structuredClone(engine.state);
  render(<Harness engine={engine} />);
  const ui = controls();
  await ui.select("Correction", labels[move]);
  switch (move) {
    case "manualSetHealth":
      await ui.select("Player", "Opponent");
      await ui.number("New value", 12);
      break;
    case "manualSetDamage":
      await ui.select("Card", "You · Sonoro · clash");
      await ui.select("Damage type", "Phase damage");
      await ui.number("New value", 2);
      break;
    case "manualSetCounter":
      await ui.select("Card", "You · Sonoro · clash");
      await ui.select("Counter", "Bounty");
      await ui.number("New value", 4);
      break;
    case "manualReadyCard":
    case "manualExertCard":
      await ui.select("Card", "You · Sonoro · clash");
      break;
    case "manualReadyAll":
      await ui.select("Player", "Opponent");
      break;
    case "manualMoveCard":
      await ui.select("Card", "You · Sonoro · clash");
      await ui.select("Destination", "deck");
      await ui.select("Deck position", "bottom");
      break;
    case "manualSetCardFace":
      await ui.select("Card", "You · Sonoro · clash");
      await ui.select("Card face", "Face down");
      break;
    case "manualDrawCard":
      await ui.select("Player", "Opponent");
      await ui.number("Cards to draw", 2);
      break;
    case "manualShuffleDeck":
      await ui.select("Player", "Opponent");
      break;
    case "manualAttachWeapon":
      await ui.select("Weapon", "You · Conquering Might · accessory");
      await ui.select("Host", "You · Sonoro · clash");
      break;
    case "manualDetachWeapon":
      await ui.select("Weapon", "You · Conquering Might · clash");
      break;
    case "manualSetPortal":
      await ui.select("Portal", "open");
      break;
    case "manualResetOncePerTurn": {
      await ui.select("Card", "You · Magnate, Awakened · contender");
      const ability = hero.abilities?.[1];
      if (!ability) throw new Error("Missing activated ability");
      await ui.select("Ability", ability.text);
      break;
    }
  }
  await ui.apply();
  changed(engine, before, move);
  switch (move) {
    case "manualSetHealth":
      expect(engine.state.players["player-two"].health).toBe(12);
      expect(engine.state.players["player-one"].health).toBe(30);
      break;
    case "manualSetDamage":
      expect(engine.state.cards[bodyId].phaseDamage).toBe(2);
      expect(engine.state.cards[bodyId].clashDamage).toBe(0);
      break;
    case "manualSetCounter":
      expect(engine.state.cards[bodyId].counters.bounty).toBe(4);
      break;
    case "manualReadyCard":
      expect(engine.state.cards[bodyId].ready).toBe(true);
      break;
    case "manualExertCard":
      expect(engine.state.cards[bodyId].ready).toBe(false);
      break;
    case "manualReadyAll":
      expect(engine.state.cards[bodyId].ready).toBe(false);
      expect(
        Object.values(engine.state.cards)
          .filter((c) => c.controller === "player-two" && c.zone === "clash")
          .every((c) => c.ready),
      ).toBe(true);
      break;
    case "manualMoveCard":
      expect(engine.state.deckOrder["player-one"].at(-1)).toBe(bodyId);
      expect(engine.state.cards[bodyId].zone).toBe("deck");
      break;
    case "manualSetCardFace":
      expect(engine.state.cards[bodyId].faceDown).toBe(true);
      break;
    case "manualDrawCard":
      expect(engine.state.deckOrder["player-two"]).toEqual(before.deckOrder["player-two"].slice(2));
      for (const id of before.deckOrder["player-two"].slice(0, 2))
        expect(engine.state.cards[id].zone).toBe("hand");
      break;
    case "manualShuffleDeck":
      expect(engine.state.rngState).not.toBe(before.rngState);
      expect([...engine.state.deckOrder["player-two"]].sort()).toEqual(
        [...before.deckOrder["player-two"]].sort(),
      );
      expect(engine.state.deckOrder["player-one"]).toEqual(before.deckOrder["player-one"]);
      break;
    case "manualAttachWeapon":
      expect(engine.state.cards[weaponId].attachedTo).toBe(bodyId);
      break;
    case "manualDetachWeapon":
      expect(engine.state.cards[weaponId].attachedTo).toBeUndefined();
      expect(engine.state.cards[weaponId].zone).toBe("accessory");
      break;
    case "manualSetPortal":
      expect(engine.state.portalOpen).toBe(true);
      break;
    case "manualResetOncePerTurn":
      expect(Object.values(engine.state.oncePerTurnUsed).some(Boolean)).toBe(false);
      break;
  }
});
it.each(AC_JUDGE_COUNTERS)(
  "sets and clears the %s counter through the selector",
  async (counter) => {
    const { engine, bodyId } = fixture("manualSetCounter");
    render(<Harness engine={engine} />);
    const ui = controls();
    await ui.select("Correction", "Set counters");
    await ui.select("Card", "You · Sonoro · clash");
    await ui.select("Counter", counter[0].toUpperCase() + counter.slice(1));
    for (const amount of [3, 0]) {
      await ui.number("New value", amount);
      await ui.apply();
      expect(engine.state.cards[bodyId].counters[counter]).toBe(amount);
    }
  },
);
it("rejects a mismatched attachment without changing the game, then accepts the friendly host", async () => {
  const { engine, bodyId, weaponId } = fixture("manualAttachWeapon");
  render(<Harness engine={engine} />);
  const ui = controls();
  await ui.select("Correction", "Attach Weapon");
  await ui.select("Weapon", "You · Conquering Might · accessory");
  await ui.select("Host", "Opponent · Sonoro · clash");
  const before = structuredClone(engine.state);
  await ui.apply();
  expect(screen.getByRole("alert").textContent).toContain("matching type");
  expect(engine.state).toEqual(before);
  await ui.select("Host", "You · Sonoro · clash");
  await ui.apply();
  changed(engine, before, "manualAttachWeapon");
  expect(engine.state.cards[weaponId].attachedTo).toBe(bodyId);
});

it.each(["You", "Opponent"])(
  "applies health, draw, and ready-all corrections to %s only",
  async (player) => {
    const seat = player === "You" ? "player-one" : "player-two";
    const other = seat === "player-one" ? "player-two" : "player-one";
    const { engine } = fixture("manualReadyAll");
    const before = structuredClone(engine.state);
    render(<Harness engine={engine} />);
    const ui = controls();
    await ui.select("Correction", "Set health");
    await ui.select("Player", player);
    await ui.number("New value", 9);
    await ui.apply();
    expect(engine.state.players[seat].health).toBe(9);
    expect(engine.state.players[other].health).toBe(before.players[other].health);
    await ui.select("Correction", "Draw cards");
    await ui.number("Cards to draw", 2);
    await ui.apply();
    expect(engine.state.deckOrder[seat]).toEqual(before.deckOrder[seat].slice(2));
    expect(engine.state.deckOrder[other]).toEqual(before.deckOrder[other]);
    await ui.select("Correction", "Ready all");
    await ui.apply();
    const friendly = Object.values(engine.state.cards).find(
      (c) => c.controller === seat && c.zone === "clash",
    )!;
    const opposing = Object.values(engine.state.cards).find(
      (c) => c.controller === other && c.zone === "clash",
    )!;
    expect(friendly.ready).toBe(true);
    expect(opposing.ready).toBe(false);
    expect(screen.queryByRole("alert")).toBeNull();
  },
);
it.each(["Clash damage", "Phase damage"])(
  "sets %s on an opposing card without replacing the other damage kind",
  async (kind) => {
    const { engine } = fixture("manualSetDamage");
    const card = Object.values(engine.state.cards).find(
      (c) => c.controller === "player-two" && c.zone === "clash",
    )!;
    render(<Harness engine={engine} />);
    const ui = controls();
    await ui.select("Correction", "Set damage");
    await ui.select("Card", "Opponent · Sonoro · clash");
    await ui.select("Damage type", kind);
    await ui.number("New value", 7);
    await ui.apply();
    const field = kind === "Clash damage" ? "clashDamage" : "phaseDamage";
    const other = field === "clashDamage" ? "phaseDamage" : "clashDamage";
    expect(engine.state.cards[card.instanceId][field]).toBe(7);
    expect(engine.state.cards[card.instanceId][other]).toBe(0);
    expect(engine.state.cards[card.instanceId].zone).toBe("clash"); // Corrections do not run defeat effects.
    expect(screen.queryByRole("alert")).toBeNull();
  },
);
it("round trips card faces and Portal state through both boolean choices", async () => {
  const { engine, bodyId } = fixture("manualSetCardFace");
  render(<Harness engine={engine} />);
  const ui = controls();
  await ui.select("Correction", "Set card face");
  await ui.select("Card", "You · Sonoro · clash");
  for (const face of ["Face down", "Face up"]) {
    await ui.select("Card face", face);
    await ui.apply();
    expect(engine.state.cards[bodyId].faceDown).toBe(face === "Face down");
  }
  await ui.select("Correction", "Set Portal");
  for (const portal of ["open", "closed"]) {
    await ui.select("Portal", portal);
    await ui.apply();
    expect(engine.state.portalOpen).toBe(portal === "open");
  }
  expect(screen.queryByRole("alert")).toBeNull();
});
