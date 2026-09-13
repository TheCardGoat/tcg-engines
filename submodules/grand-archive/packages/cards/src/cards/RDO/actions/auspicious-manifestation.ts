import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const auspiciousManifestation: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vZH2xr4yq2",
  slug: "auspicious-manifestation",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vZH2xr4yq2:face:default",
      catalogId: "vZH2xr4yq2",
      name: "Auspicious Manifestation",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ULTIMATE", "SPELL"],
      },
      elements: ["LUXEM"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Guo Jia Bonus] Banish a Shenju ally you control. Return that ally to the field under its owner's control transformed at the beginning of the next end phase.\n\n[Guo Jia Bonus] (2), Discard this card from your hand: Draw a card. Then if your champion has five or less quest counters on them, put a quest counter on them.",
      abilities: [
        {
          id: "vZH2xr4yq2-a1",
          kind: "card-resolution",
          text: "[Guo Jia Bonus] Banish a Shenju ally you control. Return that ally to the field under its owner's control transformed at the beginning of the next end phase.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Guo Jia",
              },
            },
          ],
          effect: {
            kind: "choose",
            selection: {
              id: "shenju-ally",
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
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["SHENJU"],
                    },
                  ],
                },
              },
            },
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "banish-object",
                  subject: {
                    kind: "bound",
                    binding: "shenju-ally",
                  },
                },
                {
                  kind: "create-delayed-trigger",
                  trigger: {
                    kind: "event",
                    event: {
                      name: "phase-begins",
                      phase: "end",
                    },
                  },
                  limit: 1,
                  expires: {
                    kind: "until-end-of-next-phase",
                    phase: "end",
                  },
                  effect: {
                    kind: "move",
                    subject: {
                      kind: "bound",
                      binding: "shenju-ally",
                    },
                    from: "banishment",
                    destination: {
                      zone: "field",
                      face: "transformed",
                    },
                  },
                },
              ],
            },
          },
        },
        {
          id: "vZH2xr4yq2-a2",
          kind: "activated",
          text: "[Guo Jia Bonus] (2), Discard this card from your hand: Draw a card. Then if your champion has five or less quest counters on them, put a quest counter on them.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "discard-self",
              },
            ],
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Guo Jia",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "counter-count",
                      subject: {
                        kind: "champion",
                        player: "controller",
                      },
                      counter: {
                        named: "quest",
                      },
                    },
                    operator: "lte",
                    right: 5,
                  },
                },
                then: {
                  kind: "add-counter",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  counter: {
                    named: "quest",
                  },
                  amount: 1,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default auspiciousManifestation;
