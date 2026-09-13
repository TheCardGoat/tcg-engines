import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/plow-through.generated.ts";

export const plowThrough = definePitchFamily(fabPitchFamilies["plow-through"], {
  parameters: { red: { value1: 3 }, yellow: { value1: 2 }, blue: { value1: 1 } },
  keywords: [goAgain],
  abilities: ({ value1 }) => ({
    sequenceModifyNumericPowerThisTurnGrantPropertyTriggeredDefendModifyNumericPowerThisTurnThisTurn:
      {
        kind: "resolution",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: value1,
              target: {
                selector: "this-attack",
              },
              duration: "this-turn",
              appliesTo: {
                next: {
                  typeBox: {
                    types: ["Weapon"],
                  },
                },
              },
            },
            {
              type: "grant-property",
              property: {
                kind: "ability",
                ability: {
                  id: "triggeredDefendModifyNumericPowerThisTurn",
                  text: "",
                  kind: "static",
                  staticKind: "triggered",
                  trigger: {
                    kind: "event",
                    event: {
                      name: "defend",
                      actor: {
                        kind: "any",
                      },
                      observes: {
                        kind: "event-object",
                        selector: "defender",
                        relationship: {
                          kind: "any",
                        },
                        filter: attackActionFilter(),
                      },
                      amount: {
                        op: "gte",
                        value: 1,
                      },
                    },
                  },
                  resolution: {
                    kind: "effect",
                    effect: {
                      type: "modify-numeric",
                      property: "power",
                      op: "add",
                      amount: 1,
                      target: {
                        selector: "self",
                      },
                      duration: "this-turn",
                    },
                  },
                },
              },
              target: {
                selector: "this-attack",
              },
              duration: "this-turn",
              appliesTo: {
                next: {
                  typeBox: {
                    types: ["Weapon"],
                  },
                },
              },
            },
          ],
        },
      },
  }),
});

export const {
  red: plowThroughRed,
  yellow: plowThroughYellow,
  blue: plowThroughBlue,
} = plowThrough.cards;
