import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const oneiricKey: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "pY1TImPn8g",
  slug: "oneiric-key",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "pY1TImPn8g:face:default",
      catalogId: "pY1TImPn8g",
      name: "Oneiric Key",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPECTER", "BAUBLE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "[Alice Bonus] On Enter: Put a haunt counter on your Phantasmagoria.\n\n(4), Banish Oneiric Key: Draw a card into your memory.",
      abilities: [
        {
          id: "pY1TImPn8g-a1",
          kind: "triggered",
          text: "[Alice Bonus] On Enter: Put a haunt counter on your Phantasmagoria.",
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
                name: "Alice",
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "each",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "name",
                  value: "Phantasmagoria",
                },
              },
            },
            counter: {
              named: "haunt",
            },
            amount: 1,
          },
        },
        {
          id: "pY1TImPn8g-a2",
          kind: "activated",
          text: "(4), Banish Oneiric Key: Draw a card into your memory.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 4,
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

export default oneiricKey;
