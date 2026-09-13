import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tariffRing: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "xnrw8qq1uw",
  slug: "tariff-ring",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "xnrw8qq1uw:face:default",
      catalogId: "xnrw8qq1uw",
      name: "Tariff Ring",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Banish Tariff Ring: Until end of turn, players can't declare attacks unless they pay (2) for each attack declaration. Activate this ability only during an opponent's recollection phase.",
      abilities: [
        {
          id: "xnrw8qq1uw-a1",
          kind: "activated",
          text: "Banish Tariff Ring: Until end of turn, players can't declare attacks unless they pay (2) for each attack declaration. Activate this ability only during an opponent's recollection phase.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          condition: {
            kind: "all",
            conditions: [
              {
                kind: "phase",
                phase: "recollection",
              },
              {
                kind: "turn-player",
                player: "opponent",
              },
            ],
          },
          effect: {
            kind: "rule-modification",
            mode: "add-cost",
            action: "attack",
            subject: {
              kind: "player",
              player: "each-player",
            },
            cost: {
              kind: "pay-reserve",
              amount: 2,
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default tariffRing;
