import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const chargedAssailant: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ffy4dwavco",
  slug: "charged-assailant",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ffy4dwavco:face:default",
      catalogId: "ffy4dwavco",
      name: "Charged Assailant",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "AUTOMATON"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Class Bonus] On Enter: If you control a Powercell, you gain agility 3 for this turn. (Agility 3 — Return three cards from your memory to your hand at the beginning of the end phase.)",
      abilities: [
        {
          id: "ffy4dwavco-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: If you control a Powercell, you gain agility 3 for this turn. (Agility 3 — Return three cards from your memory to your hand at the beginning of the end phase.)",
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
            kind: "conditional",
            condition: {
              kind: "collection-exists",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "subtype",
                  oneOf: ["POWERCELL"],
                },
              },
            },
            then: {
              kind: "set-player-state",
              player: "controller",
              state: "agility",
              value: true,
              amount: 3,
              duration: {
                kind: "this-turn",
              },
            },
          },
        },
      ],
    },
  },
};

export default chargedAssailant;
