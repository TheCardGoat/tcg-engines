import { describe, expect, it } from "vitest";
import type {
  GrandArchiveAbilityCost,
  GrandArchiveActivatedAbility,
} from "@tcg/grand-archive-types";
import {
  condemnedTrinket,
  lagomorphPiece,
  refluxalRibbon,
  tabulaOfSalvage,
} from "@tcg/grand-archive-cards";
import {
  createGrandArchiveMatchProgram,
  requireGrandArchiveCard,
} from "../kernel/match-program.ts";
import { grandArchiveAbilityFunctionalZones } from "./card-runtime.ts";

const banish: GrandArchiveAbilityCost = { kind: "banish-self" };
const costs: readonly GrandArchiveAbilityCost[] = [
  banish,
  { kind: "all", costs: [{ kind: "pay-reserve", amount: 1 }, banish] },
  { kind: "one-of", costs: [{ kind: "pay-reserve", amount: 1 }, banish] },
  { kind: "optional", cost: banish, bindPaidAs: "paid" },
  {
    kind: "all",
    costs: [
      {
        kind: "optional",
        cost: { kind: "one-of", costs: [banish, { kind: "pay-reserve", amount: 1 }] },
        bindPaidAs: "paid",
      },
    ],
  },
];

describe("functional zones for self-banish costs", () => {
  for (const card of [condemnedTrinket, lagomorphPiece, refluxalRibbon, tabulaOfSalvage]) {
    it(`${card.slug} retains its field activation when its effect mentions the graveyard`, () => {
      const executable = requireGrandArchiveCard(
        createGrandArchiveMatchProgram([card]),
        card.canonicalId,
      );
      if (executable.layout.kind !== "single-faced") throw new Error("Expected single face");
      const face = executable.layout.face;
      const activated = face.abilities.filter((ability) => ability.kind === "activated");
      expect(activated.length).toBeGreaterThan(0);
      for (const ability of activated) {
        expect(grandArchiveAbilityFunctionalZones(face, ability)).toEqual(["field", "intent"]);
        const { functionalZones: _zones, ...withoutExplicitZones } = ability;
        expect(grandArchiveAbilityFunctionalZones(face, withoutExplicitZones)).toEqual([
          "field",
          "intent",
        ]);
      }
    });
  }
  for (const [index, cost] of costs.entries()) {
    it(`recognizes nested graveyard self-banish cost ${index}`, () => {
      const executable = requireGrandArchiveCard(
        createGrandArchiveMatchProgram([condemnedTrinket]),
        condemnedTrinket.canonicalId,
      );
      if (executable.layout.kind !== "single-faced") throw new Error("Expected single face");
      const face = executable.layout.face;
      for (const source of ["this card", face.name]) {
        const ability: GrandArchiveActivatedAbility = {
          id: "fixture-a1",
          kind: "activated",
          activation: "ability",
          text: `Banish ${source} from your graveyard: Draw a card.`,
          cost,
          effect: { kind: "draw", player: "controller", amount: 1 },
        };
        expect(grandArchiveAbilityFunctionalZones(face, ability)).toEqual(["graveyard", "intent"]);
        expect(
          grandArchiveAbilityFunctionalZones(face, {
            ...ability,
            text: `Banish ${source}: Return a card from your graveyard to your hand.`,
          }),
        ).toEqual(["field", "intent"]);
      }
    });
  }
});
