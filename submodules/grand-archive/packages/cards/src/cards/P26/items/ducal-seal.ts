import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ducalSeal: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qFwqqT0XWo",
  slug: "ducal-seal",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qFwqqT0XWo:face:default",
      catalogId: "qFwqqT0XWo",
      name: "Ducal Seal",
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
      elements: ["EXALTED", "NORM"],
      stats: {},
      rulesText:
        "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)\n\nBanish Ducal Seal: Until end of turn, players can’t declare attacks unless they pay (3) for each attack declaration. Activate this ability only during an opponent’s recollection phase.",
      abilities: [
        {
          id: "qFwqqT0XWo-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)",
          keyword: {
            name: "exalted",
          },
        },
        {
          id: "qFwqqT0XWo-a2",
          kind: "activated",
          text: "Banish Ducal Seal: Until end of turn, players can’t declare attacks unless they pay (3) for each attack declaration. Activate this ability only during an opponent’s recollection phase.",
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
              amount: 3,
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

export default ducalSeal;
