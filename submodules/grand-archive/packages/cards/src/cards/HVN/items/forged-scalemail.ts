import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const forgedScalemail: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7lr2jiu66i",
  slug: "forged-scalemail",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7lr2jiu66i:face:default",
      catalogId: "7lr2jiu66i",
      name: "Forged Scalemail",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "ARMOR"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Unit Link (This object enters the field linked to target unit. If the link is broken, sacrifice this object.)\nIf damage would be dealt to linked unit, you may banish Forged Scalemail. If you do, prevent 2 of that damage and draw a card.",
      abilities: [
        {
          id: "7lr2jiu66i-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Unit Link (This object enters the field linked to target unit. If the link is broken, sacrifice this object.)\nIf damage would be dealt to linked unit, you may banish Forged Scalemail. If you do, prevent 2 of that damage and draw a card.",
          keyword: {
            name: "link",
            target: "unit",
          },
        },
      ],
    },
  },
};

export default forgedScalemail;
