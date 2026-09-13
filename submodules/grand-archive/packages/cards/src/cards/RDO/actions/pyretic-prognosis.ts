import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const pyreticPrognosis: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Q5HV9nWS5r",
  slug: "pyretic-prognosis",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Q5HV9nWS5r:face:default",
      catalogId: "Q5HV9nWS5r",
      name: "Pyretic Prognosis",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["EXALTED", "FIRE"],
      speed: "fast",
      stats: {},
      rulesText: "Draw three cards, then discard two cards. ",
      abilities: [
        {
          id: "Q5HV9nWS5r-a1",
          kind: "card-resolution",
          text: "Draw three cards, then discard two cards.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 3,
              },
              {
                kind: "discard",
                player: "controller",
                selection: {
                  id: "discarded-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 2,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["hand"],
                    relationship: "zone-of",
                    player: "controller",
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default pyreticPrognosis;
