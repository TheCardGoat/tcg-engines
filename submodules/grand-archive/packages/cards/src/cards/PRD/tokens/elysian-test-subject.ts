import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const elysianTestSubject: GrandArchiveCard<
  GrandArchiveAbilityDefinition,
  "token-representation"
> = {
  canonicalId: "3DCP7WmBpx",
  slug: "elysian-test-subject",
  definitionKind: "token-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "3DCP7WmBpx:face:default",
      catalogId: "3DCP7WmBpx",
      name: "Elysian Test Subject",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ELYSIAN", "HUMAN"],
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
          id: "3DCP7WmBpx-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Elysian Aura (As long as you control an object with Elysian Aura, Aenean Spell cards you own activate and resolve as if your champion got +2 level. Does not stack.)",
          keyword: {
            name: "elysian-aura",
          },
        },
        {
          id: "3DCP7WmBpx-a2",
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

export default elysianTestSubject;
