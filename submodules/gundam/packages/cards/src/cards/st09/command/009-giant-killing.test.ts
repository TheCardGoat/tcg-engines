import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectCardInTrash,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st09GiantKilling009 } from "./009-giant-killing.ts";

describe("Giant Killing (ST09-009)", () => {
  describe("【Main】/【Action】Choose 1 active enemy Unit with 4 or less AP. Destroy it.", () => {
    it("data targets one active enemy Unit with AP <= 4", () => {
      const effect = st09GiantKilling009.effects?.[0];
      const directive = effect?.directives[0];

      expect(effect?.type).toBe("command");
      expect(effect?.activation.timing).toEqual(["main", "action"]);
      if (!directive || !("action" in directive) || directive.action.action !== "destroy") {
        throw new Error("Unexpected directive shape");
      }
      expect(directive.action.target).toEqual({
        owner: "opponent",
        cardType: "unit",
        state: "active",
        attributeFilters: [{ attribute: "ap", comparison: "lte", value: 4 }],
        count: 1,
      });
    });

    it("destroys an active enemy unit with 4 AP", () => {
      const enemy = createMockUnit({ ap: 4, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st09GiantKilling009], resourceArea: activeResources(4) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const cmdId = p1.getHand()[0]!;
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(st09GiantKilling009, { targets: [enemyId!] }));

      expectCardInTrash(engine, enemyId!, p2.playerId);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });

    it("is also playable at action timing", () => {
      const enemy = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st09GiantKilling009], resourceArea: activeResources(4) },
        { play: [enemy] },
      );
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(st09GiantKilling009, { targets: [enemyId!] }));

      expectCardInTrash(engine, enemyId!, p2.playerId);
    });

    it("cannot target an enemy unit with more than 4 AP", () => {
      const enemy = createMockUnit({ ap: 5, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st09GiantKilling009], resourceArea: activeResources(4) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectFailure(p1.playCommand(st09GiantKilling009, { targets: [enemyId!] }), "INVALID_TARGET");
    });

    it("cannot target a rested enemy unit even when its AP is low enough", () => {
      const enemy = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st09GiantKilling009], resourceArea: activeResources(4) },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectFailure(p1.playCommand(st09GiantKilling009, { targets: [enemyId!] }), "INVALID_TARGET");
    });

    it("cannot target a friendly active unit", () => {
      const friendly = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [st09GiantKilling009],
        resourceArea: activeResources(4),
        play: [friendly],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [friendlyId] = p1.getCardsInZone("battleArea");

      expectFailure(
        p1.playCommand(st09GiantKilling009, { targets: [friendlyId!] }),
        "INVALID_TARGET",
      );
    });

    it("fails cleanly when there are no legal targets", () => {
      const enemy = createMockUnit({ ap: 6, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st09GiantKilling009], resourceArea: activeResources(4) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(st09GiantKilling009), "NO_LEGAL_TARGETS");
    });
  });
});
