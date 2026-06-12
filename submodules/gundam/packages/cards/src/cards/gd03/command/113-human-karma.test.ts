import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectCardInTrash,
  expectFailure,
  expectSuccess,
  getDamageCounter,
  isCardExhausted,
} from "@tcg/gundam-engine";
import { gd03HumanKarma113 } from "./113-human-karma.ts";

describe("Human Karma (GD03-113)", () => {
  describe("【Main】/【Action】Choose 1 active friendly Unit. Rest it. If you do, choose 1 enemy Unit whose Lv. is equal to or lower than the Unit rested with this ability. Deal 3 damage to it.", () => {
    function setup({
      friendlyLevel = 4,
      enemyLevel = 4,
      friendlyExhausted = false,
      resourceCount = 3,
    }: {
      friendlyLevel?: number;
      enemyLevel?: number;
      friendlyExhausted?: boolean;
      resourceCount?: number;
    } = {}) {
      const friendlyUnit = createMockUnit({
        name: "Friendly Unit",
        level: friendlyLevel,
        hp: 6,
      });
      const enemyUnit = createMockUnit({
        name: "Enemy Unit",
        level: enemyLevel,
        hp: 6,
      });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03HumanKarma113],
          resourceArea: activeResources(resourceCount),
          play: [{ card: friendlyUnit, exhausted: friendlyExhausted }],
        },
        { play: [enemyUnit] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const friendlyId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
      const commandId = p1.getHand()[0]!;
      return { engine, p1, friendlyId, enemyId, commandId };
    }

    it("rests the chosen active friendly Unit and deals 3 damage to an equal-level enemy during Main timing", () => {
      const { engine, p1, friendlyId, enemyId } = setup({ friendlyLevel: 4, enemyLevel: 4 });

      expectSuccess(p1.playCommand(gd03HumanKarma113, { targets: [friendlyId, enemyId] }));

      expect(isCardExhausted(engine, friendlyId)).toBe(true);
      expect(getDamageCounter(engine, enemyId)).toBe(3);
    });

    it("damages a lower-level enemy chosen after resting the friendly Unit", () => {
      const { engine, p1, friendlyId, enemyId } = setup({ friendlyLevel: 5, enemyLevel: 3 });

      expectSuccess(p1.playCommand(gd03HumanKarma113, { targets: [friendlyId, enemyId] }));

      expect(isCardExhausted(engine, friendlyId)).toBe(true);
      expect(getDamageCounter(engine, enemyId)).toBe(3);
    });

    it("rests the friendly Unit but skips damage when the chosen enemy has a higher level", () => {
      const { engine, p1, friendlyId, enemyId } = setup({ friendlyLevel: 3, enemyLevel: 4 });

      expectSuccess(p1.playCommand(gd03HumanKarma113, { targets: [friendlyId, enemyId] }));

      expect(isCardExhausted(engine, friendlyId)).toBe(true);
      expect(getDamageCounter(engine, enemyId)).toBe(0);
    });

    it("can be played during Action timing", () => {
      const { engine, p1, friendlyId, enemyId } = setup({ friendlyLevel: 5, enemyLevel: 5 });
      engine.setPhase("end-phase");
      engine.setStep("action-step");

      expectSuccess(p1.playCommand(gd03HumanKarma113, { targets: [friendlyId, enemyId] }));

      expect(isCardExhausted(engine, friendlyId)).toBe(true);
      expect(getDamageCounter(engine, enemyId)).toBe(3);
    });

    it("moves the command card to trash after resolving", () => {
      const { engine, p1, friendlyId, enemyId, commandId } = setup();

      expectSuccess(p1.playCommand(gd03HumanKarma113, { targets: [friendlyId, enemyId] }));

      expectCardInTrash(engine, commandId, PLAYER_ONE);
    });

    it("cannot be played outside Main or Action timing", () => {
      const { engine, p1, friendlyId, enemyId } = setup();
      engine.setPhase("draw");

      expectFailure(
        p1.playCommand(gd03HumanKarma113, { targets: [friendlyId, enemyId] }),
        "WRONG_PHASE",
      );
    });

    it("cannot be played without enough active resources", () => {
      const { engine, p1, friendlyId, enemyId } = setup({ resourceCount: 3 });
      engine.getG().exhausted[p1.getCardsInZone("resourceArea")[0]!] = true;
      engine.getG().exhausted[p1.getCardsInZone("resourceArea")[1]!] = true;

      expectFailure(
        p1.playCommand(gd03HumanKarma113, { targets: [friendlyId, enemyId] }),
        "INSUFFICIENT_RESOURCES",
      );
    });

    it("requires an active friendly Unit as the first target", () => {
      const { p1, friendlyId, enemyId } = setup({ friendlyExhausted: true });

      expectFailure(
        p1.playCommand(gd03HumanKarma113, { targets: [friendlyId, enemyId] }),
        "INVALID_TARGET",
      );
    });

    it("rejects a friendly Unit as the damage target", () => {
      const otherFriendly = createMockUnit({ name: "Other Friendly", level: 2, hp: 5 });
      const friendlyUnit = createMockUnit({ name: "Rest Source", level: 4, hp: 6 });
      const engine = GundamTestEngine.create({
        hand: [gd03HumanKarma113],
        resourceArea: activeResources(3),
        play: [friendlyUnit, otherFriendly],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [friendlyId, otherFriendlyId] = p1.getCardsInZone("battleArea");

      expectFailure(
        p1.playCommand(gd03HumanKarma113, { targets: [friendlyId!, otherFriendlyId!] }),
        "INVALID_TARGET",
      );
    });
  });
});
