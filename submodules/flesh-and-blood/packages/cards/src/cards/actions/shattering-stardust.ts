import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/shattering-stardust.generated.ts";
import { fragment } from "../shared/keywords.ts";

export const shatteringStardust = definePitchFamily(fabPitchFamilies["shattering-stardust"], {
  keywords: [
    {
      name: "amp",
      value: 1,
    },
    fragment,
  ],
  abilities: () => ({
    wheneverFragmentsAmpNumber1: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "fragment",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "object",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "amp",
          amount: 1,
        },
      },
    },
    whenHitsHeroBanishLightningAuraPermanentControlWithNoHoloCounters: {
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
          type: "sequence",
          steps: [
            {
              type: "optional",
              effect: {
                type: "banish",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["permanent"],
                  filter: {
                    typeBox: {
                      supertypes: ["Lightning"],
                      subtypes: ["Aura"],
                    },
                    lacksCounter: "holo",
                  },
                  count: 1,
                },
                outputBinding: "it",
              },
            },
            {
              type: "sequence",
              steps: [
                {
                  type: "move-card",
                  target: {
                    selector: "binding",
                    binding: "it",
                  },
                  to: {
                    zone: "permanent",
                  },
                },
                {
                  type: "add-counter",
                  counter: {
                    kind: "named",
                    name: "holo",
                  },
                  count: 1,
                  target: {
                    selector: "binding",
                    binding: "it",
                  },
                },
              ],
            },
          ],
        },
      },
    },
  }),
});

export const { red: shatteringStardustRed } = shatteringStardust.cards;
