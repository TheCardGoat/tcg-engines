import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/red-in-the-ledger.generated.ts";

export const redInTheLedger = definePitchFamily(fabPitchFamilies["red-in-the-ledger"], {
  keywords: [
    {
      name: "specialization",
      hero: "Azalea",
    },
  ],
  abilities: () => ({
    redLedgerHitsCantPlayActivateMoreThan1ActionDuringNextTurn: {
      kind: "static",
      staticKind: "triggered",
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
              filter: {
                typeBox: {
                  types: ["Action"],
                },
              },
              subject: {
                selector: "attack-target",
              },
              limit: {
                count: 1,
              },
              duration: "until-end-of-their-next-turn",
            },
            {
              type: "rule-modification",
              mode: "restrict",
              action: "activate",
              filter: {
                typeBox: {
                  types: ["Action"],
                },
              },
              subject: {
                selector: "attack-target",
              },
              limit: {
                count: 1,
              },
              duration: "until-end-of-their-next-turn",
            },
          ],
        },
      },
    },
  }),
});

export const { red: redInTheLedgerRed } = redInTheLedger.cards;
