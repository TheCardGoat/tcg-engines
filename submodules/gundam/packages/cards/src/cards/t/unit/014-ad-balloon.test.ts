import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st03TheBlueGiant014 } from "../../st03/command/014-the-blue-giant.ts";
import { tAdBalloon014 } from "./014-ad-balloon.ts";

describe("Ad Balloon (T-014)", () => {
  describe("This Unit can't be set as active or paired with a Pilot.", () => {
    it("remains rested when its controller's effect tries to set it active", () => {
      const readyCommand = createMockCommand({
        name: "Friendly Ready Effect",
        level: 0,
        cost: 0,
        effects: [
          {
            type: "command",
            activation: { timing: ["main"] },
            directives: [
              {
                action: {
                  action: "setActive",
                  target: {
                    owner: "friendly",
                    cardType: "unit",
                    state: "rested",
                    count: 1,
                  },
                },
              },
            ],
            sourceText: "【Main】Choose 1 rested friendly Unit. Set it as active.",
          },
        ],
      });
      const engine = GundamTestEngine.create({
        hand: [readyCommand],
        play: [{ card: tAdBalloon014, exhausted: true }],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const adBalloonId = p1.getCardsInZone("battleArea")[0]!;
      const commandId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(commandId, { targets: [adBalloonId] }));

      expect(p1.isExhausted(adBalloonId)).toBe(true);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("remains rested when an opponent's effect tries to set it active", () => {
      const readyEnemyCommand = createMockCommand({
        name: "Enemy Ready Effect",
        level: 0,
        cost: 0,
        effects: [
          {
            type: "command",
            activation: { timing: ["main"] },
            directives: [
              {
                action: {
                  action: "setActive",
                  target: {
                    owner: "opponent",
                    cardType: "unit",
                    state: "rested",
                    count: 1,
                  },
                },
              },
            ],
            sourceText: "【Main】Choose 1 rested enemy Unit. Set it as active.",
          },
        ],
      });
      const engine = GundamTestEngine.create(
        { play: [{ card: tAdBalloon014, exhausted: true }] },
        { hand: [readyEnemyCommand] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const adBalloonId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.playCommand(readyEnemyCommand, { targets: [adBalloonId] }));

      expect(p1.isExhausted(adBalloonId)).toBe(true);
    });

    it("stays rested through its controller's next Start Phase", () => {
      const engine = GundamTestEngine.create(
        {
          play: [{ card: tAdBalloon014, exhausted: true }],
          deck: 5,
        },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const adBalloonId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.passPhase());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.passActionStep());

      expect(p1.isExhausted(adBalloonId)).toBe(true);
    });

    it("does not prevent the same set-active effect from readying an ordinary Unit", () => {
      const readyCommand = createMockCommand({
        name: "Friendly Ready Effect",
        level: 0,
        cost: 0,
        effects: [
          {
            type: "command",
            activation: { timing: ["main"] },
            directives: [
              {
                action: {
                  action: "setActive",
                  target: {
                    owner: "friendly",
                    cardType: "unit",
                    state: "rested",
                    count: 1,
                  },
                },
              },
            ],
            sourceText: "【Main】Choose 1 rested friendly Unit. Set it as active.",
          },
        ],
      });
      const ordinaryUnit = createMockUnit({ name: "Ordinary Unit" });
      const engine = GundamTestEngine.create({
        hand: [readyCommand],
        play: [
          { card: tAdBalloon014, exhausted: true },
          { card: ordinaryUnit, exhausted: true },
        ],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [, ordinaryUnitId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(readyCommand, { targets: [ordinaryUnitId!] }));

      expect(p1.isExhausted(ordinaryUnitId!)).toBe(false);
    });

    it("does not prevent an ordinary rested Unit from readying during the Start Phase", () => {
      const ordinaryUnit = createMockUnit({ name: "Ordinary Unit" });
      const engine = GundamTestEngine.create(
        {
          play: [
            { card: tAdBalloon014, exhausted: true },
            { card: ordinaryUnit, exhausted: true },
          ],
          deck: 5,
        },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [adBalloonId, ordinaryUnitId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.passPhase());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.passActionStep());

      expect(p1.isExhausted(adBalloonId!)).toBe(true);
      expect(p1.isExhausted(ordinaryUnitId!)).toBe(false);
    });

    it("rejects pairing a Pilot and leaves both cards in their original zones", () => {
      const pilot = createMockPilot({ name: "Test Pilot", cost: 1, level: 1 });
      const engine = GundamTestEngine.create({
        hand: [pilot],
        play: [tAdBalloon014],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const adBalloonId = p1.getCardsInZone("battleArea")[0]!;
      const pilotId = p1.getHand()[0]!;

      expectFailure(p1.assignPilot(pilotId, adBalloonId), "UNIT_CANNOT_PAIR_PILOT");

      expect(p1.getPilotId(adBalloonId)).toBeUndefined();
      expect(p1.getCardZone(adBalloonId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getCardZone(pilotId)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(0);
    });

    it("does not prevent the same Pilot from pairing with an ordinary Unit", () => {
      const pilot = createMockPilot({ name: "Test Pilot", cost: 1, level: 1 });
      const ordinaryUnit = createMockUnit({ name: "Ordinary Unit" });
      const engine = GundamTestEngine.create({
        hand: [pilot],
        play: [tAdBalloon014, ordinaryUnit],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [adBalloonId, ordinaryUnitId] = p1.getCardsInZone("battleArea");
      const pilotId = p1.getHand()[0]!;

      expectFailure(p1.assignPilot(pilotId, adBalloonId!), "UNIT_CANNOT_PAIR_PILOT");
      expectSuccess(p1.assignPilot(pilotId, ordinaryUnitId!));

      expect(p1.getPilotId(ordinaryUnitId!)).toBe(pilotId);
      expect(p1.getPilotId(adBalloonId!)).toBeUndefined();
    });

    it("also rejects a Command card played as its printed Pilot", () => {
      const engine = GundamTestEngine.create({
        hand: [st03TheBlueGiant014],
        play: [tAdBalloon014],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const adBalloonId = p1.getCardsInZone("battleArea")[0]!;
      const commandId = p1.getHand()[0]!;

      expectFailure(p1.playCommandAsPilot(commandId, adBalloonId), "UNIT_CANNOT_PAIR_PILOT");

      expect(p1.getPilotId(adBalloonId)).toBeUndefined();
      expect(p1.getCardZone(commandId)).toBe(`hand:${PLAYER_ONE}`);
    });
  });
});
