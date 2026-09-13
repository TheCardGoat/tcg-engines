import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/wage-agility.generated.ts";

export const wageAgility = definePitchFamily(fabPitchFamilies["wage-agility"], {
  supertypeSets: [["Brute"], ["Warrior"]],

  abilities: () => ({
    createAgilityOnHit: {
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
            stake: "agility",
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
export const {
  red: wageAgilityRed,
  yellow: wageAgilityYellow,
  blue: wageAgilityBlue,
} = wageAgility.cards;
