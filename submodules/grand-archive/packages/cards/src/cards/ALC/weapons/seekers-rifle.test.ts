import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceCombatToTrigger,
  answerDecision,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { exaltedDorumegianThrone } from "../domains/exalted-dorumegian-throne.ts";
import { cascadingRound } from "../items/cascading-round.ts";
import { steelSlug } from "../../MRC/items/steel-slug.ts";
import { slateWhetstone } from "../../P24/items/slate-whetstone.ts";
import { shimmercloakAssassin } from "../allies/shimmercloak-assassin.ts";
import { anathemasEnd } from "../items/anathemas-end.ts";
import { meltdown } from "../actions/meltdown.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { seekersRifle } from "./seekers-rifle.ts";

function championFor(classBonus: boolean) {
  const champion = createClassBonusTestChampion(seekersRifle, classBonus, "activation-discount");
  if (champion.layout.kind !== "single-faced") throw new Error("Expected fixture champion");
  return {
    ...champion,
    layout: {
      kind: "single-faced" as const,
      face: { ...champion.layout.face, elements: ["NORM", "FIRE", "WATER", "WIND"] as const },
    },
  };
}

/** @covers 3gygojwk0p-a1 */
describe("Seeker's Rifle — Class Bonus True Sight", () => {
  for (const classBonus of [false, true]) {
    it(`permits a stealth target only while wielded with Class Bonus ${classBonus}`, () => {
      const champion = championFor(classBonus);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: { champion, zones: { field: [seekersRifle, anathemasEnd, woodlandSquirrels] } },
        playerTwo: { champion, zones: { field: [shimmercloakAssassin, exaltedDorumegianThrone] } },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const attacker = player.card(champion, { zone: "field" });
      const hidden = opponent.card(shimmercloakAssassin, { zone: "field" });
      const gun = player.card(seekersRifle, { zone: "field" });
      player.activateAbility(anathemasEnd, "ii17fzcyfr-a1", {
        targets: { "target-weapon": [gun.objectId] },
      });
      passEffectsStack(game);
      const before = game.state.stateVersion;
      expect(() => player.declareAttack(attacker, hidden)).toThrow();
      expect(() =>
        player.declareAttack(player.card(woodlandSquirrels, { zone: "field" }), hidden),
      ).toThrow();
      expect(game.state.stateVersion).toBe(before);
      if (!classBonus) {
        expect(() =>
          player.declareAttack(attacker, hidden, { weaponIds: [gun.objectId] }),
        ).toThrow();
        expect(game.state.stateVersion).toBe(before);
      }
      const target = classBonus ? hidden : opponent.card(champion, { zone: "field" });
      player.declareAttack(attacker, target, { weaponIds: [gun.objectId] });
      expect(game.state.objects[target.objectId]!.damage).toBe(0);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(2);
      expect(game.state.objects[hidden.objectId]!.damage).toBe(classBonus ? 2 : 0);
    });
  }
});

