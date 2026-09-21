import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { lawsurTheCarpenter } from "./lawsur-the-carpenter.ts";
import { evercurrentRaider } from "./evercurrent-raider.ts";
import { threeOfSpades } from "./three-of-spades.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { stillwaterPatrol } from "../../DOA/allies/stillwater-patrol.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers aenquoed10-a1 */
describe("Lawsur — resolves X from other controlled Specters", () => {
  for (const mode of ["none", "two", "remove-before", "remove-after"] as const)
    it(`counts at resolution and retains the bonus until cleanup: ${mode}`, () => {
      const champion = createClassBonusTestChampion(
        lawsurTheCarpenter,
        false,
        "activation-discount",
      );
      const foe = grantTestChampionLevel(
        createClassBonusTestChampion(fireball, true, "activation-discount"),
        1,
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [lawsurTheCarpenter, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            field: [
              woodlandSquirrels,
              ...(mode === "none" ? [] : [evercurrentRaider, evercurrentRaider]),
            ],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion: foe,
          zones: {
            field: [evercurrentRaider],
            hand: [fireball, woodlandSquirrels, woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(lawsurTheCarpenter);
      p.activate(source, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      p.pass();
      q.pass();
      expect(game.state.objects[source.objectId]!.zone).toBe("field");
      expect(
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === "aenquoed10-a1",
        ),
      ).toBe(true);
      const remove = () => {
        const wait = game.waitState();
        if (wait.kind === "opportunity" && wait.playerId === p.id) p.pass();
        q.activate(fireball, {
          targets: { "target-1": [p.cards(evercurrentRaider, { zone: "field" })[0]!.objectId] },
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
      };
      if (mode === "remove-before") remove();
      else passEffectsStack(game);
      if (mode === "remove-after") remove();
      p.declareAttack(source, q.card(foe));
      game.resolveCombatWithoutRetaliation();
      const power = mode === "none" ? 1 : mode === "remove-before" ? 2 : 3;
      expect(game.state.objects[q.card(foe).objectId]!.damage).toBe(power);
      advanceToMain(game, q.id);
      advanceToMain(game, p.id);
      p.declareAttack(source, q.card(foe));
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[q.card(foe).objectId]!.damage).toBe(power + 1);
    });
});

/** @covers aenquoed10-a2 */
it("grants Stealth only to awake controlled Specter allies, includes itself, and ends when Lawsur leaves", () => {
  const champion = createClassBonusTestChampion(lawsurTheCarpenter, false, "activation-discount");
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: {
        field: [
          lawsurTheCarpenter,
          evercurrentRaider,
          evercurrentRaider,
          woodlandSquirrels,
          giantTortoise,
        ],
        "main-deck": [woodlandSquirrels],
      },
    },
    playerTwo: {
      champion,
      zones: {
        field: [
          stillwaterPatrol,
          threeOfSpades,
          woodlandSquirrels,
          giantTortoise,
          evercurrentRaider,
        ],
        "main-deck": [woodlandSquirrels],
      },
    },
  });
  const p = game.player("player-one"),
    q = game.player("player-two");
  const source = p.card(lawsurTheCarpenter),
    [rested, awake] = p.cards(evercurrentRaider);
  p.declareAttack(rested!, q.card(champion));
  game.resolveCombatWithoutRetaliation();
  p.declareAttack(p.card(giantTortoise), q.card(evercurrentRaider));
  game.resolveCombatWithoutRetaliation();
  expect(game.state.objects[q.card(evercurrentRaider).objectId]!.damage).toBe(1);
  advanceToMain(game, q.id);
  for (const target of [source, awake!]) {
    const before = game.state;
    expect(() => q.declareAttack(q.card(threeOfSpades), target)).toThrow();
    expect(game.state).toEqual(before);
  }
  q.declareAttack(q.card(threeOfSpades), rested!);
  game.resolveCombatWithoutRetaliation();
  expect(game.state.objects[rested!.objectId]!.zone).toBe("graveyard");
  q.declareAttack(q.card(woodlandSquirrels, { zone: "field" }), p.card(woodlandSquirrels));
  game.resolveCombatWithoutRetaliation();
  expect(game.state.objects[p.card(woodlandSquirrels, { zone: "graveyard" }).objectId]!.zone).toBe(
    "graveyard",
  );
  q.declareAttack(q.card(stillwaterPatrol), source);
  game.resolveCombatWithoutRetaliation();
  expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
  q.declareAttack(q.card(giantTortoise), awake!);
  game.resolveCombatWithoutRetaliation();
  expect(game.state.objects[awake!.objectId]!.damage).toBe(1);
});
