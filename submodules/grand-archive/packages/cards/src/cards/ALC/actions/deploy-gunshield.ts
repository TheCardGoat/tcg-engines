import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const deployGunshield: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "bjvwbcizm6",
  slug: "deploy-gunshield",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "bjvwbcizm6:face:default",
      catalogId: "bjvwbcizm6",
      name: "Deploy Gunshield",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Target Gun weapon you control gains spellshroud until end of turn. (Objects with spellshroud can't be targeted by Spells.)\n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.) ",
      abilities: [
        {
          id: "bjvwbcizm6-a1",
          kind: "card-resolution",
          text: "Target Gun weapon you control gains spellshroud until end of turn. (Objects with spellshroud can't be targeted by Spells.)",
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
                      oneOf: ["GUN"],
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
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-keyword",
              keyword: {
                name: "spellshroud",
              },
            },
          },
        },
        {
          id: "bjvwbcizm6-a2",
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

export default deployGunshield;
