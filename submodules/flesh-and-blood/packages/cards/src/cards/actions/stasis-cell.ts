import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/stasis-cell.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const stasisCell = definePitchFamily(fabPitchFamilies["stasis-cell"], {
  abilities: () => ({
    whenEntersLeavesArenaActivatedAbilitiesEquipmentCanTActivatedUntilEnd: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          kind: "any-of",
          patterns: [
            {
              name: "enter-arena",
              actor: {
                kind: "any",
              },
              observes: {
                kind: "source",
                selector: "moved-object",
              },
            },
            {
              name: "leave-arena",
              actor: {
                kind: "any",
              },
              observes: {
                kind: "source",
                selector: "moved-object",
              },
            },
          ],
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "rule-modification",
          mode: "restrict",
          action: "activate",
          // CR 6.2.2a: the restriction lands on a CHOSEN equipment ("target
          // equipment"), declared as an on-stack object subject — not a
          // non-functional `hasStatus: "target"` filter sentinel. The continuous
          // rule latches this subject so quoteFabActivation denies only the
          // chosen equipment's activated abilities for the fixed duration window.
          subject: {
            selector: "object",
            declared: "on-stack",
            player: "any",
            zones: ["permanent"],
            filter: {
              typeBox: {
                types: ["Equipment"],
              },
            },
            count: 1,
          },
          duration: "until-end-of-next-turn",
        },
      },
    },
    actionPutOnBottomOwnerSDeckChooseEquipmentCanTDefend: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "move-to-deck",
        from: "self",
        position: "bottom",
        count: 1,
      },
      layerKeywords: [goAgain],
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "defend",
        subject: {
          selector: "object",
          declared: "on-stack",
          player: "any",
          zones: ["permanent"],
          filter: {
            typeBox: {
              types: ["Equipment"],
            },
          },
          count: 1,
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { blue: stasisCellBlue } = stasisCell.cards;
