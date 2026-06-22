import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const toolDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(toolDir, "../../..");
const cardsPackageRoot = path.join(workspaceRoot, "packages/cards/src");
const cardDefinitionsRoot = path.join(cardsPackageRoot, "cards");
const apiBase = "https://admin.starwarsunlimited.com/api/cards";

const promoPrefixes = ["C", "G", "J", "P", "MV"];
const promoRegex = new RegExp(`^(${promoPrefixes.join("|")})\\d\\d$`);
const setNumber = new Map([
  ["SOR", 1],
  ["SHD", 2],
  ["TWI", 3],
  ["JTL", 4],
  ["LOF", 5],
  ["IBH", 5.9],
  ["SEC", 6],
  ["LAW", 7],
  ["TS26", 7.5],
  ["ASH", 8],
]);
const setDirectoryPrefix = new Map([
  ["SOR", "01"],
  ["SHD", "02"],
  ["TWI", "03"],
  ["JTL", "04"],
  ["LOF", "05"],
  ["IBH", "06"],
  ["SEC", "06"],
  ["LAW", "07"],
  ["TS26", "07"],
  ["ASH", "08"],
]);

function isPromoSetCode(setCode) {
  if (promoRegex.test(setCode)) return true;
  if (setCode === "GG") return true;
  return /^\w{2,3}O?P$/.test(setCode);
}

function attributeNames(attributeList) {
  if (!attributeList?.data) return [];
  if (Array.isArray(attributeList.data)) {
    return attributeList.data.map((attr) => attr.attributes.name.toLowerCase());
  }
  return attributeList.data.attributes.name.toLowerCase();
}

