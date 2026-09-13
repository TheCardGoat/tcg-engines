import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const awakenOmbre: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "OVoHxVwodU",
  slug: "awaken-ombre",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "OVoHxVwodU:face:default",
      catalogId: "OVoHxVwodU",
      name: "Awaken Ombre",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SPELL"],
      },
      elements: ["UMBRA"],
      speed: "slow",
      stats: {},
      rulesText:
        "As an additional cost to activate this card, pay (X+X).\n\n[Ciel Bonus] Put up to X target ally omens you have onto the field rested. For each ally put onto the field this way, wake up that ally if one of its non-norm elements matches one of your champion's elements.",
      abilities: [
        {
          id: "OVoHxVwodU-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, pay (X+X).",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "pay-reserve",
                amount: {
                  kind: "calculate",
                  operator: "add",
                  operands: [
                    {
                      kind: "variable",
                      symbol: "X",
                    },
                    {
                      kind: "variable",
                      symbol: "X",
                    },
                  ],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "OVoHxVwodU-a2",
          kind: "card-resolution",
          text: "[Ciel Bonus] Put up to X target ally omens you have onto the field rested. For each ally put onto the field this way, wake up that ally if one of its non-norm elements matches one of your champion's elements.",
          targets: [
            {
              id: "target-omens",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: {
                  kind: "variable",
                  symbol: "X",
                },
              },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["banishment"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "has-counter",
                      counter: "omen",
                    },
                  ],
                },
              },
            },
          ],
          variables: [
            {
              symbol: "X",
              kind: "chosen",
              minimum: 0,
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Ciel",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "target-omens",
                },
                from: "banishment",
                destination: {
                  zone: "field",
                },
              },
              {
                kind: "set-object-state",
                subject: {
                  kind: "bound",
                  binding: "target-omens",
                },
                state: "rested",
                value: true,
              },
              {
                kind: "for-each",
                collection: {
                  binding: "target-omens",
                },
                bindEachAs: "entered-omen",
                effect: {
                  kind: "conditional",
                  condition: {
                    kind: "shares-characteristic",
                    left: {
                      kind: "bound",
                      binding: "entered-omen",
                    },
                    right: {
                      kind: "champion",
                      player: "controller",
                    },
                    characteristic: "element",
                    exclude: ["NORM"],
                  },
                  then: {
                    kind: "wake",
                    subject: {
                      kind: "bound",
                      binding: "entered-omen",
                    },
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

export default awakenOmbre;
