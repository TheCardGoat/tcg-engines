import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/immobilizing-shot.generated.ts";

export const immobilizingShot = definePitchFamily(fabPitchFamilies["immobilizing-shot"], {
  abilities: () => ({
    immobilizingShotAimCounterHitsCantPlayMoreThan1AttackAction1NonAttackActionDuringNextActionPhase:
      {
        kind: "static",
        staticKind: "continuous",
        condition: {
          type: "has-counter",
          counter: {
            kind: "named",
            name: "aim",
          },
          target: {
            selector: "self",
          },
        },
        effect: {
          type: "grant-property",
          property: {
            kind: "ability",
            ability: {
              kind: "static",
              staticKind: "triggered",
              id: "hitsCantPlayMoreThan1AttackAction1NonAttackActionDuringNextActionPhase",
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
                      type: "rule-modification",
                      mode: "restrict",
                      action: "play",
                      filter: attackActionFilter(),
                      limit: {
                        count: 1,
                      },
                      duration: "until-end-of-next-turn",
                    },
                    {
                      type: "rule-modification",
                      mode: "restrict",
                      action: "play",
                      filter: {
                        typeBox: {
                          types: ["Action"],
                          excludeSubtypes: ["Attack"],
                        },
                      },
                      limit: {
                        count: 1,
                      },
                      duration: "until-end-of-next-turn",
                    },
                  ],
                },
              },
            },
          },
          target: {
            selector: "self",
          },
          duration: "permanent",
        },
      },
  }),
});

export const { red: immobilizingShotRed } = immobilizingShot.cards;
