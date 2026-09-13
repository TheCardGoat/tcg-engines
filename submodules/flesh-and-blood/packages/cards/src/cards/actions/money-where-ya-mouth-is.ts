import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/money-where-ya-mouth-is.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const moneyWhereYaMouthIs = definePitchFamily(fabPitchFamilies["money-where-ya-mouth-is"], {
  keywords: [goAgain],
  parameters: {
    red: { powerBonus: 3 },
    yellow: { powerBonus: 2 },
    blue: { powerBonus: 1 },
  },
  abilities: ({ powerBonus }) => ({
    empowerNextAttack: {
      type: "sequence",
      steps: [
        {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: powerBonus,
          target: { selector: "this-attack" },
          duration: "this-turn",
          appliesTo: { next: { typeBox: { subtypes: ["Attack"] } } },
        },
        {
          type: "grant-property",
          property: {
            kind: "ability",
            ability: {
              kind: "static",
              staticKind: "triggered",
              id: "wagerGold",
              text: "",
              trigger: {
                kind: "event",
                event: {
                  name: "attack",
                  actor: { kind: "player", player: "ability-controller" },
                  observes: { kind: "source", selector: "attack" },
                  target: { kind: "hero" },
                },
              },
              resolution: {
                kind: "effect",
                effect: {
                  type: "optional",
                  effect: { type: "wager", stake: "gold", with: { selector: "attack-target" } },
                },
              },
            },
          },
          target: { selector: "this-attack" },
          duration: "this-turn",
          appliesTo: { next: { typeBox: { subtypes: ["Attack"] } } },
        },
      ],
    },
  }),
});

export const {
  red: moneyWhereYaMouthIsRed,
  yellow: moneyWhereYaMouthIsYellow,
  blue: moneyWhereYaMouthIsBlue,
} = moneyWhereYaMouthIs.cards;
