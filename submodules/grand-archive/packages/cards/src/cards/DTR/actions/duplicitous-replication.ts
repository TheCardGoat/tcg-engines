import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const duplicitousReplication: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "owq8s5fefw",
  slug: "duplicitous-replication",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "owq8s5fefw:face:default",
      catalogId: "owq8s5fefw",
      name: "Duplicitous Replication",
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
      elements: ["CRUX"],
      speed: "fast",
      stats: {},
      rulesText:
        "The next time one or more regalia enter the field under an opponent's control this turn, summon a token copy of each of them.",
      abilities: [
        {
          id: "owq8s5fefw-a1",
          kind: "card-resolution",
          text: "The next time one or more regalia enter the field under an opponent's control this turn, summon a token copy of each of them.",
          effect: {
            kind: "create-delayed-trigger",
            trigger: {
              kind: "event",
              cardinality: "one-or-more",
              event: {
                name: "object-entered-field",
                subject: {
                  kind: "event-object",
                  controller: "opponent",
                  filter: {
                    kind: "supertype",
                    oneOf: ["REGALIA"],
                  },
                },
              },
            },
            limit: 1,
            expires: {
              kind: "this-turn",
            },
            effect: {
              kind: "summon-copies",
              controller: "controller",
              subjects: {
                kind: "event-subject",
              },
              token: true,
            },
          },
        },
      ],
    },
  },
};

export default duplicitousReplication;
