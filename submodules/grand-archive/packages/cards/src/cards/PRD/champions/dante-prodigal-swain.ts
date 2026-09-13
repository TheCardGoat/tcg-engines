import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const danteProdigalSwain: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "apVtyt48u3",
  slug: "dante-prodigal-swain",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "apVtyt48u3:face:default",
      catalogId: "apVtyt48u3",
      name: "Dante, Prodigal Swain",
      lineageName: "Dante",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 1,
        life: 19,
      },
      rulesText: "On Enter: Summon an Elysian Test Subject token.",
      abilities: [
        {
          id: "apVtyt48u3-a1",
          kind: "triggered",
          text: "On Enter: Summon an Elysian Test Subject token.",
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
            kind: "summon",
            object: "Elysian Test Subject",
            controller: "controller",
            bindResultAs: "summoned-token",
          },
        },
      ],
    },
  },
};

export default danteProdigalSwain;
