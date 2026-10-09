import { describe } from "vitest";
import { waitedAccord } from "./waited-accord.ts";
import { proveLevelSacrificeDraw } from "../../../testing/level-sacrifice-draw.ts";
/** @covers xF9phlSAkE-a2 */
describe("Waited Accord's level-two sacrifice draw", () => {
  proveLevelSacrificeDraw(waitedAccord, "xF9phlSAkE-a2", 2);
});

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { luxemSight } from "../../DOA/actions/luxem-sight.ts";
import { swordOfAvarice } from "../../DOA/weapons/sword-of-avarice.ts";
import { carnwennanShroudedEdge } from "../../DOA/weapons/carnwennan-shrouded-edge.ts";
import { prismaticEdge } from "../../DOA/weapons/prismatic-edge.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { caliburnOfSilencing } from "../../DOA/weapons/caliburn-of-silencing.ts";

/** @covers xF9phlSAkE-a1 */
describe("Waited Accord's optional advanced-element tax", () => {
  for (const advancedCount of [2, 3, 4])
    for (const reveal of [false, true])
      for (const prior of [false, true])
        it(`taxes each player's first advanced activation each turn: reveal=${reveal}, prior=${prior}, available=${advancedCount}`, () => {
          const champion = enableAllTestElements(
            grantTestChampionLevel(
              createClassBonusTestChampion(waitedAccord, false, "activation-discount"),
              2,
            ),
          );
          const advanced = [
            swordOfAvarice,
            carnwennanShroudedEdge,
            prismaticEdge,
            caliburnOfSilencing,
          ].slice(0, advancedCount);
          const materials = [...advanced, trainingSword];
          const enabled = reveal && advancedCount >= 3;
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  waitedAccord,
                  ...Array.from({ length: 5 }, () => luxemSight),
                  ...Array.from({ length: 12 }, () => woodlandSquirrels),
                ],
                "material-deck": materials,
                "main-deck": Array.from({ length: 20 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: {
                hand: [
                  ...Array.from({ length: 5 }, () => luxemSight),
                  ...Array.from({ length: 8 }, () => woodlandSquirrels),
                ],
                "material-deck": materials,
                "main-deck": Array.from({ length: 20 }, () => woodlandSquirrels),
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const castSight = (player: typeof p, tax: number) => {
            const source = player.cards(luxemSight, { zone: "hand" })[0]!;
            const payment = player
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, tax)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
            if (tax) {
              const before = game.state;
              expect(() => player.activate(source, { reservePayment: payment.slice(1) })).toThrow();
              expect(game.state).toEqual(before);
            }
            const memory = player.zone("memory").length;
            player.activate(source, { reservePayment: payment });
            expect(player.zone("memory")).toHaveLength(memory + tax);
            passEffectsStack(game);
          };
          if (prior) castSight(p, 0);
          const materialIds = p.zone("material-deck").map((c) => c.objectId);
          p.activate(waitedAccord, {
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 2)
              .map((c) => ({ kind: "card", cardId: c.objectId })),
          });
          passEffectsStack(game);
          if (advancedCount < 3) {
            expect(game.state.decision).toBeNull();
            expect(game.state.stack).toHaveLength(0);
          } else answerDecision(game, "resolve-optional-effect", reveal);
          if (reveal && advancedCount > 3) {
            const valid = materials
              .slice(0, 3)
              .map((c) => p.card(c, { zone: "material-deck" }).objectId);
            for (const invalid of [
              valid.slice(0, 2),
              [valid[0]!, valid[0]!, valid[1]!],
              [valid[0]!, valid[1]!, p.card(trainingSword).objectId],
              [valid[0]!, valid[1]!, q.card(prismaticEdge).objectId],
            ]) {
              const before = game.state;
              expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
              expect(game.state).toEqual(before);
            }
            answerDecision(game, "resolve-effect-choice", valid);
            passEffectsStack(game);
          }
          passEffectsStack(game);
          expect(
            game.state.eventHistory
              .filter((e) => e.type === "card-revealed")
              .map((e) => e.objectId),
          ).toEqual(
            enabled
              ? advanced.slice(0, 3).map((c) => p.card(c, { zone: "material-deck" }).objectId)
              : [],
          );
          expect(p.zone("material-deck").map((c) => c.objectId)).toEqual(materialIds);
          p.activate(p.cards(woodlandSquirrels, { zone: "hand" })[0]!);
          passEffectsStack(game);
          castSight(p, enabled && !prior ? 2 : 0);
          p.pass();
          castSight(q, enabled ? 2 : 0);
          castSight(p, 0);
          advanceToMain(game, q.id);
          castSight(q, enabled ? 2 : 0);
          castSight(q, 0);
          advanceToMain(game, p.id);
          castSight(p, enabled ? 2 : 0);
          p.activateAbility(waitedAccord, "xF9phlSAkE-a2");
          passEffectsStack(game);
          advanceToMain(game, q.id);
          castSight(q, 0);
          expect(p.cards(waitedAccord, { zone: "graveyard" })).toHaveLength(1);
        });
});
