import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { varuckSmolderingSpire as domain } from "./varuck-smoldering-spire.ts";
/** @covers IyM7IBCQeb-a1 */
describe("Domain upkeep responds only to its controller's materialization", () => {
  for (const own of [false, true])
    it(`own materialization=${own}`, () => {
      const champion = createClassBonusTestChampion(domain, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        phase: "materialize",
        firstPlayer: own ? "playerOne" : "playerTwo",
        playerOne: { champion, zones: { field: [domain], "material-deck": [trainingSword] } },
        playerTwo: { champion, zones: { "material-deck": [trainingSword] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(domain),
        actor = own ? p : q;
      actor.materialize(trainingSword);
      passEffectsStack(game);
      expect(game.state.objects[source.objectId]!.zone).toBe(own ? "graveyard" : "field");
      expect(actor.card(trainingSword, { zone: "field" })).toBeDefined();
    });
});

import { blitzMage } from "../allies/blitz-mage.ts";
import { grayWolf } from "../allies/gray-wolf.ts";
import { waterBarrier } from "../actions/water-barrier.ts";
/** @covers IyM7IBCQeb-a2 */
describe("Varuck bypasses prevention only for controlled fire damage", () => {
  for (const ownsDomain of [false, true])
    for (const fire of [false, true])
      it(`domain controller attacks=${ownsDomain},fire=${fire}`, () => {
        const champion = grantTestChampionLevel(
          createClassBonusTestChampion(waterBarrier, false, "activation-discount"),
          2,
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: { field: [...(ownsDomain ? [domain] : []), blitzMage, grayWolf, giantTortoise] },
          },
          playerTwo: {
            champion,
            zones: {
              field: ownsDomain ? [] : [domain],
              hand: [waterBarrier, ...Array.from({ length: 3 }, () => woodlandSquirrels)],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = q.card(champion);
        p.pass();
        q.activate(waterBarrier, {
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
        });
        passEffectsStack(game);
        const wait = game.waitState();
        if (wait.kind === "opportunity" && wait.playerId === q.id) q.pass();
        p.declareAttack(fire ? blitzMage : grayWolf, hero);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[hero.objectId]!.damage).toBe(ownsDomain && fire ? 3 : 1);
        p.declareAttack(giantTortoise, hero);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[hero.objectId]!.damage).toBe(ownsDomain && fire ? 4 : 2);
      });
});
import { fireball } from "../actions/fireball.ts";
/** @covers IyM7IBCQeb-a2 */
for (const own of [false, true])
  it(`also bypasses prevention for fire actions on the stack only for its controller: ${own}`, () => {
    const attacker = grantTestChampionLevel(
        createClassBonusTestChampion(fireball, false, "activation-discount"),
        2,
      ),
      defender = createClassBonusTestChampion(waterBarrier, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: attacker,
        zones: {
          field: own ? [domain] : [],
          hand: [fireball, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
        },
      },
      playerTwo: {
        champion: defender,
        zones: {
          field: own ? [] : [domain],
          hand: [waterBarrier, ...Array.from({ length: 3 }, () => woodlandSquirrels)],
        },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      hero = q.card(defender);
    p.pass();
    q.activate(waterBarrier, {
      reservePayment: q
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
    });
    passEffectsStack(game);
    const wait = game.waitState();
    if (wait.kind === "opportunity" && wait.playerId === q.id) q.pass();
    p.activate(fireball, {
      reservePayment: p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
      targets: { "target-1": [hero.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[hero.objectId]!.damage).toBe(own ? 3 : 1);
  });
