import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const poisonousApple: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ukurlcbgzi",
  slug: "poisonous-apple",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ukurlcbgzi:face:default",
      catalogId: "ukurlcbgzi",
      name: "Poisonous Apple",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ARTIFACT"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "On Enter: Choose a player. That player gains control of Poisonous Apple. \n\nWhenever a card with floating memory is banished from your graveyard, deal 2 unpreventable damage to your champion.",
      abilities: [
        {
          id: "ukurlcbgzi-a1",
          kind: "triggered",
          text: "On Enter: Choose a player. That player gains control of Poisonous Apple.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "choose",
                selection: {
                  id: "chosen-player",
                  kind: "choice",
                  declared: "resolution",
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
              },
              {
                kind: "change-control",
                subject: {
                  kind: "source",
                },
                controller: {
                  binding: "chosen-player",
                },
              },
            ],
          },
        },
        {
          id: "ukurlcbgzi-a2",
          kind: "triggered",
          text: "Whenever a card with floating memory is banished from your graveyard, deal 2 unpreventable damage to your champion.",
          trigger: {
            kind: "event",
            event: {
              name: "card-banished",
              actor: "controller",
              from: "graveyard",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "has-keyword",
                  keyword: "floating-memory",
                },
              },
            },
          },
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "champion",
              player: "controller",
            },
            amount: 2,
            preventable: false,
          },
        },
      ],
    },
  },
};

export default poisonousApple;
