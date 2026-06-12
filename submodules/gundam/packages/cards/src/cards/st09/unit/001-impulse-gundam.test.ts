import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st09ImpulseGundam001 } from "./001-impulse-gundam.ts";

describe("Impulse Gundam (ST09-001)", () => {
  const createTrashImpulse = (overrides = {}) =>
    createMockUnit({
      name: "Force Impulse Gundam",
      level: 4,
      cost: 4,
      ap: 4,
      hp: 4,
      color: "purple",
      ...overrides,
    });

  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [st09ImpulseGundam001] }, {});
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(st09ImpulseGundam001.type).toBe("unit");
    expect(st09ImpulseGundam001.level).toBe(3);
    expect(st09ImpulseGundam001.cost).toBe(2);
    expect(st09ImpulseGundam001.ap).toBe(3);
    expect(st09ImpulseGundam001.hp).toBe(3);
  });

  describe('【Activate･Main】②, return this Unit to the bottom of its owner\'s deck：Choose 1 Unit card with "Impulse Gundam" in its card name that is Lv.4 or higher from your trash. Deploy it.', () => {
    it("data encodes the 2-resource activated main ability and both movement directives", () => {
      const effect = st09ImpulseGundam001.effects?.[0];

      expect(effect?.type).toBe("activated");
      expect(effect?.activation.timing).toEqual(["activate:main"]);
      expect(effect?.cost).toEqual({ payResources: 2 });
      expect(effect?.directives).toEqual([
        {
          action: {
            action: "returnToDeck",
            position: "bottom",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
        {
          action: {
            action: "deploy",
            target: {
              owner: "friendly",
              cardType: "unit",
              zone: "trash",
              count: 1,
              attributeFilters: [
                {
                  attribute: "name",
                  comparison: "includes",
                  value: "Impulse Gundam",
                },
                {
                  attribute: "level",
                  comparison: "gte",
                  value: 4,
                },
              ],
            },
          },
        },
      ]);
    });

    it("pays 2 resources, returns itself to deck bottom, and deploys a Lv.4+ Impulse from trash", () => {
      const target = createTrashImpulse();
      const engine = GundamTestEngine.create(
        {
          play: [st09ImpulseGundam001],
          trash: [target],
          resourceArea: activeResources(2),
          deck: 2,
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const selfId = p1.getCardsInZone("battleArea")[0]!;
      const targetId = p1.getCardsInZone("trash")[0]!;

      expectSuccess(p1.activateAbility(selfId, 0, { targets: [targetId] }));

      expect(p1.getCardsInZone("battleArea")).toEqual([targetId]);
      expect(p1.getCardsInZone("trash")).toHaveLength(0);
      expect(p1.getCardsInZone("deck").at(0)).toBe(selfId);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
    });

    it("matches an Impulse Gundam variant by card-name inclusion", () => {
      const target = createTrashImpulse({ name: "Blast Impulse Gundam" });
      const engine = GundamTestEngine.create(
        {
          play: [st09ImpulseGundam001],
          trash: [target],
          resourceArea: activeResources(2),
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const selfId = p1.getCardsInZone("battleArea")[0]!;
      const targetId = p1.getCardsInZone("trash")[0]!;

      expectSuccess(p1.activateAbility(selfId, 0, { targets: [targetId] }));

      expect(p1.getCardsInZone("battleArea")).toEqual([targetId]);
    });

    it("lets the controller choose which legal Impulse Gundam is deployed", () => {
      const first = createTrashImpulse({ name: "Force Impulse Gundam" });
      const second = createTrashImpulse({ name: "Sword Impulse Gundam" });
      const engine = GundamTestEngine.create(
        {
          play: [st09ImpulseGundam001],
          trash: [first, second],
          resourceArea: activeResources(2),
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const selfId = p1.getCardsInZone("battleArea")[0]!;
      const [firstId, secondId] = p1.getCardsInZone("trash");

      expectSuccess(p1.activateAbility(selfId, 0, { targets: [secondId!] }));

      expect(p1.getCardsInZone("battleArea")).toEqual([secondId]);
      expect(p1.getCardsInZone("trash")).toEqual([firstId]);
    });

    it("prompts for a trash target when activated without a chosen target", () => {
      const target = createTrashImpulse();
      const engine = GundamTestEngine.create(
        {
          play: [st09ImpulseGundam001],
          trash: [target],
          resourceArea: activeResources(2),
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const selfId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.activateAbility(selfId, 0));

      const pending = engine.getPendingChoice();
      expect(pending?.kind).toBe("targetSelection");
      expect(p1.getCardsInZone("battleArea")).toEqual([selfId]);
    });

    it("cannot activate without 2 active resources", () => {
      const target = createTrashImpulse();
      const engine = GundamTestEngine.create(
        {
          play: [st09ImpulseGundam001],
          trash: [target],
          resourceArea: activeResources(1),
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const selfId = p1.getCardsInZone("battleArea")[0]!;
      const targetId = p1.getCardsInZone("trash")[0]!;

      expectFailure(
        p1.activateAbility(selfId, 0, { targets: [targetId] }),
        "INSUFFICIENT_RESOURCES",
      );
      expect(p1.getCardsInZone("battleArea")).toEqual([selfId]);
      expect(p1.getCardsInZone("trash")).toEqual([targetId]);
    });

    it("rejects a trash Unit below Lv.4", () => {
      const lowLevel = createTrashImpulse({ level: 3 });
      const engine = GundamTestEngine.create(
        {
          play: [st09ImpulseGundam001],
          trash: [lowLevel],
          resourceArea: activeResources(2),
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const selfId = p1.getCardsInZone("battleArea")[0]!;
      const lowLevelId = p1.getCardsInZone("trash")[0]!;

      expectFailure(p1.activateAbility(selfId, 0, { targets: [lowLevelId] }), "ILLEGAL_TARGET");
      expect(p1.getCardsInZone("battleArea")).toEqual([selfId]);
      expect(p1.getCardsInZone("trash")).toEqual([lowLevelId]);
    });

    it('rejects a Lv.4+ trash Unit without "Impulse Gundam" in its card name', () => {
      const wrongName = createTrashImpulse({ name: "Destiny Gundam", level: 6 });
      const engine = GundamTestEngine.create(
        {
          play: [st09ImpulseGundam001],
          trash: [wrongName],
          resourceArea: activeResources(2),
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const selfId = p1.getCardsInZone("battleArea")[0]!;
      const wrongNameId = p1.getCardsInZone("trash")[0]!;

      expectFailure(p1.activateAbility(selfId, 0, { targets: [wrongNameId] }), "ILLEGAL_TARGET");
      expect(p1.getCardsInZone("battleArea")).toEqual([selfId]);
      expect(p1.getCardsInZone("trash")).toEqual([wrongNameId]);
    });

    it("rejects an opponent's matching trash Unit", () => {
      const target = createTrashImpulse();
      const engine = GundamTestEngine.create(
        {
          play: [st09ImpulseGundam001],
          resourceArea: activeResources(2),
        },
        { trash: [target] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const selfId = p1.getCardsInZone("battleArea")[0]!;
      const opponentTargetId = p2.getCardsInZone("trash")[0]!;

      expectFailure(
        p1.activateAbility(selfId, 0, { targets: [opponentTargetId] }),
        "ILLEGAL_TARGET",
      );
      expect(p1.getCardsInZone("battleArea")).toEqual([selfId]);
      expect(p2.getCardsInZone("trash")).toEqual([opponentTargetId]);
    });
  });
});
