import { comboResolution } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/hurricane-technique.generated.ts";

import { combo, goAgain } from "../shared/keywords.ts";

export const hurricaneTechnique = definePitchFamily(fabPitchFamilies["hurricane-technique"], {
  keywords: [goAgain, combo],
  abilities: () => ({
    risingKneeThrustLastAttackCombatChainHurricaneTechniqueGains1PowerGoAgainHurricaneTechniqueHitsPutHand:
      comboResolution({
        names: ["Rising Knee Thrust"],
        effect: {
          type: "sequence",
          steps: [
            {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 1,
              target: {
                selector: "self",
              },
              duration: "this-turn",
            },
            {
              type: "grant-property",
              property: {
                kind: "keyword",
                keyword: goAgain,
              },
              target: {
                selector: "self",
              },
              duration: "this-turn",
            },
            {
              type: "grant-property",
              property: {
                kind: "ability",
                ability: {
                  kind: "static",
                  staticKind: "triggered",
                  id: "hitsPutHand",
                  text: "",
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
                    },
                  },
                  resolution: {
                    kind: "effect",
                    effect: {
                      type: "move-card",
                      target: {
                        selector: "self",
                      },
                      to: {
                        zone: "hand",
                      },
                    },
                  },
                },
              },
              target: {
                selector: "self",
              },
              duration: "this-turn",
            },
          ],
        },
      }),
  }),
});

export const { yellow: hurricaneTechniqueYellow } = hurricaneTechnique.cards;
