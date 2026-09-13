import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/clash-of-arms.generated.ts";

export const clashOfArms = definePitchFamily(fabPitchFamilies["clash-of-arms"], {
  abilities: () => ({
    clashForArmEquipment: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "defended-attack",
            relationship: {
              kind: "any",
            },
            filter: {
              typeBox: {
                supertypes: ["Guardian"],
              },
            },
          },
          target: {
            kind: "any",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "clash",
              with: {
                selector: "attacking-hero",
              },
            },
            {
              type: "conditional",
              condition: {
                type: "or",
                conditions: [
                  { type: "has-status", status: "won-clash" },
                  { type: "has-status", status: "opponent-won-clash" },
                ],
              },
              then: {
                type: "conditional",
                condition: {
                  type: "control-object",
                  player: "loser",
                  zones: ["equipment-arms"],
                  filter: {
                    typeBox: {
                      types: ["Equipment"],
                    },
                  },
                },
                then: {
                  type: "add-counter",
                  counter: {
                    kind: "numeric",
                    value: -1,
                    property: "defense",
                  },
                  count: 1,
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "loser",
                    zones: ["equipment-arms"],
                    filter: {
                      typeBox: {
                        types: ["Equipment"],
                      },
                    },
                    count: 1,
                  },
                },
                else: {
                  type: "lose-life",
                  amount: 1,
                  target: {
                    selector: "hero",
                    who: "loser",
                  },
                },
              },
            },
          ],
        },
      },
      label: {
        name: "clash",
      },
    },
  }),
});

export const { yellow: clashOfArmsYellow } = clashOfArms.cards;
