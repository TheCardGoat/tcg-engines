import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const obeliskOfFabrication: GrandArchiveCard<
  GrandArchiveAbilityDefinition,
  "token-representation"
> = {
  canonicalId: "xy5lh23qu7",
  slug: "obelisk-of-fabrication",
  definitionKind: "token-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "xy5lh23qu7:face:default",
      catalogId: "xy5lh23qu7",
      name: "Obelisk of Fabrication",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["DOMAIN"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "OBELISK"],
      },
      elements: ["NEOS"],
      stats: {},
      rulesText:
        "(6), REST: Summon an Automaton Drone token with a buff counter on it. This ability costs (1) less to activate for each domain you control.",
      abilities: [
        {
          id: "xy5lh23qu7-a1",
          kind: "activated",
          text: "(6), REST: Summon an Automaton Drone token with a buff counter on it. This ability costs (1) less to activate for each domain you control.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 6,
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
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["DOMAIN"],
                  },
                },
              },
            },
          ],
          effect: {
            kind: "summon",
            object: "Automaton Drone",
            controller: "controller",
            bindResultAs: "summoned-token",
            entersWithCounters: [
              {
                counter: "buff",
                amount: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default obeliskOfFabrication;
