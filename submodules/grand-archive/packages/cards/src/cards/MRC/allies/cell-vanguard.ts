import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cellVanguard: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3qiwqjt0oo",
  slug: "cell-vanguard",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3qiwqjt0oo:face:default",
      catalogId: "3qiwqjt0oo",
      name: "Cell Vanguard",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "AUTOMATON"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "[Class Bonus] On Enter: Summon a Powercell token rested.\n\n[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.) ",
      abilities: [
        {
          id: "3qiwqjt0oo-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Summon a Powercell token rested.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
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
          effect: {
            kind: "summon",
            object: "Powercell",
            controller: "controller",
            bindResultAs: "summoned-token",
            entersWithStates: ["rested"],
          },
        },
        {
          id: "3qiwqjt0oo-a2",
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

export default cellVanguard;
