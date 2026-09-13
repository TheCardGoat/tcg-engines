import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/voltaire-strike-twice.generated.ts";

export const voltaireStrikeTwice = defineCard(
  fabCardIdentitiesByCanonicalId["Nzpgn9HrbNfkzM8CkwCQp"],
  {
    abilities: {
      twicePerTurnInstantResourcePutArrowHandFaceUpEmptyArsenalZoneChoose1Gains1PowerEndTurnGainsGoAgainEndTurn:
        {
          kind: "activated",
          limit: {
            count: 2,
            per: "turn",
          },
          abilityType: "instant",
          cost: {
            class: "asset",
            type: "resources",
            amount: 1,
          },
          effect: {
            type: "optional",
            effect: {
              type: "move-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["hand"],
                filter: {
                  typeBox: {
                    subtypes: ["Arrow"],
                  },
                },
                count: 1,
              },
              to: {
                zone: "arsenal",
                visibility: "face-up",
              },
              outputBinding: "it",
            },
            then: {
              type: "choice",
              options: [
                {
                  type: "modify-numeric",
                  property: "power",
                  op: "add",
                  amount: 1,
                  target: { selector: "binding", binding: "it" },
                  duration: "this-turn",
                },
                {
                  type: "grant-property",
                  property: { kind: "keyword", keyword: goAgain },
                  target: { selector: "binding", binding: "it" },
                  duration: "this-turn",
                },
              ],
            },
          },
        },
    },
  },
);
