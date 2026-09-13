import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const marchOn: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zuAmYGyCcL",
  slug: "march-on",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zuAmYGyCcL:face:default",
      catalogId: "zuAmYGyCcL",
      name: "March On",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "CHESSMAN", "COMMAND"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
      },
      rulesText:
        "Command Chessman (A Chessman ally you control performs this attack.)\n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "zuAmYGyCcL-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Command Chessman (A Chessman ally you control performs this attack.)",
          keyword: {
            name: "command",
            subtype: "Chessman",
          },
        },
        {
          id: "zuAmYGyCcL-a2",
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

export default marchOn;
