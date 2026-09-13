import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ritaiBerserker: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "xrbffkghwt",
  slug: "ritai-berserker",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "xrbffkghwt:face:default",
      catalogId: "xrbffkghwt",
      name: "Ritai Berserker",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 1,
      },
      rulesText: "As long as your Shifting Currents face North, Ritai Berserker gets +1 POWER.",
      abilities: [
        {
          id: "xrbffkghwt-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as your Shifting Currents face North, Ritai Berserker gets +1 POWER.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "player-state",
                player: "controller",
                state: {
                  named: "shifting-currents",
                  value: "North",
                },
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
                amount: 1,
              },
            },
          ],
        },
      ],
    },
  },
};

export default ritaiBerserker;
