import type { CharacterCard } from "@tcg/op-types";
import { op09Shanks004 } from "../../OP09/characters/004-shanks.ts";
import { op13ShanksOp09004SpSilver004I18n } from "./004-shanks-op09-004-sp-silver.i18n.ts";

export const op13ShanksOp09004SpSilver004: CharacterCard = {
  ...op09Shanks004,
  id: "OP09-004_p6_GBo9322",
  slug: "shanks-op09-004-sp-silver",
  name: "Shanks - OP09-004 (SP) (Silver)",
  printings: [
    {
      id: "OP09-004_p6_GBo9322",
      artId: "OP09-004_p6_GBo9322",
      setCode: "OP13",
      collectorNumber: "004",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-004_p6_GBo9322.png",
    },
  ],
  rarity: "SR",
  setId: "OP13",
  artVariants: undefined,
  i18n: op13ShanksOp09004SpSilver004I18n,
};
