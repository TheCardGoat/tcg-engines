import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const imbueInFrost: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "QQaOgurnjX",
  slug: "imbue-in-frost",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "QQaOgurnjX:face:default",
      catalogId: "QQaOgurnjX",
      name: "Imbue in Frost",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SPELL"],
      },
      elements: ["WATER"],
      speed: "slow",
      stats: {},
      rulesText:
        "Target Sword weapon you control gets +2 POWER until end of turn. \n\n[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "QQaOgurnjX-a1",
          kind: "card-resolution",
          text: "Target Sword weapon you control gets +2 POWER until end of turn.",
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
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["WEAPON"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["SWORD"],
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "continuous",
            subjects: {
              kind: "bound",
              binding: "target-1",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "E",
              modifies: "stat",
              sublayer: "modifier",
            },
            change: {
              kind: "numeric",
              property: "power",
              operation: "add",
              amount: 2,
            },
          },
        },
        {
          id: "QQaOgurnjX-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
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
        },
      ],
    },
  },
};

export default imbueInFrost;
