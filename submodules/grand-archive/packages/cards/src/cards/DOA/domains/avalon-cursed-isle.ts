import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const avalonCursedIsle: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "41WnFOT5YS",
  slug: "avalon-cursed-isle",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "41WnFOT5YS:face:default",
      catalogId: "41WnFOT5YS",
      name: "Avalon, Cursed Isle",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["DOMAIN"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "ISLE"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "Upkeep — Whenever you materialize a card, sacrifice Avalon.\n\nWhenever you activate a water element card, target player puts the top two cards of their deck into their graveyard.",
      abilities: [
        {
          id: "41WnFOT5YS-a1",
          kind: "triggered",
          text: "Upkeep — Whenever you materialize a card, sacrifice Avalon.",
          trigger: {
            kind: "event",
            event: {
              name: "card-materialized",
              actor: "controller",
              subject: {
                kind: "event-object",
              },
            },
          },
          effect: {
            kind: "sacrifice",
            subject: {
              kind: "source",
            },
          },
          label: {
            name: "Upkeep",
          },
        },
        {
          id: "41WnFOT5YS-a2",
          kind: "triggered",
          text: "Whenever you activate a water element card, target player puts the top two cards of their deck into their graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "element",
                  oneOf: ["WATER"],
                },
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

export default avalonCursedIsle;
