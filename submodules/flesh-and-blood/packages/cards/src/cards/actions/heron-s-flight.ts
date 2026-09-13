import { semanticTriggeredModalResolution } from "../../authoring/card.ts";
import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/heron-s-flight.generated.ts";

import { combo } from "../shared/keywords.ts";

export const heronSFlight = definePitchFamily(fabPitchFamilies["heron-s-flight"], {
  keywords: [combo],
  abilities: () => ({
    comboCraneDanceLastAttackCombatChainAttackHeronsFlightGains2PowerChoose1HeronsFlightCanOnlyDefendedAttackActionHeronsFlightCanOnlyDefendedNonAttackAction:
      {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event-and-state",
          event: {
            name: "attack",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "event-object",
              selector: "attack",
              relationship: {
                kind: "any",
              },
              filter: {
                name: "Heron's Flight",
              },
            },
          },
          state: {
            type: "last-attack-this-combat-chain",
            names: ["Crane Dance"],
          },
        },
        resolution: semanticTriggeredModalResolution({
          kind: "modal",
          choose: 1,
          modes: {
            heronsFlightCanOnlyDefendedAttackAction: {
              kind: "resolution",
              effect: {
                type: "rule-modification",
                mode: "restrict",
                action: "defend",
                filter: attackActionFilter(),
                duration: "this-turn",
              },
            },
            heronsFlightCanOnlyDefendedNonAttackAction: {
              kind: "resolution",
              effect: {
                type: "rule-modification",
                mode: "restrict",
                action: "defend",
                filter: {
                  typeBox: {
                    types: ["Action"],
                    excludeSubtypes: ["Attack"],
                  },
                },
                duration: "this-turn",
              },
            },
          },
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 2,
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
        }),
        label: {
          name: "combo",
          params: {
            names: ["Crane Dance"],
          },
        },
      },
  }),
});

export const { red: heronSFlightRed } = heronSFlight.cards;
