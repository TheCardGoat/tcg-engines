import type { CharacterCard } from "@tcg/lorcana-types";
import { hadesFastTalkerI18n } from "./052-hades-fast-talker.i18n";

export const hadesFastTalker: CharacterCard = {
  id: "Ubd",
  canonicalId: "ci_Ubd",
  reprints: ["set7-052"],
  cardType: "character",
  name: "Hades",
  version: "Fast Talker",
  inkType: ["amethyst", "ruby"],
  franchise: "Hercules",
  set: "007",
  cardNumber: 52,
  rarity: "rare",
  cost: 6,
  strength: 4,
  willpower: 6,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_5dd4b7c75d134e76998535e1f8ec6b6c",
    tcgPlayer: 618133,
  },
  text: [
    {
      title: "FOR JUST A LITTLE PAIN",
      description:
        "When you play this character, you may deal 2 damage to another chosen character of yours to banish chosen character with cost 3 or less.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Deity"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              amount: 2,
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                excludeSelf: true,
                zones: ["play"],
                cardTypes: ["character"],
              },
              type: "deal-damage",
            },
            {
              condition: {
                type: "if-you-do",
              },
              then: {
                target: {
                  selector: "chosen",
                  count: 1,
                  owner: "any",
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
                type: "banish",
              },
              type: "conditional",
            },
          ],
        },
        type: "optional",
      },
      id: "1px-1",
      name: "FOR JUST A LITTLE PAIN",
      text: "FOR JUST A LITTLE PAIN When you play this character, you may deal 2 damage to another chosen character of yours to banish chosen character with cost 3 or less.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: hadesFastTalkerI18n,
};
