import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const portsidePirate: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6p3p5iqigc",
  slug: "portside-pirate",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6p3p5iqigc:face:default",
      catalogId: "6p3p5iqigc",
      name: "Portside Pirate",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "[Class Bonus] Banish a card with floating memory from your graveyard: Put a buff counter on Portside Pirate and it gains stealth until end of turn. (This unit can’t be targeted by attacks unless permitted by true sight.)",
      abilities: [
        {
          id: "6p3p5iqigc-a1",
          kind: "card-resolution",
          text: "[Class Bonus] Banish a card with floating memory from your graveyard: Put a buff counter on Portside Pirate and it gains stealth until end of turn. (This unit can’t be targeted by attacks unless permitted by true sight.)",
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
      ],
    },
  },
};

export default portsidePirate;
