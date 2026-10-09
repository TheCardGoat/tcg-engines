import type { CharacterCard } from "@tcg/lorcana-types";
import { miguelRiveraStreetMusicianI18n } from "./021-miguel-rivera-street-musician.i18n";

export const miguelRiveraStreetMusician: CharacterCard = {
  id: "vuy",
  canonicalId: "ci_vuy",
  slug: "lorcana-ci_vuy",
  printings: [
    {
      id: "set14-021",
      artId: "set14-021",
      setCode: "set14",
      collectorNumber: "21",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-021"],
  cardType: "character",
  name: "Miguel Rivera",
  version: "Street Musician",
  inkType: ["amber"],
  franchise: "Coco",
  set: "014",
  cardNumber: 21,
  rarity: "rare",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Share the Music",
      description:
        "While you have a song card in your discard, this character gets +1 {L} and gains Singer 3. (They count as cost 3 to sing songs.)",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "vuy-1",
      name: "Share the Music",
      type: "static",
      text: "Share the Music While you have a song card in your discard, this character gets +1 {L}.",
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["discard"],
          cardType: "action",
          filters: [
            {
              type: "is-song",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
      },
    },
    {
      id: "vuy-2",
      name: "Share the Music",
      type: "static",
      text: "Share the Music While you have a song card in your discard, this character gains Singer 3. (They count as cost 3 to sing songs.)",
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["discard"],
          cardType: "action",
          filters: [
            {
              type: "is-song",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "gain-keyword",
        keyword: "Singer",
        value: 3,
        target: "SELF",
      },
    },
  ],
  i18n: miguelRiveraStreetMusicianI18n,
};
