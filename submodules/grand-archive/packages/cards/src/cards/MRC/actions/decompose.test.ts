import { describe } from "vitest";
import { proveAllySacrificeCost } from "../../../testing/ally-sacrifice-cost.ts";
import { decompose } from "./decompose.ts";

/** @covers 3JWk1jxX5u-a1 */
describe("decompose — additional ally sacrifice", () => {
  proveAllySacrificeCost(decompose, 2, false);
});

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { automatonDrone } from "../../ALC/tokens/automaton-drone.ts";
import { anthemOfVitality } from "../../FTC/actions/anthem-of-vitality.ts";
import { trainingSession } from "../../DOA/actions/training-session.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
import { blightroot } from "../../ALC/tokens/blightroot.ts";
import { fraysia } from "../../ALC/tokens/fraysia.ts";
import { manaroot } from "../../ALC/tokens/manaroot.ts";
import { razorvine } from "../../ALC/tokens/razorvine.ts";
import { silvershine } from "../../ALC/tokens/silvershine.ts";
import { springleaf } from "../../ALC/tokens/springleaf.ts";

/** @covers 3JWk1jxX5u-a2 */
describe("Decompose — Gather from the sacrificed ally's last life stat", () => {
  const herbs = [blightroot, fraysia, manaroot, razorvine, silvershine, springleaf];
  for (const matching of [false, true])
    for (const seed of [1, 123])
      for (const mode of ["small", "large", "token", "boosted", "damaged", "temporary"] as const) {
        it(`gathers exact life, mode=${mode}, class=${matching}, seed=${seed}`, () => {
          const donor =
            mode === "token"
              ? automatonDrone
              : ["large", "damaged"].includes(mode)
                ? giantTortoise
                : woodlandSquirrels;
          const life = ["large", "damaged"].includes(mode)
            ? 6
            : mode === "temporary"
              ? 4
              : mode === "boosted"
                ? 2
                : 1;
          const champion = enableAllTestElements(
            createClassBonusTestChampion(decompose, matching, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            randomSeed: seed,
            definitions: herbs,
            playerOne: {
              champion,
              zones: {
                field: [donor],
                hand: [
                  decompose,
                  trainingSession,
                  anthemOfVitality,
                  sparkAlight,
                  ...Array.from({ length: 6 }, () => woodlandSquirrels),
                ],
              },
            },
            playerTwo: { champion, zones: { field: [donor] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const paid = p.card(donor, { zone: "field" });
          const pay = () =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 2)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          if (mode === "boosted" || mode === "damaged" || mode === "temporary") {
            p.activate(
              mode === "temporary"
                ? anthemOfVitality
                : mode === "boosted"
                  ? trainingSession
                  : sparkAlight,
              {
                reservePayment: pay(),
                targets: { "target-1": [paid.objectId] },
              },
            );
            passEffectsStack(game);
          }
          expect(game.state.objects[paid.objectId]!.damage).toBe(mode === "damaged" ? 2 : 0);
          const summoned = () =>
            p.zone("field").filter((c) => herbs.some((h) => h.canonicalId === c.definitionId));
          p.activate(decompose, { reservePayment: pay(), costSelections: [[paid.objectId]] });
          expect(game.state.objects[paid.objectId]?.zone).not.toBe("field");
          expect(summoned()).toHaveLength(0);
          passEffectsStack(game);
          expect(summoned()).toHaveLength(life);
          for (const token of summoned()) {
            expect(game.state.objects[token.objectId]!.isToken).toBe(true);
            expect(game.state.objects[token.objectId]!.controllerId).toBe(p.id);
            expect(game.state.objects[token.objectId]!.states.has("rested")).toBe(false);
          }
          expect(q.zone("field")).toHaveLength(2);
          expect(game.state.decision).toBeNull();
          expect(game.state.stack).toHaveLength(0);
          expect(p.card(decompose, { zone: "graveyard" })).toBeDefined();
        });
      }
});
