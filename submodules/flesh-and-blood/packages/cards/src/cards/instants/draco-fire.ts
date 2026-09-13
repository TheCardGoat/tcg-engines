import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/draco-fire.generated.ts";

export const dracoFire = definePitchFamily(fabPitchFamilies["draco-fire"], {
  abilities: () => ({
    nextDraconicAttackTurnGets2CostsLessPlay: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 2,
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  supertypes: ["Draconic"],
                },
              },
            },
          },
          {
            type: "modify-numeric",
            property: "cost",
            op: "subtract",
            amount: 1,
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  supertypes: ["Draconic"],
                },
              },
            },
          },
        ],
      },
    },
    atStartTurnMayBanish2NamedDracoFire: {
      kind: "static",
      staticKind: "triggered",
      functionalZones: ["graveyard"],
      trigger: {
        kind: "event-and-state",
        event: {
          name: "start-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
        state: {
          type: "has-status",
          status: "in-your-graveyard",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "banish",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["graveyard"],
              filter: {
                name: "Draco Fire",
              },
              count: 2,
            },
          },
          then: {
            type: "gain-resources",
            amount: 1,
          },
        },
      },
    },
  }),
});

export const { red: dracoFireRed } = dracoFire.cards;
