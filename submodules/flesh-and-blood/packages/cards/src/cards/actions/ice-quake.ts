import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/ice-quake.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const iceQuake = definePitchFamily(fabPitchFamilies["ice-quake"], {
  parameters: { red: { amount: 3 }, yellow: { amount: 2 }, blue: { amount: 1 } },
  keywords: [goAgain],
  abilities: ({ amount }) => ({
    power: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount,
        target: { selector: "this-attack" },
        duration: "this-turn",
        appliesTo: { next: { typeBox: { subtypes: ["Attack"] } } },
      },
    },
    frostbite: {
      kind: "resolution",
      effect: {
        type: "delayed-trigger",
        trigger: {
          kind: "event",
          event: {
            name: "hit",
            actor: { kind: "any" },
            observes: {
              kind: "event-object",
              selector: "attack",
              relationship: { kind: "any" },
              filter: { typeBox: { subtypes: ["Attack"] } },
            },
            target: { kind: "hero" },
          },
        },
        policy: { kind: "windowed", duration: "this-turn", matching: "every" },
        resolution: {
          kind: "effect",
          effect: {
            type: "create-token",
            token: "frostbite",
            creator: "effect-controller",
            controller: "attack-target",
          },
        },
      },
    },
  }),
});

export const { red: iceQuakeRed, yellow: iceQuakeYellow, blue: iceQuakeBlue } = iceQuake.cards;
