import type { LeaderCard } from "@tcg/op-types";
import { op07RobLucci079 } from "../../OP07/leaders/079-rob-lucci.ts";
import { eb02RobLucci079I18n } from "./079-rob-lucci.i18n.ts";

export const eb02RobLucci079: LeaderCard = {
  ...op07RobLucci079,
  id: "OP07-079_q0dAX55",
  slug: "rob-lucci/op07-079-q0dax55",
  name: "Rob Lucci",
  printings: [
    {
      id: "OP07-079_q0dAX55",
      artId: "OP07-079_q0dAX55",
      setCode: "EB02",
      collectorNumber: "079",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-079_q0dAX55.jpg",
    },
  ],
  rarity: "L",
  setId: "EB02",
  artVariants: undefined,
  i18n: eb02RobLucci079I18n,
};
