import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/brandish.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const brandish = definePitchFamily(fabPitchFamilies["brandish"], {
  keywords: [goAgain],
  abilities: () => ({
    nextWeaponAttack: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "attack" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 1,
          target: { selector: "this-attack" },
          duration: "this-turn",
          appliesTo: { next: { typeBox: { types: ["Weapon"] } } },
        },
      },
    },
  }),
});

export const { red: brandishRed, yellow: brandishYellow, blue: brandishBlue } = brandish.cards;
