import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { chrysalisHazyCaterpillar } from "./chrysalis-hazy-caterpillar.ts";
import { aethercloakSentinel } from "./aethercloak-sentinel.ts";
import { condemnedTrinket } from "../items/condemned-trinket.ts";
import { enfeebledDagger } from "../items/enfeebled-dagger.ts";
import { teasingAerocharge } from "../actions/teasing-aerocharge.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { createLineageTestChampion } from "../../../testing/champion-lineage.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers wsqvfsyid4-a2 */
describe("Chrysalis — Ciel entry Spell with owned wind omens", () => {
  for (const ciel of [false, true])
    for (const winds of [0, 1, 2, 3]) run(ciel, winds, "ally", false, false);
  for (const type of ["ally", "item", "weapon"] as const)
    for (const own of [false, true]) run(true, 2, type, own, true);
  for (const own of [false, true]) run(true, 2, "ally", own, false, true);

  function run(
    ciel: boolean,
    winds: number,
    type: "ally" | "item" | "weapon",
    own: boolean,
    opposingTurn: boolean,
    killSource = false,
  ) {
    it(`Ciel=${ciel}, wind omens=${winds}, target=${type}, own=${own}, opposing turn=${opposingTurn}, source dies=${killSource}`, () => {
      const champion = createLineageTestChampion(chrysalisHazyCaterpillar, ciel ? "Ciel" : "Other");
      const otherChampion = createLineageTestChampion(chrysalisHazyCaterpillar, "Ciel");
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: {
            field: [
              woodlandSquirrels,
              trainingSword,
              enfeebledDagger,
              ...Array.from({ length: winds + 1 }, () => condemnedTrinket),
            ],
            hand: [
              chrysalisHazyCaterpillar,
              ...Array.from({ length: 20 }, () => woodlandSquirrels),
            ],
            graveyard: [
              ...Array.from({ length: winds + 1 }, () => teasingAerocharge),
              woodlandSquirrels,
            ],
            banishment: [teasingAerocharge, teasingAerocharge],
            "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion: otherChampion,
          zones: {
            field: [
              woodlandSquirrels,
              trainingSword,
              enfeebledDagger,
              aethercloakSentinel,
              condemnedTrinket,
              condemnedTrinket,
            ],
            hand: Array.from({ length: 6 }, () => woodlandSquirrels),
            graveyard: [teasingAerocharge, teasingAerocharge],
            "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const pay = (player: typeof p, n: number) =>
        player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, n)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const makeOmen = (player: typeof p, wind: boolean) => {
        const card = player.cards(wind ? teasingAerocharge : woodlandSquirrels, {
          zone: "graveyard",
        })[0]!;
        player.activateAbility(
          player.cards(condemnedTrinket, { zone: "field" })[0]!,
          "21oy1nd4nw-a1",
          { reservePayment: pay(player, 3) },
        );
        passEffectsStack(game);
        if (game.state.decision?.kind === "resolve-effect-choice")
          answerDecision(game, "resolve-effect-choice", [card.objectId]);
        passEffectsStack(game);
        expect(game.state.objects[card.objectId]!.counters.omen).toBe(1);
      };
      makeOmen(q, true);
      makeOmen(q, true);
      advanceToMain(game, p.id);
      for (let i = 0; i < winds; i++) makeOmen(p, true);
      makeOmen(p, false);
      const actor = own ? p : q;
      const target = actor.card(
        type === "ally" ? woodlandSquirrels : type === "item" ? enfeebledDagger : trainingSword,
        { zone: "field" },
      );
      const incarnation = game.state.objects[target.objectId]!.incarnation;
      if (opposingTurn) {
        advanceToMain(game, q.id);
        q.pass();
      }
      const source = p.card(chrysalisHazyCaterpillar);
      const before = game.state;
      expect(() => p.activate(source, { reservePayment: pay(p, 1) })).toThrow();
      expect(game.state).toEqual(before);
      p.activate(source, { reservePayment: pay(p, 2) });
      expect(game.state.objects[target.objectId]!.zone).toBe("field");
      passEffectsStack(game);
      expect(game.state.objects[source.objectId]!.zone).toBe("field");
      if (ciel) {
        expect(game.state.decision?.kind).toBe("announce-triggered-ability");
        for (const ids of [
          [],
          [source.objectId],
          [p.card(champion).objectId],
          [q.card(aethercloakSentinel).objectId],
          [p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId],
          [target.objectId, target.objectId],
        ]) {
          const pending = game.state;
          expect(() =>
            answerDecision(game, "announce-triggered-ability", {
              targets: { "target-object": ids },
            }),
          ).toThrow();
          expect(game.state).toEqual(pending);
        }
        answerDecision(game, "announce-triggered-ability", {
          targets: { "target-object": [target.objectId] },
        });
        expect(game.state.objects[target.objectId]!.zone).toBe("field");
        if (killSource) {
          const wait = game.waitState();
          if (wait.kind === "opportunity" && wait.playerId !== q.id)
            game.player(wait.playerId).pass();
          q.activateAbility(enfeebledDagger, "idpdon8f0h-a1", {
            targets: { "target-unit": [source.objectId] },
          });
        }
        passEffectsStack(game);
      } else expect(game.state.decision).toBeNull();
      const suppress = ciel && winds >= 2;
      expect(game.state.objects[source.objectId]!.zone).toBe(killSource ? "graveyard" : "field");
      expect(game.state.objects[target.objectId]!.zone).toBe(suppress ? "banishment" : "field");
      if (!suppress) return;
      for (let step = 0; game.state.turn.phase !== "end" && step < 32; step++) {
        const wait = game.waitState();
        if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
        game.player(wait.playerId).pass();
      }
      expect(game.state.turn.phase).toBe("end");
      expect(game.state.objects[target.objectId]!.zone).toBe("banishment");
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]!.zone).toBe("field");
      expect(game.state.objects[target.objectId]!.controllerId).toBe(actor.id);
      expect(game.state.objects[target.objectId]!.incarnation).toBeGreaterThan(incarnation);
      expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(false);
    });
  }
});
