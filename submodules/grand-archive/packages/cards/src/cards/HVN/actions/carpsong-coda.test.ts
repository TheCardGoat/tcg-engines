import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { seafletchedSerpent } from "../../AMB/allies/seafletched-serpent.ts";
import { songOfNurturing } from "../../DOA/actions/song-of-nurturing.ts";
import { describe, expect, it } from "vitest";
import { carpsongCoda } from "./carpsong-coda.ts";
import { proveHarmonizeMillSummon } from "../../../testing/harmonize-mill-summon.ts";
/** @covers 3omh6h3a4y-a1 */
describe("carpsong-coda — Harmonize", () => proveHarmonizeMillSummon(carpsongCoda, true));

/** @covers 3omh6h3a4y-a2 */
describe("Carpsong Coda — graveyard maximum life", () => {
  for (const own of [false, true])
    for (const kind of ["none", "animal", "beast", "both"]) {
      it(`uses only own water Animal/Beast allies, kind=${kind}, own target=${own}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(carpsongCoda, false, "activation-discount"),
        );
        const waterChampion = enableAllTestElements(lineageTestChampion("Ineligible", 3));
        const eligible =
          kind === "animal"
            ? [giantTortoise]
            : kind === "beast"
              ? [seafletchedSerpent]
              : kind === "both"
                ? [giantTortoise, seafletchedSerpent]
                : [];
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [giantTortoise],
              memory: [giantTortoise],
              graveyard: [...eligible, woodlandSquirrels, waterChampion],
              hand: [carpsongCoda, woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: { champion, zones: { graveyard: [giantTortoise] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          target = (own ? p : q).card(champion);
        p.activate(carpsongCoda, {
          targets: { "target-1": [target.objectId] },
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.damage).toBe(
          kind === "none" ? 0 : kind === "beast" ? 3 : 6,
        );
        expect(game.state.objects[(own ? q : p).card(champion).objectId]!.damage).toBe(0);
      });
    }
});
/** @covers 3omh6h3a4y-a1 @covers 3omh6h3a4y-a2 */
for (const size of [0, 2, 4])
  it(`mills only available cards without drawing from empty deck, size=${size}`, () => {
    const champion = enableAllTestElements(
      createClassBonusTestChampion(carpsongCoda, false, "activation-discount"),
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [
            carpsongCoda,
            songOfNurturing,
            ...Array.from({ length: 4 }, () => woodlandSquirrels),
          ],
          "main-deck": Array.from({ length: size }, () => giantTortoise),
        },
      },
      playerTwo: { champion },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      deck = p.zone("main-deck");
    const pay = () =>
      p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
    p.activate(songOfNurturing, { reservePayment: pay() });
    passEffectsStack(game);
    p.activate(carpsongCoda, {
      targets: { "target-1": [q.card(champion).objectId] },
      reservePayment: pay(),
    });
    passEffectsStack(game);
    expect(p.zone("main-deck")).toHaveLength(0);
    expect(p.cards(giantTortoise, { zone: "graveyard" })).toEqual(deck);
    expect(game.state.status).not.toBe("finished");
    expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(size ? 6 : 0);
  });
