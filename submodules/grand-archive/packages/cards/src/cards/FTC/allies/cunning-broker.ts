import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cunningBroker: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "oy34bro89w",
  slug: "cunning-broker",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "oy34bro89w:face:default",
      catalogId: "oy34bro89w",
      name: "Cunning Broker",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 0,
        life: 3,
      },
      rulesText:
        "Stealth (This unit can't be targeted by attacks unless permitted by true sight.)\n\nREST, Remove two preparation counters from your champion: Draw a card.",
      abilities: [
        {
          id: "oy34bro89w-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Stealth (This unit can't be targeted by attacks unless permitted by true sight.)",
          keyword: {
            name: "stealth",
          },
        },
        {
          id: "oy34bro89w-a2",
          kind: "activated",
          text: "REST, Remove two preparation counters from your champion: Draw a card.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "remove-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "preparation",
                amount: 2,
              },
            ],
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default cunningBroker;
