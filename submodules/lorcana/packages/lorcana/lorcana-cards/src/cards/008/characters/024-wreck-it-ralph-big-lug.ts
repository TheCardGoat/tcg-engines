import type { CharacterCard } from "@tcg/lorcana-types";
import { wreckitRalphBigLugI18n } from "./024-wreck-it-ralph-big-lug.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const wreckitRalphBigLug: CharacterCard = {
  id: "WSI",
  canonicalId: "ci_rXj",
  reprints: ["set8-024"],
  cardType: "character",
  name: "Wreck-It Ralph",
  version: "Big Lug",
  inkType: ["amber", "ruby"],
  franchise: "Wreck It Ralph",
  set: "008",
  cardNumber: 24,
  rarity: "common",
  cost: 7,
  strength: 7,
  willpower: 5,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_5615e8aef96941acb0e5cf1cfc8988c0",
    tcgPlayer: 632252,
  },
  text: [
    {
      title: "Shift 5",
    },
    {
      title: "BACK ON TRACK",
      description:
        "When you play this character and whenever he quests, you may return a Racer character card with cost 6 or less from your discard to your hand. If you do, gain 1 lore.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Racer"],
  abilities: [
    shift(5),
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          steps: [
            {
              type: "return-from-discard",
              cardType: "character",
              filter: {
                classification: "Racer",
                maxCost: 6,
              },
              target: "CONTROLLER",
            },
            {
              condition: {
                type: "if-you-do",
              },
              then: {
                amount: 1,
                type: "gain-lore",
              },
              type: "conditional",
            },
          ],
          type: "sequence",
        },
        type: "optional",
      },
      id: "1ic-2",
      name: "BACK ON TRACK",
      text: "BACK ON TRACK When you play this character and whenever he quests, you may return a Racer character card with cost 6 or less from your discard to your hand. If you do, gain 1 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          steps: [
            {
              type: "return-from-discard",
              cardType: "character",
              filter: {
                classification: "Racer",
                maxCost: 6,
              },
              target: "CONTROLLER",
            },
            {
              condition: {
                type: "if-you-do",
              },
              then: {
                amount: 1,
                type: "gain-lore",
              },
              type: "conditional",
            },
          ],
          type: "sequence",
        },
        type: "optional",
      },
      id: "1ic-3",
      name: "BACK ON TRACK",
      text: "BACK ON TRACK When you play this character and whenever he quests, you may return a Racer character card with cost 6 or less from your discard to your hand. If you do, gain 1 lore.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: wreckitRalphBigLugI18n,
};
