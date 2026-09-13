import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/hunted-or-hunter.generated.ts";

export const huntedOrHunter = definePitchFamily(fabPitchFamilies["hunted-or-hunter"], {
  abilities: () => ({
    punishAttackReaction: {
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
          status: "attacking-hero-played-or-activated-this-chain-link-attack-reaction",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "lose-life",
          amount: 1,
          target: {
            selector: "attacking-hero",
          },
        },
      },
    },
  }),
});

export const { red: huntedOrHunterRed } = huntedOrHunter.cards;
