import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const protectiveHelm: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "l2ipxnctse",
  slug: "protective-helm",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "l2ipxnctse:face:default",
      catalogId: "l2ipxnctse",
      name: "Protective Helm",
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
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Unit Link (This object enters the field linked to target unit. If the link is broken, sacrifice this object.)\nIf damage would be dealt to linked unit from a distant source, prevent 1 of that damage.",
      abilities: [
        {
          id: "l2ipxnctse-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Unit Link (This object enters the field linked to target unit. If the link is broken, sacrifice this object.)\nIf damage would be dealt to linked unit from a distant source, prevent 1 of that damage.",
          keyword: {
            name: "link",
            target: "unit",
          },
        },
      ],
    },
  },
};

export default protectiveHelm;
