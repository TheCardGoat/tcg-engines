import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fortifyingManashot: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7uveu3avvg",
  slug: "fortifying-manashot",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7uveu3avvg:face:default",
      catalogId: "7uveu3avvg",
      name: "Fortifying Manashot",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "AETHERCHARGE", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {
        power: 1,
      },
      rulesText:
        "Put two durability counters on target Aetherwing weapon you control. Then you may load Fortifying Manashot into an Aetherwing weapon you control.",
      abilities: [
        {
          id: "7uveu3avvg-a1",
          kind: "card-resolution",
          text: "Put two durability counters on target Aetherwing weapon you control. Then you may load Fortifying Manashot into an Aetherwing weapon you control.",
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
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "add-counter",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                counter: "durability",
                amount: 2,
              },
              {
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
                    unique: true,
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
                      kind: "source",
                    },
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
            ],
          },
        },
      ],
    },
  },
};

export default fortifyingManashot;
