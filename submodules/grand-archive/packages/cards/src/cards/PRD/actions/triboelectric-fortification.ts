import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const triboelectricFortification: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "uL4wFn96Hg",
  slug: "triboelectric-fortification",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "uL4wFn96Hg:face:default",
      catalogId: "uL4wFn96Hg",
      name: "Triboelectric Fortification",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SKILL", "CRAFT"],
      },
      elements: ["ARCANE"],
      speed: "slow",
      stats: {},
      rulesText:
        "Remove up to three static counters from among objects you control. Deal X damage to target unit, where X is the amount of counters removed this way. Then put X durability counters on a Warrior weapon you control.",
      abilities: [
        {
          id: "uL4wFn96Hg-a1",
          kind: "card-resolution",
          text: "Remove up to three static counters from among objects you control. Deal X damage to target unit, where X is the amount of counters removed this way. Then put X durability counters on a Warrior weapon you control.",
          targets: [
            {
              id: "target-unit",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "modified-ability-result-amount",
                metric: "counters-removed",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "remove-counters-from-collection",
                collection: {
                  zones: ["field"],
                  player: "controller",
                },
                counter: "static",
                count: {
                  kind: "up-to",
                  amount: 3,
                },
                chooser: "controller",
                bindResultAs: "removed-static-counters",
              },
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "bound",
                  binding: "target-unit",
                },
                amount: {
                  kind: "modified-ability-result-amount",
                  metric: "counters-removed",
                },
              },
              {
                kind: "choose",
                selection: {
                  id: "warrior-weapon",
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
                          oneOf: ["WEAPON"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["WARRIOR"],
                        },
                      ],
                    },
                  },
                },
                effect: {
                  kind: "add-counter",
                  subject: {
                    kind: "bound",
                    binding: "warrior-weapon",
                  },
                  counter: "durability",
                  amount: {
                    kind: "modified-ability-result-amount",
                    metric: "counters-removed",
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

export default triboelectricFortification;
