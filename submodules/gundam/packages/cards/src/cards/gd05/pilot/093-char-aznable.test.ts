import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockBase,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { expectPilotBurstAddsToHand } from "../../../test-helpers/pilot-behavior-test-helpers.ts";
import { gd05CharAznable093 } from "./093-char-aznable.ts";

describe("Char Aznable (GD05-093)", () => {
  /** @behavioral-proof complete: Burst retrieval, When Linked timing, optional friendly Neo Zeon Base-in-trash filter, deployment result, and decline branch are public. */
  it("executes its Burst and pairs through public moves", () => {
    expectPilotBurstAddsToHand(gd05CharAznable093);
    const unit = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd05CharAznable093],
      play: [unit],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd05CharAznable093, unitId));
    expect(p1.getPilotId(unitId)).toBeDefined();
  });

  it("may deploy only a chosen Neo Zeon Base from trash when Char links", () => {
    const host = createMockUnit({ linkCondition: "[Char Aznable]" });
    const eligible = createMockBase({ traits: ["neo zeon"] });
    const wrongTrait = createMockBase({ traits: ["earth federation"] });
    const engine = GundamTestEngine.create({
      hand: [gd05CharAznable093],
      play: [host],
      trash: [eligible, wrongTrait],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const [eligibleId, wrongTraitId] = p1.getCardsInZone("trash");

    expectSuccess(p1.assignPilot(gd05CharAznable093, hostId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") throw new Error("Expected Char's optional Base choice");
    expect(choice.legalTargetIds).toEqual([eligibleId]);
    expectSuccess(
      p1.resolveEffect({
        optionalAnswers: { [choice.directiveIndex]: true },
        targets: [eligibleId!],
      }),
    );

    expect(p1.getCardZone(eligibleId!)).toBe(`baseSection:${PLAYER_ONE}`);
    expect(p1.getCardZone(wrongTraitId!)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("may decline the linked Base deployment", () => {
    const host = createMockUnit({ linkCondition: "[Char Aznable]" });
    const eligible = createMockBase({ traits: ["neo zeon"] });
    const engine = GundamTestEngine.create({
      hand: [gd05CharAznable093],
      play: [host],
      trash: [eligible],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const eligibleId = p1.getCardsInZone("trash")[0]!;

    expectSuccess(p1.assignPilot(gd05CharAznable093, hostId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") throw new Error("Expected Char's optional Base choice");
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [choice.directiveIndex]: false } }));

    expect(p1.getCardZone(eligibleId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });
});
