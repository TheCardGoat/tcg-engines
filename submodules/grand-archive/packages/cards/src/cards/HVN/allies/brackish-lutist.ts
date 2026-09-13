import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const brackishLutist: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1clswn3ba2",
  slug: "brackish-lutist",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1clswn3ba2:face:default",
      catalogId: "1clswn3ba2",
      name: "Brackish Lutist",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "HUMAN", "MELODY"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "If a card with floating memory would be put into a player's graveyard, that player banishes it instead.",
      abilities: [
        {
          id: "1clswn3ba2-a1",
          kind: "static",
          staticKind: "effects",
          text: "If a card with floating memory would be put into a player's graveyard, that player banishes it instead.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "card-moved",
                subject: {
                  kind: "event-object",
                  filter: {
                    kind: "has-keyword",
                    keyword: "floating-memory",
                  },
                },
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
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default brackishLutist;
