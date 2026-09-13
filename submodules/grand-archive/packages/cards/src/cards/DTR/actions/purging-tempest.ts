import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const purgingTempest: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "yuo7dbge3b",
  slug: "purging-tempest",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "yuo7dbge3b:face:default",
      catalogId: "yuo7dbge3b",
      name: "Purging Tempest",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Until end of turn, if one or more cards would enter target player's graveyard from anywhere except the field, banish them instead.",
      abilities: [
        {
          id: "yuo7dbge3b-a1",
          kind: "card-resolution",
          text: "Until end of turn, if one or more cards would enter target player's graveyard from anywhere except the field, banish them instead.",
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
              name: "card-moved",
              actor: {
                binding: "target-player",
              },
              subject: {
                kind: "event-object",
              },
              fromNot: ["field"],
              to: "graveyard",
            },
            operation: {
              kind: "replace-with",
              effect: {
                kind: "banish-object",
                subject: {
                  kind: "event-subject",
                },
              },
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default purgingTempest;
