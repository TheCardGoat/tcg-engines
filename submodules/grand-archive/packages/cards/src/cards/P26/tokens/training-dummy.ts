import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const trainingDummy: GrandArchiveCard<
  GrandArchiveAbilityDefinition,
  "token-representation"
> = {
  canonicalId: "EeFXEYMmF3",
  slug: "training-dummy",
  definitionKind: "token-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "EeFXEYMmF3:face:default",
      catalogId: "EeFXEYMmF3",
      name: "Training Dummy",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "CONSTRUCT"],
      },
      elements: ["NORM"],
      stats: {
        power: 0,
        life: 2,
      },
      rulesText: "Training Dummy can't attack.",
      abilities: [
        {
          id: "EeFXEYMmF3-a1",
          kind: "static",
          staticKind: "effects",
          text: "Training Dummy can't attack.",
          effects: [
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "attack",
              subject: {
                kind: "source",
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

export default trainingDummy;
