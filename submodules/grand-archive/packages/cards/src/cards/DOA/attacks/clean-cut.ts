import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cleanCut: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "71i7d3JB9A",
  slug: "clean-cut",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "71i7d3JB9A:face:default",
      catalogId: "71i7d3JB9A",
      name: "Clean Cut",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
      },
      rulesText:
        "[Level 2+] On Kill: Draw a card. (Apply this effect only if your champion is level 2 or higher.)",
      abilities: [
        {
          id: "71i7d3JB9A-a1",
          kind: "triggered",
          text: "[Level 2+] On Kill: Draw a card. (Apply this effect only if your champion is level 2 or higher.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-killed",
              subject: {
                kind: "source",
              },
            },
          },
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
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default cleanCut;
