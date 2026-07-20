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
  restedResources,
} from "@tcg/gundam-engine";
import { st07TacticalVisionary014 } from "./014-tactical-visionary.ts";

describe("Tactical Visionary (ST07-014)", () => {
  it("offers CB Units and Pilots from the top three and adds one chosen physical card", () => {
    const engine = GundamTestEngine.create({
      hand: [st07TacticalVisionary014],
      resourceArea: activeResources(1),
      deck: [
        createMockUnit({ traits: ["cb"] }),
        createMockPilot({ traits: ["cb"] }),
        createMockUnit({ traits: ["zeon"] }),
      ],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(commandId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected Tactical Visionary's choice");
    expect(choice).toMatchObject({
      sourceCardId: commandId,
      randomizeRemainingToBottom: true,
    });
    expect(choice.revealedCardIds).toHaveLength(3);
    expect(choice.legalTutorCardIds).toHaveLength(2);
    const chosenId = choice.legalTutorCardIds[0]!;
    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: { [choice.directiveIndex]: { tutorCardId: chosenId } },
      }),
    );

    expect(p1.getCardZone(chosenId)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(2);
  });

  it("does not offer a CB Command or non-CB Unit and Pilot", () => {
    const engine = GundamTestEngine.create({
      hand: [st07TacticalVisionary014],
      resourceArea: activeResources(1),
      deck: [
        createMockCommand({ traits: ["cb"] }),
        createMockUnit({ traits: ["zeon"] }),
        createMockPilot({ traits: ["super soldier"] }),
      ],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.playCommand(st07TacticalVisionary014));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected Tactical Visionary's choice");
    expect(choice.legalTutorCardIds).toEqual([]);
    expectSuccess(p1.resolveEffect({ deckLookAnswers: { [choice.directiveIndex]: {} } }));
    expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(0);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(3);
  });

  it("may decline eligible cards and returns all revealed cards randomly to the bottom", () => {
    const engine = GundamTestEngine.create({
      hand: [st07TacticalVisionary014],
      resourceArea: activeResources(1),
      deck: [createMockUnit({ traits: ["cb"] }), createMockPilot({ traits: ["cb"] })],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.playCommand(st07TacticalVisionary014));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected Tactical Visionary's choice");
    expect(choice.revealedCardIds).toHaveLength(2);
    expect(choice.legalTutorCardIds).toHaveLength(2);
    expectSuccess(p1.resolveEffect({ deckLookAnswers: { [choice.directiveIndex]: {} } }));
    expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(0);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(2);
  });

  it("rejects player-supplied ordering because the remainder is randomized server-side", () => {
    const engine = GundamTestEngine.create({
      hand: [st07TacticalVisionary014],
      resourceArea: activeResources(1),
      deck: [createMockUnit(), createMockUnit(), createMockUnit()],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.playCommand(st07TacticalVisionary014));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected Tactical Visionary's choice");
    expectFailure(
      p1.resolveEffect({
        deckLookAnswers: { [choice.directiveIndex]: { toBottom: choice.revealedCardIds } },
      }),
      "INVALID_DECK_LOOK_ROUTING",
    );
    expectSuccess(p1.resolveEffect({ deckLookAnswers: { [choice.directiveIndex]: {} } }));
  });

  it("looks at only the available cards and resolves cleanly with an empty deck", () => {
    const shortDeck = GundamTestEngine.create({
      hand: [st07TacticalVisionary014],
      resourceArea: activeResources(1),
      deck: [createMockUnit({ traits: ["cb"] })],
    }).asPlayer(PLAYER_ONE);
    expectSuccess(shortDeck.playCommand(st07TacticalVisionary014));
    const choice = shortDeck.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected Tactical Visionary's choice");
    expect(choice.revealedCardIds).toHaveLength(1);

    const empty = GundamTestEngine.create({
      hand: [st07TacticalVisionary014],
      resourceArea: activeResources(1),
    }).asPlayer(PLAYER_ONE);
    const commandId = empty.getHand()[0]!;
    expectSuccess(empty.playCommand(commandId));
    expect(empty.getBoardView().pendingChoice).toBeUndefined();
    expect(empty.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("cannot be played in a legally reached Action step", () => {
    const engine = GundamTestEngine.create({
      hand: [st07TacticalVisionary014],
      resourceArea: activeResources(1),
      deck: 3,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectFailure(p1.playCommand(st07TacticalVisionary014), "WRONG_TIMING");
  });

  it("enforces printed Lv.1 and cost 1 without moving the source", () => {
    const low = GundamTestEngine.create({ hand: [st07TacticalVisionary014], deck: 3 }).asPlayer(
      PLAYER_ONE,
    );
    expectFailure(low.playCommand(st07TacticalVisionary014), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(low.getCardZone(st07TacticalVisionary014)).toBe(`hand:${PLAYER_ONE}`);
    const unpaid = GundamTestEngine.create({
      hand: [st07TacticalVisionary014],
      resourceArea: restedResources(1),
      deck: 3,
    }).asPlayer(PLAYER_ONE);
    expectFailure(unpaid.playCommand(st07TacticalVisionary014), "INSUFFICIENT_RESOURCES");
  });
});
