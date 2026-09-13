import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd05AkatsukiOowashi004 } from "./004-akatsuki-oowashi.ts";

describe("Akatsuki (Oowashi) (GD05-004)", () => {
  /** @behavioral-proof complete: in-hand reduction gates and the linked target boundary are public. */
  describe("While you have no Units that are Lv.6 or higher in play, this card in your hand gets Lv. -1 and cost -1 for each of your (Orb) Units in play.", () => {
    it("deploys at printed Lv.6 and pays printed cost 6 without an Orb Unit", () => {
      const engine = GundamTestEngine.create({
        hand: [gd05AkatsukiOowashi004],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd05AkatsukiOowashi004));

      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(6);
    });

    it("requires printed Lv.6 when no Orb Unit is in play", () => {
      const p1 = GundamTestEngine.create({
        hand: [gd05AkatsukiOowashi004],
        resourceArea: activeResources(5),
      }).asPlayer(PLAYER_ONE);

      expectFailure(p1.deployUnit(gd05AkatsukiOowashi004), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getCardZone(gd05AkatsukiOowashi004)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("one friendly Orb Unit reduces both Lv. and cost by 1", () => {
      const orbUnit = createMockUnit({ traits: ["orb"] });
      const engine = GundamTestEngine.create({
        hand: [gd05AkatsukiOowashi004],
        play: [orbUnit],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd05AkatsukiOowashi004));

      expect(p1.getCardsInZone("battleArea")).toHaveLength(2);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(5);
    });

    it("two friendly Orb Units reduce both Lv. and cost by 2", () => {
      const engine = GundamTestEngine.create({
        hand: [gd05AkatsukiOowashi004],
        play: [
          createMockUnit({ name: "First Orb Unit", traits: ["orb"] }),
          createMockUnit({ name: "Second Orb Unit", traits: ["orb"] }),
        ],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd05AkatsukiOowashi004));

      expect(p1.getCardsInZone("battleArea")).toHaveLength(3);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(4);
    });

    it("does not count non-Orb friendly Units or enemy Orb Units", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [gd05AkatsukiOowashi004],
          play: [createMockUnit({ traits: ["earth alliance"] })],
          resourceArea: activeResources(5),
        },
        { play: [createMockUnit({ traits: ["orb"] })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployUnit(gd05AkatsukiOowashi004), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getCardZone(gd05AkatsukiOowashi004)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("does not count friendly Orb cards outside the battle area", () => {
      const orbInTrash = createMockUnit({ traits: ["orb"] });
      const engine = GundamTestEngine.create({
        hand: [gd05AkatsukiOowashi004, createMockUnit({ traits: ["orb"] })],
        trash: [orbInTrash],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployUnit(gd05AkatsukiOowashi004), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getCardZone(gd05AkatsukiOowashi004)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("still reduces with a friendly Lv.5 Unit below the printed cutoff", () => {
      const engine = GundamTestEngine.create({
        hand: [gd05AkatsukiOowashi004],
        play: [createMockUnit({ level: 5, traits: ["orb"] })],
        resourceArea: activeResources(5),
      });

      expectSuccess(engine.asPlayer(PLAYER_ONE).deployUnit(gd05AkatsukiOowashi004));
    });

    it("a friendly Lv.6 Unit disables the entire reduction", () => {
      const engine = GundamTestEngine.create({
        hand: [gd05AkatsukiOowashi004],
        play: [
          createMockUnit({ name: "Cutoff Unit", level: 6 }),
          createMockUnit({ name: "First Orb Unit", traits: ["orb"] }),
          createMockUnit({ name: "Second Orb Unit", traits: ["orb"] }),
        ],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployUnit(gd05AkatsukiOowashi004), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getCardZone(gd05AkatsukiOowashi004)).toBe(`hand:${PLAYER_ONE}`);
    });
  });

  describe("【When Linked】Choose 1 enemy Unit that is Lv.4 or lower. Return it to its owner's hand.", () => {
    it("rejects Lv.5, then returns the chosen enemy Lv.4 Unit to its owner's hand", () => {
      const orbPilot = createMockPilot({ traits: ["orb"], level: 1, cost: 1 });
      const eligible = createMockUnit({ name: "Eligible Enemy", level: 4 });
      const tooHigh = createMockUnit({ name: "Too-High Enemy", level: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [orbPilot],
          play: [gd05AkatsukiOowashi004],
          resourceArea: activeResources(1),
        },
        { play: [eligible, tooHigh] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const akatsukiId = p1.getCardsInZone("battleArea")[0]!;
      const [eligibleId, tooHighId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(orbPilot, akatsukiId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: akatsukiId,
        legalTargetIds: [eligibleId],
        minTargets: 1,
        maxTargets: 1,
      });
      expectFailure(p1.resolveEffect({ targets: [tooHighId!] }), "ILLEGAL_TARGET");
      expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

      expect(p1.getPilotId(akatsukiId)).toBeDefined();
      expect(p2.getCardZone(eligibleId!)).toBe(`hand:${PLAYER_TWO}`);
      expect(p2.getCardZone(tooHighId!)).toBe(`battleArea:${PLAYER_TWO}`);
    });

    it("does not target a friendly Lv.4 Unit when no eligible enemy exists", () => {
      const orbPilot = createMockPilot({ traits: ["orb"], level: 1, cost: 1 });
      const engine = GundamTestEngine.create(
        {
          hand: [orbPilot],
          play: [gd05AkatsukiOowashi004, createMockUnit({ level: 4 })],
          resourceArea: activeResources(1),
        },
        { play: [createMockUnit({ level: 5 })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const akatsukiId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(orbPilot, akatsukiId));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getCardsInZone("battleArea")).toHaveLength(3);
    });

    it("does not trigger when paired with a Pilot that fails the Orb link condition", () => {
      const nonOrbPilot = createMockPilot({ traits: ["coordinator"], level: 1, cost: 1 });
      const engine = GundamTestEngine.create(
        {
          hand: [nonOrbPilot],
          play: [gd05AkatsukiOowashi004],
          resourceArea: activeResources(1),
        },
        { play: [createMockUnit({ level: 4 })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const akatsukiId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(nonOrbPilot, akatsukiId));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getPilotId(akatsukiId)).toBeDefined();
    });
  });
});
