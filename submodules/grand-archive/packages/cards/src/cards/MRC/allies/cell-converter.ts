import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cellConverter: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "eqhj1trn0y",
  slug: "cell-converter",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "eqhj1trn0y:face:default",
      catalogId: "eqhj1trn0y",
      name: "Cell Converter",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "AUTOMATON"],
      },
      elements: ["WATER"],
      stats: {
        power: 0,
        life: 3,
      },
      rulesText:
        "At the beginning of your end phase, summon a Powercell token rested.\n\n[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.) ",
      abilities: [
        {
          id: "eqhj1trn0y-a1",
          kind: "triggered",
          text: "At the beginning of your end phase, summon a Powercell token rested.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
              actor: "controller",
            },
          },
          effect: {
            kind: "summon",
            object: "Powercell",
            controller: "controller",
            bindResultAs: "summoned-token",
            entersWithStates: ["rested"],
          },
        },
        {
          id: "eqhj1trn0y-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
        },
      ],
    },
  },
};

export default cellConverter;
