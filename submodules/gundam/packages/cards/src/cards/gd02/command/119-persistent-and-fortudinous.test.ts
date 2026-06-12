import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  expectFailure,
  createMockUnit,
  activeResources,
  expectCardInTrash,
  findStatModifier,
  markAsLinkUnit,
} from "@tcg/gundam-engine";
import { gd02PersistentAndFortudinous119 } from "./119-persistent-and-fortudinous.ts";

describe("Persistent and Fortudinous (GD02-119)", () => {
  describe("precondition: friendly (Gjallarhorn) Link Unit in play", () => {
    it("rejects play when no friendly Gjallarhorn Link Unit is in play", () => {
      const enemy = createMockUnit({ ap: 5, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd02PersistentAndFortudinous119],
          resourceArea: activeResources(2),
        },
        { play: [enemy] },
      );
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectFailure(p1.playCommand(gd02PersistentAndFortudinous119, { targets: [enemyId!] }));
    });

    it("rejects play when friendly unit has Gjallarhorn trait but is not a Link Unit", () => {
      const friendly = createMockUnit({ traits: ["gjallarhorn"] });
      const enemy = createMockUnit({ ap: 5, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd02PersistentAndFortudinous119],
          play: [friendly],
          resourceArea: activeResources(2),
        },
        { play: [enemy] },
      );
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectFailure(p1.playCommand(gd02PersistentAndFortudinous119, { targets: [enemyId!] }));
    });
  });

  describe("【Action】Choose 1 enemy Unit. It gets AP-3 during this battle.", () => {
    it("applies an AP-3 modifier to the chosen enemy unit for the battle", () => {
      const friendly = createMockUnit({ traits: ["gjallarhorn"] });
      const enemy = createMockUnit({ ap: 5, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd02PersistentAndFortudinous119],
          play: [friendly],
          resourceArea: activeResources(2),
        },
        { play: [enemy] },
      );
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [friendlyId] = p1.getCardsInZone("battleArea");
      markAsLinkUnit(engine, friendlyId!);
      const [enemyId] = p2.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(
        p1.playCommand(gd02PersistentAndFortudinous119, {
          targets: [enemyId!],
        }),
      );

      expect(findStatModifier(engine, enemyId!, "ap")?.modifier).toBe(-3);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });
  });
});
