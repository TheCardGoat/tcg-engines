import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rotten-remains.generated.ts";

export const rottenRemains = definePitchFamily(fabPitchFamilies["rotten-remains"], {
  abilities: () => ({
    attacksBanish1PowerHerosGraveyardGets1PowerThenRepeatProcess: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "repeat",
          until: "declined",
          effect: {
            type: "optional",
            effect: {
              type: "for-each",
              target: {
                selector: "each-hero",
              },
              effect: {
                type: "banish",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "iteration-subject",
                  chooser: "controller",
                  zones: ["graveyard"],
                  filter: {
                    power: {
                      op: "eq",
                      value: 1,
                    },
                  },
                  count: 1,
                },
              },
            },
            then: {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 1,
              target: {
                selector: "self",
              },
              duration: "this-turn",
            },
          },
        },
      },
    },
  }),
});

export const { blue: rottenRemainsBlue } = rottenRemains.cards;
