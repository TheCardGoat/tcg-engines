import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const duxalProclamation: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "473gyf0w3v",
  slug: "duxal-proclamation",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "473gyf0w3v:face:default",
      catalogId: "473gyf0w3v",
      name: "Duxal Proclamation",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "ARTIFACT"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Banish Duxal Proclamation: Allies you control get +1 POWER until end of turn. Activate this ability only if each opponent controls no allies.",
      abilities: [
        {
          id: "473gyf0w3v-a1",
          kind: "activated",
          text: "Banish Duxal Proclamation: Allies you control get +1 POWER until end of turn. Activate this ability only if each opponent controls no allies.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          condition: {
            kind: "not",
            condition: {
              kind: "collection-exists",
              collection: {
                zones: ["field"],
                player: "each-opponent",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          },
          effect: {
            kind: "continuous",
            subjects: {
              kind: "each",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
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

export default duxalProclamation;
