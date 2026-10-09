import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { enthrallingVisage } from "./enthralling-visage.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { blitzMage } from "../../DOA/allies/blitz-mage.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

function fixture() {
  const champion = createClassBonusTestChampion(enthrallingVisage, true, "activation-discount");
  const opponent = createClassBonusTestChampion(sparkAlight, false, "activation-discount");
  const game = GrandArchiveTestEngine.startFixture({
    firstPlayer: "playerTwo",
    playerOne: {
      champion,
      zones: {
        hand: [enthrallingVisage, woodlandSquirrels, woodlandSquirrels],
        field: [giantTortoise, woodlandSquirrels],
        graveyard: [woodlandSquirrels],
        "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      champion: opponent,
      zones: {
        hand: [sparkAlight, woodlandSquirrels, woodlandSquirrels],
        field: [blitzMage, woodlandSquirrels, giantTortoise],
        graveyard: [woodlandSquirrels],
        "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
      },
    },
  });
  return { game, p: game.player("player-one"), q: game.player("player-two"), champion };
}

/** @covers ycwz9gv4vm-a1 */
describe("Enthralling Visage", () => {
  for (const ownGraveyard of [false, true]) {
    for (const smallHit of [false, true]) {
      it(`prevents only the next hit, small=${smallHit}, own graveyard=${ownGraveyard}`, () => {
        const { game, p, q, champion } = fixture();
        const hero = p.card(champion),
          graveOwner = ownGraveyard ? p : q;
        const card = graveOwner.card(woodlandSquirrels, { zone: "graveyard" });
        q.declareAttack(smallHit ? woodlandSquirrels : blitzMage, hero);
        q.pass();
        const payment = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const targets = { "target-1": [hero.objectId], "target-card": [card.objectId] };
        const before = game.state;
        expect(() =>
          p.activate(enthrallingVisage, { targets, reservePayment: payment.slice(1) }),
        ).toThrow();
        expect(game.state).toEqual(before);
        expect(() =>
          p.activate(enthrallingVisage, {
            targets: { ...targets, "target-card": [q.card(blitzMage).objectId] },
            reservePayment: payment,
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        expect(() =>
          p.activate(enthrallingVisage, {
            targets: { ...targets, "target-1": [card.objectId] },
            reservePayment: payment,
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activate(enthrallingVisage, { targets, reservePayment: payment });
        expect(p.zone("memory")).toHaveLength(2);
        passEffectsStack(game);
        expect(graveOwner.zone("graveyard")).toContainEqual(card);
        expect(game.state.objects[hero.objectId]!.damage).toBe(0);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[hero.objectId]!.damage).toBe(smallHit ? 0 : 1);
        expect(graveOwner.zone("banishment").map((c) => c.objectId)).toContain(card.objectId);
        expect(graveOwner.zone("graveyard").map((c) => c.objectId)).not.toContain(card.objectId);
        q.declareAttack(smallHit ? blitzMage : woodlandSquirrels, hero);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[hero.objectId]!.damage).toBe(smallHit ? 3 : 2);
        expect(game.state.stack).toHaveLength(0);
      });
    }
  }

  it("protects an ally without consuming the instance on another unit's damage", () => {
    const { game, p, q, champion } = fixture();
    const ally = p.card(giantTortoise),
      card = q.card(woodlandSquirrels, { zone: "graveyard" });
    q.pass();
    p.activate(enthrallingVisage, {
      targets: { "target-1": [ally.objectId], "target-card": [card.objectId] },
      reservePayment: p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card", cardId: c.objectId })),
    });
    passEffectsStack(game);
    q.declareAttack(woodlandSquirrels, p.card(champion));
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(1);
    expect(q.zone("graveyard")).toContainEqual(card);
    q.declareAttack(blitzMage, ally);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[ally.objectId]!.damage).toBe(1);
    expect(q.zone("banishment").map((c) => c.objectId)).toContain(card.objectId);
  });

  it("fizzles if the protected unit leaves before resolution while retaining paid costs", () => {
    const { game, p, q } = fixture();
    const ally = p.card(woodlandSquirrels, { zone: "field" });
    const card = q.card(woodlandSquirrels, { zone: "graveyard" });
    q.pass();
    p.activate(enthrallingVisage, {
      targets: { "target-1": [ally.objectId], "target-card": [card.objectId] },
      reservePayment: p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card", cardId: c.objectId })),
    });
    p.pass();
    q.activate(sparkAlight, {
      targets: { "target-1": [ally.objectId] },
      reservePayment: q
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card", cardId: c.objectId })),
    });
    passEffectsStack(game);
    expect(p.zone("graveyard").map((c) => c.objectId)).toContain(ally.objectId);
    expect(p.cards(enthrallingVisage, { zone: "graveyard" })).toHaveLength(1);
    expect(p.zone("memory")).toHaveLength(2);
    expect(q.zone("graveyard")).toContainEqual(card);
    expect(q.zone("banishment")).toHaveLength(0);
    expect(game.state.stack).toHaveLength(0);
  });

  it("does not banish on unpreventable damage and consumes the prevention instance", () => {
    const { game, p, q, champion } = fixture();
    const hero = p.card(champion),
      card = q.card(woodlandSquirrels, { zone: "graveyard" });
    q.activate(sparkAlight, {
      targets: { "target-1": [hero.objectId] },
      reservePayment: q
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card", cardId: c.objectId })),
    });
    q.pass();
    p.activate(enthrallingVisage, {
      targets: { "target-1": [hero.objectId], "target-card": [card.objectId] },
      reservePayment: p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card", cardId: c.objectId })),
    });
    passEffectsStack(game);
    expect(game.state.objects[hero.objectId]!.damage).toBe(2);
    expect(q.zone("graveyard")).toContainEqual(card);
    q.declareAttack(woodlandSquirrels, hero);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[hero.objectId]!.damage).toBe(3);
    expect(q.zone("graveyard")).toContainEqual(card);
    expect(q.zone("banishment")).toHaveLength(0);
  });

  it("protects an opposing ally, ignores damage to other units, and expires this turn", () => {
    const { game, p, q, champion } = fixture();
    const protectedUnit = q.card(giantTortoise),
      card = p.card(woodlandSquirrels, { zone: "graveyard" });
    q.pass();
    p.activate(enthrallingVisage, {
      targets: { "target-1": [protectedUnit.objectId], "target-card": [card.objectId] },
      reservePayment: p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card", cardId: c.objectId })),
    });
    passEffectsStack(game);
    q.declareAttack(woodlandSquirrels, p.card(champion));
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(1);
    expect(p.zone("graveyard")).toContainEqual(card);
    advanceToMain(game, p.id);
    p.declareAttack(giantTortoise, protectedUnit);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[protectedUnit.objectId]!.damage).toBe(1);
    expect(p.zone("graveyard")).toContainEqual(card);
    expect(p.zone("banishment")).toHaveLength(0);
  });
});
