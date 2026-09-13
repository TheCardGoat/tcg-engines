import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const frameworkSidearm: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "p4lgdlx7md",
  slug: "framework-sidearm",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "p4lgdlx7md:face:default",
      catalogId: "p4lgdlx7md",
      name: "Framework Sidearm",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "GUN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        durability: 1,
      },
      rulesText:
        "(Gun — Must be loaded to use for an attack and can’t be used with an attack card.)\n\n[Class Bonus] You may pay (3) to activate this card from your material deck.",
      abilities: [
        {
          id: "p4lgdlx7md-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Gun — Must be loaded to use for an attack and can’t be used with an attack card.)",
          keyword: {
            name: "gun",
          },
        },
        {
          id: "p4lgdlx7md-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] You may pay (3) to activate this card from your material deck.",
          functionalZones: ["material-deck"],
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
          effects: [
            {
              kind: "rule-modification",
              mode: "allow",
              action: "activate",
              subject: {
                kind: "source",
              },
              fromZone: "material-deck",
              cost: {
                kind: "pay-reserve",
                amount: 3,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default frameworkSidearm;
