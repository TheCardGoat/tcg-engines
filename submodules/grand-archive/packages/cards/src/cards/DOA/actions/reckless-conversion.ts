import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const recklessConversion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "gJ2dsgywEs",
  slug: "reckless-conversion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "gJ2dsgywEs:face:default",
      catalogId: "gJ2dsgywEs",
      name: "Reckless Conversion",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["ARCANE"],
      speed: "slow",
      stats: {},
      rulesText:
        "Draw two cards into your memory then banish four cards at random from it.\n\n[Class Bonus] Return all cards from your memory to your hand. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "gJ2dsgywEs-a1",
          kind: "card-resolution",
          text: "Draw two cards into your memory then banish four cards at random from it.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 2,
                to: "memory",
              },
              {
                kind: "banish",
                player: "controller",
                selection: {
                  id: "banished-memory-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 4,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["memory"],
                    relationship: "zone-of",
                    player: "controller",
                  },
                  method: "random",
                },
              },
            ],
          },
        },
        {
          id: "gJ2dsgywEs-a2",
          kind: "card-resolution",
          text: "[Class Bonus] Return all cards from your memory to your hand. (Apply this effect only if your champion's class matches this card's class.)",
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
            kind: "move",
            subject: {
              kind: "each",
              collection: {
                zones: ["memory"],
                player: "controller",
              },
            },
            from: "memory",
            destination: {
              zone: "hand",
            },
          },
        },
      ],
    },
  },
};

export default recklessConversion;
