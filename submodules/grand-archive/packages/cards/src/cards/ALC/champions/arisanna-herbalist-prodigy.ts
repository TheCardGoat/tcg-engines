import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const arisannaHerbalistProdigy: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "b31x97n2jn",
  slug: "arisanna-herbalist-prodigy",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "b31x97n2jn:face:default",
      catalogId: "b31x97n2jn",
      name: "Arisanna, Herbalist Prodigy",
      lineageName: "Arisanna",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 1,
        life: 19,
      },
      rulesText:
        "On Enter: Gather twice. (To gather, summon a Blightroot, Manaroot, Silvershine, Fraysia, Razorvine, or Springleaf token, chosen at random.)",
      abilities: [
        {
          id: "b31x97n2jn-a1",
          kind: "triggered",
          text: "On Enter: Gather twice. (To gather, summon a Blightroot, Manaroot, Silvershine, Fraysia, Razorvine, or Springleaf token, chosen at random.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "repeat",
            count: 2,
            effect: {
              kind: "keyword-action",
              action: "gather",
            },
          },
        },
      ],
    },
  },
};

export default arisannaHerbalistProdigy;
