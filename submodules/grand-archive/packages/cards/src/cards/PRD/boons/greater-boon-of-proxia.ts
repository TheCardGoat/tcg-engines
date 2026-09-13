import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const greaterBoonOfProxia: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "WKA37tNxtw",
  slug: "greater-boon-of-proxia",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "WKA37tNxtw:face:default",
      catalogId: "WKA37tNxtw",
      name: "Greater Boon of Proxia",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["GREATER BOON"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "A deck with this card in it can have up to three more cards in its material deck.\n\nFirst Boon (Bestow this boon at the beginning of the game, before Spirits enter.)\n\n(10): Draw a card. This ability costs (1) less to activate for each regalia you control. Activate this ability only once.\n",
      abilities: [
        {
          id: "WKA37tNxtw-a1",
          kind: "game-setup",
          text: "A deck with this card in it can have up to three more cards in its material deck.",
          rule: {
            kind: "modify-starting-deck-limit",
            zone: "material-deck",
            operation: "add-to-maximum",
            amount: 3,
            appliesIfIncluded: true,
          },
        },
        {
          id: "WKA37tNxtw-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "First Boon (Bestow this boon at the beginning of the game, before Spirits enter.)",
          keyword: {
            name: "first-boon",
          },
        },
        {
          id: "WKA37tNxtw-a3",
          kind: "activated",
          text: "(10): Draw a card. This ability costs (1) less to activate for each regalia you control. Activate this ability only once.",
          activation: "ability",
          cost: {
            kind: "pay-reserve",
            amount: 10,
          },
          costModifiers: [
            {
              operation: "subtract",
              amount: {
                kind: "count",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "supertype",
                    oneOf: ["REGALIA"],
                  },
                },
              },
            },
          ],
          limit: {
            count: 1,
            per: "source-instance",
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default greaterBoonOfProxia;
