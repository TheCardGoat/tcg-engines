import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/by-the-book.generated.ts";

export const byTheBook = definePitchFamily(fabPitchFamilies["by-the-book"], {
  abilities: () => ({
    ifHaveLessThanEachOtherHeroMayPlay: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "life-comparison",
        player: "self",
        vs: "each-other-hero",
        op: "lt",
      },
      playEffect: {
        role: "permission",
        fromZones: ["hand", "arsenal"],
        asType: "instant",
        optional: true,
      },
    },
    heroesCanTDrawDuringActionPhases: {
      kind: "resolution",
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "draw",
        filter: {
          typeBox: {
            types: ["Hero"],
          },
        },
        duration: "while-condition",
      },
    },
    atBeginningActionPhaseDestroy: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "action-phase-start",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "destroy",
          target: {
            selector: "self",
          },
        },
      },
    },
  }),
});
export const { blue: byTheBookBlue } = byTheBook.cards;
