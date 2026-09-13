import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const hauntingApparition: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "UtwWXmc0IU",
  slug: "haunting-apparition",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "UtwWXmc0IU:face:default",
      catalogId: "UtwWXmc0IU",
      name: "Haunting Apparition",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPECTER"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "As long as Haunting Apparition is ephemeral, it has stealth.\n\nEphemerate — (5) (You may activate this card from your graveyard by paying this cost. Ally cards played this way become ephemeral as they enter the field.)\n",
      abilities: [
        {
          id: "UtwWXmc0IU-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as Haunting Apparition is ephemeral, it has stealth.",
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
                state: "ephemeral",
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
                  name: "stealth",
                },
              },
            },
          ],
        },
        {
          id: "UtwWXmc0IU-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ephemerate — (5) (You may activate this card from your graveyard by paying this cost. Ally cards played this way become ephemeral as they enter the field.)",
          keyword: {
            name: "ephemerate",
            cost: {
              kind: "pay-reserve",
              amount: 5,
            },
          },
        },
      ],
    },
  },
};

export default hauntingApparition;
