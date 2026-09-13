import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cellwardenDroid: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "EB5sNiPNvA",
  slug: "cellwarden-droid",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "EB5sNiPNvA:face:default",
      catalogId: "EB5sNiPNvA",
      name: "Cellwarden Droid",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "DISCORP", "AUTOMATON"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "[Class Bonus] (5), REST: Summon a Powercell token rested. This ability costs (1) less to activate for each water element card in your graveyard.",
      abilities: [
        {
          id: "EB5sNiPNvA-a1",
          kind: "activated",
          text: "[Class Bonus] (5), REST: Summon a Powercell token rested. This ability costs (1) less to activate for each water element card in your graveyard.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 5,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          costModifiers: [
            {
              operation: "subtract",
              amount: {
                kind: "count",
                collection: {
                  zones: ["graveyard"],
                  player: "controller",
                  filter: {
                    kind: "element",
                    oneOf: ["WATER"],
                  },
                },
              },
            },
          ],
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
      ],
    },
  },
};

export default cellwardenDroid;
