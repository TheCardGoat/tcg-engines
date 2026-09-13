import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const breakwaterCadet: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5lNjnBTT5h",
  slug: "breakwater-cadet",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5lNjnBTT5h:face:default",
      catalogId: "5lNjnBTT5h",
      name: "Breakwater Cadet",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "[Class Bonus] On Attack: Target player puts the top two cards of their deck into their graveyard. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "5lNjnBTT5h-a1",
          kind: "triggered",
          text: "[Class Bonus] On Attack: Target player puts the top two cards of their deck into their graveyard. (Apply this effect only if your champion's class matches this card's class.)",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
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
                players: ["controller", "opponent", "another-player"],
              },
            },
          ],
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
            kind: "mill",
            player: {
              binding: "target-player",
            },
            amount: 2,
          },
        },
      ],
    },
  },
};

export default breakwaterCadet;
