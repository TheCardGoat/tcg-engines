import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sanctifiedPaladin: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ioLmt0S7op",
  slug: "sanctified-paladin",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ioLmt0S7op:face:default",
      catalogId: "ioLmt0S7op",
      name: "Sanctified Paladin",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 0,
        life: 1,
      },
      rulesText:
        "Foster\n\nAs long as Sanctified Paladin is fostered, it gets +3POWER and +3LIFE, and has vigor.\n\nOn Foster: Draw two cards.",
      abilities: [
        {
          id: "ioLmt0S7op-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Foster",
          keyword: {
            name: "foster",
          },
        },
        {
          id: "ioLmt0S7op-a2",
          kind: "static",
          staticKind: "effects",
          text: "As long as Sanctified Paladin is fostered, it gets +3POWER and +3LIFE, and has vigor.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "object-state",
                subject: {
                  kind: "source",
                },
                state: "fostered",
              },
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
                amount: 3,
              },
            },
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "object-state",
                subject: {
                  kind: "source",
                },
                state: "fostered",
              },
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
                property: "life",
                operation: "add",
                amount: 3,
              },
            },
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "object-state",
                subject: {
                  kind: "source",
                },
                state: "fostered",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "vigor",
                },
              },
            },
          ],
        },
        {
          id: "ioLmt0S7op-a3",
          kind: "triggered",
          text: "On Foster: Draw two cards.",
          trigger: {
            kind: "event",
            event: {
              name: "object-fostered",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 2,
          },
        },
      ],
    },
  },
};

export default sanctifiedPaladin;
