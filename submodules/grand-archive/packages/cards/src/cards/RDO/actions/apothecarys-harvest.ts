import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const apothecarysHarvest: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "kJoyEo9Ls1",
  slug: "apothecarys-harvest",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "kJoyEo9Ls1:face:default",
      catalogId: "kJoyEo9Ls1",
      name: "Apothecary's Harvest",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SKILL"],
      },
      elements: ["EXALTED", "WIND"],
      speed: "slow",
      stats: {},
      rulesText:
        "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)\n\n[Arisanna Bonus] Fast Activation\n\nSummon a Blightroot, Manaroot, Silvershine, Fraysia, Razorvine, and a Springleaf token.",
      abilities: [
        {
          id: "kJoyEo9Ls1-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)",
          keyword: {
            name: "exalted",
          },
        },
        {
          id: "kJoyEo9Ls1-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Arisanna Bonus] Fast Activation",
          keyword: {
            name: "fast-activation",
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Arisanna",
              },
            },
          ],
        },
        {
          id: "kJoyEo9Ls1-a3",
          kind: "card-resolution",
          text: "Summon a Blightroot, Manaroot, Silvershine, Fraysia, Razorvine, and a Springleaf token.",
          effect: {
            kind: "summon",
            object: "Blightroot, Manaroot, Silvershine, Fraysia, Razorvine, and a Springleaf",
            controller: "controller",
            bindResultAs: "summoned-token",
          },
        },
      ],
    },
  },
};

export default apothecarysHarvest;
