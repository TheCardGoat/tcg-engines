import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/a-moment-s-peace.generated.ts";

export const aMomentSPeace = definePitchFamily(fabPitchFamilies["a-moment-s-peace"], {
  abilities: () => ({
    defend: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "defender" },
          defendedAttack: { typeBox: { subtypes: ["Sword"] } },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "rule-modification",
          mode: "restrict",
          action: "be-attacked",
          subject: { selector: "this-attack" },
          duration: "this-turn",
        },
      },
    },
  }),
});

export const { blue: aMomentSPeaceBlue } = aMomentSPeace.cards;
