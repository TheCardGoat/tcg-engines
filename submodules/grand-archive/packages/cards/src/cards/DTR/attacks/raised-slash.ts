import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const raisedSlash: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fuqfxq13uz",
  slug: "raised-slash",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fuqfxq13uz:face:default",
      catalogId: "fuqfxq13uz",
      name: "Raised Slash",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SUITED", "SWORD"],
      },
      elements: ["NORM"],
      stats: {
        power: 3,
      },
      rulesText:
        "[Class Bonus] On Attack: Put a buff counter on up to two target Suited allies you control. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "fuqfxq13uz-a1",
          kind: "triggered",
          text: "[Class Bonus] On Attack: Put a buff counter on up to two target Suited allies you control. (Apply this effect only if your champion's class matches this card's class.)",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
            kind: "choose",
            selection: {
              id: "counter-recipients",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 2,
              },
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["SUITED"],
                    },
                  ],
                },
              },
            },
            effect: {
              kind: "add-counter",
              subject: {
                kind: "bound",
                binding: "counter-recipients",
              },
              counter: "buff",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default raisedSlash;
