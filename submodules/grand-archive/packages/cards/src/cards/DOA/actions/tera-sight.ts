import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const teraSight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "2Ojrn7buPe",
  slug: "tera-sight",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "2Ojrn7buPe:face:default",
      catalogId: "2Ojrn7buPe",
      name: "Tera Sight",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["TERA"],
      speed: "fast",
      stats: {},
      rulesText:
        "Preserve (Put this card into its owner's material deck preserved as it resolves. As you materialize, you may instead return a preserved card to your hand.)\n\nDraw a card.",
      abilities: [
        {
          id: "2Ojrn7buPe-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Preserve (Put this card into its owner's material deck preserved as it resolves. As you materialize, you may instead return a preserved card to your hand.)",
          keyword: {
            name: "preserve",
          },
        },
        {
          id: "2Ojrn7buPe-a2",
          kind: "card-resolution",
          text: "Draw a card.",
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default teraSight;
