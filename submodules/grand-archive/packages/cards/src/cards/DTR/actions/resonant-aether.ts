import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const resonantAether: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3ppahdhe7g",
  slug: "resonant-aether",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3ppahdhe7g:face:default",
      catalogId: "3ppahdhe7g",
      name: "Resonant Aether",
      cost: {
        kind: "reserve",
        amount: 1,
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
        "[Level 2+] Resonant Aether gets +1POWER.\n\nLoad Resonant Aether into an Aetherwing weapon you control.",
      abilities: [
        {
          id: "3ppahdhe7g-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Level 2+] Resonant Aether gets +1POWER.",
          restrictions: [
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 2,
                },
              },
            },
          ],
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "power",
                operation: "add",
                amount: 1,
              },
            },
          ],
        },
        {
          id: "3ppahdhe7g-a2",
          kind: "card-resolution",
          text: "Load Resonant Aether into an Aetherwing weapon you control.",
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
};

export default resonantAether;
