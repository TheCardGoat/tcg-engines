import { legendary } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/imperial-ledger.generated.ts";

export const imperialLedger = definePitchFamily(fabPitchFamilies["imperial-ledger"], {
  keywords: [legendary],
  abilities: () => ({
    actionShuffleImperialLedgerOwnersDeckCreateCopperTokenRoyalInsteadCreateGoldToken: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "move-to-deck",
        from: "self",
        position: "shuffle",
        count: 1,
      },
      effect: {
        type: "conditional",
        condition: {
          type: "has-status",
          status: "hero-is-royal",
        },
        then: {
          type: "create-token",
          token: "gold",
          controller: "controller",
        },
        else: {
          type: "create-token",
          token: "copper",
          controller: "controller",
        },
      },
    },
  }),
});

export const { red: imperialLedgerRed } = imperialLedger.cards;
