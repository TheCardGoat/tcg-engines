import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sigil-of-protection.generated.ts";
import { ward } from "../shared/keywords.ts";

export const sigilOfProtection = definePitchFamily(fabPitchFamilies["sigil-of-protection"], {
  parameters: pitchMap({
    red: { wardAmount: 4 },
    yellow: { wardAmount: 3 },
    blue: { wardAmount: 2 },
  }),
  keywords: pitchMap({ red: [ward(4)], yellow: [ward(3)], blue: [ward(2)] }),
  abilities: () => ({
    destroyAtActionPhase: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "action-phase-start",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "none" },
        },
      },
      resolution: { kind: "effect", effect: { type: "destroy", target: { selector: "self" } } },
    },
  }),
});

export const {
  red: sigilOfProtectionRed,
  yellow: sigilOfProtectionYellow,
  blue: sigilOfProtectionBlue,
} = sigilOfProtection.cards;
