import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  expectSuccess,
  expectFailure,
  createMockUnit,
  activeResources,
  findStatModifier,
  countStatModifiers,
  expectCardInTrash,
} from "@tcg/gundam-engine";
import { st06RuthlessTactics011 } from "./011-ruthless-tactics.ts";

describe("Ruthless Tactics (ST06-011)", () => {
  describe("【Main】/【Action】Choose 1 to 2 friendly (Clan) Units. They get AP+2 during this turn.", () => {
    it("applies AP+2 modifier to a single friendly (Clan) unit", () => {
      const clanUnit = createMockUnit({ traits: ["clan"], ap: 2, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [st06RuthlessTactics011],
        play: [clanUnit],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(st06RuthlessTactics011, { targets: [unitId!] }));

      const mod = findStatModifier(engine, unitId!, "ap");
      expect(mod).toBeDefined();
      expect(mod!.modifier).toBe(2);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });

    it("applies AP+2 modifier to two friendly (Clan) units", () => {
      const clanUnit1 = createMockUnit({ traits: ["clan"], ap: 2, hp: 3 });
      const clanUnit2 = createMockUnit({ traits: ["clan"], ap: 2, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [st06RuthlessTactics011],
        play: [clanUnit1, clanUnit2],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [u1Id, u2Id] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(st06RuthlessTactics011, { targets: [u1Id!, u2Id!] }));

      expect(countStatModifiers(engine, u1Id!, "ap")).toBe(1);
      expect(countStatModifiers(engine, u2Id!, "ap")).toBe(1);
    });

    it("rejects a play with 3 targets (exceeds max)", () => {
      const clan1 = createMockUnit({ traits: ["clan"], ap: 2, hp: 3 });
      const clan2 = createMockUnit({ traits: ["clan"], ap: 2, hp: 3 });
      const clan3 = createMockUnit({ traits: ["clan"], ap: 2, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [st06RuthlessTactics011],
        play: [clan1, clan2, clan3],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [u1, u2, u3] = p1.getCardsInZone("battleArea");

      expectFailure(
        p1.playCommand(st06RuthlessTactics011, { targets: [u1!, u2!, u3!] }),
        "INVALID_TARGET",
      );
    });

    it("cannot target a non-(Clan) unit", () => {
      const nonClan = createMockUnit({ traits: ["earth federation"], ap: 2, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [st06RuthlessTactics011],
        play: [nonClan],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");

      expectFailure(
        p1.playCommand(st06RuthlessTactics011, { targets: [unitId!] }),
        "INVALID_TARGET",
      );
    });
  });
});
