import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/humble.generated.ts";

export const humble = definePitchFamily(fabPitchFamilies["humble"], {
  abilities: () => ({
    loseHeroAbilities: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "attack" },
          target: { kind: "hero" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "rule-modification",
          mode: "restrict",
          action: "lose-abilities",
          filter: { typeBox: { types: ["Hero"] } },
          subject: { selector: "attack-target" },
          duration: "until-end-of-their-next-turn",
        },
      },
    },
  }),
});

export const { red: humbleRed, yellow: humbleYellow, blue: humbleBlue } = humble.cards;
