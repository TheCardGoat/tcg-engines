import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02AgeDevice103 } from "../command/103-age-device.ts";
import { gd02FlitAsuno088 } from "./088-flit-asuno.ts";

function linkFlitWithDeck(
  deck: Array<ReturnType<typeof createMockUnit> | typeof gd02AgeDevice103>,
) {
  const host = createMockUnit({ linkCondition: "[Flit Asuno]" });
  const engine = GundamTestEngine.create({
    hand: [gd02FlitAsuno088],
    play: [host],
    resourceArea: activeResources(3),
    deck,
  });
  const p1 = engine.asPlayer(PLAYER_ONE);
  const hostId = p1.getCardsInZone("battleArea")[0]!;
  expectSuccess(p1.assignPilot(gd02FlitAsuno088, hostId));
  return { p1, hostId };
}

describe("Flit Asuno (GD02-088)", () => {
  it("【Burst】 adds the revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd02FlitAsuno088] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    const burstChoice = p2.getBoardView().pendingChoice;
    if (burstChoice?.kind !== "optional") {
      throw new Error("Expected Flit Asuno's visible Burst choice");
    }
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burstChoice.directiveIndex]: true } }));

    expect(p2.getCardZone(gd02FlitAsuno088)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("offers a revealed green Earth Federation Unit and adds the chosen card to hand", () => {
    const eligible = createMockUnit({ color: "green", traits: ["earth federation"] });
    const { p1 } = linkFlitWithDeck([eligible]);

    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected Flit's visible deck look");
    expect(choice.legalTutorCardIds).toEqual(choice.revealedCardIds);
    const eligibleId = choice.legalTutorCardIds[0]!;
    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: { [choice.directiveIndex]: { tutorCardId: eligibleId } },
      }),
    );

    expect(p1.getCardZone(eligibleId)).toBe(`hand:${PLAYER_ONE}`);
  });

  it('also offers a revealed card with "AGE Device" in its name', () => {
    const { p1 } = linkFlitWithDeck([gd02AgeDevice103]);

    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected Flit's visible deck look");
    expect(choice.legalTutorCardIds).toEqual(choice.revealedCardIds);
    const ageDeviceId = choice.legalTutorCardIds[0]!;
    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: { [choice.directiveIndex]: { tutorCardId: ageDeviceId } },
      }),
    );

    expect(p1.getCardZone(ageDeviceId)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("returns ineligible revealed cards randomly without asking the player to order them", () => {
    const ineligible = Array.from({ length: 3 }, (_, index) =>
      createMockUnit({
        name: `Ineligible Zeon Unit ${index + 1}`,
        color: "green",
        traits: ["zeon"],
      }),
    );
    const { p1 } = linkFlitWithDeck(ineligible);

    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected Flit's visible deck look");
    expect(choice.legalTutorCardIds).toEqual([]);
    expect(choice.revealedCardIds).toHaveLength(3);
    expect(choice.randomizeRemainingToBottom).toBe(true);
    expectFailure(
      p1.resolveEffect({
        deckLookAnswers: {
          [choice.directiveIndex]: { toBottom: choice.revealedCardIds },
        },
      }),
      "INVALID_DECK_LOOK_ROUTING",
    );
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "deckLook",
      randomizeRemainingToBottom: true,
    });
    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: { [choice.directiveIndex]: {} },
      }),
    );

    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(3);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });

  it("requires both its printed Lv.3 and one active Resource to be paired", () => {
    const lowLevelHost = createMockUnit({ name: "Low-Level Host" });
    const lowLevel = GundamTestEngine.create({
      hand: [gd02FlitAsuno088],
      play: [lowLevelHost],
      resourceArea: activeResources(2),
    });
    const lowP1 = lowLevel.asPlayer(PLAYER_ONE);
    const lowHostId = lowP1.getCardsInZone("battleArea")[0]!;

    expectFailure(lowP1.assignPilot(gd02FlitAsuno088, lowHostId), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(lowP1.getCardZone(gd02FlitAsuno088)).toBe(`hand:${PLAYER_ONE}`);

    const setup = createMockCommand({
      name: "Exhaust All Resources",
      level: 0,
      cost: 3,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const costHost = createMockUnit({ name: "Cost-Gate Host" });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02FlitAsuno088],
      play: [costHost],
      resourceArea: activeResources(3),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);
    const setupId = p1.getHand()[0]!;
    const pilotId = p1.getHand()[1]!;
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(setupId));
    expectFailure(p1.assignPilot(pilotId, hostId), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(pilotId)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getPilotId(hostId)).toBeUndefined();
  });
});
