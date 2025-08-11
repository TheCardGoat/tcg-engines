import { AbilityBuilder } from "../src/game-engine/engines/lorcana/src/abilities/builder/ability-builder";

function stripUndefinedDeep(obj: any): any {
  if (Array.isArray(obj)) return obj.map(stripUndefinedDeep);
  if (obj && typeof obj === "object") {
    const result: any = {};
    for (const key in obj) {
      if (Object.hasOwn(obj, key) && obj[key] !== undefined) {
        result[key] = stripUndefinedDeep(obj[key]);
      }
    }
    return result;
  }
  return obj;
}

const inputs = [
  "All opposing characters get -2 {S} until the start of your next turn.",
  "Banish chosen item. Draw a card.",
  "Draw 2 cards, then choose and discard a card.",
];

for (const t of inputs) {
  const abilities = AbilityBuilder.fromText(t);
  console.log("===", t);
  console.log(JSON.stringify(stripUndefinedDeep(abilities), null, 2));
}
