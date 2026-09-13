import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const stiflingAethercharge: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "bYrLVjKSCL",
  slug: "stifling-aethercharge",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "bYrLVjKSCL:face:default",
      catalogId: "bYrLVjKSCL",
      name: "Stifling Aethercharge",
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
        "Negate all on enter triggers from target ally. \n\nYou may load Stifling Aethercharge into an Aetherwing weapon you control.",
      abilities: [
        {
          id: "bYrLVjKSCL-a1",
          kind: "card-resolution",
          text: "Negate all on enter triggers from target ally.",
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
            kind: "negate-triggered-abilities",
            source: {
              kind: "bound",
              binding: "target-1",
            },
            triggerEvent: "object-entered-field",
          },
        },
        {
          id: "bYrLVjKSCL-a2",
          kind: "card-resolution",
          text: "You may load Stifling Aethercharge into an Aetherwing weapon you control.",
          effect: {
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
        },
      ],
    },
  },
};

export default stiflingAethercharge;
