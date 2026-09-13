import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/engage-steel.generated.ts";
import { goAgain } from "../shared/keywords.ts";
const sword = { typeBox: { subtypes: ["Sword" as const] } };
export const engageSteel = definePitchFamily(fabPitchFamilies["engage-steel"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  keywords: [goAgain],
  abilities: (amount) => ({
    sequence: {
      type: "sequence",
      steps: [
        {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount,
          target: { selector: "this-attack" },
          duration: "this-turn",
          appliesTo: { next: sword, events: ["attack", "activate"] },
        },
        {
          type: "grant-property",
          property: {
            kind: "ability",
            ability: {
              kind: "static",
              staticKind: "triggered",
              id: "staticTriggeredDefendModifyNumericPower",
              text: "",
              trigger: {
                kind: "event",
                event: {
                  name: "defend",
                  actor: { kind: "any" },
                  observes: {
                    kind: "event-object",
                    selector: "defender",
                    relationship: { kind: "any" },
                    filter: { typeBox: { supertypes: ["Warrior"] } },
                  },
                  amount: { op: "gte", value: 1 },
                },
              },
              resolution: {
                kind: "effect",
                effect: {
                  type: "modify-numeric",
                  property: "power",
                  op: "add",
                  amount: 1,
                  target: { selector: "this-attack" },
                  duration: "this-chain-link",
                },
              },
            },
          },
          target: { selector: "this-attack" },
          duration: "this-turn",
          appliesTo: { next: sword, events: ["attack", "activate"] },
        },
      ],
    },
  }),
});
export const {
  red: engageSteelRed,
  yellow: engageSteelYellow,
  blue: engageSteelBlue,
} = engageSteel.cards;
