import { ward } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/flicker-reality.generated.ts";

export const flickerReality = definePitchFamily(fabPitchFamilies["flicker-reality"], {
  keywords: [ward(1)],
  abilities: () => ({
    whenLeavesArenaMayBanishAnotherLightningAuraPermanent: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "leave-arena",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "sequence",
            steps: [
              {
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
    },
  }),
});

export const { blue: flickerRealityBlue } = flickerReality.cards;
