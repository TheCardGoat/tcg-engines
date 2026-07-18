import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02GundamKimaris070 } from "./070-gundam-kimaris.ts";
import { gd02GaelioBauduin099 } from "../pilot/099-gaelio-bauduin.ts";
import { gd02JeridMessa086 } from "../pilot/086-jerid-messa.ts";
import { createLinkUnitCheckCommand } from "../../../test-helpers/link-condition-test-helpers.ts";

describe("Gundam Kimaris (GD02-070)", () => {
  it("requires its printed Lv.5 and four active Resources to deploy", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02GundamKimaris070],
      resourceArea: activeResources(4),
    });
    const lowP1 = lowLevel.asPlayer(PLAYER_ONE);

    expectFailure(lowP1.deployUnit(gd02GundamKimaris070), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(lowP1.getCardZone(gd02GundamKimaris070)).toBe(`hand:${PLAYER_ONE}`);

    const setup = createMockCommand({
      name: "Exhaust All Resources",
      level: 0,
      cost: 5,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02GundamKimaris070],
      resourceArea: activeResources(5),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);

    expectSuccess(p1.playCommand(setup));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(0);
    expectFailure(p1.deployUnit(gd02GundamKimaris070), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02GundamKimaris070)).toBe(`hand:${PLAYER_ONE}`);
  });

  describe("Link Condition: [Gaelio Bauduin]", () => {
    it("becomes a Link Unit when paired with Gaelio Bauduin", () => {
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [gd02GaelioBauduin099, linkCheck],
        play: [gd02GundamKimaris070],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const [pilotId, commandId] = p1.getHand();

      expectSuccess(p1.assignPilot(pilotId!, unitId));
      const apBefore = p1.getVisibleCard(unitId)?.effectiveAp;
      expectSuccess(p1.playCommand(commandId!));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [unitId],
      });
      expectSuccess(p1.resolveEffect({ targets: [unitId] }));

      expect(apBefore).toBeDefined();
      expect(p1.getVisibleCard(unitId)?.effectiveAp).toBe(apBefore! + 1);
    });

    it("does not become a Link Unit when paired with a different Pilot", () => {
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [gd02JeridMessa086, linkCheck],
        play: [gd02GundamKimaris070],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const [pilotId, commandId] = p1.getHand();

      expectSuccess(p1.assignPilot(pilotId!, unitId));
      expectFailure(p1.playCommand(commandId!), "NO_LEGAL_TARGETS");

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getCardZone(commandId!)).toBe(`hand:${PLAYER_ONE}`);
    });
  });

  it("draws 2 with 4 Gjallarhorn cards in trash, then asks which 2 cards to discard", () => {
    const trash = Array.from({ length: 4 }, () => createMockUnit({ traits: ["gjallarhorn"] }));
    const firstDiscard = createMockUnit({ name: "First Discard" });
    const secondDiscard = createMockUnit({ name: "Second Discard" });
    const engine = GundamTestEngine.create({
      hand: [gd02GundamKimaris070, firstDiscard, secondDiscard],
      trash,
      resourceArea: activeResources(5),
      deck: 3,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [, firstDiscardId, secondDiscardId] = p1.getHand();

    expectSuccess(p1.deployUnit(gd02GundamKimaris070));
    const choice = p1.getBoardView().pendingChoice;
    expect(choice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([firstDiscardId, secondDiscardId]),
      minTargets: 2,
      maxTargets: 2,
    });
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected Gundam Kimaris to ask which 2 cards to discard after drawing");
    }
    expect(choice.legalTargetIds).toHaveLength(4);
    expectSuccess(p1.resolveEffect({ targets: [firstDiscardId!, secondDiscardId!] }));

    expect(p1.getCardZone(firstDiscardId!)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardZone(secondDiscardId!)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(2);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(1);
  });

  it("does not count non-Gjallarhorn cards toward the 4-card trash threshold", () => {
    const trash = [
      ...Array.from({ length: 3 }, () => createMockUnit({ traits: ["gjallarhorn"] })),
      createMockUnit({ traits: ["teiwaz"] }),
      createMockUnit({ traits: ["academy"] }),
    ];
    const keptCard = createMockUnit({ name: "Kept Card" });
    const engine = GundamTestEngine.create({
      hand: [gd02GundamKimaris070, keptCard],
      trash,
      resourceArea: activeResources(5),
      deck: 3,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const keptCardId = p1.getHand()[1]!;

    expectSuccess(p1.deployUnit(gd02GundamKimaris070));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getBoardView().players[PLAYER_ONE]?.trashCount).toBe(5);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(3);
    expect(p1.getCardZone(keptCardId)).toBe(`hand:${PLAYER_ONE}`);
  });
});
