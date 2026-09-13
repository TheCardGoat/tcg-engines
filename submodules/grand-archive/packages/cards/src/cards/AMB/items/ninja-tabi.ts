import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ninjaTabi: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "imcmo3l3th",
  slug: "ninja-tabi",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "imcmo3l3th:face:default",
      catalogId: "imcmo3l3th",
      name: "Ninja Tabi",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "BOOTS"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Banish Ninja Tabi: You gain agility 3 for this turn. Activate this ability only at slow speed. (Agility 3 — Return three cards from your memory to your hand at the beginning of the end phase.)",
      abilities: [
        {
          id: "imcmo3l3th-a1",
          kind: "activated",
          text: "Banish Ninja Tabi: You gain agility 3 for this turn. Activate this ability only at slow speed. (Agility 3 — Return three cards from your memory to your hand at the beginning of the end phase.)",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          speed: "slow",
          effect: {
            kind: "set-player-state",
            player: "controller",
            state: "agility",
            value: true,
            amount: 3,
            duration: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default ninjaTabi;
