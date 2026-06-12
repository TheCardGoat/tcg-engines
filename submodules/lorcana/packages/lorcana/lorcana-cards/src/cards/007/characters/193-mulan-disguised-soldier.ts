import type { CharacterCard } from "@tcg/lorcana-types";
import { mulanDisguisedSoldierI18n } from "./193-mulan-disguised-soldier.i18n";

export const mulanDisguisedSoldier: CharacterCard = {
  id: "uh8",
  canonicalId: "ci_uh8",
  reprints: ["set7-193"],
  cardType: "character",
  name: "Mulan",
  version: "Disguised Soldier",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "007",
  cardNumber: 193,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_9b812b75cd834563aeae274699657a59",
    tcgPlayer: 619519,
  },
  text: [
    {
      title: "WHERE DO I SIGN IN?",
      description:
        "When you play this character, you may draw a card, then choose and discard a card.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          steps: [
            {
              amount: 1,
              target: "CONTROLLER",
              type: "draw",
            },
            {
              amount: 1,
              chosen: true,
              from: "hand",
              target: "CONTROLLER",
              type: "discard",
            },
          ],
          type: "sequence",
        },
        type: "optional",
      },
      id: "1p3-1",
      name: "WHERE DO I SIGN IN?",
      text: "WHERE DO I SIGN IN? When you play this character, you may draw a card, then choose and discard a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: mulanDisguisedSoldierI18n,
};
