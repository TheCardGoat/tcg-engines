import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveKeywordName,
} from "@tcg/grand-archive-types";
import { parseGrandArchiveTestMarkers } from "./test-markers.ts";

export const centralKeywordSuite = "../engine/src/rules/abilities/keyword-effects.test.ts";

export const specializedCentralKeywordContracts = {
  "divine-relic": {
    testPath: "../engine/src/kernel/engine.test.ts",
    testName: "validates constructed decks and permits only one Divine Relic in a material deck",
  },
} satisfies Partial<
  Record<GrandArchiveKeywordName, { readonly testPath: string; readonly testName: string }>
>;

export const centralKeywordSuites = [
  centralKeywordSuite,
  ...new Set(Object.values(specializedCentralKeywordContracts).map(({ testPath }) => testPath)),
];

/** Audited, parameter-free contracts. Parameterized keywords require an explicit contract extension. */
export const centralKeywordContracts = {
  aetherwing:
    "Aetherwing requires a load, moves every loaded card to intent, and excludes attack cards",
  hindered: "Hindered enters the field rested",
  bulwark: "Bulwark enters the field with one bulwark counter per instance",
  vigor: "Vigor wakes the unit at the beginning of its controller's end step",
  foster:
    "Foster fosters an undamaged ally at the beginning of its controller's recollection phase",
  taunt: "Taunt forces awake taunt units to be targeted before other objects",
  stealth: "Stealth blocks attack declarations unless the attacker has True Sight",
  "true-sight": "Stealth blocks attack declarations unless the attacker has True Sight",
  unblockable: "Unblockable attack declarations ignore Taunt",
  spellshroud: "Spellshroud prevents spell targeting but not attack declarations",
  omnishroud: "Omnishroud prevents activation targeting while attacks may still declare it",
  "floating-memory": "Floating Memory pays one memory from the graveyard during materialization",
  reservable: "Reservable rests a ready object to pay one reserve",
  efficiency: "Efficiency reduces a card's reserve cost by the champion's level",
  "fast-activation": "Fast Activation permits an unspeeded card on a non-empty Effects Stack",
  intercept: "Intercept redirects a champion attack to the awake intercept ally",
  ambush: "Ambush lets a non-defending ally retaliate against another defender's attacker",
  steadfast: "Steadfast lets a rested defending ally retaliate",
  cleave: "Cleave attacks every attackable object the chosen player controls",
  siegeable: "Siegeable domains lose durability from combat damage instead of life",
  immortality: "Immortality keeps a lethally damaged unit on the field",
  interdiction: "Interdiction removes Opportunity while its activation is on the Effects Stack",
  unique: "Unique forces a state-based choice between same-name objects",
  renewable: "Renewable returns a banished regalia to its owner's material deck",
  preserve: "Preserve returns a destroyed ally to its owner's material deck",
  "link-shield": "Link Shield destroys the shield instead of its damaged linked ally",
  exalted:
    "Exalted permits playing Exalted-element cards only while a champion enables another advanced element",
} satisfies Partial<Record<GrandArchiveKeywordName, string>>;

export function validateCentralKeywordEvidence(sources: Readonly<Record<string, string>>): void {
  const text = sources[centralKeywordSuite];
  if (!text) throw new Error(`Missing central keyword suite source: ${centralKeywordSuite}`);
  parseGrandArchiveTestMarkers(centralKeywordSuite, `/** @covers central-a1 */\n${text}`);
  for (const title of Object.values(centralKeywordContracts)) {
    if (!text.includes(`it(${JSON.stringify(title)},`))
      throw new Error(`Missing enabled central keyword test: ${title}`);
  }
  for (const { testPath, testName } of Object.values(specializedCentralKeywordContracts)) {
    const specializedText = sources[testPath];
    if (!specializedText) throw new Error(`Missing central keyword suite source: ${testPath}`);
    parseGrandArchiveTestMarkers(testPath, `/** @covers central-a1 */\n${specializedText}`);
    if (!specializedText.includes(`it(${JSON.stringify(testName)},`))
      throw new Error(`Missing enabled central keyword test: ${testName}`);
  }
}

export function centralKeywordEvidence(ability: GrandArchiveAbilityDefinition) {
  const intrinsic =
    (ability.kind === "static" && ability.staticKind === "intrinsic") ||
    (ability.kind === "triggered" && "intrinsic" in ability && ability.intrinsic === true);
  if (!intrinsic || !("keyword" in ability) || !ability.keyword) return null;
  // Fail closed for all additional behavior, restrictions, zones, grouped keywords,
  // parameter values, or future fields rather than silently exempting them.
  const allowed = new Set(["id", "text", "kind", "staticKind", "intrinsic", "keyword"]);
  if (Object.keys(ability).some((key) => !allowed.has(key))) return null;
  if (Object.keys(ability.keyword).some((key) => key !== "name")) return null;
  const name = ability.keyword.name;
  const genericTestName = centralKeywordContracts[name as keyof typeof centralKeywordContracts];
  if (genericTestName)
    return { keyword: name, testPath: centralKeywordSuite, testName: genericTestName };
  const specialized =
    specializedCentralKeywordContracts[name as keyof typeof specializedCentralKeywordContracts];
  return specialized ? { keyword: name, ...specialized } : null;
}
