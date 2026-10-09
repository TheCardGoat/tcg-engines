import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { noxFinalRelease } from "./nox-final-release.ts";
import { maledictumVitae } from "../../SP4/actions/maledictum-vitae.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers Gf33wXPzcg-a1 */
describe("Nox, Final Release — Curse lineage discount", () => {
  for (const count of [0, 1, 2, 3, 4, 5, 6])
    for (const curseOwner of ["self", "opponent"] as const)
      it(`counts ${count} Curses in its champion's lineage, owned by ${curseOwner}`, () => {
        const champion = enableAllTestElements(lineageTestChampion("Other", 0));
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                noxFinalRelease,
                ...Array.from({ length: count + 1 }, () => maledictumVitae),
                ...Array.from({ length: 2 * (count + 1) + 11 }, () => woodlandSquirrels),
              ],
              graveyard: [maledictumVitae],
              banishment: [maledictumVitae],
            },
          },
          playerTwo: {
            champion,
            zones: {
              hand: [
                ...Array.from({ length: count + 1 }, () => maledictumVitae),
                ...Array.from({ length: 2 * (count + 1) }, () => woodlandSquirrels),
              ],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const cast = (caster: typeof p, target: typeof p) => {
          if (caster === q) p.pass();
          caster.activate(caster.cards(maledictumVitae, { zone: "hand" })[0]!, {
            targets: { "target-champion": [target.card(champion).objectId] },
            reservePayment: caster
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 2)
              .map((c) => ({ kind: "card", cardId: c.objectId })),
          });
          passEffectsStack(game);
        };
        // An owned Curse in the other lineage must not reduce Nox's cost.
        cast(p, q);
        const caster = curseOwner === "self" ? p : q;
        for (let i = 0; i < count; i++) cast(caster, p);
        const source = p.card(noxFinalRelease),
          cost = Math.max(0, 10 - 2 * count),
          initialMemory = p.zone("memory").length;
        const payment = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const before = game.state;
        for (const n of [...(cost > 0 ? [cost - 1] : []), cost + 1]) {
          expect(() => p.activate(source, { reservePayment: payment(n) })).toThrow();
          expect(game.state).toEqual(before);
        }
        p.activate(source, { reservePayment: payment(cost) });
        expect(p.zone("memory")).toHaveLength(initialMemory + cost);
        passEffectsStack(game);
        expect(game.state.decision).toBeNull();
        expect(game.state.objects[source.objectId]!.zone).toBe("field");
      });
});
