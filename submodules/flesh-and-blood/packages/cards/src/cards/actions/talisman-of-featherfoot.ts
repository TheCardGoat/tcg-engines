import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/talisman-of-featherfoot.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const talismanOfFeatherfoot = definePitchFamily(
  fabPitchFamilies["talisman-of-featherfoot"],
  {
    keywords: [goAgain],
    abilities: () => ({
      whenAttackControlGainsExactlyNumber1PowerFromEffectDuringReactionStep: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "modify-power",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "event-object",
              selector: "modified-object",
              relationship: {
                kind: "controller",
                player: "ability-controller",
              },
              filter: {
                typeBox: {
                  subtypes: ["Attack"],
                },
              },
              bindAs: "it",
            },
            during: {
              kind: "combat-step",
              step: "reaction",
            },
            delta: { op: "eq", value: 1 },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "destroy",
                target: {
                  selector: "self",
                },
              },
              {
                type: "grant-property",
                property: {
                  kind: "keyword",
                  keyword: goAgain,
                },
                target: {
                  selector: "binding",
                  binding: "it",
                },
                duration: "this-combat-chain",
              },
            ],
          },
        },
      },
    }),
  },
);

export const { yellow: talismanOfFeatherfootYellow } = talismanOfFeatherfoot.cards;
