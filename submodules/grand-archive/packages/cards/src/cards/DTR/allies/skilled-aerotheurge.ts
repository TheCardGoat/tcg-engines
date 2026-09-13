import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const skilledAerotheurge: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "58xpspudnf",
  slug: "skilled-aerotheurge",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "58xpspudnf:face:default",
      catalogId: "58xpspudnf",
      name: "Skilled Aerotheurge",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Ranged 2\n\nOn Hit: If Skilled Aerotheurge is distant, you may load target wind element Aethercharge card from your graveyard into an Aetherwing weapon you control.\n\n[Class Bonus] Floating Memory",
      abilities: [
        {
          id: "58xpspudnf-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 2",
          keyword: {
            name: "ranged",
            value: 2,
          },
        },
        {
          id: "58xpspudnf-a2",
          kind: "triggered",
          text: "On Hit: If Skilled Aerotheurge is distant, you may load target wind element Aethercharge card from your graveyard into an Aetherwing weapon you control.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
            },
          },
          targets: [
            {
              id: "target-card",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["graveyard"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "element",
                      oneOf: ["WIND"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["AETHERCHARGE"],
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "object-state",
              subject: {
                kind: "source",
              },
              state: "distant",
            },
            then: {
              kind: "optional",
              player: "controller",
              allOrNothing: true,
              effect: {
                kind: "choose",
                selection: {
                  id: "chosen-weapon",
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
                          oneOf: ["AETHERWING"],
                        },
                      ],
                    },
                  },
                },
                effect: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "target-card",
                  },
                  from: "graveyard",
                  destination: {
                    zone: "loaded",
                    host: {
                      kind: "bound",
                      binding: "chosen-weapon",
                    },
                  },
                },
              },
            },
          },
        },
        {
          id: "58xpspudnf-a3",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory",
          keyword: {
            name: "floating-memory",
          },
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
        },
      ],
    },
  },
};

export default skilledAerotheurge;
