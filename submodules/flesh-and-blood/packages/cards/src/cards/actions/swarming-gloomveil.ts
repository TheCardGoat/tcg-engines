import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/swarming-gloomveil.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const swarmingGloomveil = definePitchFamily(fabPitchFamilies["swarming-gloomveil"], {
  keywords: [goAgain],
  abilities: () => ({
    havePlayedCreatedNumber1MoreAurasTurnSwarmingGloomveilGainsGoAgain: {
      kind: "resolution",
      condition: {
        type: "performed-this-turn",
        event: "play-or-create-aura",
        player: "controller",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: goAgain,
            },
            target: {
              selector: "self",
            },
            duration: "this-turn",
          },
          {
            type: "conditional",
            condition: {
              type: "compare-amount",
              amount: {
                type: "count",
                what: "cards-played-this-turn",
                filter: { typeBox: { subtypes: ["Aura"] } },
              },
              comparison: { op: "gte", value: 2 },
            },
            then: {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 1,
              target: {
                selector: "self",
              },
              duration: "permanent",
            },
          },
          {
            type: "conditional",
            condition: {
              type: "compare-amount",
              amount: {
                type: "count",
                what: "cards-played-this-turn",
                filter: { typeBox: { subtypes: ["Aura"] } },
              },
              comparison: { op: "gte", value: 3 },
            },
            then: {
              type: "grant-property",
              property: {
                kind: "ability",
                ability: {
                  kind: "static",
                  staticKind: "triggered",
                  id: "whenHitsHeroTheyCanTPreventArcaneDamageFromSourcesControl",
                  text: "",
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
                      type: "rule-modification",
                      mode: "restrict",
                      action: "be-prevented",
                      filter: {
                        hasStatus: "arcane-from-controller-sources",
                      },
                      duration: "this-turn",
                    },
                  },
                },
              },
              target: {
                selector: "self",
              },
              duration: "permanent",
            },
          },
        ],
      },
    },
  }),
});

export const { red: swarmingGloomveilRed } = swarmingGloomveil.cards;
