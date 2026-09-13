import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const crystalOfEmpowerment: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dmfoA7jOjy",
  slug: "crystal-of-empowerment",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dmfoA7jOjy:face:default",
      catalogId: "dmfoA7jOjy",
      name: "Crystal of Empowerment",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "CRYSTAL"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText: "Banish Crystal of Empowerment: Your champion gets +2 level until end of turn.",
      abilities: [
        {
          id: "dmfoA7jOjy-a1",
          kind: "activated",
          text: "Banish Crystal of Empowerment: Your champion gets +2 level until end of turn.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "continuous",
            subjects: {
              kind: "champion",
              player: "controller",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "E",
              modifies: "stat",
              sublayer: "modifier",
            },
            change: {
              kind: "numeric",
              property: "level",
              operation: "add",
              amount: 2,
            },
          },
        },
      ],
    },
  },
};

export default crystalOfEmpowerment;
