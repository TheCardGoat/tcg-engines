import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const innervateKnowledge: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "pcescfpwak",
  slug: "innervate-knowledge",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "pcescfpwak:face:default",
      catalogId: "pcescfpwak",
      name: "Innervate Knowledge",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["WATER"],
      speed: "slow",
      stats: {},
      rulesText:
        "As an additional cost to activate this card, delevel your champion and recover 5. (To delevel your champion, return the top card of its lineage to its owner's material deck.)\n\nDraw two cards.",
      abilities: [
        {
          id: "pcescfpwak-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, delevel your champion and recover 5. (To delevel your champion, return the top card of its lineage to its owner's material deck.)",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "all",
                costs: [
                  {
                    kind: "delevel-champion",
                  },
                  {
                    kind: "recover",
                    amount: 5,
                    requiresExact: true,
                  },
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "pcescfpwak-a2",
          kind: "card-resolution",
          text: "Draw two cards.",
          effect: {
            kind: "draw",
            player: "controller",
            amount: 2,
          },
        },
      ],
    },
  },
};

export default innervateKnowledge;
