import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const claimedFromBeyond: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "nzt7qILJSl",
  slug: "claimed-from-beyond",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "nzt7qILJSl:face:default",
      catalogId: "nzt7qILJSl",
      name: "Claimed From Beyond",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["CRUX"],
      speed: "fast",
      stats: {},
      rulesText:
        "Banish target non-champion object if one of its types matches one of the types among cards in your banishment. (Types include: ally, domain, item, phantasia, and weapon. Supertypes and subtypes are excluded.)",
      abilities: [
        {
          id: "nzt7qILJSl-a1",
          kind: "card-resolution",
          text: "Banish target non-champion object if one of its types matches one of the types among cards in your banishment. (Types include: ally, domain, item, phantasia, and weapon. Supertypes and subtypes are excluded.)",
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
                  kind: "not",
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                },
              },
            },
          ],
          effect: {
            kind: "banish-object",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
          },
        },
      ],
    },
  },
};

export default claimedFromBeyond;