/** @covers 3gygojwk0p-a3 */
describe("Seeker's Rifle — optional On Kill materialization", () => {
  for (const accept of [false, true]) {
    for (const [bullet, memoryCost] of [
      [cascadingRound, 0],
      [steelSlug, 1],
    ] as const) {
      it(`pays two reserve for ${bullet.slug} after a kill when accepted ${accept}`, () => {
        const champion = championFor(false);
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [seekersRifle, anathemasEnd],
              hand: [woodlandSquirrels, woodlandSquirrels],
              "material-deck": [bullet, slateWhetstone],
            },
          },
          playerTwo: { champion, zones: { field: [woodlandSquirrels], "material-deck": [bullet] } },
        });
        const player = game.player("player-one");
        const gun = player.card(seekersRifle, { zone: "field" });
        player.activateAbility(anathemasEnd, "ii17fzcyfr-a1", {
          targets: { "target-weapon": [gun.objectId] },
        });
        passEffectsStack(game);
        player.declareAttack(
          player.card(champion, { zone: "field" }),
          game.player("player-two").card(woodlandSquirrels, { zone: "field" }),
          { weaponIds: [gun.objectId] },
        );
        advanceCombatToTrigger(game, "3gygojwk0p-a3");
        expect(
          game.state.stack.some(
            (item) => item.kind === "triggered-ability" && item.ability.id === "3gygojwk0p-a3",
          ),
        ).toBe(true);
        expect(player.cards(bullet, { zone: "field" })).toHaveLength(0);
        expect(player.zone("hand")).toHaveLength(2);
        passEffectsStack(game);
        answerDecision(game, "resolve-optional-effect", accept);
        if (accept) {
          const payment = player
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
          const before = game.state.stateVersion;
          expect(() =>
            answerDecision(game, "resolve-effect-payment", { reservePayment: payment.slice(0, 1) }),
          ).toThrow();
          expect(game.state.stateVersion).toBe(before);
          answerDecision(game, "resolve-effect-payment", { reservePayment: payment });
          expect(player.zone("hand")).toHaveLength(0);
          expect(player.zone("memory")).toHaveLength(2);
          for (const invalid of [
            player.card(slateWhetstone, { zone: "material-deck" }),
            game.player("player-two").card(bullet, { zone: "material-deck" }),
          ]) {
            const beforeChoice = game.state.stateVersion;
            expect(() =>
              answerDecision(game, "resolve-effect-choice", [invalid.objectId]),
            ).toThrow();
            expect(game.state.stateVersion).toBe(beforeChoice);
          }
          answerDecision(game, "resolve-effect-choice", [
            player.card(bullet, { zone: "material-deck" }).objectId,
          ]);
          answerDecision(game, "announce-effect-materialization", {});
          expect(player.cards(bullet, { zone: "field" })).toHaveLength(0);
          expect(player.zone("memory")).toHaveLength(2 - memoryCost);
        }
        passEffectsStack(game);
        expect(player.cards(bullet, { zone: "material-deck" })).toHaveLength(accept ? 0 : 1);
        expect(player.cards(bullet, { zone: "field" })).toHaveLength(accept ? 1 : 0);
        expect(player.zone("hand")).toHaveLength(accept ? 0 : 2);
        expect(player.cards(slateWhetstone, { zone: "material-deck" })).toHaveLength(1);
      });
    }
  }
});

/** @covers 3gygojwk0p-a2 */
describe("Seeker's Rifle — Class Bonus Spellshroud", () => {
  for (const classBonus of [false, true]) {
    it(`blocks a Spell with Class Bonus ${classBonus} but permits non-Spell loading`, () => {
      const champion = championFor(classBonus);
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: { champion, zones: { field: [seekersRifle, anathemasEnd] } },
        playerTwo: {
          champion,
          zones: { hand: [meltdown, ...Array.from({ length: 4 }, () => woodlandSquirrels)] },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const gun = player.card(seekersRifle, { zone: "field" });
      opponent.pass();
      player.activateAbility(anathemasEnd, "ii17fzcyfr-a1", {
        targets: { "target-weapon": [gun.objectId] },
      });
      passEffectsStack(game);
      expect(player.cards(anathemasEnd, { zone: "loaded" })).toHaveLength(1);
      const options = {
        reservePayment: opponent
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
        targets: { "target-1": [gun.objectId] },
      };
      if (classBonus) {
        const before = game.state.stateVersion;
        expect(() => opponent.activate(meltdown, options)).toThrow();
        expect(game.state.stateVersion).toBe(before);
        expect(game.state.objects[gun.objectId]!.zone).toBe("field");
      } else {
        opponent.activate(meltdown, options);
        expect(game.state.objects[gun.objectId]!.zone).toBe("field");
        passEffectsStack(game);
        expect(game.state.objects[gun.objectId]!.zone).toBe("banishment");
      }
    });
  }
});
