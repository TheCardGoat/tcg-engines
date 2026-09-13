import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const loadedThoughts: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "hh88rx6p3p",
  slug: "loaded-thoughts",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "hh88rx6p3p:face:default",
      catalogId: "hh88rx6p3p",
      name: "Loaded Thoughts",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "GUN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        durability: 3,
      },
      rulesText:
        "(Gun — Must be loaded to use for an attack and can’t be used with an attack card.)\n\n[Class Bonus] Whenever Loaded Thoughts becomes loaded, you may put the top card of your deck into your graveyard.",
      abilities: [
        {
          id: "hh88rx6p3p-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Gun — Must be loaded to use for an attack and can’t be used with an attack card.)",
          keyword: {
            name: "gun",
          },
        },
        {
          id: "hh88rx6p3p-a2",
          kind: "triggered",
          text: "[Class Bonus] Whenever Loaded Thoughts becomes loaded, you may put the top card of your deck into your graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "card-loaded",
              subject: {
                kind: "source",
              },
            },
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
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "mill",
              player: "controller",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default loadedThoughts;
