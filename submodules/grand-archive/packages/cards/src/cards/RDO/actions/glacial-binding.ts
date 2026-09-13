import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const glacialBinding: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "cthZxfkdsY",
  slug: "glacial-binding",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "cthZxfkdsY:face:default",
      catalogId: "cthZxfkdsY",
      name: "Glacial Binding",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL", "REACTION"],
      },
      elements: ["EXALTED", "WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "You may banish a card with floating memory from your graveyard rather than pay this card’s reserve cost.\n\nNegate target card activation unless its controller pays (3). Banish the card that had its activation negated this way.",
      abilities: [
        {
          id: "cthZxfkdsY-a1",
          kind: "card-resolution",
          text: "You may banish a card with floating memory from your graveyard rather than pay this card’s reserve cost.",
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "banish",
              player: "controller",
              selection: {
                id: "banished-cards",
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
                  filter: {
                    kind: "has-keyword",
                    keyword: "floating-memory",
                  },
                },
              },
            },
          },
        },
        {
          id: "cthZxfkdsY-a2",
          kind: "card-resolution",
          text: "Negate target card activation unless its controller pays (3). Banish the card that had its activation negated this way.",
          targets: [
            {
              id: "target-stack-item",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "stack-item",
                itemTypes: ["card-activation"],
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "unless-paid",
                player: {
                  controllerOf: "target-stack-item",
                },
                cost: {
                  kind: "pay-reserve",
                  amount: 3,
                },
                otherwise: {
                  kind: "negate",
                  subject: {
                    kind: "bound",
                    binding: "target-stack-item",
                  },
                  bindResultAs: "negated-stack-item",
                },
              },
              {
                kind: "banish-object",
                subject: {
                  kind: "stack-source",
                  binding: "negated-stack-item",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default glacialBinding;