function asArray(value) {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

function buildSetCodeList(card) {
  if (!card.reprints?.data?.length) return [card.setId];
  const reprintSetIds = card.reprints.data
    .map((reprint) => ({
      set: reprint.attributes.expansion.data.attributes.code,
      number: reprint.attributes.cardNumber,
    }))
    .filter((setId) => !isPromoSetCode(setId.set));
  return [card.setId].concat(reprintSetIds);
}

function makeSetCodeString(setCode) {
  return `${setCode.set}_${String(setCode.number).padStart(3, "0")}`;
}

function populateMissingData(attributes, id) {
  switch (id) {
    case "3941784506":
    case "3463348370":
      attributes.type = { data: { attributes: { name: "token unit" } } };
      break;
    case "8752877738":
      attributes.upgradeHp = 0;
      attributes.upgradePower = 0;
      break;
    case "5844562972":
      attributes.upgradeHp = 0;
      attributes.upgradePower = 1;
      break;
    case "8015500527":
    case "4571900905":
      attributes.cost = 0;
      attributes.type = { data: { attributes: { name: "token" } } };
      break;
    case "8777351722":
      attributes.keywords = { data: [{ attributes: { name: "Overwhelm" } }] };
      break;
    case "0026166404":
      attributes.aspects = {
        data: [{ attributes: { name: "Cunning" } }, { attributes: { name: "Heroism" } }],
      };
      attributes.backSideTraits = {
        data: [
          { attributes: { name: "Force" } },
          { attributes: { name: "Separatist" } },
          { attributes: { name: "Sith" } },
        ],
      };
      attributes.backSideAspects = {
        data: [{ attributes: { name: "Cunning" } }, { attributes: { name: "Villainy" } }],
      };
      attributes.backSideTitle = "Darth Sidious";
      break;
    case "8862896760":
      attributes.text =
        "Ambush\nOverwhelm\nOn Attack: You may choose another friendly Underworld unit. If you do, all combat damage that would be dealt to this unit during this attack is dealt to the chosen unit instead.";
      break;
    case "0011262813":
      attributes.keywords = { data: [] };
      break;
    case "5683908835":
      attributes.keywords = {
        data: [{ attributes: { name: "Overwhelm" } }, { attributes: { name: "Exploit" } }],
      };
      break;
    case "0754286363":
      attributes.unique = true;
      break;
    case "6190335038":
      attributes.traits = {
        data: [
          { attributes: { name: "Force" } },
          { attributes: { name: "Jedi" } },
          { attributes: { name: "Republic" } },
          { attributes: { name: "Twi'lek" } },
        ],
      };
      break;
    case "6658095148":
    case "2157679168":
      attributes.title = "Zeb Orrelios";
      break;
    case "9349017358":
      attributes.title = "C-3PO";
      break;
  }

  switch (id) {
    case "3796991604":
      attributes.keywords = {
        data: [{ attributes: { name: "Plot" } }, { attributes: { name: "Sentinel" } }],
      };
      break;
    case "8826807979":
    case "7394847809":
      attributes.keywords = {
        data: [{ attributes: { name: "Plot" } }, { attributes: { name: "Ambush" } }],
      };
      break;
    case "7069246970":
    case "8365930807":
    case "3612601170":
    case "0024944513":
    case "7936097828":
    case "7365023470":
    case "2919204327":
    case "9985741271":
    case "2877797132":
    case "3776423866":
    case "8845103653":
    case "0602708575":
    case "7482343383":
    case "2785395871":
    case "8401985446":
    case "1369084772":
    case "6015383018":
    case "8796918121":
    case "7248761207":
    case "5736131351":
    case "2276001210":
    case "1970175552":
    case "2792329893":
    case "3206848209":
    case "1501441701":
    case "9755584844":
      attributes.keywords = { data: [{ attributes: { name: "Plot" } }] };
      break;
  }
}

function normalizeCard(apiCard) {
  const attributes = structuredClone(apiCard.attributes);
  if (attributes.variantOf?.data !== null) return null;
  if (isPromoSetCode(attributes.expansion.data.attributes.code)) return null;

  const id = attributes.cardId || attributes.cardUid;
  populateMissingData(attributes, id);

  const card = {
    title: attributes.title,
    backSideTitle: attributes.backSideTitle,
    subtitle: attributes.subtitle,
    cost: attributes.cost,
    hp: attributes.hp,
    power: attributes.power,
    text: attributes.text,
    deployBox: attributes.deployBox,
    epicAction: attributes.epicAction,
    unique: attributes.unique,
    rules: attributes.rules,
    upgradePower: attributes.upgradePower,
    upgradeHp: attributes.upgradeHp,
    id,
    rarity: attributes.rarity?.data?.attributes?.name?.toLowerCase(),
    aspects: asArray(attributeNames(attributes.aspects)).concat(
      asArray(attributeNames(attributes.aspectDuplicates)),
    ),
    traits: asArray(attributeNames(attributes.traits)),
    arena: asArray(attributeNames(attributes.arenas))[0] ?? null,
    keywords: asArray(attributeNames(attributes.keywords)),
    types: asArray(attributeNames(attributes.type)).flatMap((type) => String(type).split(" ")),
    setId: { set: attributes.expansion.data.attributes.code },
  };

  // Put the native card type first so generated files satisfy the per-type
  // tuple refinements (e.g. SwuUpgradeCard expects "upgrade" first, even when
  // the card is also a token).
  const primaryType = card.types.includes("leader")
    ? "leader"
    : card.types.includes("base")
      ? "base"
      : card.types.includes("event")
        ? "event"
        : card.types.includes("upgrade")
          ? "upgrade"
          : card.types.includes("token")
            ? "token"
            : "unit";
  card.types = [primaryType, ...card.types.filter((type) => type !== primaryType)];

  if (attributes.backSideAspects)
    card.backSideAspects = asArray(attributeNames(attributes.backSideAspects));
  if (attributes.backSideTitle) card.backSideTitle = attributes.backSideTitle;
  if (attributes.backSideTraits)
    card.backSideTraits = asArray(attributeNames(attributes.backSideTraits));

  if (!card.types.includes("token")) {
    card.setId.number = attributes.cardNumber;
    card.setCodes = buildSetCodeList({ ...card, reprints: attributes.reprints });
  }

  if (card.keywords.includes("piloting")) {
    card.pilotText = card.epicAction;
    card.epicAction = null;
  }

  // Upgrades always have upgrade stats; default missing values to 0. They do
  // not have printed power/hp/arena, so strip any API values that leak through
  // from token/unit hybrid records.
  if (card.types.includes("upgrade")) {
    card.upgradePower ??= 0;
    card.upgradeHp ??= 0;
    delete card.hp;
    delete card.power;
    delete card.arena;
  }

  let internalName = card.title;
  internalName += card.subtitle ? `#${card.subtitle}` : "";
  internalName = internalName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  card.internalName = internalName
    .toLowerCase()
    .replace(/[^\w\s#]|_/g, "")
    .replace(/\s/g, "-");
  card.title = card.title.replace(/“|”/g, '"').replace(/‘|’/g, "'");

  return card;
}

async function fetchAllCards() {
  const first = await fetch(apiBase);
  if (!first.ok)
    throw new Error(`Failed to fetch card page metadata: ${first.status} ${first.statusText}`);
  const firstJson = await first.json();
  const pageCount = firstJson.meta.pagination.pageCount;

  const pages = await Promise.all(
    Array.from({ length: pageCount }, async (_, index) => {
      const page = index + 1;
      const response = await fetch(`${apiBase}?pagination[page]=${page}`);
      if (!response.ok)
        throw new Error(
          `Failed to fetch card page ${page}: ${response.status} ${response.statusText}`,
        );
      const json = await response.json();
      return json.data;
    }),
  );

  return pages.flat().map(normalizeCard).filter(Boolean);
}

async function walkFiles(root) {
  const entries = await fs.readdir(root, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "common") files.push(...(await walkFiles(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith(".ts") && entry.name !== "Index.ts") {
      files.push(fullPath);
    }
  }
  return files;
}

function extractAbilitiesSource(source) {
  const start = source.indexOf("abilities:");
  if (start === -1) return undefined;
  let bracketStart = source.indexOf("[", start);
  if (bracketStart === -1) return undefined;
  let depth = 1;
  let index = bracketStart + 1;
  while (index < source.length && depth > 0) {
    const char = source[index];
    if (char === "[") depth++;
    else if (char === "]") depth--;
    index++;
  }
  return source.slice(start, index).trim();
}

function extractPreamble(source) {
  const exportStart = source.search(/\nexport const \w+\s*=/);
  if (exportStart === -1) return undefined;
  const beforeExport = source.slice(0, exportStart);
  const lines = beforeExport.split("\n");
  const lastImportIndex = lines.findLastIndex((line) => /^import\b/.test(line));
  const preamble = lines
    .slice(lastImportIndex + 1)
    .join("\n")
    .trim();
  return preamble || undefined;
}

async function readExistingDefinitions() {
  try {
    await fs.access(cardDefinitionsRoot);
  } catch (error) {
    if (error.code === "ENOENT") return new Map();
    throw error;
  }

  const files = await walkFiles(cardDefinitionsRoot);
  const definitions = new Map();
  for (const file of files.sort()) {
    if (path.basename(file) === "index.ts") continue;
    const source = await fs.readFile(file, "utf8");
    const definitionJson = source.match(
      /export const \w+ = ([\s\S]+?) satisfies (?:SwuCardDefinition|Swu(?:Base|Event|Leader|Token|Unit|Upgrade)Card);/,
    )?.[1];
    if (!definitionJson) {
      throw new Error(`Could not read card definition from ${file}`);
    }
    const definition = {
      id: readStringProperty(definitionJson, "id"),
      internalName: readStringProperty(definitionJson, "internalName"),
      cardType: readStringProperty(definitionJson, "cardType"),
    };
    if (!definition.id || !definition.internalName) {
      throw new Error(`Could not read card id/internalName from ${file}`);
    }
    const helperImports = source.match(/^import \{[^}]+\} from [^;]+;$/gm) ?? [];
    const preamble = extractPreamble(source);
    definitions.set(definition.id, {
      definition,
      relativePath: path.relative(cardDefinitionsRoot, file).replaceAll(path.sep, "/"),
      abilitiesSource: extractAbilitiesSource(source),
      helperImports,
      preamble,
    });
  }
  return definitions;
}

function readStringProperty(source, property) {
  return source.match(new RegExp(`(?:"${property}"|${property}):\\s*"([^"]+)"`))?.[1];
}

function buildCardLists(cards) {
  const cardMap = [];
  const setCodeMap = {};
  const allNonLeaderCardTitlesSet = new Set();
  const playableCardTitlesSet = new Set();
  const leaderNames = [];

  for (const card of cards) {
    cardMap.push({
      id: card.id,
      internalName: card.internalName,
      title: card.title,
      subtitle: card.subtitle,
      cost: card.cost,
      rarity: card.rarity,
    });

    if (!card.types.includes("leader")) {
      allNonLeaderCardTitlesSet.add(card.title);
      if (!card.types.includes("token") && !card.types.includes("base")) {
        playableCardTitlesSet.add(card.title);
      }
    }

    if (card.types.includes("leader") && card.setId?.number != null) {
      leaderNames.push({
        name: card.title,
        id: makeSetCodeString(card.setId),
        subtitle: card.subtitle,
      });
    }

    for (const setCode of card.setCodes ?? []) {
      if (setNumber.has(setCode.set)) {
        setCodeMap[makeSetCodeString(setCode)] = card.id;
      }
    }
  }

  return {
    cardMap,
    allNonLeaderCardTitles: [...allNonLeaderCardTitlesSet].sort(),
    playableCardTitles: [...playableCardTitlesSet].sort(),
    setCodeMap,
    leaderNames,
  };
}

function stableStringify(value) {
  return JSON.stringify(value, null, 2);
}

function isEmptyValue(value) {
  return value === null || value === "" || (Array.isArray(value) && value.length === 0);
}

function stripEmptyProperties(value) {
  if (Array.isArray(value)) {
    return value.filter((item) => !isEmptyValue(item)).map((item) => stripEmptyProperties(item));
  }
  if (value !== null && typeof value === "object") {
    const result = {};
    for (const [key, val] of Object.entries(value)) {
      if (isEmptyValue(val)) continue;
      result[key] = stripEmptyProperties(val);
    }
    return result;
  }
  return value;
}

const cardTypeSatisfiesType = {
  base: "SwuBaseCard",
  event: "SwuEventCard",
  leader: "SwuLeaderCard",
  token: "SwuTokenCard",
  unit: "SwuUnitCard",
  upgrade: "SwuUpgradeCard",
};

function pascalCase(value) {
  return value
    .replace(/(^|[^a-zA-Z0-9]+)([a-zA-Z0-9])/g, (_match, _separator, char) => char.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, "");
}

function cardExportName(card) {
  const pascalName = card.internalName.replace(
    /(^|[^a-zA-Z0-9]+)([a-zA-Z0-9])/g,
    (_match, _separator, char) => char.toUpperCase(),
  );
  return `swu${pascalName.replace(/[^a-zA-Z0-9]/g, "")}`;
}

function collectorSuffix(card) {
  const set = pascalCase(card.setId?.set ?? "UnknownSet");
  const number = card.setId?.number == null ? "" : String(card.setId.number).replace(/\D/g, "");
  return `${set}${number}`;
}

const keywordText = {
  ambush: "Ambush",
  bounty: "Bounty",
  coordinate: "Coordinate",
  exploit: "Exploit",
  grit: "Grit",
  hidden: "Hidden",
  overwhelm: "Overwhelm",
  piloting: "Piloting",
  plot: "Plot",
  raid: "Raid",
  restore: "Restore",
  saboteur: "Saboteur",
  sentinel: "Sentinel",
  shielded: "Shielded",
  smuggle: "Smuggle",
  support: "Support",
};

const aspectNames = new Set([
  "aggression",
  "command",
  "cunning",
  "heroism",
  "vigilance",
  "villainy",
]);

function nativeCardType(card) {
  if (card.types.includes("leader")) return "leader";
  if (card.types.includes("base")) return "base";
  if (card.types.includes("event")) return "event";
  if (card.types.includes("upgrade")) return "upgrade";
  if (card.types.includes("token")) return "token";
  return "unit";
}

function nativeAbilities(card) {
  return [...nativeKeywordAbilities(card), ...nativeTextAbilities(card)];
}

function nativeKeywordAbilities(card) {
  return (card.keywords ?? [])
    .filter((keyword) => Object.hasOwn(keywordText, keyword))
    .map((keyword) => ({
      kind: "keyword",
      text: keywordText[keyword],
      keyword,
      effects: [],
    }));
}

function normalizeRulesText(text) {
  return String(text ?? "")
    .replaceAll("–", "-")
    .replaceAll("—", "-")
    .replaceAll("−", "-")
    .replaceAll("‑", "-")
    .replace(/\s+/g, " ")
    .trim();
}

function numberFromText(value) {
  if (!value) return 1;
  const normalized = value.toLowerCase();
  if (normalized === "a" || normalized === "an") return 1;
  return Number.parseInt(normalized, 10);
}

const tokenNameMap = new Map([
  ["battle droid", "battleDroid"],
  ["clone trooper", "cloneTrooper"],
  ["credit", "credit"],
  ["force", "force"],
  ["mandalorian", "mandalorian"],
  ["shield", "shield"],
  ["spy", "spy"],
  ["tie fighter", "tieFighter"],
  ["x-wing", "xWing"],
  ["xwing", "xWing"],
]);

function tokenFromText(value) {
  return tokenNameMap.get(value.toLowerCase());
}

function keywordFromText(value) {
  const normalized = value.toLowerCase().replace(/\s+\d+$/, "");
  return Object.hasOwn(keywordText, normalized) ? normalized : null;
}

function aspectFromText(value) {
  const normalized = value.toLowerCase().replace(/[[\]]/g, "");
  return aspectNames.has(normalized) ? normalized : null;
}

function unitTarget(controller, arena, extras = {}) {
  return {
    type: "card",
    controller,
    zones: ["groundArena", "spaceArena"],
    cardTypes: ["unit", "token"],
    ...(arena ? { arena } : {}),
    ...extras,
  };
}

const unitTraitPhraseMap = new Map([
  ["imperial", "imperial"],
  ["rebel", "rebel"],
  ["separatist", "separatist"],
  ["republic", "republic"],
  ["mandalorian", "mandalorian"],
  ["vehicle", "vehicle"],
  ["force", "force"],
  ["underworld", "underworld"],
  ["bounty hunter", "bounty hunter"],
  ["jedi", "jedi"],
  ["sith", "sith"],
  ["official", "official"],
  ["trooper", "trooper"],
  ["wookiee", "wookiee"],
]);

function traitsFromUnitPhrase(phrase) {
  return [...unitTraitPhraseMap]
    .filter(([text]) => new RegExp(`\\b${text}\\b`, "i").test(phrase))
    .map(([, trait]) => trait);
}

function attachTargetFromText(rawText) {
  const text = normalizeRulesText(rawText).replace(/\.$/, "");
  const match = text.match(/^Attach to (?:a|an) (.+)$/i);
  if (!match) return null;
  const phrase = match[1].toLowerCase();
  if (!phrase.includes("unit")) return null;
  return unitTarget(phrase.includes("friendly") ? "friendly" : "any", undefined, {
    limit: 1,
    ...(phrase.includes("force") ? { traits: ["Force"] } : {}),
    ...(phrase.includes("vehicle") && !phrase.includes("non-") ? { traits: ["Vehicle"] } : {}),
    ...(phrase.includes("non-vehicle") ? { withoutTraits: ["Vehicle"] } : {}),
  });
}

function targetFromPhrase(rawPhrase) {
  const phrase = normalizeRulesText(rawPhrase)
    .replace(/\.$/, "")
    .replace(/^to /i, "")
    .replace(/^from /i, "")
    .replace(/^each /i, "all ")
    .trim();
  const lower = phrase.toLowerCase();

  if (
    lower === "this unit" ||
    lower === "it" ||
    lower === "he" ||
    lower === "she" ||
    lower === "this card"
  ) {
    return { type: "self" };
  }
  if (lower === "this event") return { type: "self" };
  if (lower === "the defender" || lower === "defender") {
    return { type: "choice", id: "defender", controller: "opponent" };
  }
  if (lower.includes("attached unit")) return { type: "attachedUnit" };
  if (lower.includes("your base")) return { type: "base", controller: "friendly" };
  if (lower.includes("enemy base") || lower.includes("opponent's base")) {
    return { type: "base", controller: "opponent" };
  }
  if (lower === "a base" || lower === "all bases" || lower === "each base") {
    return { type: "base", controller: "any" };
  }

  if (!lower.includes("non-upgrade") && /\bupgrades?\b/.test(lower)) {
    return {
      type: "card",
      controller: lower.includes("enemy") ? "opponent" : "any",
      zones: ["groundArena", "spaceArena"],
      cardTypes: ["upgrade"],
      limit: lower.startsWith("all ") ? undefined : 1,
    };
  }

  if (/\bresources?\b/.test(lower)) {
    return {
      type: "card",
      controller: lower.includes("opponent") ? "opponent" : "friendly",
      zones: ["resource"],
      limit: lower.startsWith("all ") ? undefined : 1,
    };
  }

  if (/\bcards?\b/.test(lower) && /\bdiscard pile\b/.test(lower)) {
    return {
      type: "card",
      controller:
        lower.includes("opponent") || lower.includes("enemy")
          ? "opponent"
          : lower.includes("your")
            ? "friendly"
            : "any",
      zones: ["discard"],
      ...(lower.includes("underworld") ? { traits: ["underworld"] } : {}),
      limit: lower.startsWith("all ") ? undefined : 1,
    };
  }

  if (/\bevents?\b/.test(lower) && /\bhand\b/.test(lower)) {
    return {
      type: "card",
      controller: lower.includes("opponent") ? "opponent" : "friendly",
      zones: ["hand"],
      cardTypes: ["event"],
      limit: lower.startsWith("all ") ? undefined : 1,
    };
  }

  if (/\bcards?\b/.test(lower) && /\bhand\b/.test(lower)) {
    return {
      type: "card",
      controller:
        lower.includes("opponent") || lower.includes("enemy")
          ? "opponent"
          : lower.includes("your")
            ? "friendly"
            : "any",
      zones: ["hand"],
      limit: lower.startsWith("all ") ? undefined : 1,
    };
  }

  if (/\bcards?\b/.test(lower) && /\bdeck\b/.test(lower)) {
    return {
      type: "card",
      controller: lower.includes("opponent") ? "opponent" : "friendly",
      zones: ["deck"],
      limit: lower.match(/\btop (\d+)\b/)
        ? Number.parseInt(lower.match(/\btop (\d+)\b/)[1], 10)
        : 1,
    };
  }

  if (lower.includes("leader unit")) {
    return {
      type: "card",
      controller:
        lower.includes("enemy") || lower.includes("opponent")
          ? "opponent"
          : lower.includes("your") || lower.includes("you control") || lower.includes("friendly")
            ? "friendly"
            : "any",
      zones: ["groundArena", "spaceArena"],
      cardTypes: ["leader"],
      limit: lower.startsWith("all ") ? undefined : 1,
    };
  }

  if (lower.includes("unit") && lower.includes("hand")) {
    return {
      type: "card",
      controller:
        lower.includes("opponent") || lower.includes("enemy")
          ? "opponent"
          : lower.includes("your")
            ? "friendly"
            : "any",
      zones: ["hand"],
      cardTypes: ["unit"],
      limit: lower.startsWith("all ") ? undefined : 1,
    };
  }

  if (!lower.includes("unit")) return null;

  const controller = lower.includes("enemy")
    ? "opponent"
    : lower.includes("friendly") || lower.includes("your") || lower.includes("you control")
      ? "friendly"
      : "any";
  const arena = lower.includes("ground unit")
    ? "ground"
    : lower.includes("space unit")
      ? "space"
      : undefined;
  const hpMatch = lower.match(/(?:hp|remaining hp).*?(\d+)|(\d+)\s+or less remaining hp/i);
  const costMatch = lower.match(/costs? (\d+) or (less|more)/i);
  const traits = traitsFromUnitPhrase(lower);
  return unitTarget(controller, arena, {
    excludeSelf: lower.includes("other"),
    limit: lower.startsWith("all ") ? undefined : 1,
    ...(traits.length > 0 ? { traits } : {}),
    ...(costMatch
      ? {
          cost: {
            operator: costMatch[2] === "less" ? "lte" : "gte",
            value: Number.parseInt(costMatch[1], 10),
          },
        }
      : {}),
    ...(hpMatch
      ? { hp: { operator: "lte", value: Number.parseInt(hpMatch[1] ?? hpMatch[2], 10) } }
      : {}),
  });
}

function parseSimpleEffects(rawText) {
  const normalizedText = normalizeRulesText(rawText);
  const text = normalizedText.replace(/^you may /i, "").replace(/^choose (?:a|an|one) /i, "");

  const deployLeaderMatch = text.match(
    /^if you control \d+ or more resources, deploy this leader/i,
  );
  if (deployLeaderMatch) {
    return [{ type: "move", target: { type: "self" }, to: "groundArena" }];
  }

  const forceTokenMatch = text.match(/^the force is with you\b/i);
  if (forceTokenMatch) {
    return [{ type: "createToken", token: "force", amount: 1 }];
  }

  const selfCannotAttackMatch = text.match(/^this unit can't attack\.?$/i);
  if (selfCannotAttackMatch) {
    return [
      {
        type: "restrictAttack",
        target: { type: "self" },
        restriction: "cannotAttack",
        duration: "continuous",
      },
    ];
  }

  const attachedUnitCannotAttackBasesMatch = text.match(/^attached unit can't attack bases\.?$/i);
  if (attachedUnitCannotAttackBasesMatch) {
    return [
      {
        type: "restrictAttack",
        target: { type: "attachedUnit" },
        restriction: "cannotAttackBases",
        duration: "continuous",
      },
    ];
  }

  const selfCombatDamageFirstMatch = text.match(
    /^while attacking, this unit deals combat damage before the defender/i,
  );
  if (selfCombatDamageFirstMatch) {
    return [{ type: "combatDamageFirst", target: { type: "self" } }];
  }

  if (/^bases can't be healed\.?$/i.test(text)) {
    return [
      {
        type: "loseHealing",
        target: { type: "base", controller: "any" },
        duration: "continuous",
      },
    ];
  }

  if (
    /^if damage would be dealt to attached unit, prevent that damage\.? if you do, defeat a shield token on it\.?$/i.test(
      text,
    )
  ) {
    return [
      {
        type: "preventDamage",
        target: { type: "attachedUnit" },
        duration: "continuous",
      },
    ];
  }

  const payResourceIfYouDoMatch = text.match(/^pay \d+ resources?\. if you do, (.+)$/i);
  if (payResourceIfYouDoMatch) {
    return parseSimpleEffects(payResourceIfYouDoMatch[1]);
  }

  const discloseIfYouDoMatch = text.match(/^disclose [^(]+(?:\s*\([^)]*\))?\. if you do, (.+)$/i);
  if (discloseIfYouDoMatch) {
    return parseSimpleEffects(discloseIfYouDoMatch[1]);
  }

  const useForceIfYouDoMatch = text.match(/^use the force(?:\s*\([^)]*\))?\. if you do, (.+)$/i);
  if (useForceIfYouDoMatch) {
    const thenEffects = parseSimpleEffects(useForceIfYouDoMatch[1]);
    return thenEffects.length > 0
      ? [{ type: "ifYouDo", doEffect: { type: "useForce" }, thenEffects }]
      : [];
  }

  const payResourcesIfYouDoMatch = text.match(
    /^you may pay \[?(\d+) resources?\]?\. if you do, (.+)$/i,
  );
  if (payResourcesIfYouDoMatch) {
    const thenEffects = parseSimpleEffects(payResourcesIfYouDoMatch[2]);
    return thenEffects.length > 0
      ? [
          {
            type: "optional",
            effects: [
              {
                type: "ifYouDo",
                doEffect: {
                  type: "payResources",
                  amount: Number.parseInt(payResourcesIfYouDoMatch[1], 10),
                },
                thenEffects,
              },
            ],
          },
        ]
      : [];
  }

  const revealFromHandIfYouDoMatch = text.match(/^reveal (.+? from your hand)\. if you do, (.+)$/i);
  if (revealFromHandIfYouDoMatch) {
    const target = targetFromPhrase(revealFromHandIfYouDoMatch[1]);
    const thenEffects = parseSimpleEffects(revealFromHandIfYouDoMatch[2]);
    if (target && thenEffects.length > 0) {
      return [
        {
          type: "ifYouDo",
          doEffect: { type: "reveal", target },
          thenEffects,
        },
      ];
    }
  }

  const choosePlayerDrawMatch = normalizedText.match(/^choose a player\. they draw (\d+) cards?$/i);
  if (choosePlayerDrawMatch) {
    return [
      {
        type: "draw",
        controller: "friendly",
        amount: Number.parseInt(choosePlayerDrawMatch[1], 10),
      },
    ];
  }

  const choosePlayerDiscardMatch = normalizedText.match(
    /^choose a player\. (?:they|that player) discards? (\d+|a) cards? from their hand/i,
  );
  if (choosePlayerDiscardMatch) {
    const amount = numberFromText(choosePlayerDiscardMatch[1]);
    return [
      {
        type: "discard",
        target: { type: "card", controller: "opponent", zones: ["hand"], limit: amount },
        amount,
      },
    ];
  }

  const chooseUnitDamageMatch = normalizedText.match(/^choose a unit\. deal (\d+) damage to it$/i);
  if (chooseUnitDamageMatch) {
    return [
      {
        type: "damage",
        amount: Number.parseInt(chooseUnitDamageMatch[1], 10),
        target: unitTarget("any", undefined, { limit: 1 }),
      },
    ];
  }

  const chooseArenaDamageMatch = normalizedText.match(
    /^choose an arena(?: \(ground or space\))?\. deal (\d+) damage to each unit in that arena$/i,
  );
  if (chooseArenaDamageMatch) {
    const amount = Number.parseInt(chooseArenaDamageMatch[1], 10);
    return [
      {
        type: "choose",
        choices: [
          {
            id: "ground",
            label: "Ground",
            effects: [{ type: "damage", amount, target: unitTarget("any", "ground") }],
          },
          {
            id: "space",
            label: "Space",
            effects: [{ type: "damage", amount, target: unitTarget("any", "space") }],
          },
        ],
      },
    ];
  }

  const chooseArenaExhaustMatch = normalizedText.match(
    /^choose an arena(?: \(ground or space\))?\. exhaust each unit in that arena$/i,
  );
  if (chooseArenaExhaustMatch) {
    return [
      {
        type: "choose",
        choices: [
          {
            id: "ground",
            label: "Ground",
            effects: [{ type: "exhaust", target: unitTarget("any", "ground") }],
          },
          {
            id: "space",
            label: "Space",
            effects: [{ type: "exhaust", target: unitTarget("any", "space") }],
          },
        ],
      },
    ];
  }

  const chooseUnitStatMatch = normalizedText.match(
    /^choose a unit(?: that entered play this phase)?\. it gets ([+-]\d+)\/([+-]\d+) for this phase$/i,
  );
  if (chooseUnitStatMatch) {
    return [
      {
        type: "modifyStats",
        target: unitTarget("any", undefined, { limit: 1 }),
        power: Number.parseInt(chooseUnitStatMatch[1], 10),
        hp: Number.parseInt(chooseUnitStatMatch[2], 10),
        duration: "phase",
      },
    ];
  }

  const chooseUnitTokenMatch = normalizedText.match(
    /^choose a unit\. give (?:(an?|\d+) experience tokens?|(?:a|\d+) shield tokens?) to (?:it|that unit)$/i,
  );
  if (chooseUnitTokenMatch) {
    const amount = numberFromText(chooseUnitTokenMatch[1]);
    if (/shield/i.test(normalizedText)) {
      return [
        {
          type: "createToken",
          token: "shield",
          amount,
          target: unitTarget("any", undefined, { limit: 1 }),
        },
      ];
    }
    return [
      {
        type: "distribute",
        mode: "experience",
        amount,
        target: unitTarget("any", undefined, { limit: 1 }),
      },
    ];
  }

  const chooseFriendlyUnitExperienceForceShieldAttackMatch = normalizedText.match(
    /^choose a friendly unit and give (\d+) experience tokens? to it\. if you control a force unit, also give a shield token to the chosen unit\. you may attack with the chosen unit\.?$/i,
  );
  if (chooseFriendlyUnitExperienceForceShieldAttackMatch) {
    const target = unitTarget("friendly", undefined, { limit: 1 });
    return [
      {
        type: "sequential",
        effects: [
          {
            type: "distribute",
            mode: "experience",
            amount: Number.parseInt(chooseFriendlyUnitExperienceForceShieldAttackMatch[1], 10),
            target,
          },
          {
            type: "conditional",
            condition: {
              type: "controlsTrait",
              controller: "friendly",
              trait: "force",
            },
            ifTrue: [{ type: "createToken", token: "shield", amount: 1, target }],
          },
          {
            type: "optional",
            effects: [
              {
                type: "attack",
                attacker: target,
                defender: { type: "base", controller: "opponent" },
              },
            ],
          },
        ],
      },
    ];
  }

  const chooseBaseHealMatch = normalizedText.match(
    /^choose a base\. heal (\d+) damage from (?:it|.+base)$/i,
  );
  if (chooseBaseHealMatch) {
    return [
      {
        type: "heal",
        amount: Number.parseInt(chooseBaseHealMatch[1], 10),
        target: { type: "base", controller: "any" },
      },
    ];
  }

  const createTokenMatch = text.match(
    /^create (?:(a|an)|(\d+)) ([a-z -]+?) tokens?(?:\b|,| and|\.)/i,
  );
  if (createTokenMatch) {
    const token = tokenFromText(createTokenMatch[3]);
    if (token) {
      return [
        {
          type: "createToken",
          token,
          amount: numberFromText(createTokenMatch[1] ?? createTokenMatch[2]),
        },
      ];
    }
  }

  const returnToHandMatch = text.match(/^return (.+?) to (?:its|their|her|his) owner's hand$/i);
  if (returnToHandMatch) {
    const target = targetFromPhrase(returnToHandMatch[1]);
    return target ? [{ type: "move", target, to: "hand" }] : [];
  }

  const returnDiscardToHandMatch = text.match(/^return (.+? from .+ discard pile) to your hand$/i);
  if (returnDiscardToHandMatch) {
    const target = targetFromPhrase(returnDiscardToHandMatch[1]);
    return target ? [{ type: "move", target, to: "hand" }] : [];
  }

  const takeControlMatch = text.match(/^take control of (.+)$/i);
  if (takeControlMatch) {
    const target = targetFromPhrase(takeControlMatch[1]);
    return target ? [{ type: "takeControl", target }] : [];
  }

  const captureMatch = text.match(
    /^(?:a friendly unit|this unit|attached unit|your base) captures? (.+?)(?: with .+| in the same arena)?$/i,
  );
  if (captureMatch) {
    const target = targetFromPhrase(captureMatch[1]);
    return target ? [{ type: "capture", target }] : [];
  }

  const attackWithMatch = text.match(/^attack with (.+?)(?:, even if .*)?$/i);
  if (attackWithMatch) {
    const target = targetFromPhrase(attackWithMatch[1]);
    return target
      ? [
          {
            type: "attack",
            attacker: target,
            defender: { type: "base", controller: "opponent" },
          },
        ]
      : [];
  }

  const lookAtOpponentHandDiscardMatch = text.match(
    /^look at an opponent's hand(?:, then name a card)? and discard (.+?) from it$/i,
  );
  if (lookAtOpponentHandDiscardMatch) {
    const discarded = lookAtOpponentHandDiscardMatch[1].toLowerCase();
    return [
      { type: "lookAt", target: { type: "player", controller: "opponent" } },
      {
        type: "discard",
        target: {
          type: "card",
          controller: "opponent",
          zones: ["hand"],
          limit: 1,
          ...(discarded.includes("unit") && !discarded.includes("non-unit")
            ? { cardTypes: ["unit"] }
            : {}),
        },
        amount: 1,
      },
    ];
  }

  const lookAtOpponentHandMatch = text.match(/^look at an opponent's hand$/i);
  if (lookAtOpponentHandMatch) {
    return [{ type: "lookAt", target: { type: "player", controller: "opponent" } }];
  }

  const lookAtTopDeckReorderMatch = text.match(
    /^look at the top (\d+) cards? of your deck\. put any number of them on the bottom of your deck and the rest on top in any order$/i,
  );
  if (lookAtTopDeckReorderMatch) {
    const amount = Number.parseInt(lookAtTopDeckReorderMatch[1], 10);
    const target = { type: "card", controller: "friendly", zones: ["deck"], limit: amount };
    return [
      {
        type: "sequential",
        effects: [
          { type: "lookAt", target },
          {
            type: "reorder",
            target,
            destination: "bottomOfDeck",
            order: "any",
          },
          {
            type: "reorder",
            target,
            destination: "topOfDeck",
            order: "any",
          },
        ],
      },
    ];
  }

  const lookAtTopDeckOptionalBottomMatch = text.match(
    /^look at the top card of your deck\. you may put it on the bottom of your deck/i,
  );
  if (lookAtTopDeckOptionalBottomMatch) {
    const target = { type: "card", controller: "friendly", zones: ["deck"], limit: 1 };
    return [
      {
        type: "sequential",
        effects: [
          { type: "lookAt", target },
          {
            type: "optional",
            effects: [
              {
                type: "reorder",
                target,
                destination: "bottomOfDeck",
                order: "any",
              },
            ],
          },
        ],
      },
    ];
  }

  const opponentDiscardsMatch = text.match(
    /^(?:an|each) opponent discards a card from their hand$/i,
  );
  if (opponentDiscardsMatch) {
    return [
      {
        type: "discard",
        target: { type: "card", controller: "opponent", zones: ["hand"], limit: 1 },
        amount: 1,
      },
    ];
  }

  const eachPlayerDiscardsMatch = text.match(/^each player discards a card from their hand$/i);
  if (eachPlayerDiscardsMatch) {
    return [
      {
        type: "discard",
        target: { type: "card", controller: "any", zones: ["hand"], limit: 2 },
        amount: 2,
      },
    ];
  }

  const eachPlayerResourcesTopDeckMatch = text.match(
    /^each player resources the top card of their deck$/i,
  );
  if (eachPlayerResourcesTopDeckMatch) {
    return [
      {
        type: "resource",
        target: { type: "card", controller: "any", zones: ["deck"], limit: 2 },
        ready: false,
      },
    ];
  }

  const resourceTopDeckMatch = text.match(
    /^(?:put|resource) the top card of your deck(?: into play)? as a resource(?: and ready it)?$/i,
  );
  if (resourceTopDeckMatch) {
    return [
      {
        type: "resource",
        target: { type: "card", controller: "friendly", zones: ["deck"], limit: 1 },
        ready: /ready it/i.test(text),
      },
    ];
  }

  const gainKeywordMatch = text.match(
    /^(?:(this unit|attached unit|each unit|each friendly unit|another friendly unit|a unit|an enemy unit) )?gains? ([a-z]+(?: \d+)?)(?: for (?:this|the) (phase|attack|round|turn))?/i,
  );
  if (gainKeywordMatch) {
    const keyword = keywordFromText(gainKeywordMatch[2]);
    const target = targetFromPhrase(gainKeywordMatch[1] ?? "this unit");
    if (keyword && target) {
      return [
        {
          type: "gainKeyword",
          target,
          keyword,
          ...(gainKeywordMatch[3] ? { duration: gainKeywordMatch[3].toLowerCase() } : {}),
        },
      ];
    }
  }

  const gainTraitMatch = text.match(
    /^(?:(this unit|attached unit|each unit|each friendly unit|friendly leaders|another friendly unit|a unit|an enemy unit) )?gains? the ([A-Za-z' -]+?) trait(?: for (?:this|the) (phase|attack|round|turn))?$/i,
  );
  if (gainTraitMatch) {
    const target = targetFromPhrase(gainTraitMatch[1] ?? "this unit");
    if (target) {
      return [
        {
          type: "gainTrait",
          target,
          trait: gainTraitMatch[2].toLowerCase(),
          ...(gainTraitMatch[3] ? { duration: gainTraitMatch[3].toLowerCase() } : {}),
        },
      ];
    }
  }

  const groupGainKeywordMatch = text.match(/^(each .+?|all .+?) gains? ([a-z]+(?: \d+)?)$/i);
  if (groupGainKeywordMatch) {
    const target = targetFromPhrase(groupGainKeywordMatch[1]);
    const keyword = keywordFromText(groupGainKeywordMatch[2]);
    if (target && keyword) {
      return [
        {
          type: "gainKeyword",
          target,
          keyword,
          duration: "continuous",
        },
      ];
    }
  }

  const giveKeywordMatch = text.match(
    /^give (.+?) ([a-z]+(?: \d+)?)(?: for (?:this|the) (phase|attack|round|turn))?$/i,
  );
  if (giveKeywordMatch) {
    const keyword = keywordFromText(giveKeywordMatch[2]);
    const target = targetFromPhrase(giveKeywordMatch[1]);
    if (keyword && target) {
      return [
        {
          type: "gainKeyword",
          target,
          keyword,
          ...(giveKeywordMatch[3] ? { duration: giveKeywordMatch[3].toLowerCase() } : {}),
        },
      ];
    }
  }

  const loseKeywordMatch = text.match(
    /^(?:(a unit|each unit|all units|enemy units|attached unit|this unit) )?loses? ([a-z]+(?: \d+)?)(?: for (?:this|the) (phase|attack|round|turn))?$/i,
  );
  if (loseKeywordMatch) {
    const keyword = keywordFromText(loseKeywordMatch[2]);
    const target = targetFromPhrase(loseKeywordMatch[1] ?? "this unit");
    if (keyword && target) {
      return [
        {
          type: "loseKeyword",
          target,
          keyword,
          ...(loseKeywordMatch[3] ? { duration: loseKeywordMatch[3].toLowerCase() } : {}),
        },
      ];
    }
  }

  const indirectDamageMatch = text.match(
    /^deal (\d+) indirect damage to (a player|the defending player|each opponent)$/i,
  );
  if (indirectDamageMatch) {
    return [
      {
        type: "indirectDamage",
        amount: Number.parseInt(indirectDamageMatch[1], 10),
        target: {
          type: "player",
          controller: indirectDamageMatch[2].toLowerCase() === "a player" ? "any" : "opponent",
        },
      },
    ];
  }

  const revealDrawUnitDiscardOthersMatch = text.match(
    /^reveal the top (\d+) cards of your deck\. draw a unit revealed this way, then discard the other revealed cards$/i,
  );
  if (revealDrawUnitDiscardOthersMatch) {
    const amount = Number.parseInt(revealDrawUnitDiscardOthersMatch[1], 10);
    return [
      {
        type: "sequential",
        effects: [
          {
            type: "reveal",
            target: { type: "card", controller: "friendly", zones: ["deck"], limit: amount },
          },
          {
            type: "search",
            target: {
              type: "card",
              controller: "friendly",
              zones: ["deck"],
              cardTypes: ["unit"],
              limit: 1,
            },
            destination: "hand",
            reveal: false,
          },
          {
            type: "discard",
            target: {
              type: "card",
              controller: "friendly",
              zones: ["deck"],
              limit: Math.max(0, amount - 1),
            },
            amount: Math.max(0, amount - 1),
          },
        ],
      },
    ];
  }

  const searchDrawMatch = text.match(
    /^search (?:the top \d+ cards of )?your deck for .+?(?:reveal (?:it|them), and )?draw (?:it|them)$/i,
  );
  if (searchDrawMatch) {
    return [
      {
        type: "search",
        target: { type: "card", controller: "friendly", zones: ["deck"], limit: 1 },
        destination: "hand",
        reveal: true,
      },
    ];
  }

  const searchResourceMatch = text.match(
    /^search (?:the top \d+ cards of )?your deck for .+? and resource it/i,
  );
  if (searchResourceMatch) {
    return [
      {
        type: "search",
        target: { type: "card", controller: "friendly", zones: ["deck"], limit: 1 },
        destination: "resource",
        reveal: true,
      },
    ];
  }

  const searchDiscardMatch = text.match(
    /^search (?:the top \d+ cards of )?your deck for .+? and discard (?:it|them)/i,
  );
  if (searchDiscardMatch) {
    return [
      {
        type: "search",
        target: { type: "card", controller: "friendly", zones: ["deck"], limit: 1 },
        destination: "discard",
        reveal: true,
      },
    ];
  }

  const searchPlayMatch = text.match(
    /^search (?:the top \d+ cards of )?your deck for .+?(?:reveal it, and )?play it/i,
  );
  if (searchPlayMatch) {
    return [
      {
        type: "play",
        target: { type: "card", controller: "friendly", zones: ["deck"], limit: 1 },
        free: /for free/i.test(text),
      },
    ];
  }

  const forEachFriendlyExhaustMatch = text.match(
    /^for each friendly .+ unit, exhaust an enemy unit$/i,
  );
  if (forEachFriendlyExhaustMatch) {
    return [
      {
        type: "exhaust",
        target: unitTarget("opponent", undefined, { limit: 1 }),
      },
    ];
  }

  const parseConditionalBody = (body) => {
    const optionalMatch = body.match(/^you may (.+)$/i);
    const parsed = parseSimpleEffects(optionalMatch ? optionalMatch[1] : body);
    if (parsed.length === 0) return [];
    return optionalMatch ? [{ type: "optional", effects: parsed }] : parsed;
  };

  const damagedUnitConditionalMatch = text.match(/^if you control a damaged unit, (.+)$/i);
  if (damagedUnitConditionalMatch) {
    const ifTrue = parseConditionalBody(damagedUnitConditionalMatch[1]);
    if (ifTrue.length > 0) {
      return [
        {
          type: "conditional",
          condition: {
            type: "hasTarget",
            target: {
              type: "card",
              controller: "friendly",
              zones: ["groundArena", "spaceArena"],
              cardTypes: ["unit"],
              damaged: true,
            },
          },
          ifTrue,
        },
      ];
    }
  }

  const anotherSpaceUnitConditionalMatch = text.match(/^if you control another space unit, (.+)$/i);
  if (anotherSpaceUnitConditionalMatch) {
    const ifTrue = parseConditionalBody(anotherSpaceUnitConditionalMatch[1]);
    if (ifTrue.length > 0) {
      return [
        {
          type: "conditional",
          condition: {
            type: "hasTarget",
            target: {
              type: "card",
              controller: "friendly",
              zones: ["spaceArena"],
              cardTypes: ["unit"],
              excludeSelf: true,
            },
          },
          ifTrue,
        },
      ];
    }
  }

  const aspectConditionalMatch = text.match(
    /^if you control (?:another |a |an )?\[?([a-z]+)\]? unit, (.+)$/i,
  );
  if (aspectConditionalMatch) {
    const aspect = aspectFromText(aspectConditionalMatch[1]);
    const ifTrue = parseSimpleEffects(aspectConditionalMatch[2]);
    if (aspect && ifTrue.length > 0) {
      return [
        {
          type: "conditional",
          condition: { type: "controlsAspect", controller: "friendly", aspect },
          ifTrue,
        },
      ];
    }
  }

  const traitConditionalMatch = text.match(
    /^if you control (another |a |an )?([a-z ]+?) unit, (.+)$/i,
  );
  if (traitConditionalMatch) {
    const traits = traitsFromUnitPhrase(traitConditionalMatch[2]);
    const ifTrue = parseSimpleEffects(traitConditionalMatch[3]);
    if (traits.length > 0 && ifTrue.length > 0) {
      return [
        {
          type: "conditional",
          condition: {
            type: "controlsTrait",
            controller: "friendly",
            trait: traits[0],
            ...(traitConditionalMatch[1]?.trim().toLowerCase() === "another"
              ? { excludeSelf: true }
              : {}),
          },
          ifTrue,
        },
      ];
    }
  }

  const initiativeConditionalMatch = text.match(/^if you have the initiative, (.+)$/i);
  if (initiativeConditionalMatch) {
    const ifTrue = parseSimpleEffects(initiativeConditionalMatch[1]);
    if (ifTrue.length > 0) {
      return [
        {
          type: "conditional",
          condition: { type: "hasInitiative", controller: "friendly" },
          ifTrue,
        },
      ];
    }
  }

  const friendlyEnemyGroundDamageMatch = text.match(
    /^deal (\d+) damage to a friendly ground unit and (\d+) damage to an enemy ground unit$/i,
  );
  if (friendlyEnemyGroundDamageMatch) {
    return [
      {
        type: "sequential",
        effects: [
          {
            type: "damage",
            amount: Number.parseInt(friendlyEnemyGroundDamageMatch[1], 10),
            target: unitTarget("friendly", "ground", { limit: 1 }),
          },
          {
            type: "damage",
            amount: Number.parseInt(friendlyEnemyGroundDamageMatch[2], 10),
            target: unitTarget("opponent", "ground", { limit: 1 }),
          },
        ],
      },
    ];
  }

  const twoEnemyUnitsDamageMatch = text.match(
    /^deal (\d+) damage to an enemy unit and (\d+) damage to another enemy unit$/i,
  );
  if (twoEnemyUnitsDamageMatch) {
    return [
      {
        type: "sequential",
        effects: [
          {
            type: "damage",
            amount: Number.parseInt(twoEnemyUnitsDamageMatch[1], 10),
            target: unitTarget("opponent", undefined, { limit: 1 }),
          },
          {
            type: "damage",
            amount: Number.parseInt(twoEnemyUnitsDamageMatch[2], 10),
            target: unitTarget("opponent", undefined, { limit: 1 }),
          },
        ],
      },
    ];
  }

  const enemyBaseAndEnemyUnitDamageMatch = text.match(
    /^deal (\d+) damage to an enemy base and (\d+) damage to an enemy unit$/i,
  );
  if (enemyBaseAndEnemyUnitDamageMatch) {
    return [
      {
        type: "sequential",
        effects: [
          {
            type: "damage",
            amount: Number.parseInt(enemyBaseAndEnemyUnitDamageMatch[1], 10),
            target: { type: "base", controller: "opponent" },
          },
          {
            type: "damage",
            amount: Number.parseInt(enemyBaseAndEnemyUnitDamageMatch[2], 10),
            target: unitTarget("opponent", undefined, { limit: 1 }),
          },
        ],
      },
    ];
  }

  const enemyBaseDamageAndBaseHealMatch = text.match(
    /^deal (\d+) damage to an enemy base and heal (\d+) damage from your base$/i,
  );
  if (enemyBaseDamageAndBaseHealMatch) {
    return [
      {
        type: "sequential",
        effects: [
          {
            type: "damage",
            amount: Number.parseInt(enemyBaseDamageAndBaseHealMatch[1], 10),
            target: { type: "base", controller: "opponent" },
          },
          {
            type: "heal",
            amount: Number.parseInt(enemyBaseDamageAndBaseHealMatch[2], 10),
            target: { type: "base", controller: "friendly" },
          },
        ],
      },
    ];
  }

  const sourcePowerDamageMatch = text.match(/^(.+?) deals damage equal to its power to (.+)$/i);
  if (sourcePowerDamageMatch) {
    const source = targetFromPhrase(sourcePowerDamageMatch[1]);
    const target = targetFromPhrase(sourcePowerDamageMatch[2]);
    return source && target ? [{ type: "damageFrom", source, target, amount: "power" }] : [];
  }

  const damagePerFriendlySpaceMatch = text.match(
    /^deal damage to (.+?) equal to the number of friendly space units$/i,
  );
  if (damagePerFriendlySpaceMatch) {
    const target = targetFromPhrase(damagePerFriendlySpaceMatch[1]);
    return target
      ? [
          {
            type: "damagePer",
            target,
            per: "targetCount",
            count: unitTarget("friendly", "space", { limit: undefined }),
          },
        ]
      : [];
  }

  const damagePerCardsInHandMatch = text.match(
    /^deal damage to (.+?) equal to the number of cards in your hand$/i,
  );
  if (damagePerCardsInHandMatch) {
    const target = targetFromPhrase(damagePerCardsInHandMatch[1]);
    return target
      ? [
          {
            type: "damagePer",
            target,
            per: "cardsInHand",
            controller: "friendly",
          },
        ]
      : [];
  }

  const healAndShieldMatch = text.match(
    /^heal (?:up to )?(\d+) damage (?:from|to) (.+?) and give (?:a|\d+) shield tokens? to it$/i,
  );
  if (healAndShieldMatch) {
    const target = targetFromPhrase(healAndShieldMatch[2]);
    return target
      ? [
          {
            type: "sequential",
            effects: [
              { type: "heal", amount: Number.parseInt(healAndShieldMatch[1], 10), target },
              { type: "createToken", token: "shield", amount: 1, target },
            ],
          },
        ]
      : [];
  }

  const readyAndShieldMatch = text.match(/^ready (.+?) and give (?:a|\d+) shield tokens? to it$/i);
  if (readyAndShieldMatch) {
    const target = targetFromPhrase(readyAndShieldMatch[1]);
    return target
      ? [
          {
            type: "sequential",
            effects: [
              { type: "ready", target },
              { type: "createToken", token: "shield", amount: 1, target },
            ],
          },
        ]
      : [];
  }

  const healAndExperienceMatch = text.match(
    /^heal (?:up to )?(\d+) damage (?:from|to) (.+?) and give (?:an?|\d+) experience tokens? to it$/i,
  );
  if (healAndExperienceMatch) {
    const target = targetFromPhrase(healAndExperienceMatch[2]);
    return target
      ? [
          {
            type: "sequential",
            effects: [
              { type: "heal", amount: Number.parseInt(healAndExperienceMatch[1], 10), target },
              { type: "distribute", mode: "experience", amount: 1, target },
            ],
          },
        ]
      : [];
  }

  const resourceSelfMatch = text.match(
    /^put this (?:unit|event|card) into play as a resource(?: and ready it)?$/i,
  );
  if (resourceSelfMatch) {
    return [
      {
        type: "resource",
        target: { type: "self" },
        ready: /ready it/i.test(text),
      },
    ];
  }

  const opponentReadyResourceMatch = text.match(/^(?:each|an) opponent may ready a resource$/i);
  if (opponentReadyResourceMatch) {
    return [
      {
        type: "optional",
        effects: [
          {
            type: "ready",
            target: {
              type: "card",
              controller: "opponent",
              zones: ["resource"],
              limit: 1,
            },
          },
        ],
      },
    ];
  }

  if (
    /\b(if|and|for each|equal to|divided as|pay any number|look at|capture|return up to)\b/i.test(
      text,
    )
  ) {
    return [];
  }

  const drawMatch = text.match(/^draw (?:(a) card|(\d+) cards?)/i);
  if (drawMatch) {
    return [
      {
        type: "draw",
        controller: "friendly",
        amount: numberFromText(drawMatch[1] ?? drawMatch[2]),
      },
    ];
  }

  const damageMatch = text.match(/^deal (\d+) damage to (.+)$/i);
  if (damageMatch) {
    const target = targetFromPhrase(damageMatch[2]);
    return target ? [{ type: "damage", amount: Number.parseInt(damageMatch[1], 10), target }] : [];
  }

  const healMatch = text.match(/^heal (?:up to )?(\d+) damage (?:from|to) (.+)$/i);
  if (healMatch) {
    const target = targetFromPhrase(healMatch[2]);
    return target ? [{ type: "heal", amount: Number.parseInt(healMatch[1], 10), target }] : [];
  }

  const exhaustMatch = text.match(/^exhaust (.+)$/i);
  if (exhaustMatch) {
    const target = targetFromPhrase(exhaustMatch[1]);
    return target ? [{ type: "exhaust", target }] : [];
  }

  const readyMatch = text.match(/^ready (.+)$/i);
  if (readyMatch) {
    const target = targetFromPhrase(readyMatch[1]);
    return target ? [{ type: "ready", target }] : [];
  }

  const opponentChoosesDefeatMatch = text.match(
    /^an opponent chooses a (non-leader )?unit they control\. defeat that unit$/i,
  );
  if (opponentChoosesDefeatMatch) {
    return [
      {
        type: "defeat",
        target: {
          type: "card",
          controller: "opponent",
          zones: ["groundArena", "spaceArena"],
          cardTypes: ["unit", "token"],
          limit: 1,
        },
      },
    ];
  }

  const defeatMatch = text.match(/^defeat (.+)$/i);
  if (defeatMatch) {
    const target = targetFromPhrase(defeatMatch[1]);
    return target ? [{ type: "defeat", target }] : [];
  }

  const discardMatch = text.match(/^discard (.+)$/i);
  if (discardMatch) {
    const target = targetFromPhrase(discardMatch[1]);
    return target ? [{ type: "discard", target, amount: target.limit ?? 1 }] : [];
  }

  const playMatch = text.match(
    /^play (.+?) from your hand(?:\s*\([^)]*\))?(?:, ignoring .*)?(?: for free)?$/i,
  );
  if (playMatch) {
    const target = targetFromPhrase(`${playMatch[1]} from your hand`);
    return target ? [{ type: "play", target, free: /for free$/i.test(text) }] : [];
  }

  const shieldMatch = text.match(/^give (a|\d+) shield tokens? to (.+)$/i);
  if (shieldMatch) {
    const target = targetFromPhrase(shieldMatch[2]);
    return target
      ? [{ type: "createToken", token: "shield", amount: numberFromText(shieldMatch[1]), target }]
      : [];
  }

  const experienceMatch = text.match(/^give (?:(an?)|(\d+)) experience tokens? to (.+)$/i);
  if (experienceMatch) {
    const target = targetFromPhrase(experienceMatch[3]);
    return target
      ? [
          {
            type: "distribute",
            mode: "experience",
            amount: numberFromText(experienceMatch[1] ?? experienceMatch[2]),
            target,
          },
        ]
      : [];
  }

  const statMatch = text.match(/^give (.+?) ([+-]\d+)\/([+-]\d+) for this phase$/i);
  if (statMatch) {
    const target = targetFromPhrase(statMatch[1]);
    return target
      ? [
          {
            type: "modifyStats",
            target,
            power: Number.parseInt(statMatch[2], 10),
            hp: Number.parseInt(statMatch[3], 10),
            duration: "phase",
          },
        ]
      : [];
  }

  const getsStatMatch = text.match(/^(.+?) gets ([+-]\d+)\/([+-]\d+) for this phase$/i);
  if (getsStatMatch) {
    const target = targetFromPhrase(getsStatMatch[1]);
    return target
      ? [
          {
            type: "modifyStats",
            target,
            power: Number.parseInt(getsStatMatch[2], 10),
            hp: Number.parseInt(getsStatMatch[3], 10),
            duration: "phase",
          },
        ]
      : [];
  }

  const getsStatsPerResourceMatch = text.match(
    /^(this unit) gets ([+-]\d+)\/([+-]\d+) for each resource you control$/i,
  );
  if (getsStatsPerResourceMatch) {
    const target = targetFromPhrase(getsStatsPerResourceMatch[1]);
    return target
      ? [
          {
            type: "modifyStatsPer",
            target,
            per: "friendlyResources",
            power: Number.parseInt(getsStatsPerResourceMatch[2], 10),
            hp: Number.parseInt(getsStatsPerResourceMatch[3], 10),
            duration: "continuous",
          },
        ]
      : [];
  }

  const getsStatsPerDamageMatch = text.match(
    /^(this unit) gets ([+-]\d+)\/([+-]\d+) for each damage on (?:it|him|her|this unit)$/i,
  );
  if (getsStatsPerDamageMatch) {
    const target = targetFromPhrase(getsStatsPerDamageMatch[1]);
    return target
      ? [
          {
            type: "modifyStatsPer",
            target,
            per: "damageOnTarget",
            power: Number.parseInt(getsStatsPerDamageMatch[2], 10),
            hp: Number.parseInt(getsStatsPerDamageMatch[3], 10),
            duration: "continuous",
          },
        ]
      : [];
  }

  const getsStatsPerOtherFriendlySpaceUnitMatch = text.match(
    /^(this unit) gets ([+-]\d+)\/([+-]\d+) for each other friendly space unit$/i,
  );
  if (getsStatsPerOtherFriendlySpaceUnitMatch) {
    const target = targetFromPhrase(getsStatsPerOtherFriendlySpaceUnitMatch[1]);
    return target
      ? [
          {
            type: "modifyStatsPer",
            target,
            per: "targetCount",
            count: {
              type: "card",
              controller: "friendly",
              zones: ["spaceArena"],
              cardTypes: ["unit"],
              excludeSelf: true,
            },
            power: Number.parseInt(getsStatsPerOtherFriendlySpaceUnitMatch[2], 10),
            hp: Number.parseInt(getsStatsPerOtherFriendlySpaceUnitMatch[3], 10),
            duration: "continuous",
          },
        ]
      : [];
  }

  const getsStatsPerOtherExhaustedFriendlyUnitMatch = text.match(
    /^(this unit) gets ([+-]\d+)\/([+-]\d+) for each other exhausted friendly unit$/i,
  );
  if (getsStatsPerOtherExhaustedFriendlyUnitMatch) {
    const target = targetFromPhrase(getsStatsPerOtherExhaustedFriendlyUnitMatch[1]);
    return target
      ? [
          {
            type: "modifyStatsPer",
            target,
            per: "targetCount",
            count: {
              type: "card",
              controller: "friendly",
              zones: ["groundArena", "spaceArena"],
              cardTypes: ["unit"],
              exhausted: true,
              excludeSelf: true,
            },
            power: Number.parseInt(getsStatsPerOtherExhaustedFriendlyUnitMatch[2], 10),
            hp: Number.parseInt(getsStatsPerOtherExhaustedFriendlyUnitMatch[3], 10),
            duration: "continuous",
          },
        ]
      : [];
  }

  const getsStatsPerTraitInDiscardMatch = text.match(
    /^(this unit) gets ([+-]\d+)\/([+-]\d+) for each ([A-Za-z -]+) unit in your discard pile$/i,
  );
  if (getsStatsPerTraitInDiscardMatch) {
    const target = targetFromPhrase(getsStatsPerTraitInDiscardMatch[1]);
    return target
      ? [
          {
            type: "modifyStatsPer",
            target,
            per: "targetCount",
            count: {
              type: "card",
              controller: "friendly",
              zones: ["discard"],
              cardTypes: ["unit"],
              traits: [getsStatsPerTraitInDiscardMatch[4].toLowerCase()],
            },
            power: Number.parseInt(getsStatsPerTraitInDiscardMatch[2], 10),
            hp: Number.parseInt(getsStatsPerTraitInDiscardMatch[3], 10),
            duration: "continuous",
          },
        ]
      : [];
  }

  const getsConstantStatsAndKeywordMatch = text.match(
    /^(.+?) gets ([+-]\d+)\/([+-]\d+) and gains ([a-z]+(?: \d+)?)$/i,
  );
  if (getsConstantStatsAndKeywordMatch) {
    const target = targetFromPhrase(getsConstantStatsAndKeywordMatch[1]);
    const keyword = keywordFromText(getsConstantStatsAndKeywordMatch[4]);
    return target && keyword
      ? [
          {
            type: "modifyStats",
            target,
            power: Number.parseInt(getsConstantStatsAndKeywordMatch[2], 10),
            hp: Number.parseInt(getsConstantStatsAndKeywordMatch[3], 10),
            duration: "continuous",
          },
          {
            type: "gainKeyword",
            target,
            keyword,
            duration: "continuous",
          },
        ]
      : [];
  }

  const getsConstantStatMatch = text.match(/^(.+?) gets ([+-]\d+)\/([+-]\d+)$/i);
  if (getsConstantStatMatch) {
    const target = targetFromPhrase(getsConstantStatMatch[1]);
    return target
      ? [
          {
            type: "modifyStats",
            target,
            power: Number.parseInt(getsConstantStatMatch[2], 10),
            hp: Number.parseInt(getsConstantStatMatch[3], 10),
            duration: "continuous",
          },
        ]
      : [];
  }

  const selfStatMatch = text.match(/^this unit gets ([+-]\d+)\/([+-]\d+) for this phase$/i);
  if (selfStatMatch) {
    return [
      {
        type: "modifyStats",
        target: { type: "self" },
        power: Number.parseInt(selfStatMatch[1], 10),
        hp: Number.parseInt(selfStatMatch[2], 10),
        duration: "phase",
      },
    ];
  }

  return [];
}

function parsedAbility(kind, trigger, text, effects, optional = false) {
  const resolvedEffects = optional ? [{ type: "optional", effects }] : effects;
  return {
    kind,
    text,
    trigger: { event: trigger },
    effects: resolvedEffects,
    ...(optional ? { optional: true } : {}),
  };
}

function conditionFromWhileText(rawText) {
  const text = normalizeRulesText(rawText);
  const resourcesMatch = text.match(/^you control (\d+) or more resources$/i);
  if (resourcesMatch) {
    return {
      type: "resources",
      controller: "friendly",
      comparison: {
        operator: "gte",
        value: Number.parseInt(resourcesMatch[1], 10),
      },
    };
  }
  if (/^you have the initiative$/i.test(text)) {
    return {
      type: "hasInitiative",
      controller: "friendly",
    };
  }
  if (/^this unit is upgraded$/i.test(text)) {
    return {
      type: "sourceIsUpgraded",
    };
  }
  if (/^this unit is damaged$/i.test(text)) {
    return {
      type: "sourceIsDamaged",
    };
  }
  const baseDamageMatch = text.match(/^your base has (\d+) or more damage on it$/i);
  if (baseDamageMatch) {
    return {
      type: "baseDamage",
      controller: "friendly",
      comparison: {
        operator: "gte",
        value: Number.parseInt(baseDamageMatch[1], 10),
      },
    };
  }
  const aspectControlMatch = text.match(/^you control another \[?([a-z]+)\]? unit$/i);
  if (aspectControlMatch) {
    const aspect = aspectFromText(aspectControlMatch[1]);
    if (aspect) {
      return {
        type: "controlsAspect",
        controller: "friendly",
        aspect,
        excludeSelf: true,
      };
    }
  }
  const traitControlMatch = text.match(/^you control another ([a-z ]+?) unit$/i);
  if (traitControlMatch) {
    const traits = traitsFromUnitPhrase(traitControlMatch[1]);
    if (traits.length > 0) {
      return {
        type: "controlsTrait",
        controller: "friendly",
        trait: traits[0],
        excludeSelf: true,
      };
    }
  }
  const traitUnitOrUpgradeControlMatch = text.match(
    /^you control a ([a-z ]+?) unit or (?:a \1 )?upgrade$/i,
  );
  if (traitUnitOrUpgradeControlMatch) {
    const traits = traitsFromUnitPhrase(traitUnitOrUpgradeControlMatch[1]);
    if (traits.length > 0) {
      return {
        type: "controlsTrait",
        controller: "friendly",
        trait: traits[0],
      };
    }
  }
  return null;
}

function constantAbilityFromLine(normalizedLine) {
  const whileMatch = normalizedLine.match(/^While (.+?), (.+)$/i);
  if (!whileMatch) {
    const effects = parseSimpleEffects(normalizedLine.replace(/\.$/, ""));
    if (
      effects.length > 0 &&
      effects.every(
        (effect) =>
          (effect.type === "modifyStats" ||
            effect.type === "gainKeyword" ||
            effect.type === "gainTrait") &&
          (effect.duration === undefined || effect.duration === "continuous"),
      )
    ) {
      return [
        {
          kind: "constant",
          text: normalizedLine,
          effects,
        },
      ];
    }
    return null;
  }
  const condition = conditionFromWhileText(whileMatch[1]);
  if (!condition) return null;
  const firstSentence = whileMatch[2].split(/(?<=\.)\s+/)[0]?.replace(/\.$/, "") ?? "";
  const effects = parseSimpleEffects(firstSentence);
  if (effects.length === 0) return null;
  return [
    {
      kind: "constant",
      text: normalizedLine,
      conditions: [condition],
      effects,
    },
  ];
}

function abilityFromLine(card, line) {
  const normalizedLine = normalizeRulesText(line);
  const attachTarget = card.cardType === "upgrade" ? attachTargetFromText(normalizedLine) : null;
  if (attachTarget) {
    return [
      {
        kind: "constant",
        text: normalizedLine,
        target: attachTarget,
        effects: [],
      },
    ];
  }
  const constantAbility = constantAbilityFromLine(normalizedLine);
  if (constantAbility) return constantAbility;
  const shieldReplacementMatch = normalizedLine.match(
    /^If damage would be dealt to attached unit, prevent that damage\.? If you do, defeat a Shield token on it\.?$/i,
  );
  if (shieldReplacementMatch) {
    return [
      {
        kind: "constant",
        text: "Attach to a unit.",
        target: unitTarget("any", undefined, { limit: 1 }),
        effects: [],
      },
      {
        kind: "replacement",
        text: normalizedLine,
        trigger: { event: "replacement" },
        effects: parseSimpleEffects(normalizedLine),
      },
    ];
  }
  const combinedPlayedAttackMatch = normalizedLine.match(/^When Played\/On Attack:\s*(.+)$/i);
  const combinedPlayedDefeatedMatch = normalizedLine.match(/^When Played\/When Defeated:\s*(.+)$/i);
  const combinedAttackDefeatedMatch = normalizedLine.match(/^On Attack\/When Defeated:\s*(.+)$/i);
  const friendlyForceAttackMatch = normalizedLine.match(
    /^When a friendly Force unit attacks:\s*(.+)$/i,
  );
  const deployLeaderMatch = normalizedLine.match(/^When you deploy a leader:\s*(.+)$/i);
  const triggerMatch = normalizedLine.match(/^(When Played|On Attack):\s*(.+)$/i);
  const attackedMatch = normalizedLine.match(/^When this unit is attacked:\s*(.+)$/i);
  const unitDefeatedMatch = normalizedLine.match(
    /^When (?:an?|another) (?:enemy|friendly) unit is defeated:\s*(.+)$/i,
  );
  const defeatedMatch = normalizedLine.match(/^When Defeated:\s*(.+)$/i);
  const actionMatch = normalizedLine.match(
    /^(?:Coordinate\s+-\s+)?(Epic Action|Action)(?:\s*\[[^\]]+\])?:\s*(.+)$/i,
  );
  const attackExhaustedDefenderDamageMatch = normalizedLine.match(
    /^On Attack:\s*If this unit is attacking an exhausted unit that didn't enter play this (?:round|phase), deal (\d+) damage to the defender\.?$/i,
  );
  if (attackExhaustedDefenderDamageMatch) {
    return [
      {
        kind: "triggered",
        text: normalizedLine,
        trigger: { event: "attack" },
        conditions: [{ type: "attackDefender", exhausted: true, playedThisPhase: false }],
        effects: [
          {
            type: "damage",
            amount: Number.parseInt(attackExhaustedDefenderDamageMatch[1], 10),
            target: { type: "choice", id: "defender" },
          },
        ],
      },
    ];
  }
  const attackIfSourceUpgradedMatch = normalizedLine.match(
    /^On Attack:\s*If this unit is upgraded, (.+)$/i,
  );
  if (attackIfSourceUpgradedMatch) {
    const effectText = attackIfSourceUpgradedMatch[1].replace(/\.$/, "");
    const optional = /^you may\b/i.test(effectText);
    const effects = parseSimpleEffects(effectText);
    if (effects.length > 0) {
      return [
        {
          ...parsedAbility("triggered", "attack", normalizedLine, effects, optional),
          conditions: [{ type: "sourceIsUpgraded" }],
        },
      ];
    }
  }
  const isPlayableEventText = card.cardType === "event" && !/^[^:]+:/.test(normalizedLine);
  let body = "";
  if (deployLeaderMatch) body = deployLeaderMatch[1];
  else if (friendlyForceAttackMatch) body = friendlyForceAttackMatch[1];
  else if (combinedPlayedAttackMatch) body = combinedPlayedAttackMatch[1];
  else if (combinedPlayedDefeatedMatch) body = combinedPlayedDefeatedMatch[1];
  else if (combinedAttackDefeatedMatch) body = combinedAttackDefeatedMatch[1];
  else if (attackedMatch) body = attackedMatch[1];
  else if (unitDefeatedMatch) body = unitDefeatedMatch[1];
  else if (defeatedMatch) body = defeatedMatch[1];
  else if (triggerMatch) body = triggerMatch[2];
  else if (actionMatch) body = actionMatch[2];
  else if (isPlayableEventText) body = normalizedLine;
  if (!body) return null;
  const normalizedBody = body.replace(/\.$/, "");
  const firstSentence = body.split(/(?<=\.)\s+/)[0]?.replace(/\.$/, "") ?? "";
  const effectText =
    /^(?:use the force|you may pay \d+ resources?\.|you may reveal .+?\. if you do|an opponent chooses .+?\. defeat that unit)/i.test(
      normalizedBody,
    )
      ? normalizedBody
      : firstSentence;
  const optional = /^you may\b/i.test(effectText);
  let effects = parseSimpleEffects(effectText);
  if (effects.length === 0 && /^choose (?:a|an|one|up to \d+)/i.test(firstSentence)) {
    effects = parseSimpleEffects(normalizedBody);
  }
  if (effects.length === 0) return null;

  if (deployLeaderMatch) {
    return [parsedAbility("triggered", "deployed", normalizedLine, effects, optional)];
  }
  if (combinedPlayedAttackMatch) {
    return [
      parsedAbility("triggered", "played", normalizedLine, effects, optional),
      parsedAbility("triggered", "attack", normalizedLine, effects, optional),
    ];
  }
  if (friendlyForceAttackMatch) {
    return [
      {
        ...parsedAbility("triggered", "attack", normalizedLine, effects, optional),
        conditions: [
          {
            type: "hasTarget",
            target: {
              type: "choice",
              id: "attacker",
              controller: "friendly",
              traits: ["Force"],
            },
          },
        ],
      },
    ];
  }
  if (combinedPlayedDefeatedMatch) {
    return [
      parsedAbility("triggered", "played", normalizedLine, effects, optional),
      parsedAbility("triggered", "defeated", normalizedLine, effects, optional),
    ];
  }
  if (combinedAttackDefeatedMatch) {
    return [
      parsedAbility("triggered", "attack", normalizedLine, effects, optional),
      parsedAbility("triggered", "defeated", normalizedLine, effects, optional),
    ];
  }
  if (unitDefeatedMatch) {
    return [parsedAbility("triggered", "defeated", normalizedLine, effects, optional)];
  }
  if (attackedMatch) {
    return [parsedAbility("triggered", "attacked", normalizedLine, effects, optional)];
  }
  if (defeatedMatch) {
    return [parsedAbility("triggered", "defeated", normalizedLine, effects, optional)];
  }
  if (actionMatch) {
    const trigger = actionMatch[1].toLowerCase() === "epic action" ? "epicAction" : "action";
    return [parsedAbility("action", trigger, normalizedLine, effects, optional)];
  }
  const trigger = triggerMatch?.[1].toLowerCase() === "on attack" ? "attack" : "played";
  return [parsedAbility("triggered", trigger, normalizedLine, effects, optional)];
}

function nativeTextAbilities(card) {
  const textParts = [card.text, card.deployBox, card.epicAction].filter(Boolean);
  const abilities = [];
  const seen = new Set();
  for (const textPart of textParts) {
    for (const line of String(textPart).split(/\n+/)) {
      const lineAbilities = abilityFromLine(card, line);
      if (!lineAbilities) continue;
      for (const ability of lineAbilities) {
        const key = `${ability.trigger?.event ?? ability.kind}:${ability.text}`;
        if (seen.has(key)) continue;
        seen.add(key);
        abilities.push(ability);
      }
    }
  }
  return abilities;
}

function hasAuthoredBehavior(definition) {
  return (definition.abilities ?? []).some((ability) => {
    if (ability.kind !== "keyword") return true;
    if ((ability.effects ?? []).length > 0) return true;
    if ((ability.costs ?? []).length > 0) return true;
    if ((ability.conditions ?? []).length > 0) return true;
    if (ability.target || ability.trigger || ability.optional || ability.limit) return true;
    return false;
  });
}

function behaviorForCard(card, _existingDefinition) {
  return nativeAbilities(card);
}

function safeFileSegment(value) {
  return value.replace(/[^a-zA-Z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
}

function baseCardDefinitionRelativePath(card) {
  const set = card.relativePath
    ? card.relativePath.split("/")[0]
    : card.setId?.set
      ? `${setDirectoryPrefix.get(card.setId.set) ?? "00"}_${card.setId.set}`
      : "unmapped-set";
  const type = card.cardType === "token" ? "tokens" : `${card.cardType}s`;
  return `${set}/${type}/${safeFileSegment(card.internalName)}.ts`;
}

function cardDefinitionPath(card, paths) {
  return path.join(cardDefinitionsRoot, paths.get(card.id));
}

function cardDefinitionPaths(cards) {
  const baseCounts = new Map();
  for (const card of cards) {
    const relativePath = baseCardDefinitionRelativePath(card);
    baseCounts.set(relativePath, (baseCounts.get(relativePath) ?? 0) + 1);
  }

  const used = new Map();
  const paths = new Map();
  for (const card of cards) {
    const basePath = baseCardDefinitionRelativePath(card);
    const parsed = path.posix.parse(basePath);
    const relativePath =
      baseCounts.get(basePath) === 1
        ? basePath
        : path.posix.join(parsed.dir, `${parsed.name}-${collectorSuffix(card).toLowerCase()}.ts`);
    const previous = used.get(relativePath);
    if (previous) {
      throw new Error(`Card path collision: ${relativePath} for ${previous.id} and ${card.id}`);
    }
    used.set(relativePath, card);
    paths.set(card.id, relativePath);
  }
  return paths;
}

function rootExportNames(cards) {
  const baseCounts = new Map();
  for (const card of cards) {
    const exportName = cardExportName(card);
    baseCounts.set(exportName, (baseCounts.get(exportName) ?? 0) + 1);
  }

  const used = new Set();
  const names = new Map();
  for (const card of cards) {
    const base = cardExportName(card);
    let name = baseCounts.get(base) === 1 ? base : `${base}${collectorSuffix(card)}`;
    if (used.has(name)) name = `${name}${card.id}`;
    used.add(name);
    names.set(card.id, name);
  }
  return names;
}

function cardSortValue(card) {
  const set = card.setId?.set ?? "";
  const setOrder = setNumber.get(set) ?? 999;
  const number = card.setId?.number ?? 9999;
  return [setOrder, set, number, card.cardType, card.internalName, card.id];
}

function compareCards(a, b) {
  const aSort = cardSortValue(a);
  const bSort = cardSortValue(b);
  for (const [index, aValue] of aSort.entries()) {
    const bValue = bSort[index];
    if (aValue < bValue) return -1;
    if (aValue > bValue) return 1;
  }
  return 0;
}

function relativeImportPath(fromFile, toFile) {
  let importPath = path.relative(path.dirname(fromFile), toFile).replaceAll(path.sep, "/");
  if (!importPath.startsWith(".")) importPath = `./${importPath}`;
  return importPath;
}

async function writeCardDefinitionFiles(cards) {
  await fs.rm(cardDefinitionsRoot, { recursive: true, force: true });
  const cardPaths = cardDefinitionPaths(cards);
  const rootNames = rootExportNames(cards);

  const rootIndexPath = path.join(cardDefinitionsRoot, "index.ts");
  const rootIndexImports = [
    "// Generated by tools/import-card-data. Do not edit manually.",
    'import type { SwuCard } from "@tcg/star-wars-unlimited-types";',
  ];
  const rootIndexExports = [];
  const cardExportNames = [];

  for (const card of cards) {
    const exportName = cardExportName(card);
    const rootExportName = rootNames.get(card.id);
    const cardPath = cardDefinitionPath(card, cardPaths);
    const satisfiesType = cardTypeSatisfiesType[card.cardType];
    const {
      relativePath: _relativePath,
      abilitiesSource,
      helperImports,
      preamble,
      ...cardDefinition
    } = card;
    const strippedDefinition = stripEmptyProperties(cardDefinition);
    if (abilitiesSource) {
      delete strippedDefinition.abilities;
    }
    let definitionString = stableStringify(strippedDefinition);
    if (abilitiesSource) {
      const cleanedAbilitiesSource = abilitiesSource.replace(/,\s+effects: \[\],?/g, "");
      if (!/^abilities:\s*\[\]\s*$/.test(cleanedAbilitiesSource)) {
        definitionString = definitionString.replace(/\n\}$/, `,\n  ${cleanedAbilitiesSource}\n}`);
      }
    }
    await fs.mkdir(path.dirname(cardPath), { recursive: true });
    await fs.writeFile(
      cardPath,
      [
        "// Generated by tools/import-card-data. Do not edit manually.",
        `import type { ${satisfiesType} } from "@tcg/star-wars-unlimited-types";`,
        ...(helperImports ?? []),
        ...(preamble ? ["", preamble] : []),
        "",
        `export const ${exportName} = ${definitionString} satisfies ${satisfiesType};`,
        "",
        `export default ${exportName};`,
        "",
      ].join("\n"),
    );

    rootIndexImports.push(
      `import ${rootExportName} from "${relativeImportPath(rootIndexPath, cardPath)}";`,
    );
    rootIndexExports.push(
      `export { default as ${rootExportName} } from "${relativeImportPath(rootIndexPath, cardPath)}";`,
    );
    cardExportNames.push(rootExportName);
  }

  await fs.writeFile(
    rootIndexPath,
    [
      ...rootIndexImports,
      "",
      `export const allCardDefinitions: readonly SwuCard[] = [${cardExportNames.map((name) => `${name} as SwuCard`).join(", ")}];`,
      "",
      ...rootIndexExports,
      "",
    ].join("\n"),
  );
}

async function main() {
  const [downloadedCards, existingDefinitions] = await Promise.all([
    fetchAllCards(),
    readExistingDefinitions(),
  ]);
  const downloadedCardsById = new Map();
  for (const card of downloadedCards) {
    if (!downloadedCardsById.has(card.id)) downloadedCardsById.set(card.id, card);
  }

  const cards = [...downloadedCardsById.values()]
    .map((card) => {
      const existing = existingDefinitions.get(card.id);
      if (
        existing?.definition.internalName &&
        existing.definition.internalName !== card.internalName
      ) {
        console.warn(
          `Card ${card.id} internalName changed: ${existing.definition.internalName} -> ${card.internalName}; regenerating path.`,
        );
      }
      const cardType = nativeCardType(card);
      const cardWithType = {
        ...card,
        relativePath:
          existing?.definition.internalName === card.internalName &&
          existing.definition.cardType === cardType
            ? existing.relativePath
            : undefined,
        cardType,
        ...(existing?.abilitiesSource ? { abilitiesSource: existing.abilitiesSource } : {}),
        ...(existing?.helperImports?.length ? { helperImports: existing.helperImports } : {}),
        ...(existing?.preamble ? { preamble: existing.preamble } : {}),
      };
      return { ...cardWithType, abilities: behaviorForCard(cardWithType, existing?.definition) };
    })
    .sort(compareCards);

  const lists = buildCardLists(cards);
  const strippedLists = {
    ...lists,
    cardMap: lists.cardMap.map((entry) => stripEmptyProperties(entry)),
    leaderNames: lists.leaderNames.map((entry) => stripEmptyProperties(entry)),
  };

  await fs.mkdir(cardsPackageRoot, { recursive: true });
  await writeCardDefinitionFiles(cards);
  await fs.writeFile(
    path.join(cardsPackageRoot, "generated.ts"),
    [
      "// Generated by tools/import-card-data. Do not edit manually.",
      'import type { SwuCardCatalog } from "@tcg/star-wars-unlimited-types";',
      'import { allCardDefinitions } from "./cards/index.ts";',
      "",
      `export const cardCatalogData = {
  cards: allCardDefinitions,
  cardMap: ${stableStringify(strippedLists.cardMap)},
  allNonLeaderCardTitles: ${stableStringify(strippedLists.allNonLeaderCardTitles)},
  playableCardTitles: ${stableStringify(strippedLists.playableCardTitles)},
  setCodeMap: ${stableStringify(strippedLists.setCodeMap)},
  leaderNames: ${stableStringify(strippedLists.leaderNames)},
} as const satisfies SwuCardCatalog;`,
      "",
      "export const allCards = cardCatalogData.cards;",
      "export const cardMap = cardCatalogData.cardMap;",
      "export const allNonLeaderCardTitles = cardCatalogData.allNonLeaderCardTitles;",
      "export const playableCardTitles = cardCatalogData.playableCardTitles;",
      "export const setCodeMap = cardCatalogData.setCodeMap;",
      "export const leaderNames = cardCatalogData.leaderNames;",
      "",
    ].join("\n"),
  );

  const newCardCount = cards.filter((card) => !existingDefinitions.has(card.id)).length;
  const removedCardCount = [...existingDefinitions.keys()].filter(
    (id) => !downloadedCardsById.has(id),
  ).length;
  console.log(
    `Imported ${cards.length} cards from ${downloadedCards.length} normalized API records (${newCardCount} new, ${removedCardCount} removed).`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
