import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const edgeOfTomorrow: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "E0FPuC9bXq",
  slug: "edge-of-tomorrow",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "E0FPuC9bXq:face:default",
      catalogId: "E0FPuC9bXq",
      name: "Edge of Tomorrow",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Scavenge 8 for a domain card. When the next domain with the same name as the scavenged card enters the field under your control this turn, draw a card into your memory.",
      abilities: [
        {
          id: "E0FPuC9bXq-a1",
          kind: "card-resolution",
          text: "Scavenge 8 for a domain card. When the next domain with the same name as the scavenged card enters the field under your control this turn, draw a card into your memory.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "keyword-action",
                action: "scavenge",
                player: "controller",
                amount: 8,
                filter: {
                  kind: "type",
                  oneOf: ["DOMAIN"],
                },
                bindResultAs: "scavenged-domain",
              },
              {
                kind: "track-characteristic",
                subject: {
                  kind: "bound",
                  binding: "scavenged-domain",
                },
                characteristic: "card-name",
                trackAs: "scavenged-domain-name",
              },
              {
                kind: "create-delayed-trigger",
                trigger: {
                  kind: "event",
                  event: {
                    name: "object-entered-field",
                    subject: {
                      kind: "event-object",
                      controller: "controller",
                      filter: {
                        kind: "all",
                        filters: [
                          {
                            kind: "type",
                            oneOf: ["DOMAIN"],
                          },
                          {
                            kind: "matches-tracked-characteristic",
                            key: "scavenged-domain-name",
                            characteristic: "card-name",
                          },
                        ],
                      },
                    },
                  },
                },
                limit: 1,
                expires: {
                  kind: "this-turn",
                },
                effect: {
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

export default edgeOfTomorrow;
