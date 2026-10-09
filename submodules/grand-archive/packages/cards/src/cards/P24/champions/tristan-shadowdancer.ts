import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tristanShadowdancer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "he6kd7hocc",
  slug: "tristan-shadowdancer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "he6kd7hocc:face:default",
      catalogId: "he6kd7hocc",
      name: "Tristan, Shadowdancer",
      lineageName: "Tristan",
      cost: {
        kind: "memory",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["UMBRA"],
      stats: {
        level: 3,
        life: 25,
      },
      rulesText:
        "Tristan Lineage\n\nOn Enter: Summon two Ominous Shadow tokens and put a preparation counter on Tristan.\n\nRemove two preparation counters from Tristan: Change the target of an attack that targets Tristan to a phantasia ally you control.",
      abilities: [
        {
          id: "he6kd7hocc-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Tristan Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Tristan",
          },
        },
        {
          id: "he6kd7hocc-a2",
          kind: "triggered",
          text: "On Enter: Summon two Ominous Shadow tokens and put a preparation counter on Tristan.",
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
                kind: "summon",
                object: "Ominous Shadow",
                controller: "controller",
                bindResultAs: "summoned-token",
                amount: 2,
              },
              {
                kind: "add-counter",
                subject: {
                  kind: "source",
                },
                counter: "preparation",
                amount: 1,
              },
            ],
          },
        },
        {
          id: "he6kd7hocc-a3",
          kind: "activated",
          text: "Remove two preparation counters from Tristan: Change the target of an attack that targets Tristan to a phantasia ally you control.",
          activation: "ability",
          cost: {
            kind: "remove-counter",
            subject: {
              kind: "source",
            },
            counter: "preparation",
            amount: 2,
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "current-attack-target-matches",
              controller: "controller",
              filter: {
                kind: "not",
                filter: {
                  kind: "not-source",
                },
              },
            },
            then: {
              kind: "choose",
              selection: {
                id: "target-1",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                candidates: {
                  kind: "object",
                  zones: ["field"],
                  relationship: "controlled-by",
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["PHANTASIA"],
                      },
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                    ],
                  },
                },
              },
              effect: {
                kind: "retarget",
                subject: {
                  kind: "current-attack",
                },
                chooser: "controller",
                newTarget: {
                  kind: "bound",
                  binding: "target-1",
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default tristanShadowdancer;
