import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const floodwardSergeant: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "64xGWbG9Xf",
  slug: "floodward-sergeant",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "64xGWbG9Xf:face:default",
      catalogId: "64xGWbG9Xf",
      name: "Floodward Sergeant",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Taunt (While awake, this ally must be targeted before other objects you control during your opponents’ attack declarations if able.)\n\nIf damage would be dealt to Floodward Sergeant, prevent that damage. Apply this replacement effect only once each turn.",
      abilities: [
        {
          id: "64xGWbG9Xf-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Taunt (While awake, this ally must be targeted before other objects you control during your opponents’ attack declarations if able.)",
          keyword: {
            name: "taunt",
          },
        },
        {
          id: "64xGWbG9Xf-a2",
          kind: "static",
          staticKind: "effects",
          text: "If damage would be dealt to Floodward Sergeant, prevent that damage. Apply this replacement effect only once each turn.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                recipient: {
                  kind: "source",
                },
              },
              operation: {
                kind: "prevent",
              },
              duration: {
                kind: "while-source-on-field",
              },
              limit: {
                count: 1,
                per: "turn",
              },
            },
          ],
        },
      ],
    },
  },
};

export default floodwardSergeant;
