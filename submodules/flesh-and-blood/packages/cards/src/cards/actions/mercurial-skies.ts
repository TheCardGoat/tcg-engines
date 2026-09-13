import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/mercurial-skies.generated.ts";
import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { goAgain } from "../shared/keywords.ts";

export const mercurialSkies = definePitchFamily(fabPitchFamilies["mercurial-skies"], {
  parameters: {
    red: { arcaneDamage: 3 },
    yellow: { arcaneDamage: 2 },
    blue: { arcaneDamage: 1 },
  },
  keywords: [goAgain],
  abilities: ({ arcaneDamage }) => ({
    sequenceGrantPropertyThisTurnGrantPropertyTriggeredDealtDamageOptionalDestroyLightningFlowDealDamageThisTurn:
      {
        kind: "resolution",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "grant-property",
              property: {
                kind: "keyword",
                keyword: goAgain,
              },
              target: {
                selector: "this-attack",
              },
              duration: "this-turn",
              appliesTo: nextAttackActionLatch({
                or: [
                  {
                    typeBox: {
                      supertypes: ["Runeblade"],
                    },
                  },
                  {
                    typeBox: {
                      supertypes: ["Lightning"],
                    },
                  },
                ],
              }),
            },
            {
              type: "grant-property",
              property: {
                kind: "ability",
                ability: {
                  kind: "static",
                  staticKind: "triggered",
                  id: "triggeredDealtDamageOptionalDestroyLightningFlowDealDamage",
                  text: "",
                  trigger: {
                    kind: "event",
                    event: {
                      name: "dealt-damage",
                      actor: {
                        kind: "any",
                      },
                      observes: {
                        kind: "none",
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
                        type: "destroy",
                        target: {
                          selector: "object",
                          declared: "at-resolution",
                          player: "controller",
                          zones: ["permanent"],
                          filter: {
                            name: "Lightning Flow",
                          },
                          count: 1,
                        },
                      },
                      then: {
                        type: "deal-damage",
                        damageType: "arcane",
                        amount: arcaneDamage,
                        target: {
                          selector: "attack-target",
                        },
                      },
                    },
                  },
                  limit: {
                    count: 1,
                    per: "turn",
                    ordinals: [1],
                  },
                },
              },
              target: {
                selector: "this-attack",
              },
              duration: "this-turn",
              appliesTo: nextAttackActionLatch({
                or: [
                  {
                    typeBox: {
                      supertypes: ["Runeblade"],
                    },
                  },
                  {
                    typeBox: {
                      supertypes: ["Lightning"],
                    },
                  },
                ],
              }),
            },
          ],
        },
      },
  }),
});

export const {
  red: mercurialSkiesRed,
  yellow: mercurialSkiesYellow,
  blue: mercurialSkiesBlue,
} = mercurialSkies.cards;
