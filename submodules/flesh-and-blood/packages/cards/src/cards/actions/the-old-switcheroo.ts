import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/the-old-switcheroo.generated.ts";

export const theOldSwitcheroo = definePitchFamily(fabPitchFamilies["the-old-switcheroo"], {
  abilities: () => ({
    instantDiscardNextTimeWouldClashWithHeroTurnInsteadRevealTop: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "discard-self",
      },
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "clash",
        },
        modification: {
          type: "swap-clash-reveals",
          prize: {
            type: "discard",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "opponent",
              zones: ["hand"],
              count: 1,
            },
          },
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { blue: theOldSwitcherooBlue } = theOldSwitcheroo.cards;
