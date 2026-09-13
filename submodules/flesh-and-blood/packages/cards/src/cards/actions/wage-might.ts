import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/wage-might.generated.ts";

export const wageMight = definePitchFamily(fabPitchFamilies["wage-might"], {
  supertypeSets: [["Brute"], ["Guardian"]],
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
            stake: "might",
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

export const { red: wageMightRed, yellow: wageMightYellow, blue: wageMightBlue } = wageMight.cards;
