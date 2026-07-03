import type { CharacterCard } from "@tcg/lorcana-types";
import { pocahontasMeekoAdventurousFriendsI18n } from "./027-pocahontas-meeko-adventurous-friends.i18n";
import { evasive } from "../../../helpers/abilities/evasive";
import { shift } from "../../../helpers/abilities/shift";

export const pocahontasMeekoAdventurousFriends: CharacterCard = {
  id: "uQO",
  canonicalId: "ci_uQO",
  slug: "lorcana-ci_uQO",
  printings: [
    {
      id: "set13-027",
      artId: "set13-027",
      setCode: "set13",
      collectorNumber: "27",
      rarity: "legendary",
      imageUrl: "",
    },
  ],
  reprints: ["set13-027"],
  cardType: "character",
  name: "Pocahontas & Meeko",
  version: "Adventurous Friends",
  inkType: ["amber", "amethyst"],
  franchise: "Pocahontas",
  set: "013",
  cardNumber: 27,
  rarity: "legendary",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_1337332b5317428c95c1129cf645924f",
  },
  text: [
    {
      title: "Shift 2 {I}",
      description:
        "(You may pay 2 {I} to play this on top of one of your characters named Pocahontas or Meeko.)",
    },
    {
      title: "Evasive",
    },
    {
      title: "WELCOME RETURN",
      description:
        "Whenever this character quests, you may return chosen character of yours with cost 1 to your hand. If you do, you may play a character with cost 1 for free.",
    },
  ],
  classifications: ["Storyborn", "Team", "Hero", "Princess"],
  abilities: [
    shift("Pocahontas or Meeko", 2),
    evasive,
    {
      type: "triggered",
      id: "uQO-3",
      name: "WELCOME RETURN",
      text: "WELCOME RETURN Whenever this character quests, you may return chosen character of yours with cost 1 to your hand. If you do, you may play a character with cost 1 for free.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "return-to-hand",
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["character"],
                filter: [
                  {
                    type: "cost-comparison",
                    comparison: "equal",
                    value: 1,
                  },
                ],
              },
            },
            {
              type: "conditional",
              condition: {
                type: "if-you-do",
              },
              then: {
                type: "optional",
                chooser: "CONTROLLER",
                effect: {
                  type: "play-card",
                  from: "hand",
                  cardType: "character",
                  costRestriction: {
                    comparison: "equal",
                    value: 1,
                  },
                  cost: "free",
                },
              },
            },
          ],
        },
      },
    },
  ],
  i18n: pocahontasMeekoAdventurousFriendsI18n,
};
