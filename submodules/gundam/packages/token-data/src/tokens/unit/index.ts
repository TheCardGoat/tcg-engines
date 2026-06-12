import type { UnitCard } from "@tcg/gundam-types";

import { tGundam001 } from "./001-gundam.ts";
import { tGuncannon002 } from "./002-guncannon.ts";
import { tGuntank003 } from "./003-guntank.ts";
import { tLeo004 } from "./004-leo.ts";
import { tTallgeese005 } from "./005-tallgeese.ts";
import { tCharsZakuIi006 } from "./006-chars-zaku-ii.ts";
import { tZakuIi007 } from "./007-zaku-ii.ts";
import { tAileStrikeGundam008 } from "./008-aile-strike-gundam.ts";
import { tLauncherStrikeGundam009 } from "./009-launcher-strike-gundam.ts";
import { tSwordStrikeGundam010 } from "./010-sword-strike-gundam.ts";
import { tDaughtress012 } from "./012-daughtress.ts";

export {
  tGundam001,
  tGuncannon002,
  tGuntank003,
  tLeo004,
  tTallgeese005,
  tCharsZakuIi006,
  tZakuIi007,
  tAileStrikeGundam008,
  tLauncherStrikeGundam009,
  tSwordStrikeGundam010,
  tDaughtress012,
};

export const TOKEN_PRINTINGS: Readonly<Partial<Record<string, UnitCard>>> = {
  [tGundam001.cardNumber]: tGundam001,
  [tGuncannon002.cardNumber]: tGuncannon002,
  [tGuntank003.cardNumber]: tGuntank003,
  [tLeo004.cardNumber]: tLeo004,
  [tTallgeese005.cardNumber]: tTallgeese005,
  [tCharsZakuIi006.cardNumber]: tCharsZakuIi006,
  [tZakuIi007.cardNumber]: tZakuIi007,
  [tAileStrikeGundam008.cardNumber]: tAileStrikeGundam008,
  [tLauncherStrikeGundam009.cardNumber]: tLauncherStrikeGundam009,
  [tSwordStrikeGundam010.cardNumber]: tSwordStrikeGundam010,
  [tDaughtress012.cardNumber]: tDaughtress012,
};
