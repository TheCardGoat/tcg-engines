import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const innervateFury: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wpbhigka5a",
  slug: "innervate-fury",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wpbhigka5a:face:default",
      catalogId: "wpbhigka5a",
      name: "Innervate Fury",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "As an additional cost to activate this card, delevel your champion and recover 5. (To delevel your champion, return the top card of its lineage to its owner's material deck.)\n\nDeal 7 damage split among any amount of target allies.",
      abilities: [
        {
          id: "wpbhigka5a-a1",
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
          id: "wpbhigka5a-a2",
          kind: "card-resolution",
          text: "Deal 7 damage split among any amount of target allies.",
          effect: {
            kind: "distribute",
            amount: 7,
            among: {
              id: "damage-recipients",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "any-number",
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
            payload: {
              kind: "damage",
              source: {
                kind: "source",
              },
            },
          },
        },
      ],
    },
  },
};

export default innervateFury;
