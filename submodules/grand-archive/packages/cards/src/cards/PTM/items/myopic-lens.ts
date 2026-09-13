import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const myopicLens: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dZ30oXwi3l",
  slug: "myopic-lens",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dZ30oXwi3l:face:default",
      catalogId: "dZ30oXwi3l",
      name: "Myopic Lens",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "REST: The next time target player would glimpse any amount this turn, that player glimpses 2 instead.",
      abilities: [
        {
          id: "dZ30oXwi3l-a1",
          kind: "activated",
          text: "REST: The next time target player would glimpse any amount this turn, that player glimpses 2 instead.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
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
            kind: "replacement",
            event: {
              name: "keyword-action-performed",
              actor: {
                binding: "target-player",
              },
              action: "glimpse",
            },
            operation: {
              kind: "replace-with",
              effect: {
                kind: "keyword-action",
                action: "glimpse",
                player: {
                  binding: "target-player",
                },
                amount: 2,
              },
            },
            duration: {
              kind: "for-next-event",
              event: "keyword-action-performed",
              expires: {
                kind: "this-turn",
              },
            },
          },
        },
      ],
    },
  },
};

export default myopicLens;
