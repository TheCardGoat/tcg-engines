import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const clockworkMusicbox: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "q2svdv3zb9",
  slug: "clockwork-musicbox",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "q2svdv3zb9:face:default",
      catalogId: "q2svdv3zb9",
      name: "Clockwork Musicbox",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ARTIFACT"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Hindered (This object enters the field rested.)\n\n[Class Bonus] Whenever you activate a Harmony or Melody card from your hand, you may banish it as it resolves.\n\nREST: You may activate a card banished by Clockwork Musicbox. (You still pay its costs.)",
      abilities: [
        {
          id: "q2svdv3zb9-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Hindered (This object enters the field rested.)",
          keyword: {
            name: "hindered",
          },
        },
        {
          id: "q2svdv3zb9-a2",
          kind: "triggered",
          text: "[Class Bonus] Whenever you activate a Harmony or Melody card from your hand, you may banish it as it resolves.",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "subtype",
                  oneOf: ["HARMONY", "MELODY"],
                },
              },
              from: "hand",
            },
          },
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "after-resolution",
              stackItem: {
                kind: "event-subject",
              },
              effect: {
                kind: "banish-object",
                subject: {
                  kind: "event-subject",
                },
              },
            },
          },
        },
        {
          id: "q2svdv3zb9-a3",
          kind: "activated",
          text: "REST: You may activate a card banished by Clockwork Musicbox. (You still pay its costs.)",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "choose",
              selection: {
                id: "source-banished-card",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                unique: true,
                candidates: {
                  kind: "card",
                  zones: ["banishment"],
                  host: {
                    kind: "source",
                  },
                  relationship: "banished-by",
                },
              },
              effect: {
                kind: "activate-card",
                subject: {
                  kind: "bound",
                  binding: "source-banished-card",
                },
                payCosts: true,
              },
            },
          },
        },
      ],
    },
  },
};

export default clockworkMusicbox;
