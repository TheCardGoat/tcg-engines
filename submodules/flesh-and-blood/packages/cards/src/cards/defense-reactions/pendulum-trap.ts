import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/pendulum-trap.generated.ts";

export const pendulumTrap = definePitchFamily(fabPitchFamilies["pendulum-trap"], {
  abilities: () => ({
    millTwoOnAttackerReaction: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
        state: {
          type: "has-status",
          status: "attack-reaction-played-or-activated-this-chain-link",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "move-card",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "attacking-hero",
            zones: ["deck"],
            position: "top",
            count: 2,
          },
          to: {
            zone: "graveyard",
          },
        },
      },
    },
  }),
});

export const { yellow: pendulumTrapYellow } = pendulumTrap.cards;
