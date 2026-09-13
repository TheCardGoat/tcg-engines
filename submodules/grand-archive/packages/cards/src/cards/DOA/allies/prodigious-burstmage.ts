import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const prodigiousBurstmage: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "l64yfOVhkp",
  slug: "prodigious-burstmage",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "l64yfOVhkp:face:default",
      catalogId: "l64yfOVhkp",
      name: "Prodigious Burstmage",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 3,
        life: 2,
      },
      rulesText:
        "[Class Bonus] On Death: Draw a card, then discard a card. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "l64yfOVhkp-a1",
          kind: "triggered",
          text: "[Class Bonus] On Death: Draw a card, then discard a card. (Apply this effect only if your champion's class matches this card's class.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "source",
              },
            },
          },
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
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
              {
                kind: "discard",
                player: "controller",
                selection: {
                  id: "discarded-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["hand"],
                    relationship: "zone-of",
                    player: "controller",
                  },
                },
                bindResultAs: "discarded-card",
              },
            ],
          },
        },
      ],
    },
  },
};

export default prodigiousBurstmage;
