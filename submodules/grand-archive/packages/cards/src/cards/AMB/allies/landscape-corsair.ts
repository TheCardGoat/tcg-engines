import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const landscapeCorsair: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "racxis1ji8",
  slug: "landscape-corsair",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "racxis1ji8:face:default",
      catalogId: "racxis1ji8",
      name: "Landscape Corsair",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "[Kongming Bonus] On Enter: You may change the direction of your Shifting Currents to a different direction of your choice. (Apply this effect only if your champion is Kongming.)",
      abilities: [
        {
          id: "racxis1ji8-a1",
          kind: "triggered",
          text: "[Kongming Bonus] On Enter: You may change the direction of your Shifting Currents to a different direction of your choice. (Apply this effect only if your champion is Kongming.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Kongming",
              },
            },
          ],
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "choose-direction",
              player: "controller",
              state: "shifting-currents",
              directions: ["north", "east", "south", "west"],
              differentFromCurrent: true,
            },
          },
        },
      ],
    },
  },
};

export default landscapeCorsair;
