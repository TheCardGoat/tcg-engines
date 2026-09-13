import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const featheryTune: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4hm8uzmf8v",
  slug: "feathery-tune",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4hm8uzmf8v:face:default",
      catalogId: "4hm8uzmf8v",
      name: "Feathery Tune",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL", "MELODY"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText: "Summon two Fledgling tokens.",
      abilities: [
        {
          id: "4hm8uzmf8v-a1",
          kind: "card-resolution",
          text: "Summon two Fledgling tokens.",
          effect: {
            kind: "summon",
            object: "Fledgling",
            controller: "controller",
            bindResultAs: "summoned-token",
            amount: 2,
          },
        },
      ],
    },
  },
};

export default featheryTune;
