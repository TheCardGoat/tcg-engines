import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const welcomeMerriment: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "mUyzPPc0nc",
  slug: "welcome-merriment",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "mUyzPPc0nc:face:default",
      catalogId: "mUyzPPc0nc",
      name: "Welcome Merriment",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SKILL"],
      },
      elements: ["WIND"],
      speed: "slow",
      stats: {},
      rulesText:
        "For each player, that player may rest any amount of allies they control. Put a buff counter on each ally rested this way.\n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "mUyzPPc0nc-a1",
          kind: "card-resolution",
          text: "For each player, that player may rest any amount of allies they control. Put a buff counter on each ally rested this way.",
          effect: {
            kind: "for-each-player",
            players: "each-player",
            bindEachAs: "participating-player",
            effect: {
              kind: "choose",
              selection: {
                id: "rested-allies",
                kind: "choice",
                declared: "resolution",
                chooser: {
                  binding: "participating-player",
                },
                count: {
                  kind: "any-number",
                },
                unique: true,
                candidates: {
                  kind: "object",
                  zones: ["field"],
                  relationship: "controlled-by",
                  player: {
                    binding: "participating-player",
                  },
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY"],
                  },
                },
              },
              effect: {
                kind: "sequence",
                effects: [
                  {
                    kind: "rest",
                    subject: {
                      kind: "bound",
                      binding: "rested-allies",
                    },
                  },
                  {
                    kind: "add-counter",
                    subject: {
                      kind: "bound",
                      binding: "rested-allies",
                    },
                    counter: "buff",
                    amount: 1,
                  },
                ],
              },
            },
          },
        },
        {
          id: "mUyzPPc0nc-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default welcomeMerriment;
