import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { st05McgillisFareed012 } from "./012-mcgillis-fareed.ts";

describe("McGillis Fareed (ST05-012)", () => {
  it("【Burst】 Add this card to your hand — moves shield into hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [st05McgillisFareed012] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  describe("【When Paired】If you have 2 or more other (Gjallarhorn)/(Tekkadan) Units in play, choose 1 enemy Unit with 3 or less HP. Rest it.", () => {
    it("rests a 3-or-less-HP enemy when 2+ other (Gjallarhorn)/(Tekkadan) Units are in play", () => {
      // Pair host (carries the McGillis pilot) + 2 other matching units = 2 "other" matches.
      const host = createMockUnit({ traits: ["gjallarhorn"] });
      const otherGj = createMockUnit({ traits: ["gjallarhorn"] });
      const otherTk = createMockUnit({ traits: ["tekkadan"] });
      const enemy = createMockUnit({ ap: 2, hp: 3 });

      const engine = GundamTestEngine.create(
        {
          hand: [st05McgillisFareed012],
          play: [host, otherGj, otherTk],
          resourceArea: activeResources(5),
          deck: 5,
        },
        { play: [enemy], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(st05McgillisFareed012, hostId));

      if (engine.getPendingChoice()) {
        expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
      }

      expect(engine.getG().exhausted[enemyId]).toBe(true);
    });

    it("does NOT fire when only 1 matching Unit is in play (below 2 threshold)", () => {
      // Non-matching host + 1 matching Unit = only 1 match in play → count < 2.
      const host = createMockUnit({ traits: ["earth federation"] });
      const onlyMatch = createMockUnit({ traits: ["gjallarhorn"] });
      const enemy = createMockUnit({ ap: 2, hp: 3 });

      const engine = GundamTestEngine.create(
        {
          hand: [st05McgillisFareed012],
          play: [host, onlyMatch],
          resourceArea: activeResources(5),
          deck: 5,
        },
        { play: [enemy], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(st05McgillisFareed012, hostId));

      expect(engine.getPendingChoice()).toBeFalsy();
      expect(engine.getG().exhausted[enemyId] ?? false).toBe(false);
    });

    it("does NOT fire when other units don't carry either trait (e.g. Titans/EF)", () => {
      const host = createMockUnit({ traits: ["gjallarhorn"] });
      const filler1 = createMockUnit({ traits: ["titans"] });
      const filler2 = createMockUnit({ traits: ["earth federation"] });
      const enemy = createMockUnit({ ap: 2, hp: 3 });

      const engine = GundamTestEngine.create(
        {
          hand: [st05McgillisFareed012],
          play: [host, filler1, filler2],
          resourceArea: activeResources(5),
          deck: 5,
        },
        { play: [enemy], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(st05McgillisFareed012, hostId));

      expect(engine.getPendingChoice()).toBeFalsy();
      expect(engine.getG().exhausted[enemyId] ?? false).toBe(false);
    });
  });
});
