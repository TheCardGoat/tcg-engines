import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02TurningPointOfHistory104 } from "./104-turning-point-of-history.ts";
import { gd02Valedictorian105 } from "./105-valedictorian.ts";

function resolveTopThree(p1: ReturnType<GundamTestEngine["asPlayer"]>) {
  const choice = p1.getBoardView().pendingChoice;
  if (choice?.kind !== "deckLook") {
    throw new Error("Expected a visible top-three deck look");
  }
  const [topId, ...bottomIds] = choice.revealedCardIds;
  expectSuccess(
    p1.resolveEffect({
      deckLookAnswers: {
        [choice.directiveIndex]: { toTop: [topId!], toBottom: bottomIds },
      },
    }),
  );
  return topId!;
}

describe("Turning Point of History (GD02-104)", () => {
  it("reorders the revealed top three and draws the chosen top card with a Newtype Pilot in play", () => {
    const host = createMockUnit();
    const newtype = createMockPilot({ traits: ["newtype"], level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [newtype, gd02TurningPointOfHistory104],
      play: [host],
      resourceArea: activeResources(2),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const commandId = p1.getHand()[1]!;

    expectSuccess(p1.assignPilot(newtype, hostId));
    expectSuccess(p1.playCommand(commandId));
    const chosenTopId = resolveTopThree(p1);

    expect(p1.getCardZone(chosenTopId)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(4);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("recognizes a Command played as a Newtype Pilot before drawing", () => {
    const host = createMockUnit();
    const engine = GundamTestEngine.create({
      hand: [gd02Valedictorian105, gd02TurningPointOfHistory104],
      play: [host],
      resourceArea: activeResources(3),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const [pilotCommandId, historyCommandId] = p1.getHand();

    expectSuccess(p1.playCommandAsPilot(pilotCommandId!, hostId));
    expectSuccess(p1.playCommand(historyCommandId!));
    const chosenTopId = resolveTopThree(p1);

    expect(p1.getPilotId(hostId)).toBe(pilotCommandId);
    expect(p1.getCardZone(chosenTopId)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(4);
    expect(p1.getCardZone(historyCommandId!)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("reorders the revealed cards without drawing when no Newtype Pilot is in play", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02TurningPointOfHistory104],
      resourceArea: activeResources(1),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(commandId));
    resolveTopThree(p1);

    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(5);
    expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(0);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("cannot be played during a legally reached Action step", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02TurningPointOfHistory104],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());

    expectFailure(p1.playCommand(gd02TurningPointOfHistory104), "WRONG_TIMING");
  });

  it("enforces both its printed Lv.1 and active Resource cost 1", () => {
    const lowLevel = GundamTestEngine.create({ hand: [gd02TurningPointOfHistory104] });
    expectFailure(
      lowLevel.asPlayer(PLAYER_ONE).playCommand(gd02TurningPointOfHistory104),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
    expect(lowLevel.asPlayer(PLAYER_ONE).getCardZone(gd02TurningPointOfHistory104)).toBe(
      `hand:${PLAYER_ONE}`,
    );

    const setup = createMockCommand({
      level: 0,
      cost: 1,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02TurningPointOfHistory104],
      resourceArea: activeResources(1),
      deck: 3,
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);
    expectSuccess(p1.playCommand(setup));
    expectFailure(p1.playCommand(gd02TurningPointOfHistory104), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02TurningPointOfHistory104)).toBe(`hand:${PLAYER_ONE}`);
  });
});
