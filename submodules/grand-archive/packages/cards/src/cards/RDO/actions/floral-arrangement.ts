import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const floralArrangement: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dt4YncETqE",
  slug: "floral-arrangement",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dt4YncETqE:face:default",
      catalogId: "dt4YncETqE",
      name: "Floral Arrangement",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Summon a Silvershine and a Fraysia token.\n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "dt4YncETqE-a1",
          kind: "card-resolution",
          text: "Summon a Silvershine and a Fraysia token.",
          effect: {
            kind: "summon",
            object: "Silvershine and a Fraysia",
            controller: "controller",
            bindResultAs: "summoned-token",
          },
        },
        {
          id: "dt4YncETqE-a2",
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

export default floralArrangement;
