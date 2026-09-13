import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/events/code-of-conduct-kill-or-be-killed.generated.ts";

export const codeOfConductKillOrBeKilled = defineCard(
  fabCardIdentitiesByCanonicalId["9f8tgdNwfwg7bhkkDLdPK"],
  {
    abilities: {
      attackAnyOpponentAndTakeExtraTurn: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "rule-modification",
              mode: "allow",
              action: "attack-target",
              target: "any-opposing-hero",
              duration: "this-turn",
            },
            {
              type: "delayed-trigger",
              trigger: {
                kind: "event",
                event: {
                  name: "deal-damage",
                  actor: {
                    kind: "player",
                    player: "ability-controller",
                  },
                  observes: {
                    kind: "event-object",
                    selector: "damage-source",
                    relationship: {
                      kind: "any",
                    },
                    filter: {
                      hasStatus: "lethal",
                    },
                  },
                },
              },
              policy: {
                kind: "windowed",
                duration: "this-turn",
                matching: "first",
              },
              resolution: {
                kind: "effect",
                effect: {
                  type: "take-extra-turn",
                  player: "controller",
                },
              },
            },
          ],
        },
      },
    },
  },
);
