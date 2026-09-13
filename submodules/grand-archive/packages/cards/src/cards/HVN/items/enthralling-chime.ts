import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const enthrallingChime: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "mhc5a9jpi6",
  slug: "enthralling-chime",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "mhc5a9jpi6:face:default",
      catalogId: "mhc5a9jpi6",
      name: "Enthralling Chime",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ACCESSORY"],
      },
      elements: ["TERA"],
      stats: {},
      rulesText:
        "[Diao Chan Bonus] (3), Banish Enthralling Chime: As a Spell, gain control of target ally with three or more wither counters on it.",
      abilities: [
        {
          id: "mhc5a9jpi6-a1",
          kind: "activated",
          text: "[Diao Chan Bonus] (3), Banish Enthralling Chime: As a Spell, gain control of target ally with three or more wither counters on it.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
              },
              {
                kind: "banish-self",
              },
            ],
          },
          targets: [
            {
              id: "target-ally",
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
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "numeric",
                      comparison: {
                        left: {
                          kind: "counter-count",
                          subject: {
                            kind: "candidate",
                          },
                          counter: "wither",
                        },
                        operator: "gte",
                        right: 3,
                      },
                    },
                  ],
                },
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Diao Chan",
              },
            },
          ],
          effect: {
            kind: "perform-as",
            sourceKind: "spell",
            effect: {
              kind: "change-control",
              subject: {
                kind: "bound",
                binding: "target-ally",
              },
              controller: "controller",
            },
          },
        },
      ],
    },
  },
};

export default enthrallingChime;
