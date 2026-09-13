import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const kongmingWaywardMaven: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "346vgwz3y4",
  slug: "kongming-wayward-maven",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "346vgwz3y4:face:default",
      catalogId: "346vgwz3y4",
      name: "Kongming, Wayward Maven",
      lineageName: "Kongming",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 1,
        life: 19,
      },
      rulesText:
        "On Enter: You gain the Shifting Currents mastery. (Players can only have one mastery. The Shifting Currents mastery has four modes: North, South, East, and West. Some cards benefit from certain directions of Shifting Currents. Starts in the North direction.)",
      abilities: [
        {
          id: "346vgwz3y4-a1",
          kind: "triggered",
          text: "On Enter: You gain the Shifting Currents mastery. (Players can only have one mastery. The Shifting Currents mastery has four modes: North, South, East, and West. Some cards benefit from certain directions of Shifting Currents. Starts in the North direction.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "gain-mastery",
            player: "controller",
            mastery: "Shifting Currents",
          },
        },
      ],
    },
  },
};

export default kongmingWaywardMaven;
