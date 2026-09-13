import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/wage-vigor.generated.ts";

export const wageVigor = definePitchFamily(fabPitchFamilies["wage-vigor"], {
  supertypeSets: [["Guardian"], ["Warrior"]],
  abilities: () => ({
    triggeredStaticOnAttackEffect: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
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
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "wager",
            stake: "vigor",
            with: {
              selector: "attack-target",
            },
          },
        },
      },
      label: {
        name: "wager",
      },
    },
  }),
});

export const { red: wageVigorRed, yellow: wageVigorYellow, blue: wageVigorBlue } = wageVigor.cards;
