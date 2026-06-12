import type { LeaderCard } from "@tcg/op-types";
import { op03PortgasDAce001I18n } from "./001-portgas-d-ace.i18n.ts";

export const op03PortgasDAce001: LeaderCard = {
  id: "OP03-001",
  cardType: "leader",
  color: ["red"],
  rarity: "L",
  setId: "OP03",
  power: 5000,
  life: 5,
  traits: ["Whitebeard Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-001_p1.jpg",
      imageId: "OP03-001_p1",
    },
  ],
  effect:
    "When this Leader attacks or is attacked, you may trash any number of Event or Stage cards from your hand. This Leader gains +1000 power during this battle for every card trashed.",
  i18n: op03PortgasDAce001I18n,
};
