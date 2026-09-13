import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const hydroguardRetainer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0qm7n87o4s",
  slug: "hydroguard-retainer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0qm7n87o4s:face:default",
      catalogId: "0qm7n87o4s",
      name: "Hydroguard Retainer",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "Taunt (While awake, this ally must be targeted before other units you control during your opponent's attack declarations if able.)\n\nWhenever your Shifting Currents change from facing North to West, draw a card.",
      abilities: [
        {
          id: "0qm7n87o4s-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Taunt (While awake, this ally must be targeted before other units you control during your opponent's attack declarations if able.)",
          keyword: {
            name: "taunt",
          },
        },
        {
          id: "0qm7n87o4s-a2",
          kind: "triggered",
          text: "Whenever your Shifting Currents change from facing North to West, draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "player-state-changed",
              actor: "controller",
              state: "shifting-currents",
              directionTransition: {
                from: "north",
                to: "west",
              },
            },
          },
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

export default hydroguardRetainer;
