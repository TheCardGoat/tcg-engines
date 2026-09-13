import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const gencodeWomb: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7IVQRtJFa8",
  slug: "gencode-womb",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7IVQRtJFa8:face:default",
      catalogId: "7IVQRtJFa8",
      name: "Gencode Womb",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "ARTIFACT"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "[Dante Bonus] (3), Banish Gencode Womb: If you don't control an Elysian object, summon an Elysian Test Subject token. Otherwise, draw a card into your memory. (Activate this ability only if your champion is Dante.)",
      abilities: [
        {
          id: "7IVQRtJFa8-a1",
          kind: "activated",
          text: "[Dante Bonus] (3), Banish Gencode Womb: If you don't control an Elysian object, summon an Elysian Test Subject token. Otherwise, draw a card into your memory. (Activate this ability only if your champion is Dante.)",
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
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Dante",
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "not",
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "subtype",
                    oneOf: ["ELYSIAN"],
                  },
                },
              },
            },
            then: {
              kind: "summon",
              object: "Elysian Test Subject",
              controller: "controller",
              bindResultAs: "summoned-token",
            },
            else: {
              kind: "draw",
              player: "controller",
              amount: 1,
              to: "memory",
            },
          },
        },
      ],
    },
  },
};

export default gencodeWomb;
