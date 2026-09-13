import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const portentousTanggu: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "mb3iqw3kc6",
  slug: "portentous-tanggu",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "mb3iqw3kc6:face:default",
      catalogId: "mb3iqw3kc6",
      name: "Portentous Tanggu",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ARTIFACT"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "[Guo Jia Bonus] On Enter: Put a quest counter on your champion. (Apply this effect only if your champion is Guo Jia.)\n\n(3), Banish Portentous Tanggu: Draw a card into your memory.",
      abilities: [
        {
          id: "mb3iqw3kc6-a1",
          kind: "triggered",
          text: "[Guo Jia Bonus] On Enter: Put a quest counter on your champion. (Apply this effect only if your champion is Guo Jia.)",
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
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Guo Jia",
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: {
              named: "quest",
            },
            amount: 1,
          },
        },
        {
          id: "mb3iqw3kc6-a2",
          kind: "activated",
          text: "(3), Banish Portentous Tanggu: Draw a card into your memory.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
              },
              {
                kind: "banish-self",
              },
            ],
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
      ],
    },
  },
};

export default portentousTanggu;
