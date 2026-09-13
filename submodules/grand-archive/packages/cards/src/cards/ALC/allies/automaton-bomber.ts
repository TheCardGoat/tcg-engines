import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const automatonBomber: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ygojwk0pw0",
  slug: "automaton-bomber",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ygojwk0pw0:face:default",
      catalogId: "ygojwk0pw0",
      name: "Automaton Bomber",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "AUTOMATON"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Ranged 4 (As long as this unit is distant, its attacks get +4 POWER.)\n\n[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.) ",
      abilities: [
        {
          id: "ygojwk0pw0-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 4 (As long as this unit is distant, its attacks get +4 POWER.)",
          keyword: {
            name: "ranged",
            value: 4,
          },
        },
        {
          id: "ygojwk0pw0-a2",
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

export default automatonBomber;
