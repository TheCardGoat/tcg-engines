import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/smashing-good-time.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const smashingGoodTime = definePitchFamily(fabPitchFamilies["smashing-good-time"], {
  parameters: pitchMap({
    red: { powerBonus: 3 },
    yellow: { powerBonus: 2 },
    blue: { powerBonus: 1 },
  }),
  keywords: [goAgain],
  abilities: ({ powerBonus }) => ({
    destroyItemOnHit: {
      kind: "resolution",
      effect: {
        type: "optional",
        effect: {
          type: "destroy",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "opponent",
            zones: ["permanent"],
            filter: { typeBox: { subtypes: ["Item"] }, cost: { op: "lte", value: 2 } },
            count: 1,
          },
        },
        appliesTo: nextAttackActionLatch(),
      },
    },
    empowerFromArsenal: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "play",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "played-card" },
          from: ["arsenal"],
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: powerBonus,
          target: { selector: "this-attack" },
          duration: "this-turn",
          appliesTo: nextAttackActionLatch(),
        },
      },
    },
  }),
});

export const {
  red: smashingGoodTimeRed,
  yellow: smashingGoodTimeYellow,
  blue: smashingGoodTimeBlue,
} = smashingGoodTime.cards;
