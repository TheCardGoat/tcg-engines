import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const shiftingCurrents: GrandArchiveCard<
  GrandArchiveAbilityDefinition,
  "mastery-representation"
> = {
  canonicalId: "qh5mpkyl60",
  slug: "shifting-currents",
  definitionKind: "mastery-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "qh5mpkyl60:face:default",
      catalogId: "qh5mpkyl60",
      name: "Shifting Currents",
      cost: {
        kind: "none",
      },
      typeLine: {
        supertypes: [],
        types: ["MASTERY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: [],
      stats: {},
      rulesText:
        "[Kongming Bonus] At the beginning of your end phase, you may change the direction of your Shifting Currents to a different direction of your choice. (The directions are North, South, East, and West.)",
      abilities: [
        {
          id: "qh5mpkyl60-a1",
          kind: "triggered",
          text: "[Kongming Bonus] At the beginning of your end phase, you may change the direction of your Shifting Currents to a different direction of your choice. (The directions are North, South, East, and West.)",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
              actor: "controller",
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

export default shiftingCurrents;
