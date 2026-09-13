import { goAgain, ward } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/fleeing-starbreeze.generated.ts";

export const fleeingStarbreeze = definePitchFamily(fabPitchFamilies["fleeing-starbreeze"], {
  keywords: [ward(1)],
  abilities: () => ({
    whenEntersArenaUp1TargetAttackGetsGo: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "enter-arena",
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
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: goAgain,
          },
          target: {
            selector: "object",
            declared: "on-stack",
            zones: ["combat-chain"],
            filter: {
              typeBox: {
                subtypes: ["Attack"],
              },
            },
            count: { type: "up-to", amount: 1 },
          },
          duration: "this-turn",
          outputBinding: "it",
        },
      },
    },
  }),
});

export const { blue: fleeingStarbreezeBlue } = fleeingStarbreeze.cards;
