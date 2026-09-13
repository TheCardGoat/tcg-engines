import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const trineRecursion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dwZvL9K0Ke",
  slug: "trine-recursion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dwZvL9K0Ke:face:default",
      catalogId: "dwZvL9K0Ke",
      name: "Trine Recursion",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["ASTRA"],
      speed: "fast",
      stats: {},
      rulesText: "Put target card in a graveyard into its owner's deck third from the top.",
      abilities: [
        {
          id: "dwZvL9K0Ke-a1",
          kind: "card-resolution",
          text: "Put target card in a graveyard into its owner's deck third from the top.",
          targets: [
            {
              id: "target-card",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["graveyard"],
              },
            },
          ],
          effect: {
            kind: "move",
            subject: {
              kind: "bound",
              binding: "target-card",
            },
            from: "graveyard",
            destination: {
              zone: "main-deck",
              placement: {
                kind: "position-from-top",
                position: 3,
              },
            },
          },
        },
      ],
    },
  },
};

export default trineRecursion;
