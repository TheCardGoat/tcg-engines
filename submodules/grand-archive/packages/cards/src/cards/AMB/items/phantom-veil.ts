import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const phantomVeil: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fviga4cmti",
  slug: "phantom-veil",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fviga4cmti:face:default",
      catalogId: "fviga4cmti",
      name: "Phantom Veil",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "CLOAK"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Ally Link (This object enters the field linked to target ally. If the link is broken, sacrifice this object.)\n\n(2): Linked ally gains stealth until end of turn. (This unit can't be targeted by attacks unless permitted by true sight.)",
      abilities: [
        {
          id: "fviga4cmti-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ally Link (This object enters the field linked to target ally. If the link is broken, sacrifice this object.)",
          keyword: {
            name: "link",
            target: "ally",
          },
        },
        {
          id: "fviga4cmti-a2",
          kind: "activated",
          text: "(2): Linked ally gains stealth until end of turn. (This unit can't be targeted by attacks unless permitted by true sight.)",
          activation: "ability",
          cost: {
            kind: "pay-reserve",
            amount: 2,
          },
          effect: {
            kind: "continuous",
            subjects: {
              kind: "linked-object",
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
                name: "stealth",
              },
            },
          },
        },
      ],
    },
  },
};

export default phantomVeil;
