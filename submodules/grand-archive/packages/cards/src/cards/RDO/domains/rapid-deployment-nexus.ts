import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const rapidDeploymentNexus: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "AGXBh74UEp",
  slug: "rapid-deployment-nexus",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "AGXBh74UEp:face:default",
      catalogId: "AGXBh74UEp",
      name: "Rapid Deployment Nexus",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["DOMAIN"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SIEGEABLE", "SPIRE"],
      },
      elements: ["NEOS"],
      stats: {
        durability: 9,
      },
      rulesText:
        "(Siegeable — This domain can be attacked. It takes damage in the form of removing durability counters.)\n\n[Class Bonus] REST, Remove three durability counters from Rapid Deployment Nexus: Wake up another target domain.",
      abilities: [
        {
          id: "AGXBh74UEp-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Siegeable — This domain can be attacked. It takes damage in the form of removing durability counters.)",
          keyword: {
            name: "siegeable",
          },
        },
        {
          id: "AGXBh74UEp-a2",
          kind: "activated",
          text: "[Class Bonus] REST, Remove three durability counters from Rapid Deployment Nexus: Wake up another target domain.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "remove-counter",
                subject: {
                  kind: "source",
                },
                counter: "durability",
                amount: 3,
              },
            ],
          },
          targets: [
            {
              id: "target-1",
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
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["DOMAIN"],
                    },
                    {
                      kind: "not-source",
                    },
                  ],
                },
              },
            },
          ],
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
            kind: "wake",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
          },
        },
      ],
    },
  },
};

export default rapidDeploymentNexus;
