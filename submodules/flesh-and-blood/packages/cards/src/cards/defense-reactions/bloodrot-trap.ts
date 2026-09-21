import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/bloodrot-trap.generated.ts";

export const bloodrotTrap = definePitchFamily(fabPitchFamilies["bloodrot-trap"], {
  supertypeSets: [["Assassin"], ["Ranger"]],
  abilities: () => ({
    poxOnAttackerReaction: {
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
          type: "create-token",
          token: "bloodrot-pox",
          creator: "effect-controller",
          controller: "attacking-hero",
        },
      },
    },
  }),
});

export const { red: bloodrotTrapRed } = bloodrotTrap.cards;
