import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const summonRetinue: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7qg90wqPHs",
  slug: "summon-retinue",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7qg90wqPHs:face:default",
      catalogId: "7qg90wqPHs",
      name: "Summon Retinue",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SPELL"],
      },
      elements: ["WIND"],
      speed: "slow",
      stats: {},
      rulesText:
        "Summon two Vacuous Servant tokens rested. Then if you have three or more omens, wake them up.",
      abilities: [
        {
          id: "7qg90wqPHs-a1",
          kind: "card-resolution",
          text: "Summon two Vacuous Servant tokens rested. Then if you have three or more omens, wake them up.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "summon",
                object: "Vacuous Servant",
                controller: "controller",
                bindResultAs: "summoned-token",
                amount: 2,
                entersWithStates: ["rested"],
              },
              {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "player-property",
                      player: "controller",
                      property: "omens",
                    },
                    operator: "gte",
                    right: 3,
                  },
                },
                then: {
                  kind: "wake",
                  subject: {
                    kind: "bound",
                    binding: "summoned-token",
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default summonRetinue;
