import { stealth } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/kiss-of-death.generated.ts";

export const kissOfDeath = definePitchFamily(fabPitchFamilies["kiss-of-death"], {
  keywords: [stealth],
  abilities: () => ({
    hitsLose1Life: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
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
          type: "lose-life",
          amount: 1,
          target: {
            selector: "attack-target",
          },
        },
      },
    },
  }),
});

export const { red: kissOfDeathRed } = kissOfDeath.cards;
