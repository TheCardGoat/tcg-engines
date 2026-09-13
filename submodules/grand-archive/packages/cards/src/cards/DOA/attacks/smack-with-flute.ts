import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const smackWithFlute: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zpkcFs72Ah",
  slug: "smack-with-flute",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zpkcFs72Ah:face:default",
      catalogId: "zpkcFs72Ah",
      name: "Smack with Flute",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "FLUTE"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
      },
      rulesText:
        "On Attack: Your champion gets +1 level until end of turn. \n\n[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "zpkcFs72Ah-a1",
          kind: "triggered",
          text: "On Attack: Your champion gets +1 level until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "continuous",
            subjects: {
              kind: "champion",
              player: "controller",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "E",
              modifies: "stat",
              sublayer: "modifier",
            },
            change: {
              kind: "numeric",
              property: "level",
              operation: "add",
              amount: 1,
            },
          },
        },
        {
          id: "zpkcFs72Ah-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
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
        },
      ],
    },
  },
};

export default smackWithFlute;
