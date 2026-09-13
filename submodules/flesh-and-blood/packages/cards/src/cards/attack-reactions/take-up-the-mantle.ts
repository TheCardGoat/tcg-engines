import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/take-up-the-mantle.generated.ts";

export const takeUpTheMantle = definePitchFamily(fabPitchFamilies["take-up-the-mantle"], {
  abilities: () => ({
    transformStealthAttackAgainstMarkedHero: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            // Bind the selected attacker before evaluating the replacement
            // condition. The condition and the optional copy clause must
            // retain this exact combat-chain object across the sequence.
            type: "choose-card",
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["combat-chain"],
              filter: attackActionFilter({ hasKeyword: "stealth" }),
              count: 1,
            },
            outputBinding: "it",
          },
          {
            // Base +2{p}; the marked-hero clause below replaces it (CR 6.4.7).
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 2,
            target: { selector: "binding", binding: "it" },
            duration: "this-turn",
            outputBinding: "it",
          },
          {
            type: "self-replacement",
            condition: {
              type: "has-status",
              status: "attacking-a-marked-hero",
            },
            modification: {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 3,
              target: { selector: "binding", binding: "it" },
              duration: "this-turn",
              outputBinding: "it",
            },
          },
          {
            // The printed "and you may banish …" rides the same marked-hero
            // clause; gated as its own step so the optional surfaces as a
            // player decision.
            type: "conditional",
            condition: {
              type: "has-status",
              status: "attacking-a-marked-hero",
            },
            then: {
              type: "optional",
              effect: {
                type: "banish",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["graveyard"],
                  filter: attackActionFilter({ hasKeyword: "stealth" }),
                  count: 1,
                },
                outputBinding: "banished",
              },
              then: {
                type: "copy",
                target: {
                  selector: "binding",
                  binding: "it",
                },
                source: {
                  selector: "binding",
                  binding: "banished",
                },
                duration: "permanent",
              },
            },
          },
        ],
      },
    },
  }),
});

export const { yellow: takeUpTheMantleYellow } = takeUpTheMantle.cards;
