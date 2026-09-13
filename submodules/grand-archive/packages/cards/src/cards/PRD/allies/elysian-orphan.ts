import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const elysianOrphan: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "RN7ueRDijA",
  slug: "elysian-orphan",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "RN7ueRDijA:face:default",
      catalogId: "RN7ueRDijA",
      name: "Elysian Orphan",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "ELYSIAN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 0,
        life: 2,
      },
      rulesText:
        "Elysian Aura (As long as you control an object with Elysian Aura, Aenean Spell cards you own activate and resolve as if your champion got +2 level. Does not stack.)\n\nStealth (This unit can’t be targeted by attacks unless permitted by true sight.)",
      abilities: [
        {
          id: "RN7ueRDijA-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Elysian Aura (As long as you control an object with Elysian Aura, Aenean Spell cards you own activate and resolve as if your champion got +2 level. Does not stack.)",
          keyword: {
            name: "elysian-aura",
          },
        },
        {
          id: "RN7ueRDijA-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Stealth (This unit can’t be targeted by attacks unless permitted by true sight.)",
          keyword: {
            name: "stealth",
          },
        },
      ],
    },
  },
};

export default elysianOrphan;
