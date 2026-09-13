import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const epicureanInstitute: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "axxaUOWHA3",
  slug: "epicurean-institute",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "axxaUOWHA3:face:default",
      catalogId: "axxaUOWHA3",
      name: "Epicurean Institute",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["DOMAIN"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SIEGEABLE", "LABORATORY"],
      },
      elements: ["NORM"],
      stats: {
        durability: 3,
      },
      rulesText:
        "(Siegeable — This domain can be attacked. It takes damage in the form of removing durability counters.)\n\nAt the beginning of your recollection phase, sacrifice Epicurean Institute and draw a card.\n\nOn Destroy: Summon an Elysian Test Subject token.",
      abilities: [
        {
          id: "axxaUOWHA3-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Siegeable — This domain can be attacked. It takes damage in the form of removing durability counters.)",
          keyword: {
            name: "siegeable",
          },
        },
        {
          id: "axxaUOWHA3-a2",
          kind: "triggered",
          text: "At the beginning of your recollection phase, sacrifice Epicurean Institute and draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "sacrifice",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
            ],
          },
        },
        {
          id: "axxaUOWHA3-a3",
          kind: "triggered",
          text: "On Destroy: Summon an Elysian Test Subject token.",
          trigger: {
            kind: "event",
            event: {
              name: "object-destroyed",
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

export default epicureanInstitute;
