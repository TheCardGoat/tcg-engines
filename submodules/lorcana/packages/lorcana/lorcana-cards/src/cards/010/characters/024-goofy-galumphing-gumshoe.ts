import type { CharacterCard } from "@tcg/lorcana-types";
import { goofyGalumphingGumshoeI18n } from "./024-goofy-galumphing-gumshoe.i18n";

export const goofyGalumphingGumshoe: CharacterCard = {
  id: "42x",
  canonicalId: "ci_zXO",
  reprints: ["set10-024"],
  cardType: "character",
  name: "Goofy",
  version: "Galumphing Gumshoe",
  inkType: ["amber"],
  set: "010",
  cardNumber: 24,
  rarity: "common",
  cost: 8,
  strength: 5,
  willpower: 7,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_51faef6e502845188f6fee9429829df2",
    tcgPlayer: 660365,
  },
  text: [
    {
      title: "Shift 5 {I}",
    },
    {
      title: "HOT PURSUIT",
      description:
        "When you play this character and whenever he quests, each opposing character gets -1 {S} until the start of your next turn.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Detective"],
  abilities: [
    {
      cost: {
        ink: 5,
      },
      id: "1mo-1",
      keyword: "Shift",
      text: "Shift 5 {I}",
      type: "keyword",
    },
    {
      effect: {
        duration: "until-start-of-next-turn",
        modifier: -1,
        stat: "strength",
        target: "ALL_OPPOSING_CHARACTERS",
        type: "modify-stat",
      },
      id: "1mo-2",
      name: "HOT PURSUIT",
      text: "HOT PURSUIT When you play this character and whenever he quests, each opposing character gets -1 {S} until the start of your next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      effect: {
        duration: "until-start-of-next-turn",
        modifier: -1,
        stat: "strength",
        target: "ALL_OPPOSING_CHARACTERS",
        type: "modify-stat",
      },
      id: "1mo-3",
      name: "HOT PURSUIT",
      text: "HOT PURSUIT When you play this character and whenever he quests, each opposing character gets -1 {S} until the start of your next turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: goofyGalumphingGumshoeI18n,
};
