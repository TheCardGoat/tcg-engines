import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { usurpTheWinds } from "../cards/HVN/actions/usurp-the-winds.ts";
import { singeingLeap } from "../cards/PTM/actions/singeing-leap.ts";
import { cramSession } from "../cards/DOA/actions/cram-session.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "./class-bonus-test-champion.ts";
import { startWithShiftingCurrentsNorth } from "./shifting-currents.ts";
import { answerDecision, passEffectsStack } from "./decisions.ts";

export function proveShiftingCurrentConditional(
  card: GrandArchiveCard<GrandArchiveAbilityDefinition, "card">,
  kind: "draw" | "recover",
) {
  for (const direction of ["none", "north", "east", "south", "west"] as const)
    for (const level of [0, 3])
      for (const damage of kind === "recover" ? [0, 2, 7] : [0])
        for (const response of direction === "none" ? [false] : [false, true]) {
          it(`${kind}, direction=${direction}, level=${level}, damage=${damage}, response=${response}`, () => {
            const zones = {
              hand: [
                card,
                cramSession,
                usurpTheWinds,
                usurpTheWinds,
                ...Array.from({ length: damage }, () => singeingLeap),
                ...Array.from({ length: 15 }, () => woodlandSquirrels),
              ],
              "main-deck": Array.from({ length: 10 }, () => woodlandSquirrels),
            };
            const blank = grantTestChampionLevel(
              enableAllTestElements(
                createClassBonusTestChampion(card, false, "activation-discount"),
              ),
              level,
            );
            const game =
              direction === "none"
                ? GrandArchiveTestEngine.startFixture({
                    playerOne: { champion: blank, zones },
                    playerTwo: { champion: blank, zones: { "main-deck": [woodlandSquirrels] } },
                  })
                : startWithShiftingCurrentsNorth({
                    extraChampionLevel: level,
                    playerOneZones: zones,
                  });
            const p = game.player("player-one"),
              q = game.player("player-two");
            const champion = p.zone("field")[0]!;
            const pay = (n: number) =>
              p
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, n)
                .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
            const shift = (next: "north" | "east" | "south" | "west") => {
              p.activate(p.cards(usurpTheWinds, { zone: "hand" })[0]!, {
                reservePayment: pay(1),
                targets: { "target-1": [] },
              });
              passEffectsStack(game);
              answerDecision(game, "resolve-optional-effect", true);
              passEffectsStack(game);
              answerDecision(game, "resolve-direction-choice", next);
              passEffectsStack(game);
              expect(game.state.players[p.id]?.states["shifting-currents"]).toBe(next);
            };
            for (let i = 0; i < damage; i++) {
              p.activate(p.cards(singeingLeap, { zone: "hand" })[0]!, { reservePayment: pay(1) });
              passEffectsStack(game);
            }
            expect(game.state.objects[champion.objectId]?.damage).toBe(damage);
            if (direction !== "none") {
              if (response && direction === "north") shift("east");
              else if (!response && direction !== "north") shift(direction);
            }
            // A public level change must be read by recovery at resolution.
            if (response && kind === "recover") {
              // Resolve the slow level spell before announcing recovery.
              p.activate(cramSession, { reservePayment: pay(1) });
              passEffectsStack(game);
            }
            const deck = p.zone("main-deck"),
              otherDeck = q.zone("main-deck");
            const cost = kind === "draw" ? 1 : 2;
            const before = game.state;
            expect(() =>
              p.activate(card, {
                reservePayment: pay(cost + 1),
                ...(kind === "draw" ? { targets: { "target-1": [champion.objectId] } } : {}),
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
            p.activate(card, {
              reservePayment: pay(cost),
              ...(kind === "draw" ? { targets: { "target-1": [champion.objectId] } } : {}),
            });
            const memory = p.zone("memory"),
              hand = p.zone("hand");
            expect(game.state.objects[champion.objectId]?.damage).toBe(damage);
            if (response && direction !== "none") shift(direction);
            else passEffectsStack(game);
            if (kind === "draw") {
              const draws = direction === "west" ? 1 : 0;
              expect(p.zone("main-deck")).toEqual(deck.slice(draws));
              // Responding with Usurp pays one additional reserve card from hand.
              expect(p.zone("memory")).toHaveLength(memory.length + Number(response) + draws);
              if (draws) expect(p.zone("memory").at(-1)?.objectId).toBe(deck[0]!.objectId);
              expect(p.zone("hand")).toHaveLength(hand.length - (response ? 2 : 0));
            } else {
              const recovered = direction === "north" ? 3 + level + Number(response) : 3;
              expect(game.state.objects[champion.objectId]?.damage).toBe(
                Math.max(0, damage - recovered),
              );
              expect(p.zone("main-deck")).toEqual(deck);
            }
            expect(q.zone("main-deck")).toEqual(otherDeck);
            expect(game.state.objects[q.zone("field")[0]!.objectId]?.damage).toBe(0);
          });
        }
}
