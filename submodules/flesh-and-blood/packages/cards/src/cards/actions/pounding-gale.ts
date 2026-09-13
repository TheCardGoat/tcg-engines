import { comboResolution } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/pounding-gale.generated.ts";

import { combo } from "../shared/keywords.ts";

export const poundingGale = definePitchFamily(fabPitchFamilies["pounding-gale"], {
  keywords: [combo],
  abilities: () => ({
    openCenterLastAttackCombatChainPoundingGaleGainsPoundingGaleDealDamageInsteadDealsDoubleMuchDamage:
      comboResolution({
        names: ["Open The Center"],
        effect: {
          type: "grant-property",
          property: {
            kind: "ability",
            ability: {
              id: "poundingGaleDealDamageInsteadDealsDoubleMuchDamage",
              text: "",
              kind: "resolution",
              effect: {
                type: "replacement",
                replacementKind: "standard",
                replaces: {
                  name: "damage",
                  subject: "self",
                },
                modification: {
                  type: "modify-numeric",
                  property: "count",
                  op: "add",
                  amount: {
                    type: "event-amount",
                  },
                  target: {
                    selector: "self",
                  },
                  duration: "permanent",
                },
                duration: "this-chain-link",
              },
            },
          },
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      }),
  }),
});

export const { red: poundingGaleRed } = poundingGale.cards;
