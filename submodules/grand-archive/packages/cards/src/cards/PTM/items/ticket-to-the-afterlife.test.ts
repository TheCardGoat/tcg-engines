import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { ticketToTheAfterlife } from "./ticket-to-the-afterlife.ts";
import { hauntingApparition } from "../../RDO/allies/haunting-apparition.ts";
import { maledictumVitae } from "../../SP4/actions/maledictum-vitae.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  enableAllTestElements,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers E09lX95cb9-a1 @covers E09lX95cb9-a2 */
describe("Ticket to the Afterlife — distinct ability and card costs", () => {
  for (const copies of [0, 1, 2])
    for (const opposing of [0, 2])
      for (const mode of ["graveyard-ability", "graveyard-card", "hand-card"] as const)
        it(`copies=${copies}, opposing=${opposing}, ${mode}`, () => {
          const base = lineageTestChampion("Alice", 0);
          const champion = enableAllTestElements({
            ...base,
            layout: {
              kind: "single-faced",
              face: { ...requireSingleFace(base), elements: ["NORM", "UMBRA"] },
            },
          });
          const sourceCard = mode === "graveyard-ability" ? maledictumVitae : hauntingApparition;
          const cost =
            mode === "hand-card" ? 3 : Math.max(0, (mode === "graveyard-card" ? 5 : 2) - copies);
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: Array.from({ length: copies }, () => ticketToTheAfterlife),
                hand: [
                  ...(mode === "hand-card" ? [sourceCard] : []),
                  ...Array.from({ length: cost + 1 }, () => woodlandSquirrels),
                ],
                graveyard: [
                  ...(mode !== "hand-card" ? [sourceCard] : []),
                  ticketToTheAfterlife,
                  woodlandSquirrels,
                ],
              },
            },
            playerTwo: {
              champion,
              zones: { field: Array.from({ length: opposing }, () => ticketToTheAfterlife) },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(sourceCard),
            fuel = p.card(woodlandSquirrels, { zone: "graveyard" });
          const payment = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const activate = (n: number) =>
            mode === "graveyard-ability"
              ? p.activateAbility(source, "24I0xn0OQ1-a3", {
                  reservePayment: payment(n),
                  costSelections: [[fuel.objectId]],
                  targets: { "target-champion": [q.card(champion).objectId] },
                })
              : p.activate(source, {
                  reservePayment: payment(n),
                  ...(mode === "graveyard-card" ? { activationMethod: "ephemerate" as const } : {}),
                });
          const before = game.state;
          for (const n of [...(cost > 0 ? [cost - 1] : []), cost + 1]) {
            expect(() => activate(n)).toThrow();
            expect(game.state).toEqual(before);
          }
          activate(cost);
          expect(p.zone("memory")).toHaveLength(cost);
          expect(q.zone("memory")).toHaveLength(0);
          if (mode === "graveyard-ability")
            expect(game.state.objects[fuel.objectId]!.zone).toBe("banishment");
          passEffectsStack(game);
          expect(game.state.decision).toBeNull();
          expect(game.state.objects[source.objectId]!.zone).toBe(
            mode === "graveyard-ability" ? "inner-lineage" : "field",
          );
          if (mode !== "graveyard-ability")
            expect(game.state.objects[source.objectId]!.states.has("ephemeral")).toBe(
              mode === "graveyard-card",
            );
        });
});

/** @covers E09lX95cb9-a1 @covers E09lX95cb9-a2 */
for (const extras of [0, 1, 2])
  it(`a Specter ability on the field pays full reserve cost with ${extras + 1} Tickets`, () => {
    const champion = enableAllTestElements(lineageTestChampion("Alice", 0));
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: Array.from({ length: extras + 1 }, () => ticketToTheAfterlife),
          graveyard: [hauntingApparition],
          hand: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const p = game.player("player-one"),
      source = p.cards(ticketToTheAfterlife)[0]!,
      fuel = p.card(hauntingApparition);
    const payment = (n: number) =>
      p
        .cards(woodlandSquirrels)
        .slice(0, n)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
    const activate = (n: number) =>
      p.activateAbility(source, "E09lX95cb9-a3", {
        reservePayment: payment(n),
        costSelections: [[fuel.objectId]],
      });
    const before = game.state;
    for (const n of [0, 1, 3]) {
      expect(() => activate(n)).toThrow();
      expect(game.state).toEqual(before);
    }
    activate(2);
    expect(p.zone("memory")).toHaveLength(2);
    expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
    expect(game.state.objects[fuel.objectId]!.zone).toBe("banishment");
    passEffectsStack(game);
    expect(game.state.decision).toBeNull();
  });
