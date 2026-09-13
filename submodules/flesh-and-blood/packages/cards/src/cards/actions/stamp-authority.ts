import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/stamp-authority.generated.ts";

export const stampAuthority = definePitchFamily(fabPitchFamilies["stamp-authority"], {
  abilities: () => ({
    whenStampAuthorityEntersArenaHaveNumber2MoreInPitchZoneWith: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "enter-arena",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
        state: {
          type: "zone-count",
          zone: "pitch",
          player: "controller",
          filter: {
            cost: {
              op: "gte",
              value: 3,
            },
          },
          comparison: {
            op: "gte",
            value: 2,
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "modify-numeric",
          property: "intellect",
          op: "add",
          amount: 1,
          target: {
            selector: "controller",
          },
          duration: "this-turn",
        },
      },
    },
    whileStampAuthorityInArenaAttackActionEffectsDoNotTriggerWhen: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "has-status",
        status: "in-the-arena",
      },
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "trigger",
        filter: attackActionFilter(),
        duration: "while-condition",
      },
    },
    atBeginningActionPhaseDestroyStampAuthority: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "action-phase-start",
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
          type: "destroy",
          target: {
            selector: "self",
          },
        },
      },
    },
  }),
});

export const { blue: stampAuthorityBlue } = stampAuthority.cards;
