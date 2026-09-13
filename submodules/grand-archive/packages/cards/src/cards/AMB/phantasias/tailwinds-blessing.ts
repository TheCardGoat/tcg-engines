import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tailwindsBlessing: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "oh5n2sjk0u",
  slug: "tailwinds-blessing",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "oh5n2sjk0u:face:default",
      catalogId: "oh5n2sjk0u",
      name: "Tailwind's Blessing",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "Whenever your Shifting Currents change from facing North to West, allies you control get +1 POWER until end of turn.",
      abilities: [
        {
          id: "oh5n2sjk0u-a1",
          kind: "triggered",
          text: "Whenever your Shifting Currents change from facing North to West, allies you control get +1 POWER until end of turn.",
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
            kind: "continuous",
            subjects: {
              kind: "each",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
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
              property: "power",
              operation: "add",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default tailwindsBlessing;
