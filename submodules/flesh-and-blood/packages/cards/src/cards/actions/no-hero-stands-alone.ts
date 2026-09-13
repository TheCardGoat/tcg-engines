import { ambush } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/no-hero-stands-alone.generated.ts";

/** Model notes (hand-authored): Ambush and +3{d} are conditional on having
 * controlled a Toughness token this turn (not a static keyword). The printed
 * "While this is in any zone" is the scope of the while, not a status marker.
 * Clash is only the on-defend trigger (not a label on the while). */
export const noHeroStandsAlone = definePitchFamily(fabPitchFamilies["no-hero-stands-alone"], {
  abilities: () => ({
    anyZoneToughnessTokenTurnGets3DefenseAmbush: {
      kind: "static",
      staticKind: "while",
      condition: { type: "performed-this-turn", event: "control-toughness", player: "controller" },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "defense",
            op: "add",
            amount: 3,
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
          {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: ambush,
            },
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
        ],
      },
    },
    defendsClashAttackingWinnerChooseAttackingDefendingGet3Power3DefenseChainLink: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "clash",
          with: {
            selector: "attacking-hero",
          },
          prize: {
            type: "optional",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "choose-card",
                  target: {
                    selector: "object",
                    declared: "on-stack",
                    zones: ["combat-chain"],
                    filter: {
                      or: [
                        {
                          hasStatus: "attacking",
                        },
                        {
                          defending: true,
                        },
                      ],
                    },
                    count: 1,
                  },
                  outputBinding: "it",
                },
                {
                  type: "modify-numeric",
                  property: "power",
                  op: "subtract",
                  amount: 3,
                  target: { selector: "binding", binding: "it" },
                  duration: "this-chain-link",
                },
                {
                  type: "modify-numeric",
                  property: "defense",
                  op: "subtract",
                  amount: 3,
                  target: { selector: "binding", binding: "it" },
                  duration: "this-chain-link",
                },
              ],
            },
          },
        },
      },
      label: {
        name: "clash",
      },
    },
  }),
});

export const { yellow: noHeroStandsAloneYellow } = noHeroStandsAlone.cards;
