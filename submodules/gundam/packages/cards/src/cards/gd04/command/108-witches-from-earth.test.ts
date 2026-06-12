import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockResource,
  createMockUnit,
  expectCardInTrash,
  expectFailure,
  expectSuccess,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { gd04WitchesFromEarth108 } from "./108-witches-from-earth.ts";

describe("Witches from Earth (GD04-108)", () => {
  describe("【Main】/【Action】Choose 1 friendly (Academy) Unit. During this turn, reduce the next damage it receives by 2. If you use an EX Resource to play this card, reduce by 4 instead.", () => {
    function setup({ useEx = false }: { useEx?: boolean } = {}) {
      const academy = createMockUnit({
        name: "Academy Unit",
        traits: ["academy"],
        ap: 1,
        hp: 10,
      });
      const enemy = createMockUnit({ name: "Enemy Counterattacker", ap: 5, hp: 10 });
      const resources = useEx
        ? [
            ...activeResources(3).map((entry) => ({ ...entry, exhausted: true })),
            { card: createMockResource({ name: "EX Resource" }), exhausted: false },
          ]
        : activeResources(4);
      const engine = GundamTestEngine.create(
        {
          hand: [gd04WitchesFromEarth108],
          resourceArea: resources,
          play: [academy],
        },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const academyId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;
      const commandId = p1.getHand()[0]!;
      let exResourceId: string | undefined;
      if (useEx) {
        exResourceId = p1.getCardsInZone("resourceArea").at(-1)!;
        engine.markAsToken(exResourceId);
      }
      return { engine, p1, academyId, enemyId, commandId, exResourceId };
    }

    it("reduces the next battle damage a friendly Academy Unit receives by 2 during Main timing", () => {
      const { engine, p1, academyId, enemyId } = setup();

      expectSuccess(p1.playCommand(gd04WitchesFromEarth108, { targets: [academyId] }));
      expectSuccess(engine.resolveCombat({ attackerId: academyId, target: enemyId }));

      expect(getDamageCounter(engine, academyId)).toBe(3);
    });

    it("uses the EX Resource amount and reduces the next damage by 4 instead", () => {
      const { engine, p1, academyId, enemyId, exResourceId } = setup({ useEx: true });

      expectSuccess(p1.playCommand(gd04WitchesFromEarth108, { targets: [academyId] }));
      expectSuccess(engine.resolveCombat({ attackerId: academyId, target: enemyId }));

      expect(getDamageCounter(engine, academyId)).toBe(1);
      expect(engine.getState().ctx.zones.private.cardIndex[exResourceId!]?.zoneKey).toBe(
        "removalArea",
      );
    });

    it("consumes the reduction after the next damage event", () => {
      const { engine, p1, academyId, enemyId } = setup();

      expectSuccess(p1.playCommand(gd04WitchesFromEarth108, { targets: [academyId] }));
      expect(
        engine
          .getG()
          .continuousEffects.some((effect) => effect.payload.kind === "damage-reduction"),
      ).toBe(true);

      expectSuccess(engine.resolveCombat({ attackerId: academyId, target: enemyId }));

      expect(
        engine
          .getG()
          .continuousEffects.some((effect) => effect.payload.kind === "damage-reduction"),
      ).toBe(false);
    });

    it("can be played during Action timing", () => {
      const { engine, p1, academyId } = setup();
      engine.setPhase("end-phase");
      engine.setStep("action-step");

      expectSuccess(p1.playCommand(gd04WitchesFromEarth108, { targets: [academyId] }));

      expect(
        engine
          .getG()
          .continuousEffects.some((effect) => effect.payload.kind === "damage-reduction"),
      ).toBe(true);
    });

    it("moves the command card to trash after resolution", () => {
      const { engine, p1, academyId, commandId } = setup();

      expectSuccess(p1.playCommand(gd04WitchesFromEarth108, { targets: [academyId] }));

      expectCardInTrash(engine, commandId, PLAYER_ONE);
    });

    it("cannot target a friendly non-Academy Unit", () => {
      const nonAcademy = createMockUnit({ traits: ["earth federation"], hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [gd04WitchesFromEarth108],
        resourceArea: activeResources(4),
        play: [nonAcademy],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const nonAcademyId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.playCommand(gd04WitchesFromEarth108, { targets: [nonAcademyId] }),
        "INVALID_TARGET",
      );
    });

    it("cannot target an enemy Academy Unit", () => {
      const enemyAcademy = createMockUnit({ traits: ["academy"], hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [gd04WitchesFromEarth108], resourceArea: activeResources(4) },
        { play: [enemyAcademy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyAcademyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.playCommand(gd04WitchesFromEarth108, { targets: [enemyAcademyId] }),
        "INVALID_TARGET",
      );
    });

    it("cannot be played without enough active resources", () => {
      const { engine, p1, academyId } = setup();
      for (const resourceId of p1.getCardsInZone("resourceArea")) {
        engine.getG().exhausted[resourceId] = true;
      }

      expectFailure(
        p1.playCommand(gd04WitchesFromEarth108, { targets: [academyId] }),
        "INSUFFICIENT_RESOURCES",
      );
    });

    it("cannot be played outside Main or Action timing", () => {
      const { engine, p1, academyId } = setup();
      engine.setPhase("draw");

      expectFailure(
        p1.playCommand(gd04WitchesFromEarth108, { targets: [academyId] }),
        "WRONG_PHASE",
      );
    });
  });
});
