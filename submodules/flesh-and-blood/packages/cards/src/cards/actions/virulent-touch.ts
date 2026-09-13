import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/virulent-touch.generated.ts";

export const virulentTouch = definePitchFamily(fabPitchFamilies["virulent-touch"], {
  supertypeSets: [["Assassin"], ["Ranger"]],
  abilities: () => ({
    continuousStaticRuleModification: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "play",
        filter: {
          playedFromZones: ["hand"],
        },
        duration: "permanent",
      },
    },
    triggeredStaticOnChainLinkResolveEffect: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "chain-link-resolve",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "none",
          },
        },
        state: {
          type: "has-status",
          status: "defended-by-card-from-hand",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "bloodrot-pox",
          controller: "defending-hero",
        },
      },
    },
  }),
});

export const {
  red: virulentTouchRed,
  yellow: virulentTouchYellow,
  blue: virulentTouchBlue,
} = virulentTouch.cards;
