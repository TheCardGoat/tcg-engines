import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const nagasFang: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "n67ghdh1t6",
  slug: "nagas-fang",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "n67ghdh1t6:face:default",
      catalogId: "n67ghdh1t6",
      name: "Naga's Fang",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "DAGGER"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        durability: 1,
      },
      rulesText:
        "Remove a preparation counter from your champion: Naga's Fang gets +1 POWER until end of turn.",
      abilities: [
        {
          id: "n67ghdh1t6-a1",
          kind: "activated",
          text: "Remove a preparation counter from your champion: Naga's Fang gets +1 POWER until end of turn.",
          activation: "ability",
          cost: {
            kind: "remove-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: "preparation",
            amount: 1,
          },
          effect: {
            kind: "continuous",
            subjects: {
              kind: "source",
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
              property: "power",
              operation: "add",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default nagasFang;
