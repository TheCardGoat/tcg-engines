import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/concuss.generated.ts";

export const concuss = definePitchFamily(fabPitchFamilies["concuss"], {
  abilities: () => ({
    onHitDiscardPower: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "hit",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
          target: {
            kind: "hero",
          },
        },
        state: {
          type: "object-numeric-comparison",
          property: "power",
          left: "current",
          op: "gt",
          right: "base",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "discard",
          target: {
            selector: "attack-target",
          },
        },
      },
    },
  }),
});

export const { red: concussRed, yellow: concussYellow, blue: concussBlue } = concuss.cards;
