import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { miasmicFog } from "./miasmic-fog.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { disenchant } from "../../P25/actions/disenchant.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers OwhKGEMTXm-a1 */
describe("Miasmic Fog changes all allies' life while on the field", () => {
  for (const ownCopies of [0, 1])
    for (const opposingCopies of [0, 1, 2])
      it(`own copies=${ownCopies}, opposing copies=${opposingCopies}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(miasmicFog, false, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [giantTortoise, ...Array.from({ length: ownCopies }, () => miasmicFog)],
              hand: [miasmicFog, disenchant, ...Array.from({ length: 5 }, () => woodlandSquirrels)],
              graveyard: [miasmicFog],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [giantTortoise, ...Array.from({ length: opposingCopies }, () => miasmicFog)],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const allies = [p.card(giantTortoise), q.card(giantTortoise)];
        const value = (id: (typeof allies)[number]["objectId"], property: "life" | "power") =>
          deriveGrandArchiveNumericProperty(game.state.objects[id]!, property, {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          });
        const check = (copies: number) => {
          for (const ally of allies) {
            expect(value(ally.objectId, "life")).toBe(6 - copies);
            expect(value(ally.objectId, "power")).toBe(1);
          }
          for (const player of [p, q])
            expect(value(player.card(champion).objectId, "life")).toBe(15);
        };
        const pay = () =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        check(ownCopies + opposingCopies);
        const source = p.card(miasmicFog, { zone: "hand" });
        p.activate(source, { reservePayment: pay() });
        check(ownCopies + opposingCopies);
        passEffectsStack(game);
        check(ownCopies + opposingCopies + 1);
        const doomed = p.cards(woodlandSquirrels, { zone: "hand" })[0]!;
        p.activate(doomed);
        passEffectsStack(game);
        expect(game.state.objects[doomed.objectId]!.zone).toBe("graveyard");
        p.activate(disenchant, {
          reservePayment: pay(),
          targets: { "target-1": [source.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
        check(ownCopies + opposingCopies);
      });
});
