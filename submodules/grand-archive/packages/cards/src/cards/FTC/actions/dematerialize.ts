import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dematerialize: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "b1k0zi5h8a",
  slug: "dematerialize",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "b1k0zi5h8a:face:default",
      catalogId: "b1k0zi5h8a",
      name: "Dematerialize",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["WIND"],
      speed: "slow",
      stats: {},
      rulesText: "Return target regalia to its owner's material deck.",
      abilities: [
        {
          id: "b1k0zi5h8a-a1",
          kind: "card-resolution",
          text: "Return target regalia to its owner's material deck.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "supertype",
                  oneOf: ["REGALIA"],
                },
              },
            },
          ],
          effect: {
            kind: "move",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            destination: {
              zone: "material-deck",
            },
          },
        },
      ],
    },
  },
};

export default dematerialize;
