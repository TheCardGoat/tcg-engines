import { describe } from "vitest";

import { proveOnEnterDraw } from "../../../testing/on-enter-draw.ts";
import { pelagicFatestone } from "./pelagic-fatestone.ts";

/** @covers tqkkyf4ktr-a1 */
describe("Pelagic Fatestone — entry draw", () => {
  proveOnEnterDraw({
    card: pelagicFatestone,
    abilityId: "tqkkyf4ktr-a1",
    cost: { kind: "reserve", amount: 4 },
    destination: "memory",
  });
});

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { fluteOfTaming } from "../../DOA/items/flute-of-taming.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
/** @covers tqkkyf4ktr-a2 */
describe("Pelagic Fatestone — floating memory transformed return", () => {
  for (const matching of [false, true])
    for (const origin of ["memory", "graveyard"] as const)
      it(`Guo Jia=${matching}, origin=${origin}`, () => {
        const base = enableAllTestElements(
          createClassBonusTestChampion(pelagicFatestone, true, "floating-memory"),
        );
        const champion = {
          ...base,
          layout: {
            kind: "single-faced" as const,
            face: { ...requireSingleFace(base), lineageName: matching ? "Guo Jia" : "Other" },
          },
        };
        const game = GrandArchiveTestEngine.startFixture({
          phase: "materialize",
          playerOne: {
            champion,
            zones: {
              [origin]: [pelagicFatestone],
              "material-deck": [fluteOfTaming],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: { champion },
        });
        const p = game.player("player-one"),
          source = p.card(pelagicFatestone);
        p.materialize(
          fluteOfTaming,
          origin === "graveyard" ? { floatingMemoryCardIds: [source.objectId] } : {},
        );
        passEffectsStack(game);
        const returns = matching && origin === "graveyard";
        expect(game.state.objects[source.objectId]!.zone).toBe(returns ? "field" : "banishment");
        expect(game.state.objects[source.objectId]!.face).toBe(returns ? "transformed" : "default");
        expect(p.cards(woodlandSquirrels, { zone: "memory" })).toHaveLength(0);
      });
});

import { tombSweep } from "../../P26/actions/tomb-sweep.ts";
it("does not return when graveyard banishment is not a memory payment", () => {
  const base = enableAllTestElements(
    createClassBonusTestChampion(pelagicFatestone, true, "floating-memory"),
  );
  const champion = {
    ...base,
    layout: {
      kind: "single-faced" as const,
      face: { ...requireSingleFace(base), lineageName: "Guo Jia" },
    },
  };
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: {
        graveyard: [pelagicFatestone],
        hand: [tombSweep, woodlandSquirrels, woodlandSquirrels],
        "main-deck": [woodlandSquirrels],
      },
    },
    playerTwo: { champion },
  });
  const p = game.player("player-one"),
    source = p.card(pelagicFatestone);
  p.activate(tombSweep, {
    reservePayment: p
      .cards(woodlandSquirrels, { zone: "hand" })
      .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
    targets: { "target-card": [source.objectId] },
  });
  passEffectsStack(game);
  expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
});
