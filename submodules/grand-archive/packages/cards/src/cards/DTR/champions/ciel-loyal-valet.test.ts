import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { cielLoyalValet } from "./ciel-loyal-valet.ts";
import { condemnedTrinket } from "../items/condemned-trinket.ts";
import { backdash } from "../actions/backdash.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { servilePossessions } from "../../P25/masteries/servile-possessions.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

function reachEnd(game: GrandArchiveTestEngine): void {
  for (let i = 0; i < 32 && game.state.turn.phase !== "end"; i++) {
    const wait = game.waitState();
    if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
    game.player(wait.playerId).pass();
  }
  expect(game.state.turn.phase).toBe("end");
}

/** @covers nn48ne8a05-a1 */
describe("Ciel, Loyal Valet — gains an operative Servile Possessions mastery on entry", () => {
  for (const omens of [0, 1, 3, 5])
    it(`materializes, gains mastery, and attacks with ${omens} omens`, () => {
      const starter = lineageTestChampion("Ciel", 0),
        enemy = lineageTestChampion("Opponent", 0);
      const game = GrandArchiveTestEngine.startFixture({
        definitions: [servilePossessions],
        phase: "materialize",
        playerOne: {
          champion: starter,
          zones: {
            "material-deck": [cielLoyalValet],
            memory: [woodlandSquirrels],
            field: [trainingSword, ...Array.from({ length: omens }, () => condemnedTrinket)],
            hand: Array.from({ length: omens * 3 }, () => woodlandSquirrels),
            graveyard: Array.from({ length: omens + 1 }, () => backdash),
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: { champion: enemy },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        hero = p.card(starter, { zone: "field" });
      p.materialize(cielLoyalValet);
      expect(p.zone("memory")).toHaveLength(0);
      expect(
        game.state.objects[hero.objectId]!.activeDefinitionId ??
          game.state.objects[hero.objectId]!.definitionId,
      ).toBe(starter.canonicalId);
      p.pass();
      q.pass();
      expect(game.state.objects[hero.objectId]!.activeDefinitionId).toBe(
        cielLoyalValet.canonicalId,
      );
      expect(game.state.players[p.id]!.mastery).toBeUndefined();
      passEffectsStack(game);
      expect(game.state.players[p.id]!.mastery?.name).toBe("Servile Possessions");
      expect(game.state.players[q.id]!.mastery).toBeUndefined();
      advanceToMain(game, p.id);
      for (let i = 0; i < omens; i++) {
        const selected = p.cards(backdash, { zone: "graveyard" })[0]!;
        p.activateAbility(p.cards(condemnedTrinket, { zone: "field" })[0]!, "21oy1nd4nw-a1", {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 3)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
        answerDecision(game, "resolve-effect-choice", [selected.objectId]);
        passEffectsStack(game);
      }
      const memory = p.zone("memory").length,
        top = p.zone("main-deck")[0]!;
      p.declareAttack(hero, q.card(enemy), { weaponIds: [p.card(trainingSword).objectId] });
      expect(game.state.objects[q.card(enemy).objectId]!.damage).toBe(0);
      game.resolveCombatWithoutRetaliation();
      const bonus = omens === 0 ? 0 : omens === 1 ? 1 : omens === 3 ? 2 : 3;
      expect(game.state.objects[q.card(enemy).objectId]!.damage).toBe(1 + bonus);
      expect(p.zone("memory")).toHaveLength(memory + Number(omens >= 5));
      expect(game.state.objects[top.objectId]!.zone).toBe(omens >= 5 ? "memory" : "main-deck");
    });
});

/** @covers nn48ne8a05-a2 */
describe("Ciel, Loyal Valet — inherited end-phase omen from hand or graveyard", () => {
  for (const position of ["material-deck", "current", "deeper"] as const)
    for (const zone of ["hand", "graveyard"] as const)
      for (const accept of [false, true])
        it(`position=${position}, selected zone=${zone}, accept=${accept}`, () => {
          const starter = lineageTestChampion("Ciel", 0),
            enemy = lineageTestChampion("Opponent", 0);
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion: starter,
              lineage:
                position === "material-deck"
                  ? []
                  : position === "current"
                    ? [cielLoyalValet]
                    : [cielLoyalValet, lineageTestChampion("Other", 2)],
              zones: {
                "material-deck": position === "material-deck" ? [cielLoyalValet] : [],
                hand: [backdash, woodlandSquirrels],
                graveyard: [backdash, woodlandSquirrels],
                memory: [woodlandSquirrels],
                banishment: [woodlandSquirrels],
                field: [woodlandSquirrels],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion: enemy,
              zones: {
                hand: [woodlandSquirrels],
                graveyard: [woodlandSquirrels],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            selected = p.card(backdash, { zone });
          reachEnd(game);
          expect(game.state.objects[selected.objectId]!.zone).toBe(zone);
          passEffectsStack(game);
          if (position !== "material-deck") {
            expect(game.state.decision).toMatchObject({
              kind: "resolve-optional-effect",
              playerId: p.id,
            });
            answerDecision(game, "resolve-optional-effect", accept);
            passEffectsStack(game);
            if (accept) {
              for (const invalid of [
                [],
                [q.card(woodlandSquirrels, { zone: "hand" }).objectId],
                [q.card(woodlandSquirrels, { zone: "graveyard" }).objectId],
                [p.card(woodlandSquirrels, { zone: "field" }).objectId],
                [p.card(woodlandSquirrels, { zone: "memory" }).objectId],
                [p.card(woodlandSquirrels, { zone: "banishment" }).objectId],
                [
                  p.card(backdash, { zone: "hand" }).objectId,
                  p.card(backdash, { zone: "graveyard" }).objectId,
                ],
              ]) {
                const before = game.state;
                expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
                expect(game.state).toEqual(before);
              }
              answerDecision(game, "resolve-effect-choice", [selected.objectId]);
              passEffectsStack(game);
            }
          } else expect(game.state.decision).toBeNull();
          const banished = position !== "material-deck" && accept;
          expect(game.state.objects[selected.objectId]!.zone).toBe(banished ? "banishment" : zone);
          expect(game.state.objects[selected.objectId]!.counters.omen ?? 0).toBe(Number(banished));
          advanceToMain(game, q.id);
          reachEnd(game);
          passEffectsStack(game);
          expect(game.state.decision).toBeNull();
          expect(p.cards(backdash, { zone: "banishment" })).toHaveLength(Number(banished));
        });
});

/** @covers nn48ne8a05-a2 */
describe("Ciel, Loyal Valet — empty-zone boundaries", () => {
  for (const available of ["hand", "graveyard", "neither"] as const)
    it(`can use a sole card in ${available}`, () => {
      const starter = lineageTestChampion("Ciel", 0);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion: starter,
          lineage: [cielLoyalValet],
          zones: {
            hand: available === "hand" ? [backdash] : [],
            graveyard: available === "graveyard" ? [backdash] : [],
            memory: [woodlandSquirrels],
            banishment: [woodlandSquirrels],
          },
        },
        playerTwo: {
          champion: lineageTestChampion("Opponent", 0),
          zones: { hand: [backdash], graveyard: [backdash] },
        },
      });
      const p = game.player("player-one");
      reachEnd(game);
      passEffectsStack(game);
      if (available !== "neither") {
        expect(game.state.decision?.kind).toBe("resolve-optional-effect");
        answerDecision(game, "resolve-optional-effect", true);
        passEffectsStack(game);
        if (game.state.decision?.kind === "resolve-effect-choice") {
          answerDecision(game, "resolve-effect-choice", [p.card(backdash).objectId]);
          passEffectsStack(game);
        }
        const omen = p.card(backdash, { zone: "banishment" });
        expect(game.state.objects[omen.objectId]!.counters.omen).toBe(1);
      } else expect(p.cards(backdash)).toHaveLength(0);
      expect(game.state.decision).toBeNull();
      expect(p.zone("memory")).toHaveLength(1);
      expect(p.cards(woodlandSquirrels, { zone: "banishment" })).toHaveLength(1);
    });
});
