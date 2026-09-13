import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const imperialSeal: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "by8145w2u2",
  slug: "imperial-seal",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "by8145w2u2:face:default",
      catalogId: "by8145w2u2",
      name: "Imperial Seal",
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
        "Divine Relic (You can only have one card with this keyword in your material deck.)\n\nBanish Imperial Seal: All basic elements are enabled for you until end of turn. (Fire, water, and wind are basic elements.)",
      abilities: [
        {
          id: "by8145w2u2-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Divine Relic (You can only have one card with this keyword in your material deck.)",
          keyword: {
            name: "divine-relic",
          },
        },
        {
          id: "by8145w2u2-a2",
          kind: "activated",
          text: "Banish Imperial Seal: All basic elements are enabled for you until end of turn. (Fire, water, and wind are basic elements.)",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "set-player-state",
                player: "controller",
                state: {
                  named: "enabled-element",
                  value: "FIRE",
                },
                value: true,
                duration: {
                  kind: "this-turn",
                },
              },
              {
                kind: "set-player-state",
                player: "controller",
                state: {
                  named: "enabled-element",
                  value: "WATER",
                },
                value: true,
                duration: {
                  kind: "this-turn",
                },
              },
              {
                kind: "set-player-state",
                player: "controller",
                state: {
                  named: "enabled-element",
                  value: "WIND",
                },
                value: true,
                duration: {
                  kind: "this-turn",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default imperialSeal;
