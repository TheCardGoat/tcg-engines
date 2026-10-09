import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { reclaim } from "../cards/DOA/actions/reclaim.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "./decisions.ts";
type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
export function proveEndSacrifice(card: Card, abilityId: string) {
  const token = card.definitionKind === "token-representation";
  const face = grandArchiveTestFace(card);
  const unique = face.typeLine.supertypes.includes("UNIQUE");
  const ally = face.typeLine.types.includes("ALLY");
  for (const matching of [false, true])
    for (const zone of token ? (["field"] as const) : (["field", "hand", "graveyard"] as const))
      for (const copies of unique ? [1] : [1, 2])
        it(`sacrifices each field source only on its own end phase: class=${matching}, zone=${zone}, copies=${copies}`, () => {
          const champion = createClassBonusTestChampion(card, matching, "activation-discount");
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: "playerTwo",
            playerOne: {
              champion,
              zones: {
                [zone]: Array.from({ length: copies }, () => card),
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [woodlandSquirrels],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            sources = p.cards(card, { zone }),
            other = q.card(woodlandSquirrels);
          function reachEnd(playerId: string) {
            for (let i = 0; i < 128; i++) {
              if (game.state.turn.playerId === playerId && game.state.turn.phase === "end") return;
              const wait = game.waitState();
              if (wait.kind === "materialization-choice")
                game.player(wait.playerId).execute({ move: "skip-materialization" });
              else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
              else throw new Error(`Unexpected ${wait.kind}`);
            }
            throw new Error("End phase not reached");
          }
          reachEnd(q.id);
          expect(game.state.stack).toHaveLength(0);
          expect(p.cards(card, { zone })).toEqual(sources);
          reachEnd(p.id);
          if (game.state.decision?.kind === "order-triggered-abilities")
            answerDecision(
              game,
              "order-triggered-abilities",
              game.state.decision.pendingTriggerIds,
            );
          expect(game.state.stack).toHaveLength(zone === "field" ? copies : 0);
          for (const item of game.state.stack)
            expect(item).toMatchObject({ kind: "triggered-ability", ability: { id: abilityId } });
          expect(p.cards(card, { zone })).toEqual(sources);
          const sacrificed: string[] = [];
          for (let step = 0; step < 32 && game.state.stack.length; step++) {
            const wait = game.waitState();
            if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
            const result = game.player(wait.playerId).execute({ move: "pass" });
            for (const event of result.events)
              if (
                event.type === "object-moved" &&
                event.from === "field" &&
                event.cause?.kind === "rule" &&
                event.cause.rule === "sacrifice-effect"
              )
                sacrificed.push(event.objectId);
          }
          expect(game.state.stack).toHaveLength(0);
          expect(sacrificed.sort()).toEqual(
            zone === "field" ? sources.map((ref) => ref.objectId).sort() : [],
          );
          if (zone === "field") {
            expect(p.cards(card, { zone: "field" })).toHaveLength(0);
            if (token)
              for (const source of sources)
                expect(game.state.objects[source.objectId]).toBeUndefined();
            else
              expect(p.cards(card, { zone: "graveyard" })).toEqual(
                expect.arrayContaining([...sources]),
              );
          } else expect(p.cards(card, { zone })).toEqual(sources);
          expect(q.card(woodlandSquirrels, { zone: "field" })).toEqual(other);
          reachEnd(q.id);
          expect(game.state.stack).toHaveLength(0);
          reachEnd(p.id);
          expect(game.state.stack).toHaveLength(0);
        });
  if (ally)
    for (const matching of [false, true])
      it(`does not sacrifice another object when its source leaves in response: class=${matching}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(card, matching, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [card, woodlandSquirrels],
              hand: [reclaim, woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: { champion },
        });
        const p = game.player("player-one"),
          source = p.card(card),
          other = p.card(woodlandSquirrels, { zone: "field" });
        for (let step = 0; step < 64; step++) {
          if (
            game.state.stack.some(
              (item) => item.kind === "triggered-ability" && item.ability.id === abilityId,
            )
          )
            break;
          const wait = game.waitState();
          if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
          game.player(wait.playerId).pass();
        }
        expect(game.state.stack).toHaveLength(1);
        p.activate(reclaim, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((ref) => ({ kind: "card", cardId: ref.objectId })),
          targets: { "target-1": [source.objectId] },
        });
        passEffectsStack(game);
        expect(p.cards(card, { zone: "graveyard" })).toHaveLength(0);
        if (token) expect(game.state.objects[source.objectId]).toBeUndefined();
        else expect(p.card(card, { zone: "hand" })).toEqual(source);
        expect(p.card(woodlandSquirrels, { zone: "field" })).toEqual(other);
      });
}
