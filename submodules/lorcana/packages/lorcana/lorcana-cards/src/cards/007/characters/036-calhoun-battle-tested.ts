import type { CharacterCard } from "@tcg/lorcana-types";
import { calhounBattletestedI18n } from "./036-calhoun-battle-tested.i18n";

export const calhounBattletested: CharacterCard = {
  id: "ilK",
  canonicalId: "ci_ilK",
  reprints: ["set7-036"],
  cardType: "character",
  name: "Calhoun",
  version: "Battle-Tested",
  inkType: ["amber"],
  franchise: "Wreck It Ralph",
  set: "007",
  cardNumber: 36,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_64a76c911cf94a1c88039f36efdec741",
    tcgPlayer: 619427,
  },
  text: [
    {
      title: "TACTICAL ADVANTAGE",
      description:
        "When you play this character, you may choose and discard a card to give chosen opposing character -3 {S} until the start of your next turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Racer"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              amount: 1,
              chosen: true,
              from: "hand",
              target: "CONTROLLER",
              type: "discard",
            },
            {
              type: "modify-stat",
              stat: "strength",
              modifier: -3,
              duration: "until-start-of-next-turn",
              target: {
                selector: "chosen",
                count: 1,
                owner: "opponent",
                zones: ["play"],
                cardTypes: ["character"],
              },
            },
          ],
        },
        type: "optional",
      },
      id: "1sj-1",
      name: "TACTICAL ADVANTAGE",
      text: "TACTICAL ADVANTAGE When you play this character, you may choose and discard a card to give chosen opposing character -3 {S} until the start of your next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: calhounBattletestedI18n,
};
