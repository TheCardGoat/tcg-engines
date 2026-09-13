import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { expectPilotBurstAddsToHand } from "../../../test-helpers/pilot-behavior-test-helpers.ts";
import { gd05StellarLoussier090 } from "./090-stellar-loussier.ts";

describe("Stellar Loussier (GD05-090)", () => {
  it("executes its Burst and pairs through public moves", () => {
    expectPilotBurstAddsToHand(gd05StellarLoussier090);
    const unit = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd05StellarLoussier090],
      play: [unit],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd05StellarLoussier090, unitId));
    expect(p1.getPilotId(unitId)).toBeDefined();
  });

  it("looks at the top card after destruction and may add only a Phantom Pain card", () => {
    const destroyHost = createMockCommand({
      level: 1,
      cost: 1,
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [
            {
              action: {
                action: "destroy",
                target: { owner: "opponent", cardType: "unit", count: 1 },
              },
            },
          ],
          sourceText: "【Main】Destroy 1 enemy Unit.",
        },
      ],
    });
    const host = createMockUnit({ hp: 4 });
    const reward = createMockUnit({ name: "Phantom Pain Reward", traits: ["phantom pain"] });
    const engine = GundamTestEngine.create(
      {
        hand: [gd05StellarLoussier090],
        play: [host],
        deck: [reward],
        resourceArea: activeResources(3),
      },
      { hand: [destroyHost], resourceArea: activeResources(1), deck: 3 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd05StellarLoussier090, hostId));
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.playCommand(destroyHost, { targets: [hostId] }));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected Stellar's deck-look choice");
    expect(choice.legalTutorCardIds).toEqual(choice.revealedCardIds);
    const rewardId = choice.revealedCardIds[0]!;
    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: { [choice.directiveIndex]: { tutorCardId: rewardId } },
      }),
    );

    expect(p1.getCardZone(hostId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardZone(rewardId)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("does not offer an ineligible top card for the destroyed trigger", () => {
    const destroyHost = createMockCommand({
      level: 1,
      cost: 1,
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [
            {
              action: {
                action: "destroy",
                target: { owner: "opponent", cardType: "unit", count: 1 },
              },
            },
          ],
          sourceText: "【Main】Destroy 1 enemy Unit.",
        },
      ],
    });
    const host = createMockUnit({ hp: 4 });
    const ineligible = createMockUnit({ name: "Outsider", traits: ["earth federation"] });
    const engine = GundamTestEngine.create(
      {
        hand: [gd05StellarLoussier090],
        play: [host],
        deck: [ineligible],
        resourceArea: activeResources(3),
      },
      { hand: [destroyHost], resourceArea: activeResources(1), deck: 3 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd05StellarLoussier090, hostId));
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.playCommand(destroyHost, { targets: [hostId] }));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected Stellar's deck-look choice");
    expect(choice.legalTutorCardIds).toEqual([]);
    const ineligibleId = choice.revealedCardIds[0]!;
    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: { [choice.directiveIndex]: { toBottom: [ineligibleId] } },
      }),
    );

    expect(p1.getCardZone(ineligibleId)).toBe(`deck:${PLAYER_ONE}`);
    expect(p1.getHand()).toHaveLength(0);
  });
});
