import { definePitchFamily, modalAbility } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/up-the-ante.generated.ts";

export const upTheAnte = definePitchFamily(fabPitchFamilies["up-the-ante"], {
  keywords: [
    {
      name: "specialization",
      hero: "Olympia",
    },
  ],
  abilities: () => ({
    chooseWagerModes: modalAbility({
      kind: "modal",
      modal: {
        choose: {
          type: "sum",
          operands: [
            {
              type: "count",
              what: "times-it-has-wagered",
            },
            1,
          ],
        },
      },
      modes: {
        wagerAgility: {
          kind: "resolution",
          effect: {
            type: "wager",
            stake: "agility",
            attacker: {
              selector: "this-attack",
            },
          },
        },
        wagerGold: {
          kind: "resolution",
          effect: {
            type: "wager",
            stake: "gold",
            attacker: {
              selector: "this-attack",
            },
          },
        },
        wagerVigor: {
          kind: "resolution",
          effect: {
            type: "wager",
            stake: "vigor",
            attacker: {
              selector: "this-attack",
            },
          },
        },
        gainPowerPerWager: {
          kind: "resolution",
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: {
              type: "count",
              what: "times-it-has-wagered",
            },
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
          },
        },
      },
      label: {
        name: "wager",
      },
    }),
  }),
});

export const { blue: upTheAnteBlue } = upTheAnte.cards;
