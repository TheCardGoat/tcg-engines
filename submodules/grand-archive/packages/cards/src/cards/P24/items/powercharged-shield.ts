import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const powerchargedShield: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rrii17fzcy",
  slug: "powercharged-shield",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "rrii17fzcy:face:default",
      catalogId: "rrii17fzcy",
      name: "Powercharged Shield",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SHIELD"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Banish Powercharged Shield: Target unit with taunt gains vigor until end of turn. (Units with vigor wake up at the beginning of your end phase.)",
      abilities: [
        {
          id: "rrii17fzcy-a1",
          kind: "activated",
          text: "Banish Powercharged Shield: Target unit with taunt gains vigor until end of turn. (Units with vigor wake up at the beginning of your end phase.)",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
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
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
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
                name: "vigor",
              },
            },
          },
        },
      ],
    },
  },
};

export default powerchargedShield;
