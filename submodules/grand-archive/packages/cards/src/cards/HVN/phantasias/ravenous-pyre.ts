import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ravenousPyre: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "pjdsfqbgit",
  slug: "ravenous-pyre",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "pjdsfqbgit:face:default",
      catalogId: "pjdsfqbgit",
      name: "Ravenous Pyre",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "[Class Bonus] On Enter: Draw a card and discard a card.\nWhenever a champion you don't control levels up, deal 2 damage to it.",
      abilities: [
        {
          id: "pjdsfqbgit-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Draw a card and discard a card.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
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
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
              {
                kind: "discard",
                player: "controller",
                selection: {
                  id: "discarded-card",
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
                  },
                },
              },
            ],
          },
        },
        {
          id: "pjdsfqbgit-a2",
          kind: "triggered",
          text: "Whenever a champion you don't control levels up, deal 2 damage to it.",
          trigger: {
            kind: "event",
            event: {
              name: "champion-leveled-up",
              actor: "opponent",
              subject: {
                kind: "event-object",
                controller: "opponent",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
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
              kind: "event-subject",
            },
            amount: 2,
          },
        },
      ],
    },
  },
};

export default ravenousPyre;
