import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const destinedEncounter: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6F5hCQ8I9S",
  slug: "destined-encounter",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6F5hCQ8I9S:face:default",
      catalogId: "6F5hCQ8I9S",
      name: "Destined Encounter",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SKILL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Scavenge 6 for an ally card. If the scavenged card is Elysian, draw a card into your memory.",
      abilities: [
        {
          id: "6F5hCQ8I9S-a1",
          kind: "card-resolution",
          text: "Scavenge 6 for an ally card. If the scavenged card is Elysian, draw a card into your memory.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "keyword-action",
                action: "scavenge",
                amount: 6,
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
                bindResultAs: "scavenged-card",
              },
              {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "scavenged-card",
                  },
                  filter: {
                    kind: "subtype",
                    oneOf: ["ELYSIAN"],
                  },
                },
                then: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                  to: "memory",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default destinedEncounter;
