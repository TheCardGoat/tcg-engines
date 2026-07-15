import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockResource,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04IndiscriminateViolence106 } from "../command/106-indiscriminate-violence.ts";
import { gd04GundamAerialRebuild024 } from "../unit/024-gundam-aerial-rebuild.ts";
import { gd04SulettaMercury085 } from "./085-suletta-mercury.ts";

describe("Suletta Mercury (GD04-085)", () => {
  it("【Burst】adds this card to hand when its controller accepts the revealed Shield prompt", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create(
      { shieldArea: [gd04SulettaMercury085] },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const shieldId = p1.getCardsInZone("shieldArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      sourceCardId: shieldId,
      directiveIndex: -1,
    });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p1.getHand()).toContain(shieldId);
  });

  describe("【During Link】【Once per Turn】When you play and activate an (Academy) Command card using an EX Resource, if you have no remaining EX Resources, place 1 rested EX Resource.", () => {
    it("replaces the last spent EX Resource with a rested EX Resource", () => {
      const resources = [
        ...activeResources(1),
        ...activeResources(3).map((entry) => ({ ...entry, exhausted: true })),
        {
          card: createMockResource({ name: "EX Resource" }),
          exhausted: false,
          isToken: true,
        },
      ];
      const engine = GundamTestEngine.create({
        hand: [gd04SulettaMercury085, gd04IndiscriminateViolence106],
        play: [gd04GundamAerialRebuild024],
        resourceArea: resources,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const resourceIdsBefore = p1.getCardsInZone("resourceArea");
      const spentExResourceId = resourceIdsBefore.at(-1)!;

      expectSuccess(p1.assignPilot(gd04SulettaMercury085, hostId));
      expectSuccess(p1.playCommand(gd04IndiscriminateViolence106, { targets: [hostId] }));

      const resourceIdsAfter = p1.getCardsInZone("resourceArea");
      const replacementExResourceId = resourceIdsAfter.find(
        (cardId) => !resourceIdsBefore.includes(cardId),
      );
      expect(resourceIdsAfter).not.toContain(spentExResourceId);
      expect(resourceIdsAfter).toHaveLength(resourceIdsBefore.length);
      expect(replacementExResourceId).toBeDefined();
      expect(p1.isExhausted(replacementExResourceId!)).toBe(true);
    });

    it("does not place another EX Resource while one remains after payment", () => {
      const resources = [
        ...activeResources(1),
        ...activeResources(3).map((entry) => ({ ...entry, exhausted: true })),
        {
          card: createMockResource({ name: "EX Resource" }),
          exhausted: false,
          isToken: true,
        },
        {
          card: createMockResource({ name: "EX Resource" }),
          exhausted: false,
          isToken: true,
        },
      ];
      const engine = GundamTestEngine.create({
        hand: [gd04SulettaMercury085, gd04IndiscriminateViolence106],
        play: [gd04GundamAerialRebuild024],
        resourceArea: resources,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const resourceIdsBefore = p1.getCardsInZone("resourceArea");
      const exResourceIds = resourceIdsBefore.slice(-2);

      expectSuccess(p1.assignPilot(gd04SulettaMercury085, hostId));
      expectSuccess(p1.playCommand(gd04IndiscriminateViolence106, { targets: [hostId] }));

      const resourceIdsAfter = p1.getCardsInZone("resourceArea");
      expect(resourceIdsAfter).toHaveLength(resourceIdsBefore.length - 1);
      expect(resourceIdsAfter.every((cardId) => resourceIdsBefore.includes(cardId))).toBe(true);
      expect(resourceIdsAfter.filter((cardId) => exResourceIds.includes(cardId))).toHaveLength(1);
    });
  });
});
