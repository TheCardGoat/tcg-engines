import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { steelSlug } from "../cards/MRC/items/steel-slug.ts";
import { savageAttack } from "../cards/AMB/attacks/savage-attack.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion, grandArchiveTestFace } from "./class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "./decisions.ts";

export function proveGunMustBeLoaded(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
): void {
  const durability = grandArchiveTestFace(card).stats.durability;
  if (durability === undefined) throw new Error("Gun needs printed durability");
  const setup = () => {
    const champion = createClassBonusTestChampion(card, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [card, card, steelSlug],
          hand: [savageAttack, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: {
        champion,
        zones: { field: [card], "main-deck": [woodlandSquirrels, woodlandSquirrels] },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two");
    const [gun, other] = p.cards(card, { zone: "field" });
    if (!gun || !other) throw new Error("Missing Guns");
    const bullet = p.card(steelSlug),
      attacker = p.card(champion),
      target = q.card(champion);
    const load = () => {
      p.activateAbility(bullet, "ao8bki6fxx-a2", { targets: { "target-weapon": [gun.objectId] } });
      passEffectsStack(game);
      expect(game.state.objects[bullet.objectId]!.zone).toBe("loaded");
      expect(game.state.objects[bullet.objectId]!.hostId).toBe(gun.objectId);
    };
    return { game, p, q, gun, other, bullet, attacker, target, load };
  };
  it("rejects an unloaded Gun without changing the game", () => {
    const { game, p, gun, attacker, target } = setup();
    const before = game.state;
    expect(() => p.declareAttack(attacker, target, { weaponIds: [gun.objectId] })).toThrow();
    expect(game.state).toEqual(before);
  });
  it("moves loaded ammunition to intent, deals combined power, and consumes durability", () => {
    const { game, p, q, gun, other, bullet, attacker, target, load } = setup();
    load();
    const before = game.state;
    expect(() => p.declareAttack(attacker, target, { weaponIds: [other.objectId] })).toThrow();
    expect(game.state).toEqual(before);
    p.declareAttack(attacker, target, { weaponIds: [gun.objectId] });
    expect(game.state.objects[bullet.objectId]!.zone).toBe("intent");
    expect(game.state.objects[bullet.objectId]!.hostId).toBe(attacker.objectId);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(4);
    expect(game.state.objects[bullet.objectId]!.zone).toBe("material-deck");
    expect(game.state.objects[gun.objectId]!.zone).toBe(durability === 1 ? "banishment" : "field");
    expect(game.state.objects[gun.objectId]!.counters.durability ?? 0).toBe(durability - 1);
    expect(game.state.objects[other.objectId]!.counters.durability).toBe(durability);
    if (durability > 1) {
      advanceToMain(game, q.id);
      advanceToMain(game, p.id);
      const unloaded = game.state;
      expect(() => p.declareAttack(attacker, target, { weaponIds: [gun.objectId] })).toThrow();
      expect(game.state).toEqual(unloaded);
    }
  });
  it("rejects a loaded Gun with an attack card and preserves the ammunition", () => {
    const { game, p, gun, bullet, attacker, target, load } = setup();
    load();
    p.activate(savageAttack, {
      attackAttackerId: attacker.objectId,
      reservePayment: p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card", cardId: c.objectId })),
    });
    passEffectsStack(game);
    expect(game.state.decision?.kind).toBe("declare-resolved-attack");
    const before = game.state;
    expect(() =>
      answerDecision(game, "declare-resolved-attack", {
        attackerId: attacker.objectId,
        targetIds: [target.objectId],
        weaponIds: [gun.objectId],
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
    answerDecision(game, "declare-resolved-attack", {
      attackerId: attacker.objectId,
      targetIds: [target.objectId],
      weaponIds: [],
    });
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(2);
    expect(game.state.objects[bullet.objectId]!.zone).toBe("loaded");
    expect(game.state.objects[bullet.objectId]!.hostId).toBe(gun.objectId);
    expect(game.state.objects[gun.objectId]!.counters.durability).toBe(durability);
  });
}
