import type { CharacterCard } from "@tcg/lorcana-types";
import { scarShamelessFirebrandI18n } from "./123-scar-shameless-firebrand.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const scarShamelessFirebrand: CharacterCard = {
  id: "pVG",
  canonicalId: "ci_pVG",
  reprints: ["set1-123"],
  cardType: "character",
  name: "Scar",
  version: "Shameless Firebrand",
  inkType: ["ruby"],
  franchise: "Lion King",
  set: "001",
  cardNumber: 123,
  rarity: "rare",
  cost: 8,
  strength: 6,
  willpower: 6,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_5ad957ef62844bcaba344b0af0a5ff24",
    tcgPlayer: 507467,
  },
  text: [
    {
      title: "Shift 6",
    },
    {
      title: "ROUSING SPEECH",
      description:
        "When you play this character, ready your characters with cost 3 or less. They can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Floodborn", "Villain", "King"],
  abilities: [
    shift(6),
    {
      effect: {
        type: "sequence",
        steps: [
          {
            type: "ready",
            target: {
              selector: "all",
              count: "all",
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
              filter: [
                {
                  type: "cost-comparison",
                  comparison: "less-or-equal",
                  value: 3,
                },
              ],
            },
          },
          {
            type: "restriction",
            restriction: "cant-quest",
            duration: "this-turn",
            target: {
              selector: "all",
              count: "all",
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
              filter: [
                {
                  type: "cost-comparison",
                  comparison: "less-or-equal",
                  value: 3,
                },
              ],
            },
          },
        ],
      },
      id: "pVG-2",
      name: "ROUSING SPEECH",
      text: "When you play this character, ready your characters with cost 3 or less. They can't quest for the rest of this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: scarShamelessFirebrandI18n,
};
