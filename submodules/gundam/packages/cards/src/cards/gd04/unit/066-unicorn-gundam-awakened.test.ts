import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd05HokaKyotenJuzetsujin112 } from "../../gd05/command/112-hoka-kyoten-juzetsujin.ts";
import { gd05DragonGundam035 } from "../../gd05/unit/035-dragon-gundam.ts";
import { gd04Inspector112 } from "../command/112-inspector.ts";
import { gd04UnicornGundamAwakened066 } from "./066-unicorn-gundam-awakened.ts";

describe("Unicorn Gundam (Awakened) (GD04-066)", () => {
  describe("When you activate a Command's 【Main】/【Action】 effect, choose 1 enemy Unit. It gets AP-2 during this turn.", () => {
    it("shows AP-2 on the chosen enemy Unit after its controller plays a Main Command", () => {
      const enemyA = createMockUnit({ name: "Enemy A", level: 4, ap: 5, hp: 5 });
      const enemyB = createMockUnit({ name: "Enemy B", level: 4, ap: 5, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04Inspector112],
          play: [gd04UnicornGundamAwakened066],
          resourceArea: activeResources(4),
        },
        { play: [enemyA, enemyB] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [enemyAId, enemyBId] = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(gd04Inspector112));
      expectSuccess(p1.resolveEffect({ targets: [enemyAId!] }));

      expect(p1.getVisibleCard(enemyAId!)?.effectiveAp).toBe(3);
      expect(p1.getVisibleCard(enemyBId!)?.effectiveAp).toBe(5);
    });

    it("does not trigger when the opponent plays the Command", () => {
      const enemy = createMockUnit({ name: "Enemy", level: 4, ap: 5, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [gd04UnicornGundamAwakened066] },
        {
          hand: [gd04Inspector112],
          play: [enemy],
          resourceArea: activeResources(4),
        },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.playCommand(gd04Inspector112));

      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(5);
    });

    it("observes a paired Command Main activated indirectly by Dragon Gundam", () => {
      const enemy = createMockUnit({ name: "Enemy", level: 4, ap: 5, hp: 8 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd05HokaKyotenJuzetsujin112],
          play: [gd04UnicornGundamAwakened066, gd05DragonGundam035],
          resourceArea: activeResources(5),
        },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [unicornId, dragonId] = p1.getCardsInZone("battleArea");
      const commandId = p1.getHand()[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommandAsPilot(commandId, dragonId!));
      expectSuccess(p1.enterBattle(dragonId!, enemyId));

      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: unicornId,
        legalTargetIds: [enemyId],
      });
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
      expect(p1.getVisibleCard(enemyId)?.effectiveAp).toBe(3);

      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: commandId,
        legalTargetIds: [dragonId],
      });
      expectSuccess(p1.resolveEffect({ targets: [dragonId!] }));

      expect(p1.getVisibleCard(enemyId)?.effectiveAp).toBe(3);
      expect(p1.getPilotId(dragonId!)).toBe(commandId);
      expect(p1.getCardZone(commandId)).toBe(`battleArea:${PLAYER_ONE}`);
    });
  });

  describe("<Suppression>", () => {
    it("destroys the first 2 enemy Shields in one direct attack", () => {
      const shieldA = createMockUnit({ name: "Shield A" });
      const shieldB = createMockUnit({ name: "Shield B" });
      const engine = GundamTestEngine.create(
        { play: [gd04UnicornGundamAwakened066] },
        { shieldArea: [shieldA, shieldB] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(0);
    });
  });
});
