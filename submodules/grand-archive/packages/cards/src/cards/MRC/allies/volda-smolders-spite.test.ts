import { describe } from "vitest";
import { voldaSmoldersSpite } from "./volda-smolders-spite.ts";
import { proveLevelFastActivation } from "../../../testing/level-fast-activation.ts";
/** @covers ecZsQQAYJJ-a1 */
describe("volda-smolders-spite — Level 2 Fast Activation", () =>
  proveLevelFastActivation(voldaSmoldersSpite));

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { simpleSlime } from "../../RDO/allies/simple-slime.ts";
import { plantedExplosive } from "../../P26/actions/planted-explosive.ts";
import { dwarfStarsGlow } from "../../RDO/actions/dwarf-stars-glow.ts";
/** @covers ecZsQQAYJJ-a2 */
describe("Volda — only controlled Fire sources bypass prevention until end of turn", () => {
  for (const matching of [false, true])
    for (const own of [false, true])
      for (const fire of [false, true])
        for (const expired of [false, true])
          it(`class=${matching}, own source=${own}, Fire=${fire}, expired=${expired}`, () => {
            const champion = enableAllTestElements(
              createClassBonusTestChampion(voldaSmoldersSpite, matching, "activation-discount"),
            );
            const game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: {
                  hand: [
                    voldaSmoldersSpite,
                    plantedExplosive,
                    dwarfStarsGlow,
                    ...Array.from({ length: 4 }, () => woodlandSquirrels),
                  ],
                  "main-deck": [woodlandSquirrels, woodlandSquirrels],
                },
              },
              playerTwo: {
                champion,
                zones: {
                  field: [simpleSlime],
                  hand: [plantedExplosive, dwarfStarsGlow, woodlandSquirrels, woodlandSquirrels],
                  "main-deck": [woodlandSquirrels, woodlandSquirrels],
                },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              actor = own ? p : q,
              target = q.card(simpleSlime);
            p.activate(voldaSmoldersSpite, {
              reservePayment: p
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, 2)
                .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
            });
            passEffectsStack(game);
            if (expired) advanceToMain(game, p.id, game.state.turn.number);
            if (!own) p.pass();
            const start = game.state.eventHistory.length;
            actor.activate(fire ? plantedExplosive : dwarfStarsGlow, {
              reservePayment: actor
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, 2)
                .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
              targets: { "target-1": [target.objectId] },
            });
            passEffectsStack(game);
            const damage = game.state.eventHistory
                .slice(start)
                .filter((e) => e.type === "damage-marked" && e.objectId === target.objectId)
                .reduce((n, e) => n + (e.type === "damage-marked" ? e.amount : 0), 0),
              bypass = matching && own && fire && !expired;
            expect(damage).toBe(bypass ? 2 : 0);
            expect(game.state.objects[target.objectId]!.zone).toBe(bypass ? "graveyard" : "field");
          });
});
