import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const scarletTassel: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "swy2NJ4q6O",
  slug: "scarlet-tassel",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "swy2NJ4q6O:face:default",
      catalogId: "swy2NJ4q6O",
      name: "Scarlet Tassel",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "ACCESSORY"],
      },
      elements: ["EXIA"],
      stats: {},
      rulesText:
        "Regalia Link (This object enters the field linked to target regalia. If the link is broken, sacrifice this object.)\n\n(2), REST: Linked regalia gains omnishroud until end of turn. (An object with omnishroud can’t be targeted by activations, materializations, or triggers.)\n",
      abilities: [
        {
          id: "swy2NJ4q6O-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Regalia Link (This object enters the field linked to target regalia. If the link is broken, sacrifice this object.)",
          keyword: {
            name: "link",
            target: "regalia",
          },
        },
        {
          id: "swy2NJ4q6O-a2",
          kind: "activated",
          text: "(2), REST: Linked regalia gains omnishroud until end of turn. (An object with omnishroud can’t be targeted by activations, materializations, or triggers.)",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
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
                name: "omnishroud",
              },
            },
          },
        },
      ],
    },
  },
};

export default scarletTassel;
