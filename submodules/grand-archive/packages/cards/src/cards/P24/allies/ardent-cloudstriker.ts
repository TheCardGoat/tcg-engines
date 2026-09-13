import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ardentCloudstriker: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4kpotk5hvr",
  slug: "ardent-cloudstriker",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4kpotk5hvr:face:default",
      catalogId: "4kpotk5hvr",
      name: "Ardent Cloudstriker",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 3,
        life: 4,
      },
      rulesText:
        "On Attack: If your Shifting Currents face West and Ardent Cloudstriker is attacking a champion, this attack gets +3 POWER.",
      abilities: [
        {
          id: "4kpotk5hvr-a1",
          kind: "triggered",
          text: "On Attack: If your Shifting Currents face West and Ardent Cloudstriker is attacking a champion, this attack gets +3 POWER.",
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
            kind: "conditional",
            condition: {
              kind: "all",
              conditions: [
                {
                  kind: "player-state",
                  player: "controller",
                  state: {
                    named: "shifting-currents",
                    value: "West",
                  },
                },
                {
                  kind: "combat-relation",
                  relation: "attacking",
                  subject: {
                    kind: "source",
                  },
                  otherFilter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                },
              ],
            },
            then: {
              kind: "continuous",
              subjects: {
                kind: "current-attack",
              },
              affectedSet: "locked",
              duration: {
                kind: "this-attack",
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
                amount: 3,
              },
            },
          },
        },
      ],
    },
  },
};

export default ardentCloudstriker;
