import { parseDamage } from "./damage";
import { parseDrawDiscard } from "./drawDiscard";
import { parseGrant } from "./grant";
import { parseHeal } from "./heal";
import { parseLore } from "./lore";
import { parseMoveReady } from "./moveReady";
import { parseRestrict } from "./restrict";
import { parseReturnPut } from "./returnPut";
import { parseStats } from "./stats";

export function parseStaticAbility(text: string) {
  return (
    parseDrawDiscard(text) ||
    parseDamage(text) ||
    parseRestrict(text) ||
    parseMoveReady(text) ||
    parseReturnPut(text) ||
    parseStats(text) ||
    parseHeal(text) ||
    parseGrant(text) ||
    parseLore(text) ||
    null
  );
}
