import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/good-natured-brutality.generated.ts";

/**
 * Model notes (hand-authored): printed "it gets +6{d}" refers to this
 * defending card (selector self). Generated binding "it" is never bound by
 * the defend trigger, so the bonus never applied.
 */
export const goodNaturedBrutality = definePitchFamily(fabPitchFamilies["good-natured-brutality"], {
  abilities: () => ({
    whenDefendsIfHaveNoHandGets6Crowd: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
        state: {
          type: "zone-count",
          zone: "hand",
          player: "controller",
          comparison: {
            op: "eq",
            value: 0,
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "modify-numeric",
              property: "defense",
              op: "add",
              amount: 6,
              target: {
                selector: "self",
              },
              duration: "this-turn",
            },
            {
              type: "crowd-cheers",
              target: "controller",
            },
          ],
        },
      },
      label: {
        name: "the-crowd-cheers",
      },
    },
  }),
});
export const { yellow: goodNaturedBrutalityYellow } = goodNaturedBrutality.cards;
