import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import { gd02GquuuuuuxOmegaPsycommu038 } from "./038-gquuuuuux-omega-psycommu.ts";

describe("GQuuuuuuX (Omega Psycommu) (GD02-038)", () => {
  describe("Printed Lv.7 and cost 5", () => {
    it("cannot deploy with only 6 total Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02GquuuuuuxOmegaPsycommu038],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot deploy after a legal play leaves only 4 active Resources", () => {
      const spender = createMockUnit({ level: 1, cost: 3 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02GquuuuuuxOmegaPsycommu038],
        resourceArea: activeResources(7),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[1]!;

      expectSuccess(p1.deployUnit(spender));
      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
      expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(4);
    });
  });

  describe("Link Condition: [Amate Yuzuriha (Machu)]", () => {
    it("can attack on its deploy turn after Amate Yuzuriha (Machu) is paired", () => {
      const machu = createMockPilot({
        name: "Amate Yuzuriha (Machu)",
        level: 1,
        cost: 1,
      });
      const engine = GundamTestEngine.create({
        hand: [gd02GquuuuuuxOmegaPsycommu038, machu],
        resourceArea: activeResources(7),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02GquuuuuuxOmegaPsycommu038));
      const gquuuuuuxId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(machu, gquuuuuuxId));
      expectSuccess(p1.enterBattle(gquuuuuuxId, "direct"));

      expect(p1.getBoardView().pendingCombat).toMatchObject({ attackerId: gquuuuuuxId });
    });

    it("cannot attack on its deploy turn after a different Pilot is paired", () => {
      const otherPilot = createMockPilot({ name: "Nyaan", level: 1, cost: 1 });
      const engine = GundamTestEngine.create({
        hand: [gd02GquuuuuuxOmegaPsycommu038, otherPilot],
        resourceArea: activeResources(7),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02GquuuuuuxOmegaPsycommu038));
      const gquuuuuuxId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(otherPilot, gquuuuuuxId));

      expectFailure(p1.enterBattle(gquuuuuuxId, "direct"), "CANNOT_ATTACK");
      expect(p1.getBoardView().pendingCombat).toBeUndefined();
    });
  });

  it("reveals the top 3 cards and deploys only the eligible Clan Unit", () => {
    const clanUnit = createMockUnit({ name: "Eligible Clan Unit", traits: ["clan"], level: 4 });
    const nonClanUnit = createMockUnit({
      name: "Non-Clan Unit",
      traits: ["earth federation"],
      level: 3,
    });
    const highLevelClanUnit = createMockUnit({
      name: "High-Level Clan Unit",
      traits: ["clan"],
      level: 5,
    });
    const engine = GundamTestEngine.create({
      hand: [gd02GquuuuuuxOmegaPsycommu038],
      resourceArea: activeResources(7),
      deck: [nonClanUnit, clanUnit, highLevelClanUnit],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd02GquuuuuuxOmegaPsycommu038));

    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected the revealed top cards");
    expect(choice.revealedCardIds).toHaveLength(3);
    expect(choice.legalTutorCardIds).toHaveLength(1);
    const clanUnitId = choice.legalTutorCardIds[0]!;

    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: {
          [choice.directiveIndex]: { tutorCardId: clanUnitId },
        },
      }),
    );

    expect(p1.getCardZone(clanUnitId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getVisibleCard(clanUnitId)).toMatchObject({ effectiveAp: 2, effectiveHp: 3 });
    expect(p1.getCardsInZone("battleArea")).toHaveLength(2);
  });

  it("lets the player decline to deploy an eligible revealed Unit", () => {
    const clanUnit = createMockUnit({ name: "Eligible Clan Unit", traits: ["clan"], level: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd02GquuuuuuxOmegaPsycommu038],
      resourceArea: activeResources(7),
      deck: [clanUnit, createMockUnit(), createMockUnit()],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd02GquuuuuuxOmegaPsycommu038));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected the revealed top cards");

    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: { [choice.directiveIndex]: {} },
      }),
    );

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });

  it("shows no deploy candidate when the revealed cards do not match both qualifications", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02GquuuuuuxOmegaPsycommu038],
      resourceArea: activeResources(7),
      deck: [
        createMockUnit({ traits: ["earth federation"], level: 4 }),
        createMockUnit({ traits: ["clan"], level: 5 }),
        createMockUnit({ traits: ["clan"], level: 6 }),
      ],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd02GquuuuuuxOmegaPsycommu038));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected the revealed top cards");
    expect(choice.legalTutorCardIds).toEqual([]);

    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: { [choice.directiveIndex]: {} },
      }),
    );
    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
  });
});
