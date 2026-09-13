import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/earthlore-empowerment.generated.ts";

export const earthloreEmpowerment = definePitchFamily(fabPitchFamilies["earthlore-empowerment"], {
  parameters: { red: 5, yellow: 4 },
  abilities: (powerBonus) => ({
    atStartTurnDestroyThenNextGuardianAttackAction: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "start-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            {
              type: "sequence",
              steps: [
                {
                  type: "modify-numeric",
                  property: "cost",
                  op: "subtract",
                  amount: 1,
                  target: {
                    selector: "this-attack",
                  },
                  duration: "this-turn",
                  appliesTo: {
                    next: {
                      typeBox: {
                        supertypes: ["Guardian"],
                        types: ["Action"],
                        subtypes: ["Attack"],
                      },
                    },
                  },
                },
                {
                  type: "modify-numeric",
                  property: "power",
                  op: "add",
                  amount: powerBonus,
                  target: {
                    selector: "this-attack",
                  },
                  duration: "this-turn",
                  appliesTo: {
                    next: {
                      typeBox: {
                        supertypes: ["Guardian"],
                        types: ["Action"],
                        subtypes: ["Attack"],
                      },
                    },
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
export const { red: earthloreEmpowermentRed, yellow: earthloreEmpowermentYellow } =
  earthloreEmpowerment.cards;
