import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { purlingFootman } from "./purling-footman.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers z11p126ctq-a1 */
describe("Purling Footman — optional top-deck graveyard move", () => {
  for (const accept of [false, true])
    for (const empty of [false, true])
      it(`looks privately then ${accept ? "mills" : "keeps"} its top card, empty=${empty}`, () => {
        const champion = createClassBonusTestChampion(purlingFootman, false, "activation-discount");
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [purlingFootman],
              "main-deck": empty ? [] : [woodlandSquirrels, giantTortoise],
            },
          },
          playerTwo: { champion, zones: { "main-deck": [giantTortoise] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          deck = p.zone("main-deck");
        p.declareAttack(p.card(purlingFootman), q.card(champion));
        expect(p.zone("main-deck")).toEqual(deck);
        expect(game.state.eventHistory.filter((e) => e.type === "cards-looked-at")).toHaveLength(0);
        passEffectsStack(game);
        const looks = game.state.eventHistory.filter((e) => e.type === "cards-looked-at");
        expect(looks).toHaveLength(empty ? 0 : 1);
        if (!empty)
          expect(looks[0]).toMatchObject({ playerId: p.id, objectIds: [deck[0]!.objectId] });
        expect(p.zone("main-deck")).toEqual(deck);
        if (game.state.decision?.kind === "resolve-optional-effect") {
          expect(game.state.decision.playerId).toBe(p.id);
          answerDecision(game, "resolve-optional-effect", accept);
          passEffectsStack(game);
        }
        expect(p.zone("main-deck")).toEqual(accept ? deck.slice(1) : deck);
        expect(p.zone("graveyard")).toEqual(accept ? deck.slice(0, 1) : []);
        expect(q.zone("main-deck")).toHaveLength(1);
        expect(game.state.eventHistory.filter((e) => e.type === "card-revealed")).toHaveLength(0);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(1);
      });
});
