import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const redirectOrbit: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Tst4WbM6O8",
  slug: "redirect-orbit",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Tst4WbM6O8:face:default",
      catalogId: "Tst4WbM6O8",
      name: "Redirect Orbit",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["ASTRA"],
      speed: "slow",
      stats: {},
      rulesText:
        "Shuffle any amount of cards from your hand and/or memory into your deck. Then draw that many cards into your memory. ",
      abilities: [
        {
          id: "Tst4WbM6O8-a1",
          kind: "card-resolution",
          text: "Shuffle any amount of cards from your hand and/or memory into your deck. Then draw that many cards into your memory.",
          effect: {
            kind: "choose",
            selection: {
              id: "shuffled-cards",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "any-number",
              },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["hand", "memory"],
                relationship: "zone-of",
                player: "controller",
              },
            },
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "shuffled-cards",
                  },
                  destination: {
                    zone: "main-deck",
                    placement: {
                      kind: "unordered",
                    },
                  },
                  bindResultAs: "shuffled-card-count",
                },
                {
                  kind: "shuffle",
                  player: "controller",
                  zone: "main-deck",
                },
                {
                  kind: "draw",
                  player: "controller",
                  amount: {
                    kind: "binding-count",
                    binding: "shuffled-card-count",
                  },
                  to: "memory",
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default redirectOrbit;
