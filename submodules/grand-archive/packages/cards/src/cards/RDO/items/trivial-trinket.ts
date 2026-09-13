import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const trivialTrinket: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Nym5Y3JsO5",
  slug: "trivial-trinket",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Nym5Y3JsO5:face:default",
      catalogId: "Nym5Y3JsO5",
      name: "Trivial Trinket",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Banish Trivial Trinket: Target opponent puts the top three cards of their deck into their graveyard.",
      abilities: [
        {
          id: "Nym5Y3JsO5-a1",
          kind: "activated",
          text: "Banish Trivial Trinket: Target opponent puts the top three cards of their deck into their graveyard.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          targets: [
            {
              id: "target-player",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "player",
                players: ["opponent"],
              },
            },
          ],
          effect: {
            kind: "mill",
            player: {
              binding: "target-player",
            },
            amount: 3,
          },
        },
      ],
    },
  },
};

export default trivialTrinket;
