import { definePitchFamily, modalAbility } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/beat-of-the-ironsong.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const beatOfTheIronsong = definePitchFamily(fabPitchFamilies["beat-of-the-ironsong"], {
  abilities: () => ({
    chooseDawnbladeModes: modalAbility({
      kind: "modal",
      modal: {
        choose: {
          type: "sum",
          operands: [
            {
              type: "count",
              what: "counters-on-objects",
              counter: {
                kind: "numeric",
                value: 1,
                property: "power",
              },
              filter: {
                name: "Dawnblade",
                hasStatus: "attacking",
              },
            },
            1,
          ],
        },
      },
      modes: {
        gainPower: {
          kind: "resolution",
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["combat-chain"],
              filter: {
                name: "Dawnblade",
              },
              count: 1,
            },
            duration: "this-turn",
            outputBinding: "it",
          },
        },
        gainGoAgain: {
          kind: "resolution",
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
                name: "Dawnblade",
              },
              count: 1,
            },
            duration: "this-turn",
            outputBinding: "it",
          },
        },
        preventDefenseGains: {
          kind: "resolution",
          effect: {
            type: "rule-modification",
            mode: "restrict",
            action: "gain-defense",
            filter: {
              defending: true,
              defendingAgainst: {
                name: "Dawnblade",
              },
            },
            duration: "this-chain-link",
          },
        },
        preventDamagePrevention: {
          kind: "resolution",
          effect: {
            type: "rule-modification",
            mode: "restrict",
            action: "be-prevented",
            subject: {
              name: "Dawnblade",
            },
            duration: "this-chain-link",
          },
        },
      },
    }),
  }),
});

export const { blue: beatOfTheIronsongBlue } = beatOfTheIronsong.cards;
