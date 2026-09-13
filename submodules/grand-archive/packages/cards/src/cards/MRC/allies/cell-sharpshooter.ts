import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cellSharpshooter: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "etaebjlwab",
  slug: "cell-sharpshooter",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "etaebjlwab:face:default",
      catalogId: "etaebjlwab",
      name: "Cell Sharpshooter",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "AUTOMATON"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Ranged 2 (As long as this unit is distant, its attacks get +2 POWER.) \n\nOn Enter: You may banish a card with floating memory from your graveyard. If you do, draw a card and summon a Powercell token rested.",
      abilities: [
        {
          id: "etaebjlwab-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 2 (As long as this unit is distant, its attacks get +2 POWER.)",
          keyword: {
            name: "ranged",
            value: 2,
          },
        },
        {
          id: "etaebjlwab-a2",
          kind: "triggered",
          text: "On Enter: You may banish a card with floating memory from your graveyard. If you do, draw a card and summon a Powercell token rested.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "banish",
                  player: "controller",
                  selection: {
                    id: "banished-cards",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    candidates: {
                      kind: "card",
                      zones: ["graveyard"],
                      relationship: "zone-of",
                      player: "controller",
                      filter: {
                        kind: "has-keyword",
                        keyword: "floating-memory",
                      },
                    },
                  },
                },
                {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "draw",
                      player: "controller",
                      amount: 1,
                    },
                    {
                      kind: "summon",
                      object: "Powercell",
                      controller: "controller",
                      bindResultAs: "summoned-token",
                      entersWithStates: ["rested"],
                    },
                  ],
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default cellSharpshooter;
