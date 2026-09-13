import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const teasingAerocharge: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6lkv3tu69l",
  slug: "teasing-aerocharge",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6lkv3tu69l:face:default",
      catalogId: "6lkv3tu69l",
      name: "Teasing Aerocharge",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "AETHERCHARGE", "SPELL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {
        power: 1,
      },
      rulesText:
        "Suppress target ally. (To suppress an object, banish it and return it to the field under its owner’s control at the beginning of the next end phase.)\n\nThen you may load Teasing Aerocharge into an Aetherwing weapon you control.",
      abilities: [
        {
          id: "6lkv3tu69l-a1",
          kind: "card-resolution",
          text: "Suppress target ally. (To suppress an object, banish it and return it to the field under its owner’s control at the beginning of the next end phase.)",
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
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "keyword-action",
            action: "suppress",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
          },
        },
        {
          id: "6lkv3tu69l-a2",
          kind: "ability-modifier",
          text: "Then you may load Teasing Aerocharge into an Aetherwing weapon you control.",
          modifies: {
            kind: "preceding-non-modifier-ability",
          },
          operation: {
            kind: "append-effect",
            effect: {
              kind: "optional",
              player: "controller",
              allOrNothing: true,
              effect: {
                kind: "choose",
                selection: {
                  id: "chosen-aetherwing-weapon",
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
                          kind: "has-keyword",
                          keyword: "aetherwing",
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
                      binding: "chosen-aetherwing-weapon",
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default teasingAerocharge;
