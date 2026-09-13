import { crushAbility } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/renounce-grandeur.generated.ts";

export const renounceGrandeur = definePitchFamily(fabPitchFamilies["renounce-grandeur"], {
  abilities: () => ({
    defendingControlsAuraTokenGets1Power: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "control-object",
        player: "defending-hero",
        filter: {
          typeBox: {
            metatypes: ["Token"],
            subtypes: ["Aura"],
          },
        },
      },
      effect: {
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
    deals4MoreDamageCantCreateAuraTokensDuringNextTurn: crushAbility({
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "create",
        subject: {
          selector: "attack-target",
        },
        filter: {
          typeBox: {
            metatypes: ["Token"],
            subtypes: ["Aura"],
          },
        },
        duration: "until-end-of-their-next-turn",
      },
    }),
  }),
});

export const { red: renounceGrandeurRed } = renounceGrandeur.cards;
