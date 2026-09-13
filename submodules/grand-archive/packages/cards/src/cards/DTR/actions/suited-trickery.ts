import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const suitedTrickery: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "uxhmucm8si",
  slug: "suited-trickery",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "uxhmucm8si:face:default",
      catalogId: "uxhmucm8si",
      name: "Suited Trickery",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SUITED", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Until the beginning of your next turn, players can't declare attacks with champions they control unless they pay (2) for each attack declaration. Then if you control a Suited ally, draw a card into your memory.",
      abilities: [
        {
          id: "uxhmucm8si-a1",
          kind: "card-resolution",
          text: "Until the beginning of your next turn, players can't declare attacks with champions they control unless they pay (2) for each attack declaration. Then if you control a Suited ally, draw a card into your memory.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "rule-modification",
                mode: "add-cost",
                action: "attack",
                subject: {
                  kind: "player",
                  player: "each-player",
                },
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
                cost: {
                  kind: "pay-reserve",
                  amount: 2,
                },
                duration: {
                  kind: "until-start-of-turn",
                  whose: "controller",
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "collection-exists",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "type",
                          oneOf: ["ALLY"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["SUITED"],
                        },
                      ],
                    },
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

export default suitedTrickery;
