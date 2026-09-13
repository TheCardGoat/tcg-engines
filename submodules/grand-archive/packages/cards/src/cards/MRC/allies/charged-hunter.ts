import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const chargedHunter: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "iffei7chsb",
  slug: "charged-hunter",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "iffei7chsb:face:default",
      catalogId: "iffei7chsb",
      name: "Charged Hunter",
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
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Ranged 2 (As long as this unit is distant, its attacks get +2 POWER.) \n\n[Class Bonus] On Enter: If you control another Automaton ally or a Powercell, Charged Hunter becomes distant. (Units stay distant until the end of their controller’s turn.)",
      abilities: [
        {
          id: "iffei7chsb-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 2 (As long as this unit is distant, its attacks get +2 POWER.)",
          keyword: {
            name: "ranged",
            value: 2,
          },
        },
        {
          id: "iffei7chsb-a2",
          kind: "triggered",
          text: "[Class Bonus] On Enter: If you control another Automaton ally or a Powercell, Charged Hunter becomes distant. (Units stay distant until the end of their controller’s turn.)",
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
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["AUTOMATON"],
                    },
                  ],
                },
              },
            },
            then: {
              kind: "set-object-state",
              subject: {
                kind: "source",
              },
              state: "distant",
              value: true,
            },
          },
        },
      ],
    },
  },
};

export default chargedHunter;
