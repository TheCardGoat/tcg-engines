import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const returnToTheArchive: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "aIbBhTilEN",
  slug: "return-to-the-archive",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "aIbBhTilEN:face:default",
      catalogId: "aIbBhTilEN",
      name: "Return to the Archive",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "You may sacrifice a regalia. If you do, recover 2 and draw a card.\n\nFloating Memory",
      abilities: [
        {
          id: "aIbBhTilEN-a1",
          kind: "card-resolution",
          text: "You may sacrifice a regalia. If you do, recover 2 and draw a card.",
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "attempt",
                  effect: {
                    kind: "choose",
                    selection: {
                      id: "sacrificed-object",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: 1,
                      },
                      candidates: {
                        kind: "object",
                        zones: ["field"],
                        relationship: "controlled-by",
                        player: "controller",
                        filter: {
                          kind: "supertype",
                          oneOf: ["REGALIA"],
                        },
                      },
                    },
                    effect: {
                      kind: "sacrifice",
                      subject: {
                        kind: "bound",
                        binding: "sacrificed-object",
                      },
                    },
                  },
                  bindSucceededAs: "optional-action-succeeded",
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "optional-action-succeeded",
                  },
                  then: {
                    kind: "sequence",
                    effects: [
                      {
                        kind: "recover",
                        player: "controller",
                        amount: 2,
                      },
                      {
                        kind: "draw",
                        player: "controller",
                        amount: 1,
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
        {
          id: "aIbBhTilEN-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default returnToTheArchive;
