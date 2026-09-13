import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/iris-of-reality.generated.ts";

export const irisOfReality = defineCard(fabCardIdentitiesByCanonicalId["W8h8fMQhbjGr6hzDbFmq7"], {
  abilities: {
    duringActionPhaseIllusionistAurasWeapons4PowerOncePerTurnActionResourceResourceResourceAttackGoAgain:
      {
        kind: "static",
        staticKind: "continuous",
        condition: {
          type: "turn-player",
          who: "self",
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "sequence",
              steps: [
                {
                  type: "grant-property",
                  property: {
                    kind: "type",
                    value: "Weapon",
                  },
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "controller",
                    zones: ["permanent"],
                    filter: {
                      typeBox: {
                        supertypes: ["Illusionist"],
                        subtypes: ["Aura"],
                      },
                    },
                    count: {
                      type: "all",
                    },
                  },
                  duration: "while-condition",
                },
                {
                  type: "modify-numeric",
                  property: "power",
                  op: "set-base",
                  amount: 4,
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "controller",
                    zones: ["permanent"],
                    filter: {
                      typeBox: {
                        supertypes: ["Illusionist"],
                        subtypes: ["Aura"],
                      },
                    },
                    count: {
                      type: "all",
                    },
                  },
                  duration: "while-condition",
                },
                {
                  type: "grant-property",
                  property: {
                    kind: "ability",
                    ability: {
                      id: "oncePerTurnActionResourceResourceResourceAttackGoAgain",
                      text: "",
                      kind: "activated",
                      abilityType: "action",
                      limit: {
                        count: 1,
                        per: "turn",
                      },
                      cost: {
                        class: "asset",
                        type: "resources",
                        amount: 3,
                      },
                      layerKeywords: [goAgain],
                      effect: {
                        type: "attack-with",
                        target: {
                          selector: "self",
                        },
                      },
                    },
                  },
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "controller",
                    zones: ["permanent"],
                    filter: {
                      typeBox: {
                        supertypes: ["Illusionist"],
                        subtypes: ["Aura"],
                      },
                    },
                    count: {
                      type: "all",
                    },
                  },
                  duration: "while-condition",
                },
              ],
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
              duration: "while-in-arena",
            },
          ],
        },
      },
  },
});
