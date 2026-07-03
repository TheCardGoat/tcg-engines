import { describe, expect, it } from "vite-plus/test";
import { allCards } from "@tcg/star-wars-unlimited-cards";
import type {
  SwuAbility,
  SwuArena,
  SwuCardDefinition,
  SwuCondition,
  SwuEffect,
  SwuKeyword,
  SwuTarget,
  SwuZone,
} from "@tcg/star-wars-unlimited-types";
import { executeTriggeredAbilities } from "../commands.ts";
import { effectiveHp, effectiveKeywords, effectivePower, effectiveTraits } from "../state.ts";
import { SwuTestEngine } from "../testing/index.ts";
import type { FixtureCardEntry, SwuTestFixture } from "../testing/index.ts";
import { testCardIdentity } from "../testing/index.ts";

interface CardHappyPathCase {
  readonly name: string;
  readonly card: SwuCardDefinition;
}

const unitTokenTitles = new Set<string>([
  "Battle Droid",
  "Clone Trooper",
  "Mandalorian",
  "Spy",
  "TIE Fighter",
  "X-Wing",
]);
const commonTokenDefinitions: SwuCardDefinition[] = allCards.filter(
  (card) =>
    card.cardType === "token" && (unitTokenTitles.has(card.title) || card.title === "Credit"),
);

function testName(card: SwuCardDefinition): string {
  const setCode = card.setId?.set ?? "UNKNOWN";
  const setNumber = card.setId?.number ? `${card.setId.number} ` : "";
  const subtitle = card.subtitle ? `, ${card.subtitle}` : "";
  return `${setCode} ${setNumber}${card.title}${subtitle} [${card.id}]`;
}

function cardStartZone(card: SwuCardDefinition): SwuZone {
  if (card.cardType === "base") return "base";
  if (card.cardType === "leader") return "leader";
  if (card.cardType === "unit" || card.cardType === "token") {
    return card.arena === "space" ? "spaceArena" : "groundArena";
  }
  return "hand";
}

function fixtureEntry(card: SwuCardDefinition): FixtureCardEntry {
  return { card, instanceId: `subject-${card.id}` };
}

function subjectFixtureEntry(card: SwuCardDefinition) {
  return { card, instanceId: `subject-${card.id}` };
}

function fixtureFor(card: SwuCardDefinition): SwuTestFixture {
  const zone = cardStartZone(card);
  if (zone === "base") {
    return { definitions: [card], playerOne: { base: fixtureEntry(card) } };
  }
  if (zone === "leader") {
    return { definitions: [card], playerOne: { leader: fixtureEntry(card) } };
  }
  return { definitions: [card], playerOne: { [zone]: [fixtureEntry(card)] } };
}

function subjectFor(engine: SwuTestEngine, card: SwuCardDefinition) {
  if (card.cardType === "base" || card.cardType === "leader") {
    return engine.findCard(card);
  }
  return engine.findCard(`subject-${card.id}`);
}

function keywordAbilities(card: SwuCardDefinition) {
  return (card.abilities ?? []).filter((ability) => ability.kind === "keyword");
}

function typedAbilities(card: SwuCardDefinition) {
  return (card.abilities ?? []).filter((ability) => ability.kind !== "keyword");
}

function keywordAmount(card: SwuCardDefinition, keyword: string): number {
  const match = card.text?.match(new RegExp(`\\b${keyword}\\s+(\\d+)`, "i"));
  return match ? Number.parseInt(match[1], 10) : 1;
}

function isCombatUnit(card: SwuCardDefinition): boolean {
  return (
    (card.cardType === "unit" || card.cardType === "token") &&
    card.power !== null &&
    card.hp !== null
  );
}

const supportedCombatKeywords: readonly SwuKeyword[] = [
  "ambush",
  "bounty",
  "coordinate",
  "exploit",
  "shielded",
  "grit",
  "hidden",
  "raid",
  "restore",
  "overwhelm",
  "piloting",
  "saboteur",
  "sentinel",
  "smuggle",
  "support",
];

function hasRunnableSupportedKeyword(card: SwuCardDefinition): boolean {
  return supportedCombatKeywords.some((keyword) => {
    if (!(card.keywords ?? []).includes(keyword)) return false;
    if (keyword === "bounty") return isCombatUnit(card) && hasPrintedBountyAbility(card);
    if (keyword === "smuggle") return card.cardType !== "leader" && card.cardType !== "base";
    return isCombatUnit(card);
  });
}

function hasPrintedBountyAbility(card: SwuCardDefinition): boolean {
  return /(?:^|\n|["“])\s*Bounty\s+[—-]/i.test(card.text ?? "");
}

function runShieldedHappyPath(card: SwuCardDefinition): boolean {
  if (!(card.keywords ?? []).includes("shielded") || !isCombatUnit(card)) return false;
  const engine = SwuTestEngine.fromFixture({
    definitions: [card],
    playerOne: { hand: [fixtureEntry(card)] },
  });

  engine.playerOne.playCard(`subject-${card.id}`);

  expect(subjectFor(engine, card).shield).toBeGreaterThanOrEqual(1);
  return true;
}

function runAmbushHappyPath(card: SwuCardDefinition): boolean {
  if (!(card.keywords ?? []).includes("ambush") || !isCombatUnit(card)) return false;
  const defender = vanillaUnit(`ambush-defender-${card.id}`, card.arena ?? "ground");
  const arenaZone = card.arena === "space" ? "spaceArena" : "groundArena";
  const engine = SwuTestEngine.fromFixture({
    definitions: [card, defender],
    playerOne: { hand: [fixtureEntry(card)] },
    playerTwo: { [arenaZone]: [{ card: defender, instanceId: `defender-${card.id}` }] },
  });

  engine.playerOne.playCard(`subject-${card.id}`);
  while (engine.pendingChoice && engine.pendingChoice.prompt !== "Resolve Ambush?") {
    engine.playerOne.resolveChoice("yes");
  }
  expect(engine.pendingChoice?.prompt).toBe("Resolve Ambush?");

  engine.playerOne.resolveChoice("yes");

  const subject = subjectFor(engine, card);
  expect(engine.state.moveLog.some((entry) => entry.type === "move.attack")).toBe(true);
  if (subject.zone === arenaZone) expect(subject.exhausted).toBe(true);
  if ((card.power ?? 0) > 0)
    expect(engine.findCard(`defender-${card.id}`).damage).toBeGreaterThan(0);
  return true;
}

function runSupportHappyPath(card: SwuCardDefinition): boolean {
  if (!(card.keywords ?? []).includes("support") || !isCombatUnit(card)) return false;
  const supporterZone = card.arena === "space" ? "spaceArena" : "groundArena";
  const attacker = vanillaUnit(`support-attacker-${card.id}`, "ground");
  const engine = SwuTestEngine.fromFixture({
    definitions: [card, attacker],
    playerOne: {
      hand: [fixtureEntry(card)],
      groundArena: [{ card: attacker, instanceId: `attacker-${card.id}` }],
    },
  });
  const enemyBase = engine.playerTwo.cardsIn("base")[0];

  engine.playerOne.playCard(`subject-${card.id}`);
  expect(subjectFor(engine, card).zone).toBe(supporterZone);
  expect(engine.pendingChoice?.prompt).toBe("Resolve Support?");

  engine.playerOne.resolveChoice("yes");

  expect(engine.findCard(`attacker-${card.id}`).exhausted).toBe(true);
  expect(enemyBase.damage).toBe(attacker.power);
  expect(engine.state.moveLog.some((entry) => entry.type === "move.attack")).toBe(true);
  return true;
}

function runExploitHappyPath(card: SwuCardDefinition): boolean {
  if (
    !(card.keywords ?? []).includes("exploit") ||
    card.cardType === "leader" ||
    card.cardType === "base"
  )
    return false;
  const sacrifice = vanillaUnit(`exploit-sacrifice-${card.id}`, "ground");
  const engine = SwuTestEngine.fromFixture({
    definitions: [card, sacrifice],
    playerOne: {
      hand: [fixtureEntry(card)],
      groundArena: [{ card: sacrifice, instanceId: `sacrifice-${card.id}` }],
    },
  });

  engine.playerOne.playCard(`subject-${card.id}`);

  while (engine.pendingChoice && engine.pendingChoice.prompt !== "Resolve Exploit?") {
    engine.playerOne.resolveChoice("yes");
  }
  expect(engine.pendingChoice?.prompt).toBe("Resolve Exploit?");
  engine.playerOne.resolveChoice("yes");

  expect(engine.findCard(`sacrifice-${card.id}`).zone).toBe("discard");
  expect(engine.state.moveLog.some((entry) => entry.type === "effect.defeat")).toBe(true);
  return true;
}

function runCoordinateHappyPath(card: SwuCardDefinition): boolean {
  if (!(card.keywords ?? []).includes("coordinate") || !isCombatUnit(card)) return false;
  const firstAlly = vanillaUnit(`coordinate-ally-a-${card.id}`, "ground");
  const secondAlly = vanillaUnit(`coordinate-ally-b-${card.id}`, "ground");
  const cardZone = cardStartZone(card);
  const friendlyGround = [
    { card: firstAlly, instanceId: `coordinate-ally-a-${card.id}` },
    { card: secondAlly, instanceId: `coordinate-ally-b-${card.id}` },
  ];
  const engine = SwuTestEngine.fromFixture({
    definitions: [card, firstAlly, secondAlly],
    playerOne:
      cardZone === "groundArena"
        ? { groundArena: [fixtureEntry(card), ...friendlyGround] }
        : {
            [cardZone]: [fixtureEntry(card)],
            groundArena: friendlyGround,
          },
  });
  const subject = subjectFor(engine, card);
  const activeKeywords = effectiveKeywords(engine.state, subject);

  expect(activeKeywords).toContain("coordinate");
  const statMatch = card.text?.match(/Coordinate\s+—\s+This unit gets\s+([+−-]\d+)\/([+−-]\d+)/i);
  if (statMatch) {
    const parseModifier = (value: string) => Number.parseInt(value.replace("−", "-"), 10);
    expect(effectivePower(engine.state, subject)).toBe(
      (card.power ?? 0) + parseModifier(statMatch[1]),
    );
    expect(effectiveHp(engine.state, subject)).toBe((card.hp ?? 0) + parseModifier(statMatch[2]));
  }
  for (const keyword of [
    "ambush",
    "grit",
    "overwhelm",
    "raid",
    "restore",
    "saboteur",
    "sentinel",
  ] as const) {
    if (new RegExp(`Coordinate\\s+—\\s+${keyword}\\b`, "i").test(card.text ?? "")) {
      expect(activeKeywords).toContain(keyword);
    }
  }
  return true;
}

function runSmuggleHappyPath(card: SwuCardDefinition): boolean {
  if (
    !(card.keywords ?? []).includes("smuggle") ||
    card.cardType === "leader" ||
    card.cardType === "base"
  )
    return false;
  const replacement = vanillaUnit(`smuggle-replacement-${card.id}`, "ground");
  const engine = SwuTestEngine.fromFixture({
    definitions: [card, replacement],
    playerOne: {
      resource: [fixtureEntry(card)],
      deck: [{ card: replacement, instanceId: `replacement-${card.id}` }],
    },
  });

  engine.playerOne.smuggle(`subject-${card.id}`);

  expect(subjectFor(engine, card).zone).not.toBe("resource");
  expect(engine.findCard(`replacement-${card.id}`).zone).toBe("resource");
  expect(engine.state.moveLog.some((entry) => entry.type === "framework.smuggle.replace")).toBe(
    true,
  );
  return true;
}

function runPilotingHappyPath(card: SwuCardDefinition): boolean {
  if (!(card.keywords ?? []).includes("piloting") || !isCombatUnit(card)) return false;
  const vehicle = vehicleUnit(`piloting-vehicle-${card.id}`);
  const engine = SwuTestEngine.fromFixture({
    definitions: [card, vehicle],
    playerOne: {
      hand: [fixtureEntry(card)],
      groundArena: [{ card: vehicle, instanceId: `vehicle-${card.id}` }],
    },
  });
  const target = engine.findCard(`vehicle-${card.id}`);

  engine.playerOne.pilot(`subject-${card.id}`, target);

  expect(target.upgrades).toContain(`subject-${card.id}`);
  expect(subjectFor(engine, card).zone).toBe(target.zone);
  expect(engine.state.moveLog.some((entry) => entry.type === "framework.piloting.attach")).toBe(
    true,
  );
  const targetKeywords = effectiveKeywords(engine.state, target);
  for (const keyword of [
    "ambush",
    "grit",
    "overwhelm",
    "raid",
    "restore",
    "saboteur",
    "sentinel",
    "shielded",
  ] as const) {
    if (new RegExp(`Attached unit gains:?\\s+[“"]?${keyword}\\b`, "i").test(card.pilotText ?? "")) {
      expect(targetKeywords).toContain(keyword);
    }
  }
  return true;
}

function runBountyHappyPath(card: SwuCardDefinition): boolean {
  if (
    !(card.keywords ?? []).includes("bounty") ||
    !isCombatUnit(card) ||
    !hasPrintedBountyAbility(card)
  )
    return false;
  const attacker = {
    ...vanillaUnit(`bounty-attacker-${card.id}`, card.arena ?? "ground"),
    power: Math.max(6, card.hp ?? 1),
  };
  const rewardCard = vanillaUnit(`bounty-reward-${card.id}`, "ground");
  const zone = cardStartZone(card);
  const engine = SwuTestEngine.fromFixture({
    definitions: [card, attacker, rewardCard],
    playerOne: {
      [zone]: [{ card: attacker, instanceId: `attacker-${card.id}` }],
      deck: [{ card: rewardCard, instanceId: `reward-${card.id}` }],
    },
    playerTwo: { [zone]: [fixtureEntry(card)] },
  });

  engine.playerOne.attack(`attacker-${card.id}`, `subject-${card.id}`);

  expect(subjectFor(engine, card).zone).toBe("discard");
  expect(engine.state.moveLog.some((entry) => entry.type === "framework.bounty.collect")).toBe(
    true,
  );
  if (/Bounty\s+[—-]\s+Draw (?:a card|2 cards)/i.test(card.text ?? "")) {
    expect(engine.findCard(`reward-${card.id}`).zone).toBe("hand");
  }
  if (
    /Bounty\s+[—-]\s+Put the top card of your deck into play as a resource/i.test(card.text ?? "")
  ) {
    expect(engine.findCard(`reward-${card.id}`).zone).toBe("resource");
  }
  return true;
}

function vanillaUnit(id: string, arena: SwuArena = "ground"): SwuCardDefinition {
  return {
    ...testCardIdentity(id, "Test Unit"),
    title: "Test Unit",
    subtitle: null,
    cost: 1,
    hp: 6,
    power: 2,
    text: null,
    deployBox: null,
    epicAction: null,
    unique: false,
    rules: null,
    id,
    internalName: id,
    cardType: "unit",
    types: ["unit"],
    aspects: [],
    traits: [],
    arena,
    keywords: [],
    abilities: [],
  };
}

function vehicleUnit(id: string, arena: SwuArena = "ground"): SwuCardDefinition {
  return {
    ...vanillaUnit(id, arena),
    title: "Test Vehicle",
    traits: ["Vehicle"],
  };
}

function allAspectUnit(id: string, arena: SwuArena = "ground"): SwuCardDefinition {
  return {
    ...vanillaUnit(id, arena),
    title: "Test Aspect Unit",
    aspects: ["aggression", "command", "cunning", "heroism", "vigilance", "villainy"],
  };
}

function forceUnit(id: string, arena: SwuArena = "ground"): SwuCardDefinition {
  return {
    ...vanillaUnit(id, arena),
    title: "Test Force Unit",
    traits: ["Force"],
  };
}

function tokenUnit(id: string, arena: SwuArena = "ground"): SwuCardDefinition {
  return {
    ...vanillaUnit(id, arena),
    title: "Test Token",
    cardType: "token",
    types: ["token"],
  };
}

function allTraitUnit(id: string, arena: SwuArena = "ground"): SwuCardDefinition {
  return {
    ...vanillaUnit(id, arena),
    title: "Test Trait Unit",
    traits: [
      "bounty hunter",
      "capital ship",
      "clone",
      "droid",
      "force",
      "imperial",
      "jedi",
      "mandalorian",
      "official",
      "rebel",
      "republic",
      "separatist",
      "sith",
      "spectre",
      "trooper",
      "underworld",
      "vehicle",
      "wookiee",
    ],
  };
}

function leaderUnit(id: string, arena: SwuArena = "ground"): SwuCardDefinition {
  return {
    ...vanillaUnit(id, arena),
    title: "Test Leader Unit",
    cardType: "leader",
    types: ["leader"],
  };
}

function cardTargetFixture(
  card: SwuCardDefinition,
  target: Extract<SwuEffect, { type: "modifyStats" }>["target"],
): { card: SwuCardDefinition; instanceId: string } {
  if (target.type !== "card") {
    return {
      card: vanillaUnit(`constant-target-${card.id}`),
      instanceId: `constant-target-${card.id}`,
    };
  }
  const arena = target.arena ?? "ground";
  const targetCard = target.cardTypes?.includes("leader")
    ? leaderUnit(`constant-target-${card.id}`, arena)
    : target.cardTypes?.includes("token")
      ? tokenUnit(`constant-target-${card.id}`, arena)
      : vanillaUnit(`constant-target-${card.id}`, arena);
  return {
    card: {
      ...targetCard,
      cost: Math.max(target.cost?.value ?? targetCard.cost ?? 1, targetCard.cost ?? 1),
      traits: [...(target.traits ?? targetCard.traits)],
      keywords: [...(target.keywords ?? targetCard.keywords)],
      power: Math.max(target.power?.value ?? targetCard.power ?? 2, targetCard.power ?? 2),
      hp: Math.max(target.hp?.value ?? targetCard.hp ?? 6, targetCard.hp ?? 6),
    },
    instanceId: `constant-target-${card.id}`,
  };
}

function constantCountTargetFixture(
  card: SwuCardDefinition,
  target: Extract<SwuEffect, { type: "modifyStatsPer"; per: "targetCount" }>["count"],
): { card: SwuCardDefinition; instanceId: string; exhausted?: boolean } {
  if (target.type !== "card") {
    return {
      card: vanillaUnit(`constant-count-target-${card.id}`),
      instanceId: `constant-count-target-${card.id}`,
    };
  }
  const id = target.ids?.[0] ?? `constant-count-target-${card.id}`;
  const arena = target.arena ?? (target.zones?.includes("spaceArena") ? "space" : "ground");
  const targetCard =
    target.ids?.includes(card.id) === true
      ? card
      : {
          ...vanillaUnit(id, arena),
          id,
          internalName: id,
          traits: [...(target.traits ?? [])],
        };
  return {
    card: targetCard,
    instanceId: `constant-count-target-${card.id}`,
    exhausted: target.exhausted,
  };
}

function vanillaUpgrade(id: string): SwuCardDefinition {
  return {
    ...testCardIdentity(id, "Test Upgrade"),
    title: "Test Upgrade",
    subtitle: null,
    cost: 1,
    hp: 1,
    power: 1,
    text: null,
    deployBox: null,
    epicAction: null,
    unique: false,
    rules: null,
    upgradePower: 1,
    upgradeHp: 1,
    id,
    internalName: id,
    cardType: "upgrade",
    types: ["upgrade"],
    aspects: [],
    traits: [],
    arena: null,
    keywords: [],
    abilities: [],
  };
}

function vanillaEvent(id: string): SwuCardDefinition {
  return {
    ...testCardIdentity(id, "Test Event"),
    title: "Test Event",
    subtitle: null,
    cost: 1,
    hp: null,
    power: null,
    text: null,
    deployBox: null,
    epicAction: null,
    unique: false,
    rules: null,
    id,
    internalName: id,
    cardType: "event",
    types: ["event"],
    aspects: [],
    traits: [],
    arena: null,
    keywords: [],
    abilities: [],
  };
}

function deployableLeader(id: string): SwuCardDefinition {
  return {
    ...leaderUnit(id),
    title: "Test Deployable Leader",
    text: "Epic Action: If you control 5 or more resources, deploy this leader.",
    epicAction: "Epic Action: If you control 5 or more resources, deploy this leader.",
    abilities: [
      {
        kind: "action",
        text: "Epic Action: If you control 5 or more resources, deploy this leader.",
        trigger: { event: "epicAction" },
        effects: [{ type: "move", target: { type: "self" }, to: "groundArena" }],
      },
    ],
  };
}

function runAttachAbilityHappyPath(card: SwuCardDefinition, ability: SwuAbility): boolean {
  if (
    card.cardType !== "upgrade" ||
    ability.kind !== "constant" ||
    !/^Attach to /i.test(ability.text)
  ) {
    return false;
  }
  const targetCard =
    /vehicle/i.test(ability.text) && !/non-vehicle/i.test(ability.text)
      ? vehicleUnit(`attach-target-${card.id}`)
      : /force/i.test(ability.text)
        ? forceUnit(`attach-target-${card.id}`)
        : vanillaUnit(`attach-target-${card.id}`);
  const engine = SwuTestEngine.fromFixture({
    definitions: [card, targetCard],
    playerOne: {
      hand: [fixtureEntry(card)],
      groundArena: [{ card: targetCard, instanceId: `attach-target-${card.id}` }],
    },
  });
  const target = engine.findCard(`attach-target-${card.id}`);

  engine.playCard(`subject-${card.id}`, { target });

  expect(subjectFor(engine, card).zone).toBe(target.zone);
  expect(target.upgrades).toContain(`subject-${card.id}`);
  expect(engine.state.moveLog.some((entry) => entry.type === "framework.upgrade.attach")).toBe(
    true,
  );
  return true;
}

function runGritHappyPath(card: SwuCardDefinition): boolean {
  if (!(card.keywords ?? []).includes("grit") || !isCombatUnit(card)) return false;
  const damage = Math.max(1, Math.min(2, (card.hp ?? 2) - 1));
  const engine = SwuTestEngine.fromFixture({
    definitions: [card],
    playerOne: { [cardStartZone(card)]: [{ ...subjectFixtureEntry(card), damage }] },
  });
  const subject = subjectFor(engine, card);

  expect(effectivePower(engine.state, subject)).toBe((card.power ?? 0) + damage);
  return true;
}

function runRaidHappyPath(card: SwuCardDefinition): boolean {
  if (!(card.keywords ?? []).includes("raid") || !isCombatUnit(card)) return false;
  const engine = SwuTestEngine.fromFixture({
    definitions: [card],
    playerOne: { [cardStartZone(card)]: [fixtureEntry(card)] },
  });
  const defender = engine.playerTwo.cardsIn("base")[0];

  engine.playerOne.attack(`subject-${card.id}`, defender);

  expect(defender.damage).toBe((card.power ?? 0) + keywordAmount(card, "raid"));
  return true;
}

function runHiddenHappyPath(card: SwuCardDefinition): boolean {
  if (
    !(card.keywords ?? []).includes("hidden") ||
    (card.keywords ?? []).includes("sentinel") ||
    !isCombatUnit(card)
  )
    return false;
  const attacker = vanillaUnit(`hidden-attacker-${card.id}`, card.arena ?? "ground");
  const zone = cardStartZone(card);
  const engine = SwuTestEngine.fromFixture({
    definitions: [card, attacker],
    playerOne: { [zone]: [{ card: attacker, instanceId: `attacker-${card.id}` }] },
    playerTwo: { [zone]: [{ ...subjectFixtureEntry(card), playedThisPhase: true }] },
  });

  const result = engine.expectFailure(() =>
    engine.playerOne.attack(`attacker-${card.id}`, `subject-${card.id}`),
  );

  expect(result.error).toBe("Defender is hidden.");
  return true;
}

function runSentinelHappyPath(card: SwuCardDefinition): boolean {
  if (!(card.keywords ?? []).includes("sentinel") || !isCombatUnit(card)) return false;
  const attacker = vanillaUnit(`sentinel-attacker-${card.id}`, card.arena ?? "ground");
  const zone = cardStartZone(card);
  const engine = SwuTestEngine.fromFixture({
    definitions: [card, attacker],
    playerOne: { [zone]: [{ card: attacker, instanceId: `attacker-${card.id}` }] },
    playerTwo: { [zone]: [fixtureEntry(card)] },
  });
  const enemyBase = engine.playerTwo.cardsIn("base")[0];

  const blockedAttack = engine.expectFailure(() =>
    engine.playerOne.attack(`attacker-${card.id}`, enemyBase),
  );
  expect(blockedAttack.error).toBe("A Sentinel unit must be attacked first.");

  engine.playerOne.attack(`attacker-${card.id}`, `subject-${card.id}`);

  expect(subjectFor(engine, card).damage).toBeGreaterThan(0);
  return true;
}

function runRestoreHappyPath(card: SwuCardDefinition): boolean {
  if (!(card.keywords ?? []).includes("restore") || !isCombatUnit(card)) return false;
  const engine = SwuTestEngine.fromFixture({
    definitions: [card],
    playerOne: { [cardStartZone(card)]: [fixtureEntry(card)] },
  });
  const friendlyBase = engine.playerOne.cardsIn("base")[0];
  const defender = engine.playerTwo.cardsIn("base")[0];
  const expectedHealing = Math.min(5, keywordAmount(card, "restore"));
  friendlyBase.damage = 5;

  engine.playerOne.attack(`subject-${card.id}`, defender);

  expect(friendlyBase.damage).toBe(5 - expectedHealing);
  return true;
}

function runOverwhelmHappyPath(card: SwuCardDefinition): boolean {
  if (!(card.keywords ?? []).includes("overwhelm") || !isCombatUnit(card)) return false;
  const defender: SwuCardDefinition = {
    ...card,
    id: `overwhelm-defender-${card.id}`,
    title: "Overwhelm Defender",
    internalName: `overwhelm-defender-${card.id}`,
    power: 0,
    hp: 1,
    keywords: [],
    abilities: [],
  };
  const engine = SwuTestEngine.fromFixture({
    definitions: [card, defender],
    playerOne: { [cardStartZone(card)]: [{ ...subjectFixtureEntry(card), temporaryPower: 2 }] },
    playerTwo: { groundArena: [{ card: defender, instanceId: `defender-${card.id}` }] },
  });
  const enemyBase = engine.playerTwo.cardsIn("base")[0];
  const subject = subjectFor(engine, card);
  const raidPower = (card.keywords ?? []).includes("raid") ? keywordAmount(card, "raid") : 0;
  const expectedExcess = Math.max(0, effectivePower(engine.state, subject) + raidPower - 1);

  engine.playerOne.attack(`subject-${card.id}`, `defender-${card.id}`);

  expect(enemyBase.damage).toBe(expectedExcess);
  return true;
}

function runSaboteurHappyPath(card: SwuCardDefinition): boolean {
  if (!(card.keywords ?? []).includes("saboteur") || !isCombatUnit(card)) return false;
  const defender: SwuCardDefinition = {
    ...card,
    id: `saboteur-defender-${card.id}`,
    title: "Saboteur Defender",
    internalName: `saboteur-defender-${card.id}`,
    power: 0,
    hp: 6,
    keywords: [],
    abilities: [],
  };
  const engine = SwuTestEngine.fromFixture({
    definitions: [card, defender],
    playerOne: { [cardStartZone(card)]: [fixtureEntry(card)] },
    playerTwo: { groundArena: [{ card: defender, instanceId: `defender-${card.id}`, shield: 1 }] },
  });
  const defenderRuntime = engine.findCard(`defender-${card.id}`);
  const subject = subjectFor(engine, card);
  const expectedDamage =
    effectivePower(engine.state, subject) +
    ((card.keywords ?? []).includes("raid") ? keywordAmount(card, "raid") : 0);

  engine.playerOne.attack(`subject-${card.id}`, defenderRuntime);

  expect(defenderRuntime.shield).toBe(0);
  expect(defenderRuntime.damage).toBe(expectedDamage);
  return true;
}

const executableEffectTypes = new Set<SwuEffect["type"]>([
  "attack",
  "capture",
  "choose",
  "combatDamageFirst",
  "conditional",
  "createToken",
  "damage",
  "damageFrom",
  "damagePer",
  "defeat",
  "delayed",
  "discard",
  "distribute",
  "draw",
  "exhaust",
  "gainKeyword",
  "gainTrait",
  "heal",
  "ifYouDo",
  "indirectDamage",
  "lookAt",
  "loseHealing",
  "loseKeyword",
  "modifyStats",
  "move",
  "optional",
  "payResources",
  "play",
  "preventDamage",
  "ready",
  "reorder",
  "restrictAttack",
  "reveal",
  "resource",
  "search",
  "sequential",
  "simultaneous",
  "takeControl",
  "useForce",
]);

function effectsAreExecutable(effects: readonly SwuEffect[]): boolean {
  return effects.every((effect) => {
    if (!executableEffectTypes.has(effect.type)) return false;
    if (effect.type === "choose") {
      return effect.choices.every((choice) => effectsAreExecutable(choice.effects ?? []));
    }
    if (effect.type === "optional") return effectsAreExecutable(effect.effects);
    if (effect.type === "ifYouDo") {
      return effectsAreExecutable([effect.doEffect]) && effectsAreExecutable(effect.thenEffects);
    }
    if (effect.type === "conditional") {
      return (
        effectsAreExecutable(effect.ifTrue) &&
        (effect.ifFalse === undefined || effectsAreExecutable(effect.ifFalse))
      );
    }
    if (effect.type === "sequential") return effectsAreExecutable(effect.effects);
    return true;
  });
}

function abilityIsExecutableForCard(card: SwuCardDefinition, ability: SwuAbility): boolean {
  return (
    ability.kind === "triggered" &&
    (ability.trigger?.event === "played" ||
      ability.trigger?.event === "deployed" ||
      ability.trigger?.event === "attack" ||
      ability.trigger?.event === "attackEnds" ||
      ability.trigger?.event === "attacked" ||
      ability.trigger?.event === "when" ||
      ability.trigger?.event === "defeated") &&
    (ability.trigger.event !== "attack" || isCombatUnit(card)) &&
    (ability.trigger.event !== "attackEnds" || isCombatUnit(card)) &&
    (ability.trigger.event !== "attacked" || isCombatUnit(card)) &&
    (ability.trigger.event !== "defeated" || isCombatUnit(card)) &&
    (ability.trigger.event !== "played" ||
      (card.cardType !== "base" && card.cardType !== "leader")) &&
    effectsAreExecutable(ability.effects ?? [])
  );
}

function actionAbilityIsExecutable(ability: SwuAbility): boolean {
  return (
    ability.kind === "action" &&
    (ability.trigger?.event === "action" || ability.trigger?.event === "epicAction") &&
    effectsAreExecutable(ability.effects ?? [])
  );
}

function effectTypes(effects: readonly SwuEffect[], types = new Set<SwuEffect["type"]>()) {
  for (const effect of effects) {
    if (
      effect.type !== "optional" &&
      effect.type !== "choose" &&
      effect.type !== "ifYouDo" &&
      effect.type !== "conditional" &&
      effect.type !== "sequential" &&
      effect.type !== "simultaneous"
    ) {
      types.add(effect.type);
    }
    if (effect.type === "optional") effectTypes(effect.effects, types);
    if (effect.type === "choose") {
      const chosen = effect.choices[0];
      if (chosen) effectTypes(chosen.effects ?? [], types);
    }
    if (effect.type === "ifYouDo") {
      effectTypes([effect.doEffect], types);
      effectTypes(effect.thenEffects, types);
    }
    if (effect.type === "conditional") {
      // Happy-path fixtures are shaped to satisfy the primary branch. The
      // alternative branch remains typed and interpreter-checked through the DSL
      // exhaustiveness tests, but it is not expected to log in this scenario.
      effectTypes(effect.ifTrue, types);
    }
    if (effect.type === "sequential") effectTypes(effect.effects, types);
    if (effect.type === "simultaneous") effectTypes(effect.effects, types);
  }
  return types;
}

function createTokenTypes(
  effects: readonly SwuEffect[],
  tokens = new Set<Extract<SwuEffect, { type: "createToken" }>["token"]>(),
) {
  for (const effect of effects) {
    if (effect.type === "createToken") tokens.add(effect.token);
    if (effect.type === "optional") createTokenTypes(effect.effects, tokens);
    if (effect.type === "choose") {
      for (const choice of effect.choices) createTokenTypes(choice.effects ?? [], tokens);
    }
    if (effect.type === "ifYouDo") {
      createTokenTypes([effect.doEffect], tokens);
      createTokenTypes(effect.thenEffects, tokens);
    }
    if (effect.type === "conditional") {
      createTokenTypes(effect.ifTrue, tokens);
      if (effect.ifFalse) createTokenTypes(effect.ifFalse, tokens);
    }
    if (effect.type === "sequential") createTokenTypes(effect.effects, tokens);
    if (effect.type === "simultaneous") createTokenTypes(effect.effects, tokens);
  }
  return tokens;
}

function extraUnitsForMoreUnitsCondition(
  card: SwuCardDefinition,
  ability: SwuAbility,
  controller: "friendly" | "opponent",
): FixtureCardEntry[] {
  const condition = ability.conditions?.find(
    (candidate): candidate is Extract<SwuCondition, { type: "controlsMoreUnits" }> =>
      candidate.type === "controlsMoreUnits" && candidate.controller === controller,
  );
  if (!condition) return [];
  const arena = condition.arena ?? "ground";
  return [1, 2, 3].map((index) => ({
    card: vanillaUnit(`${controller}-more-unit-${card.id}-${index}`, arena),
    instanceId: `${controller}-more-unit-${card.id}-${index}`,
  }));
}

function fixtureDefinition(entry: FixtureCardEntry): SwuCardDefinition {
  if (typeof entry === "string") throw new Error("String fixture entries do not carry definitions");
  return "card" in entry ? (entry.card as SwuCardDefinition) : entry;
}

function fixtureEntriesForArena(
  entries: readonly FixtureCardEntry[],
  arena: SwuArena,
): FixtureCardEntry[] {
  return entries.filter((entry) => fixtureDefinition(entry).arena === arena);
}

function fixtureEntryDefinitions(entries: readonly FixtureCardEntry[]): SwuCardDefinition[] {
  return entries.map(fixtureDefinition);
}

function playerOneUnitTokenCount(engine: SwuTestEngine): number {
  return engine.playerOne
    .cardsIn("groundArena")
    .concat(engine.playerOne.cardsIn("spaceArena"))
    .filter((runtimeCard) => {
      const definition = engine.state.definitions[runtimeCard.definitionId];
      return definition?.cardType === "token" && unitTokenTitles.has(definition.title);
    }).length;
}

function effectStatBonus(effects: readonly SwuEffect[]) {
  return effects.reduce(
    (stats, effect) => {
      if (effect.type === "modifyStats" && effect.target.type === "self") {
        return {
          power: stats.power + (effect.power ?? 0),
          hp: stats.hp + (effect.hp ?? 0),
        };
      }
      return stats;
    },
    { power: 0, hp: 0 },
  );
}

function firstTargetedStatEffect(effects: readonly SwuEffect[]) {
  return effects.find(
    (effect): effect is Extract<SwuEffect, { type: "modifyStats" }> =>
      effect.type === "modifyStats" && effect.target.type !== "self",
  );
}

function firstTargetedKeywordEffect(effects: readonly SwuEffect[]) {
  return effects.find(
    (effect): effect is Extract<SwuEffect, { type: "gainKeyword" }> =>
      effect.type === "gainKeyword" && effect.target.type !== "self",
  );
}

function firstTargetedTraitEffect(effects: readonly SwuEffect[]) {
  return effects.find(
    (effect): effect is Extract<SwuEffect, { type: "gainTrait" }> =>
      effect.type === "gainTrait" && effect.target.type !== "self",
  );
}

function resourcesSelf(effects: readonly SwuEffect[]): boolean {
  return effects.some((effect) => {
    if (effect.type === "resource" && effect.target.type === "self") return true;
    if (effect.type === "optional") return resourcesSelf(effect.effects);
    if (effect.type === "ifYouDo") {
      return resourcesSelf([effect.doEffect]) || resourcesSelf(effect.thenEffects);
    }
    if (effect.type === "conditional") {
      return resourcesSelf(effect.ifTrue) || resourcesSelf(effect.ifFalse ?? []);
    }
    if (effect.type === "sequential") return resourcesSelf(effect.effects);
    return false;
  });
}

function referencesChoiceTarget(effects: readonly SwuEffect[], choiceId: string): boolean {
  const targetReferencesChoice = (target: SwuTarget | undefined): boolean =>
    target?.type === "choice" && target.id === choiceId;

  return effects.some((effect) => {
    if ("target" in effect && targetReferencesChoice(effect.target)) return true;
    if (effect.type === "attack") {
      return (
        (!!effect.attacker && targetReferencesChoice(effect.attacker)) ||
        (!!effect.defender && targetReferencesChoice(effect.defender))
      );
    }
    if (effect.type === "optional") return referencesChoiceTarget(effect.effects, choiceId);
    if (effect.type === "ifYouDo") {
      return (
        referencesChoiceTarget([effect.doEffect], choiceId) ||
        referencesChoiceTarget(effect.thenEffects, choiceId)
      );
    }
    if (effect.type === "conditional") {
      return (
        referencesChoiceTarget(effect.ifTrue, choiceId) ||
        referencesChoiceTarget(effect.ifFalse ?? [], choiceId)
      );
    }
    if (effect.type === "sequential") return referencesChoiceTarget(effect.effects, choiceId);
    if (effect.type === "simultaneous") return referencesChoiceTarget(effect.effects, choiceId);
    return false;
  });
}

function constantAbilityIsExecutable(ability: SwuAbility): boolean {
  return (
    ability.kind === "constant" &&
    (ability.effects ?? []).every(
      (effect) =>
        (effect.type === "modifyStats" ||
          effect.type === "modifyStatsPer" ||
          effect.type === "combatDamageFirst" ||
          effect.type === "gainKeyword" ||
          effect.type === "gainTrait" ||
          effect.type === "loseHealing" ||
          effect.type === "preventDamage" ||
          effect.type === "restrictAttack") &&
        (effect.target.type === "self" ||
          effect.target.type === "base" ||
          effect.target.type === "card" ||
          effect.target.type === "attachedUnit"),
    ) &&
    (ability.conditions ?? []).every(
      (condition) =>
        condition.type === "attackDefender" ||
        condition.type === "hasInitiative" ||
        condition.type === "resources" ||
        condition.type === "controlsAspect" ||
        condition.type === "controlsTrait" ||
        condition.type === "baseDamage" ||
        condition.type === "hasTarget" ||
        condition.type === "sourceIsDamaged" ||
        condition.type === "sourceIsUpgraded" ||
        condition.type === "unitsDefeatedThisPhase",
    )
  );
}

function expectAbilityEffectResolved(engine: SwuTestEngine, ability: SwuAbility) {
  for (const type of effectTypes(ability.effects ?? [])) {
    expect(engine.state.moveLog.some((entry) => entry.type === `effect.${type}`)).toBe(true);
  }
}

function attackRestrictionEffects(effects: readonly SwuEffect[]) {
  return effects.filter(
    (effect): effect is Extract<SwuEffect, { type: "restrictAttack" }> =>
      effect.type === "restrictAttack",
  );
}

function resolveAllChoices(engine: SwuTestEngine) {
  while (engine.pendingChoice) {
    const optionId = engine.pendingChoice.options.some((option) => option.id === "yes")
      ? "yes"
      : engine.pendingChoice.options[0]?.id;
    expect(optionId).toBeTruthy();
    if (engine.pendingChoice.playerId === "player-two") engine.playerTwo.resolveChoice(optionId);
    else engine.playerOne.resolveChoice(optionId);
  }
}

function genericTargets(card: SwuCardDefinition) {
  return {
    friendlyGround: {
      card: { ...allAspectUnit(`friendly-ground-${card.id}`, "ground"), power: 5, unique: true },
      instanceId: `friendly-ground-${card.id}`,
      damage: 3,
    },
    friendlyTraitGround: {
      card: allTraitUnit(`friendly-trait-ground-${card.id}`, "ground"),
      instanceId: `friendly-trait-ground-${card.id}`,
      damage: 1,
    },
    friendlySpace: {
      card: vanillaUnit(`friendly-space-${card.id}`, "space"),
      instanceId: `friendly-space-${card.id}`,
      damage: 3,
    },
    friendlyFighter: {
      card: {
        ...vehicleUnit(`friendly-fighter-${card.id}`, "space"),
        traits: ["vehicle", "fighter"],
      },
      instanceId: `friendly-fighter-${card.id}`,
    },
    enemyGround: {
      card: vanillaUnit(`enemy-ground-${card.id}`, "ground"),
      instanceId: `enemy-ground-${card.id}`,
      damage: 1,
    },
    enemySpace: {
      card: vanillaUnit(`enemy-space-${card.id}`, "space"),
      instanceId: `enemy-space-${card.id}`,
      damage: 1,
    },
    enemyTransport: {
      card: { ...vehicleUnit(`enemy-transport-${card.id}`, "space"), traits: ["transport"] },
      instanceId: `enemy-transport-${card.id}`,
    },
    friendlyLowHpGround: {
      card: { ...vanillaUnit(`friendly-low-hp-ground-${card.id}`, "ground"), hp: 1 },
      instanceId: `friendly-low-hp-ground-${card.id}`,
    },
    enemyLowHpGround: {
      card: { ...vanillaUnit(`enemy-low-hp-ground-${card.id}`, "ground"), hp: 1 },
      instanceId: `enemy-low-hp-ground-${card.id}`,
    },
    enemyLowHpSpace: {
      card: { ...vanillaUnit(`enemy-low-hp-space-${card.id}`, "space"), hp: 1 },
      instanceId: `enemy-low-hp-space-${card.id}`,
    },
    enemyToken: {
      card: tokenUnit(`enemy-token-${card.id}`, "ground"),
      instanceId: `enemy-token-${card.id}`,
    },
    drawCard: {
      card: vanillaUnit(`draw-card-${card.id}`, "ground"),
      instanceId: `draw-card-${card.id}`,
    },
    friendlyDeckEventA: {
      card: vanillaEvent(`friendly-deck-event-a-${card.id}`),
      instanceId: `friendly-deck-event-a-${card.id}`,
    },
    friendlyDeckEventB: {
      card: vanillaEvent(`friendly-deck-event-b-${card.id}`),
      instanceId: `friendly-deck-event-b-${card.id}`,
    },
    friendlyDeckForceUnit: {
      card: forceUnit(`friendly-deck-force-${card.id}`, "ground"),
      instanceId: `friendly-deck-force-${card.id}`,
    },
    friendlyDeckDroid: {
      card: { ...vanillaUnit(`friendly-deck-droid-${card.id}`, "ground"), traits: ["droid"] },
      instanceId: `friendly-deck-droid-${card.id}`,
    },
    friendlyDeckUnderworld: {
      card: {
        ...vanillaUnit(`friendly-deck-underworld-${card.id}`, "ground"),
        traits: ["underworld"],
      },
      instanceId: `friendly-deck-underworld-${card.id}`,
    },
    enemyDeckCard: {
      card: vanillaUnit(`enemy-deck-card-${card.id}`, "ground"),
      instanceId: `enemy-deck-card-${card.id}`,
    },
    enemyDeckCardB: {
      card: vanillaUnit(`enemy-deck-card-b-${card.id}`, "ground"),
      instanceId: `enemy-deck-card-b-${card.id}`,
    },
    enemyHandCard: {
      card: vanillaUnit(`enemy-hand-card-${card.id}`, "ground"),
      instanceId: `enemy-hand-card-${card.id}`,
    },
    friendlyHandUnit: {
      card: vanillaUnit(`friendly-hand-${card.id}`, "ground"),
      instanceId: `friendly-hand-${card.id}`,
    },
    friendlyHandForceUnit: {
      card: forceUnit(`friendly-hand-force-${card.id}`, "ground"),
      instanceId: `friendly-hand-force-${card.id}`,
    },
    friendlyHandVehicle: {
      card: vehicleUnit(`friendly-hand-vehicle-${card.id}`, "space"),
      instanceId: `friendly-hand-vehicle-${card.id}`,
    },
    friendlyHandEvent: {
      card: vanillaEvent(`friendly-hand-event-${card.id}`),
      instanceId: `friendly-hand-event-${card.id}`,
    },
    friendlyHandUpgrade: {
      card: { ...vanillaUpgrade(`friendly-hand-upgrade-${card.id}`), traits: ["lightsaber"] },
      instanceId: `friendly-hand-upgrade-${card.id}`,
    },
    friendlyDiscardUnderworld: {
      card: {
        ...vanillaUnit(`friendly-discard-underworld-${card.id}`, "ground"),
        traits: ["underworld", "force"],
      },
      instanceId: `friendly-discard-underworld-${card.id}`,
    },
    friendlyDiscardRepublic: {
      card: {
        ...vanillaUnit(`friendly-discard-republic-${card.id}`, "ground"),
        traits: ["republic"],
      },
      instanceId: `friendly-discard-republic-${card.id}`,
    },
    friendlyDiscardVehicle: {
      card: vehicleUnit(`friendly-discard-vehicle-${card.id}`, "space"),
      instanceId: `friendly-discard-vehicle-${card.id}`,
    },
    friendlyDiscardLightsaber: {
      card: {
        ...vanillaUpgrade(`friendly-discard-lightsaber-${card.id}`),
        traits: ["lightsaber"],
      },
      instanceId: `friendly-discard-lightsaber-${card.id}`,
    },
    enemyDiscardCard: {
      card: vanillaUnit(`enemy-discard-card-${card.id}`, "ground"),
      instanceId: `enemy-discard-card-${card.id}`,
    },
    friendlyResource: {
      card: vanillaUnit(`friendly-resource-${card.id}`, "ground"),
      instanceId: `friendly-resource-${card.id}`,
      exhausted: true,
    },
    enemyResource: {
      card: vanillaUnit(`enemy-resource-${card.id}`, "ground"),
      instanceId: `enemy-resource-${card.id}`,
      exhausted: true,
    },
    friendlyUpgrade: {
      card: vanillaUpgrade(`friendly-upgrade-${card.id}`),
      instanceId: `friendly-upgrade-${card.id}`,
    },
    friendlyPilotUpgrade: {
      card: { ...vanillaUpgrade(`friendly-pilot-upgrade-${card.id}`), traits: ["pilot"] },
      instanceId: `friendly-pilot-upgrade-${card.id}`,
    },
    enemyUpgrade: {
      card: vanillaUpgrade(`enemy-upgrade-${card.id}`),
      instanceId: `enemy-upgrade-${card.id}`,
    },
  } satisfies Record<string, FixtureCardEntry>;
}

function runPlayedAbilityHappyPath(card: SwuCardDefinition, ability: SwuAbility): boolean {
  if (ability.trigger?.event !== "played" || !abilityIsExecutableForCard(card, ability))
    return false;
  const targets = genericTargets(card);
  const extraFriendlyUnits = extraUnitsForMoreUnitsCondition(card, ability, "friendly");
  const extraOpponentUnits = extraUnitsForMoreUnitsCondition(card, ability, "opponent");
  const engine = SwuTestEngine.fromFixture({
    phaseHistory: ability.conditions?.some(
      (condition) => condition.type === "unitsDefeatedThisPhase",
    )
      ? { unitsDefeatedByController: { "player-one": 1, "player-two": 1 } }
      : undefined,
    definitions: [
      card,
      ...commonTokenDefinitions,
      targets.friendlyGround.card,
      targets.friendlyTraitGround.card,
      targets.friendlySpace.card,
      targets.friendlyFighter.card,
      targets.enemyGround.card,
      targets.enemySpace.card,
      targets.enemyTransport.card,
      targets.enemyToken.card,
      targets.friendlyLowHpGround.card,
      targets.enemyLowHpGround.card,
      targets.enemyLowHpSpace.card,
      targets.drawCard.card,
      targets.friendlyDeckEventA.card,
      targets.friendlyDeckEventB.card,
      targets.friendlyDeckForceUnit.card,
      targets.friendlyDeckDroid.card,
      targets.enemyDeckCard.card,
      targets.enemyDeckCardB.card,
      targets.enemyHandCard.card,
      targets.friendlyHandUnit.card,
      targets.friendlyHandForceUnit.card,
      targets.friendlyHandVehicle.card,
      targets.friendlyHandEvent.card,
      targets.friendlyHandUpgrade.card,
      targets.friendlyDiscardUnderworld.card,
      targets.friendlyDiscardRepublic.card,
      targets.friendlyDiscardVehicle.card,
      targets.friendlyDiscardLightsaber.card,
      targets.enemyDiscardCard.card,
      targets.friendlyResource.card,
      targets.enemyResource.card,
      targets.friendlyUpgrade.card,
      targets.friendlyPilotUpgrade.card,
      targets.enemyUpgrade.card,
      ...fixtureEntryDefinitions(extraFriendlyUnits),
      ...fixtureEntryDefinitions(extraOpponentUnits),
    ],
    playerOne: {
      hand: [
        fixtureEntry(card),
        targets.friendlyHandUnit,
        targets.friendlyHandVehicle,
        targets.friendlyHandEvent,
        targets.friendlyHandUpgrade,
      ],
      deck: [
        targets.drawCard,
        targets.friendlyDeckEventA,
        targets.friendlyDeckEventB,
        targets.friendlyDeckForceUnit,
        targets.friendlyDeckDroid,
      ],
      discard: [
        targets.friendlyDiscardUnderworld,
        targets.friendlyDiscardRepublic,
        targets.friendlyDiscardVehicle,
        targets.friendlyDiscardLightsaber,
      ],
      resource: [targets.friendlyResource],
      groundArena: [
        targets.friendlyGround,
        targets.friendlyTraitGround,
        targets.friendlyLowHpGround,
        targets.friendlyUpgrade,
        targets.friendlyPilotUpgrade,
        ...fixtureEntriesForArena(extraFriendlyUnits, "ground"),
      ],
      spaceArena: [targets.friendlySpace, ...fixtureEntriesForArena(extraFriendlyUnits, "space")],
    },
    playerTwo: {
      deck: [targets.enemyDeckCard],
      discard: [targets.enemyDiscardCard],
      hand: [targets.enemyHandCard],
      resource: [targets.enemyResource],
      groundArena: [
        targets.enemyGround,
        targets.enemyToken,
        targets.enemyLowHpGround,
        targets.enemyUpgrade,
        ...fixtureEntriesForArena(extraOpponentUnits, "ground"),
      ],
      spaceArena: [
        targets.enemySpace,
        targets.enemyTransport,
        targets.enemyLowHpSpace,
        ...fixtureEntriesForArena(extraOpponentUnits, "space"),
      ],
    },
  });
  engine.playerOne.cardsIn("base")[0].damage = 5;
  engine.playerTwo.cardsIn("base")[0].damage = 5;
  const tokenTypes = createTokenTypes(ability.effects ?? []);
  const unitTokenCountBefore = playerOneUnitTokenCount(engine);
  const creditsBefore =
    engine.state.players["player-one"].credits + engine.state.players["player-two"].credits;
  const forceBefore = engine.state.players["player-one"].force;

  if (card.cardType === "upgrade") {
    engine.playCard(`subject-${card.id}`, {
      target: engine.findCard(`friendly-ground-${card.id}`),
    });
  } else {
    engine.playerOne.playCard(`subject-${card.id}`);
  }
  resolveAllChoices(engine);

  expect(engine.state.moveLog.some((entry) => entry.type === "trigger.resolve")).toBe(true);
  expectAbilityEffectResolved(engine, ability);
  if (
    [...tokenTypes].some((token) => token !== "credit" && token !== "force" && token !== "shield")
  ) {
    expect(playerOneUnitTokenCount(engine)).toBeGreaterThan(unitTokenCountBefore);
  }
  if (tokenTypes.has("credit")) {
    expect(
      engine.state.players["player-one"].credits + engine.state.players["player-two"].credits,
    ).toBeGreaterThan(creditsBefore);
  }
  if (tokenTypes.has("force")) {
    expect(engine.state.players["player-one"].force).toBeGreaterThan(forceBefore);
  }
  return true;
}

function runGenericWhenAbilityHappyPath(card: SwuCardDefinition, ability: SwuAbility): boolean {
  if (ability.trigger?.event !== "when" || !abilityIsExecutableForCard(card, ability)) {
    return false;
  }
  const zone = cardStartZone(card);
  const targets = genericTargets(card);
  const engine = SwuTestEngine.fromFixture({
    definitions: [
      card,
      ...commonTokenDefinitions,
      targets.friendlyGround.card,
      targets.friendlyTraitGround.card,
      targets.friendlySpace.card,
      targets.enemyGround.card,
      targets.enemySpace.card,
      targets.enemyTransport.card,
      targets.friendlyLowHpGround.card,
      targets.enemyLowHpGround.card,
      targets.enemyLowHpSpace.card,
      targets.drawCard.card,
      targets.friendlyDeckEventA.card,
      targets.friendlyDeckDroid.card,
      targets.enemyHandCard.card,
      targets.friendlyHandUnit.card,
      targets.friendlyHandVehicle.card,
      targets.friendlyHandEvent.card,
      targets.friendlyResource.card,
      targets.enemyResource.card,
    ],
    playerOne: {
      base: zone === "base" ? fixtureEntry(card) : undefined,
      leader: zone === "leader" ? fixtureEntry(card) : undefined,
      deck: [targets.drawCard, targets.friendlyDeckEventA],
      hand:
        zone === "hand"
          ? [
              fixtureEntry(card),
              targets.friendlyHandUnit,
              targets.friendlyHandVehicle,
              targets.friendlyHandEvent,
            ]
          : [targets.friendlyHandUnit, targets.friendlyHandVehicle, targets.friendlyHandEvent],
      resource: [targets.friendlyResource],
      groundArena:
        zone === "groundArena"
          ? [
              fixtureEntry(card),
              targets.friendlyGround,
              targets.friendlyTraitGround,
              targets.friendlyLowHpGround,
            ]
          : [targets.friendlyGround, targets.friendlyTraitGround, targets.friendlyLowHpGround],
      spaceArena: zone === "spaceArena" ? [fixtureEntry(card), targets.friendlySpace] : [],
    },
    playerTwo: {
      hand: [targets.enemyHandCard],
      resource: [targets.enemyResource],
      groundArena: [targets.enemyGround, targets.enemyLowHpGround],
      spaceArena: [targets.enemySpace, targets.enemyTransport, targets.enemyLowHpSpace],
    },
  });

  if (card.cardType === "upgrade") {
    engine.playCard(`subject-${card.id}`, {
      target: engine.findCard(`friendly-ground-${card.id}`),
    });
  }

  executeTriggeredAbilities(engine.state, { type: "when" }, "player-one");
  resolveAllChoices(engine);

  expect(engine.state.moveLog.some((entry) => entry.type === "trigger.resolve")).toBe(true);
  expectAbilityEffectResolved(engine, ability);
  return true;
}

function runDeployLeaderAbilityHappyPath(card: SwuCardDefinition, ability: SwuAbility): boolean {
  if (ability.trigger?.event !== "deployed" || !abilityIsExecutableForCard(card, ability)) {
    return false;
  }
  const leader = deployableLeader(`deploy-leader-${card.id}`);
  const drawCard = vanillaUnit(`deploy-draw-${card.id}`);
  const engine = SwuTestEngine.fromFixture({
    definitions: [card, leader, drawCard, ...commonTokenDefinitions],
    playerOne: {
      base: fixtureEntry(card),
      deck: [{ card: drawCard, instanceId: `deploy-draw-${card.id}` }],
      resource: 5,
    },
  });
  engine.addCard({ card: leader, instanceId: `deploy-leader-${card.id}` }, "player-one", "leader");
  const tokenTypes = createTokenTypes(ability.effects ?? []);
  const unitTokenCountBefore = playerOneUnitTokenCount(engine);

  engine.playerOne.activateAbility(`deploy-leader-${card.id}`);
  resolveAllChoices(engine);

  expect(engine.findCard(`deploy-leader-${card.id}`).zone).toBe("groundArena");
  expect(engine.state.moveLog.some((entry) => entry.type === "trigger.resolve")).toBe(true);
  expectAbilityEffectResolved(engine, ability);
  if (
    [...tokenTypes].some((token) => token !== "credit" && token !== "force" && token !== "shield")
  ) {
    expect(playerOneUnitTokenCount(engine)).toBeGreaterThan(unitTokenCountBefore);
  }
  if ((ability.effects ?? []).some((effect) => effect.type === "draw")) {
    expect(engine.findCard(`deploy-draw-${card.id}`).zone).toBe("hand");
  }
  return true;
}

function runAttackAbilityHappyPath(card: SwuCardDefinition, ability: SwuAbility): boolean {
  if (ability.trigger?.event !== "attack" || !abilityIsExecutableForCard(card, ability)) {
    return false;
  }
  const targets = genericTargets(card);
  const zone = cardStartZone(card);
  const friendlyGround =
    zone === "groundArena"
      ? [fixtureEntry(card), targets.friendlyGround]
      : [targets.friendlyGround];
  const friendlySpace =
    zone === "spaceArena" ? [fixtureEntry(card), targets.friendlySpace] : [targets.friendlySpace];
  const engine = SwuTestEngine.fromFixture({
    phaseHistory: ability.conditions?.some(
      (condition) => condition.type === "unitsDefeatedThisPhase",
    )
      ? { unitsDefeatedByController: { "player-one": 1, "player-two": 1 } }
      : undefined,
    definitions: [
      card,
      targets.friendlyGround.card,
      targets.friendlyTraitGround.card,
      targets.friendlySpace.card,
      targets.enemyGround.card,
      targets.enemySpace.card,
      targets.enemyTransport.card,
      targets.friendlyLowHpGround.card,
      targets.enemyLowHpGround.card,
      targets.enemyLowHpSpace.card,
      targets.drawCard.card,
      targets.friendlyDeckEventA.card,
      targets.friendlyDeckEventB.card,
      targets.friendlyDeckForceUnit.card,
      targets.friendlyDeckDroid.card,
      targets.enemyDeckCard.card,
      targets.enemyDeckCardB.card,
      targets.enemyHandCard.card,
      targets.friendlyHandUnit.card,
      targets.friendlyHandVehicle.card,
      targets.friendlyHandEvent.card,
      targets.friendlyDiscardUnderworld.card,
      targets.friendlyDiscardVehicle.card,
      targets.friendlyDiscardLightsaber.card,
      targets.friendlyResource.card,
      targets.enemyResource.card,
      targets.friendlyUpgrade.card,
      targets.friendlyPilotUpgrade.card,
      targets.enemyUpgrade.card,
    ],
    playerOne: {
      resource: 6,
      deck: [
        targets.drawCard,
        targets.friendlyDeckEventA,
        targets.friendlyDeckEventB,
        targets.friendlyDeckForceUnit,
        targets.friendlyDeckDroid,
      ],
      discard: [
        targets.friendlyDiscardUnderworld,
        targets.friendlyDiscardVehicle,
        targets.friendlyDiscardLightsaber,
      ],
      hand: ability.conditions?.some(
        (condition) =>
          condition.type === "cardsInHand" &&
          condition.controller === "friendly" &&
          condition.comparison.operator === "eq" &&
          condition.comparison.value === 0,
      )
        ? []
        : [targets.friendlyHandUnit, targets.friendlyHandVehicle, targets.friendlyHandEvent],
      groundArena: [
        ...friendlyGround,
        targets.friendlyTraitGround,
        targets.friendlyLowHpGround,
        targets.friendlyUpgrade,
        targets.friendlyPilotUpgrade,
      ],
      spaceArena: friendlySpace,
    },
    playerTwo: {
      deck: [targets.enemyDeckCard],
      hand: [targets.enemyHandCard],
      resource: [targets.enemyResource],
      groundArena: [targets.enemyGround, targets.enemyLowHpGround, targets.enemyUpgrade],
      spaceArena: [targets.enemySpace, targets.enemyTransport, targets.enemyLowHpSpace],
    },
  });
  engine.playerOne.cardsIn("base")[0].damage = 5;
  engine.playerTwo.cardsIn("base")[0].damage = 5;

  const defender = referencesChoiceTarget(ability.effects ?? [], "defender")
    ? engine.findCard(`enemy-${card.arena ?? "ground"}-${card.id}`)
    : engine.playerTwo.cardsIn("base")[0];
  for (const condition of ability.conditions ?? []) {
    if (condition.type === "attackDefender") {
      defender.exhausted = condition.exhausted ?? defender.exhausted;
      defender.playedThisPhase = condition.playedThisPhase ?? defender.playedThisPhase;
    }
  }
  if (ability.conditions?.some((condition) => condition.type === "sourceIsUpgraded")) {
    const subject = subjectFor(engine, card);
    const upgrade = engine.addCard(
      {
        card: vanillaUpgrade(`attack-condition-upgrade-${card.id}`),
        instanceId: `attack-condition-upgrade-${card.id}`,
      },
      "player-one",
      subject.zone,
    );
    subject.upgrades.push(upgrade.instanceId);
  }

  engine.playerOne.attack(`subject-${card.id}`, defender);
  resolveAllChoices(engine);

  expect(engine.state.moveLog.some((entry) => entry.type === "trigger.resolve")).toBe(true);
  expectAbilityEffectResolved(engine, ability);
  return true;
}

function runAttackEndsAbilityHappyPath(card: SwuCardDefinition, ability: SwuAbility): boolean {
  if (ability.trigger?.event !== "attackEnds" || !abilityIsExecutableForCard(card, ability)) {
    return false;
  }
  const targets = genericTargets(card);
  const zone = cardStartZone(card);
  if (zone !== "groundArena" && zone !== "spaceArena") return false;
  const defender = {
    ...vanillaUnit(`attack-ends-defender-${card.id}`, card.arena ?? "ground"),
    hp: 1,
    power: 0,
  };
  const engine = SwuTestEngine.fromFixture({
    definitions: [
      card,
      defender,
      targets.friendlyGround.card,
      targets.friendlyTraitGround.card,
      targets.friendlySpace.card,
      targets.drawCard.card,
      targets.friendlyDeckDroid.card,
      targets.friendlyDeckUnderworld.card,
      targets.friendlyHandUnit.card,
      targets.enemyHandCard.card,
      targets.enemyGround.card,
      targets.enemySpace.card,
      targets.enemyLowHpGround.card,
      targets.enemyLowHpSpace.card,
    ],
    playerOne: {
      deck: [targets.drawCard, targets.friendlyDeckDroid, targets.friendlyDeckUnderworld],
      hand: [targets.friendlyHandUnit],
      groundArena:
        zone === "groundArena"
          ? [fixtureEntry(card), targets.friendlyGround, targets.friendlyTraitGround]
          : [targets.friendlyGround, targets.friendlyTraitGround],
      spaceArena: zone === "spaceArena" ? [fixtureEntry(card), targets.friendlySpace] : [],
    },
    playerTwo: {
      hand: [targets.enemyHandCard],
      groundArena:
        zone === "groundArena"
          ? [{ card: defender, instanceId: `attack-ends-defender-${card.id}` }, targets.enemyGround]
          : [targets.enemyGround, targets.enemyLowHpGround],
      spaceArena:
        zone === "spaceArena"
          ? [{ card: defender, instanceId: `attack-ends-defender-${card.id}` }, targets.enemySpace]
          : [targets.enemySpace, targets.enemyLowHpSpace],
    },
  });
  engine.playerOne.cardsIn("base")[0].damage = 5;
  engine.playerTwo.cardsIn("base")[0].damage = 5;

  engine.playerOne.attack(`subject-${card.id}`, `attack-ends-defender-${card.id}`);
  resolveAllChoices(engine);

  expect(engine.findCard(`attack-ends-defender-${card.id}`).zone).toBe("discard");
  expect(engine.state.moveLog.some((entry) => entry.type === "trigger.resolve")).toBe(true);
  expectAbilityEffectResolved(engine, ability);
  return true;
}

function runAttackReactionHappyPath(card: SwuCardDefinition, ability: SwuAbility): boolean {
  if (
    ability.trigger?.event !== "attack" ||
    ability.kind !== "triggered" ||
    card.cardType !== "base" ||
    isCombatUnit(card) ||
    !effectsAreExecutable(ability.effects ?? [])
  ) {
    return false;
  }
  const attacker = forceUnit(`reaction-attacker-${card.id}`);
  const engine = SwuTestEngine.fromFixture({
    definitions: [card, attacker],
    playerOne: {
      base: fixtureEntry(card),
      groundArena: [{ card: attacker, instanceId: `reaction-attacker-${card.id}` }],
    },
  });

  engine.playerOne.attack(`reaction-attacker-${card.id}`, engine.playerTwo.cardsIn("base")[0]);
  resolveAllChoices(engine);

  expect(engine.state.moveLog.some((entry) => entry.type === "trigger.resolve")).toBe(true);
  expectAbilityEffectResolved(engine, ability);
  return true;
}

function runAttackedAbilityHappyPath(card: SwuCardDefinition, ability: SwuAbility): boolean {
  if (ability.trigger?.event !== "attacked" || !abilityIsExecutableForCard(card, ability)) {
    return false;
  }
  const zone = cardStartZone(card);
  if (zone !== "groundArena" && zone !== "spaceArena") return false;
  const attacker = vanillaUnit(`attacked-attacker-${card.id}`, card.arena ?? "ground");
  const engine = SwuTestEngine.fromFixture({
    definitions: [card, attacker],
    playerOne: {
      [zone]: [{ card: attacker, instanceId: `attacked-attacker-${card.id}` }],
    },
    playerTwo: {
      [zone]: [fixtureEntry(card)],
    },
  });

  engine.playerOne.attack(`attacked-attacker-${card.id}`, `subject-${card.id}`);
  resolveAllChoices(engine);

  expect(engine.state.moveLog.some((entry) => entry.type === "trigger.resolve")).toBe(true);
  expectAbilityEffectResolved(engine, ability);
  return true;
}

function runActionAbilityHappyPath(
  card: SwuCardDefinition,
  ability: SwuAbility,
  abilityIndex: number,
): boolean {
  if (!actionAbilityIsExecutable(ability)) return false;
  const targets = genericTargets(card);
  const zone = cardStartZone(card);
  const subjectEntry = fixtureEntry(card);
  const extraFriendlyUnits = extraUnitsForMoreUnitsCondition(card, ability, "friendly");
  const extraOpponentUnits = extraUnitsForMoreUnitsCondition(card, ability, "opponent");
  const conditionAlly = ability.conditions?.find(
    (condition) => condition.type === "controlsAspect" || condition.type === "controlsTrait",
  );
  const conditionAllyCount =
    conditionAlly?.type === "controlsTrait" ? Math.max(1, conditionAlly.comparison?.value ?? 1) : 1;
  const extraConditionAllies =
    conditionAlly?.type === "controlsTrait"
      ? Array.from({ length: conditionAllyCount - 1 }, (_, index) => ({
          card: {
            ...vanillaUnit(`action-condition-ally-${card.id}-${index + 2}`),
            traits: [conditionAlly.trait],
          },
          instanceId: `action-condition-ally-${card.id}-${index + 2}`,
        }))
      : [];
  const engine = SwuTestEngine.fromFixture({
    phaseHistory: ability.conditions?.some(
      (condition) => condition.type === "unitsDefeatedThisPhase",
    )
      ? { unitsDefeatedByController: { "player-one": 1, "player-two": 1 } }
      : undefined,
    definitions: [
      card,
      targets.friendlyGround.card,
      targets.friendlyTraitGround.card,
      targets.friendlySpace.card,
      targets.enemyGround.card,
      targets.enemySpace.card,
      targets.enemyTransport.card,
      targets.friendlyLowHpGround.card,
      targets.enemyLowHpGround.card,
      targets.enemyLowHpSpace.card,
      targets.drawCard.card,
      targets.friendlyDeckEventA.card,
      targets.friendlyDeckEventB.card,
      targets.friendlyDeckForceUnit.card,
      targets.friendlyDeckDroid.card,
      targets.enemyDeckCard.card,
      targets.enemyDeckCardB.card,
      targets.enemyHandCard.card,
      targets.friendlyHandUnit.card,
      targets.friendlyHandVehicle.card,
      targets.friendlyHandEvent.card,
      targets.friendlyDiscardUnderworld.card,
      targets.friendlyDiscardVehicle.card,
      targets.friendlyDiscardLightsaber.card,
      targets.friendlyResource.card,
      targets.enemyResource.card,
      targets.friendlyUpgrade.card,
      targets.friendlyPilotUpgrade.card,
      targets.enemyUpgrade.card,
      ...extraConditionAllies.map((entry) => entry.card),
      ...fixtureEntryDefinitions(extraFriendlyUnits),
      ...fixtureEntryDefinitions(extraOpponentUnits),
    ],
    playerOne: {
      leader: zone === "leader" ? subjectEntry : undefined,
      base: zone === "base" ? subjectEntry : undefined,
      deck: [
        targets.drawCard,
        targets.friendlyDeckEventA,
        targets.friendlyDeckEventB,
        targets.friendlyDeckForceUnit,
        targets.friendlyDeckDroid,
      ],
      discard: [
        targets.friendlyDiscardUnderworld,
        targets.friendlyDiscardVehicle,
        targets.friendlyDiscardLightsaber,
      ],
      resource: [targets.friendlyResource],
      hand:
        zone === "hand"
          ? [
              subjectEntry,
              targets.friendlyHandUnit,
              targets.friendlyHandForceUnit,
              targets.friendlyHandVehicle,
              targets.friendlyHandEvent,
              targets.friendlyHandUpgrade,
            ]
          : [
              targets.friendlyHandUnit,
              targets.friendlyHandForceUnit,
              targets.friendlyHandVehicle,
              targets.friendlyHandEvent,
              targets.friendlyHandUpgrade,
            ],
      groundArena:
        zone === "groundArena"
          ? [
              subjectEntry,
              targets.friendlyGround,
              targets.friendlyTraitGround,
              targets.friendlyLowHpGround,
              targets.friendlyUpgrade,
              targets.friendlyPilotUpgrade,
              ...extraConditionAllies,
              ...fixtureEntriesForArena(extraFriendlyUnits, "ground"),
            ]
          : [
              targets.friendlyGround,
              targets.friendlyTraitGround,
              targets.friendlyLowHpGround,
              targets.friendlyUpgrade,
              targets.friendlyPilotUpgrade,
              ...extraConditionAllies,
              ...fixtureEntriesForArena(extraFriendlyUnits, "ground"),
            ],
      spaceArena:
        zone === "spaceArena"
          ? [
              subjectEntry,
              targets.friendlySpace,
              targets.friendlyFighter,
              ...fixtureEntriesForArena(extraFriendlyUnits, "space"),
            ]
          : [
              targets.friendlySpace,
              targets.friendlyFighter,
              ...fixtureEntriesForArena(extraFriendlyUnits, "space"),
            ],
    },
    playerTwo: {
      deck: [targets.enemyDeckCard],
      hand: [targets.enemyHandCard],
      resource: [targets.enemyResource],
      groundArena: [
        targets.enemyGround,
        targets.enemyLowHpGround,
        targets.enemyUpgrade,
        ...fixtureEntriesForArena(extraOpponentUnits, "ground"),
      ],
      spaceArena: [
        targets.enemySpace,
        targets.enemyTransport,
        targets.enemyLowHpSpace,
        ...fixtureEntriesForArena(extraOpponentUnits, "space"),
      ],
    },
  });
  engine.playerOne.cardsIn("base")[0].damage = 5;
  engine.playerTwo.cardsIn("base")[0].damage = 5;
  const source = subjectFor(engine, card);

  engine.playerOne.activateAbility(source, abilityIndex);
  resolveAllChoices(engine);

  expect(engine.state.moveLog.some((entry) => entry.type === "move.activateAbility")).toBe(true);
  expectAbilityEffectResolved(engine, ability);
  return true;
}

function runAttackRestrictionHappyPath(card: SwuCardDefinition, ability: SwuAbility): boolean {
  if (ability.kind !== "constant") return false;
  const restrictions = attackRestrictionEffects(ability.effects ?? []);
  if (restrictions.length === 0) return false;
  const restriction = restrictions[0];
  if (!restriction) return false;

  if (restriction.target.type === "self" && restriction.restriction === "cannotAttack") {
    if (!isCombatUnit(card)) return false;
    const zone = cardStartZone(card);
    const engine = SwuTestEngine.fromFixture({
      definitions: [card],
      playerOne: { [zone]: [fixtureEntry(card)] },
    });
    const defender = engine.playerTwo.cardsIn("base")[0];

    const result = engine.expectFailure(() =>
      engine.playerOne.attack(`subject-${card.id}`, defender),
    );

    expect(result.error).toBe("Attacker cannot attack.");
    expect(subjectFor(engine, card).exhausted).toBe(false);
    expect(defender.damage).toBe(0);
    return true;
  }

  if (
    restriction.target.type === "attachedUnit" &&
    restriction.restriction === "cannotAttackBases" &&
    card.cardType === "upgrade"
  ) {
    const attachedUnit = vanillaUnit(`restricted-attacker-${card.id}`, "ground");
    const defender = vanillaUnit(`restricted-defender-${card.id}`, "ground");
    const engine = SwuTestEngine.fromFixture({
      definitions: [card, attachedUnit, defender],
      playerOne: {
        hand: [fixtureEntry(card)],
        groundArena: [{ card: attachedUnit, instanceId: `restricted-attacker-${card.id}` }],
      },
      playerTwo: {
        groundArena: [{ card: defender, instanceId: `restricted-defender-${card.id}` }],
      },
    });
    const attacker = engine.findCard(`restricted-attacker-${card.id}`);
    const enemyBase = engine.playerTwo.cardsIn("base")[0];

    engine.playCard(`subject-${card.id}`, { target: attacker });
    engine.playerTwo.pass();
    const result = engine.expectFailure(() => engine.playerOne.attack(attacker, enemyBase));

    expect(result.error).toBe("Attacker cannot attack bases.");
    expect(attacker.exhausted).toBe(false);
    expect(enemyBase.damage).toBe(0);

    engine.playerOne.attack(attacker, `restricted-defender-${card.id}`);

    expect(engine.findCard(`restricted-defender-${card.id}`).damage).toBeGreaterThan(0);
    return true;
  }

  return false;
}

function runCombatDamageFirstHappyPath(card: SwuCardDefinition, ability: SwuAbility): boolean {
  if (
    ability.kind !== "constant" ||
    !isCombatUnit(card) ||
    !(ability.effects ?? []).some(
      (effect) => effect.type === "combatDamageFirst" && effect.target.type === "self",
    )
  ) {
    return false;
  }
  const defender: SwuCardDefinition = {
    ...vanillaUnit(`first-strike-defender-${card.id}`, card.arena ?? "ground"),
    power: 5,
    hp: 1,
  };
  const zone = cardStartZone(card);
  const engine = SwuTestEngine.fromFixture({
    definitions: [card, defender],
    playerOne: { [zone]: [fixtureEntry(card)] },
    playerTwo: {
      [zone]: [
        {
          card: defender,
          instanceId: `first-strike-defender-${card.id}`,
          exhausted: true,
          playedThisPhase: false,
        },
      ],
    },
  });

  engine.playerOne.attack(`subject-${card.id}`, `first-strike-defender-${card.id}`);

  expect(engine.findCard(`first-strike-defender-${card.id}`).zone).toBe("discard");
  expect(subjectFor(engine, card).damage).toBe(0);
  return true;
}

function runLoseHealingHappyPath(card: SwuCardDefinition, ability: SwuAbility): boolean {
  if (
    ability.kind !== "constant" ||
    !(ability.effects ?? []).some(
      (effect) => effect.type === "loseHealing" && effect.target.type === "base",
    )
  ) {
    return false;
  }
  const healBase: SwuCardDefinition = {
    ...testCardIdentity(`heal-action-${card.id}`, "Test Heal Base"),
    title: "Test Heal Base",
    subtitle: null,
    cost: null,
    hp: 30,
    power: null,
    text: "Action: Heal 3 damage from your base.",
    deployBox: null,
    epicAction: null,
    unique: false,
    rules: null,
    id: `heal-action-${card.id}`,
    internalName: `heal-action-${card.id}`,
    cardType: "base",
    types: ["base"],
    aspects: [],
    traits: [],
    arena: null,
    keywords: [],
    abilities: [
      {
        kind: "action",
        text: "Action: Heal 3 damage from your base.",
        trigger: { event: "action" },
        effects: [{ type: "heal", amount: 3, target: { type: "base", controller: "friendly" } }],
      },
    ],
  };
  const engine = SwuTestEngine.fromFixture({
    definitions: [card],
    playerOne: { [cardStartZone(card)]: [fixtureEntry(card)] },
  });
  engine.addCard({ card: healBase, instanceId: `heal-action-${card.id}` }, "player-one", "leader");
  const friendlyBase = engine.playerOne.cardsIn("base")[0];
  friendlyBase.damage = 5;

  engine.playerOne.activateAbility(`heal-action-${card.id}`);

  expect(friendlyBase.damage).toBe(5);
  return true;
}

function runPreventDamageHappyPath(card: SwuCardDefinition, ability: SwuAbility): boolean {
  if (
    card.cardType !== "upgrade" ||
    ability.kind !== "replacement" ||
    !(ability.effects ?? []).some(
      (effect) => effect.type === "preventDamage" && effect.target.type === "attachedUnit",
    )
  ) {
    return false;
  }
  const targetCard = vanillaUnit(`prevent-damage-target-${card.id}`);
  const attacker = vanillaUnit(`prevent-damage-attacker-${card.id}`);
  const engine = SwuTestEngine.fromFixture({
    definitions: [card, targetCard, attacker],
    playerOne: {
      hand: [fixtureEntry(card)],
      groundArena: [{ card: targetCard, instanceId: `prevent-damage-target-${card.id}` }],
    },
    playerTwo: {
      groundArena: [{ card: attacker, instanceId: `prevent-damage-attacker-${card.id}` }],
    },
  });
  const target = engine.findCard(`prevent-damage-target-${card.id}`);

  engine.playCard(`subject-${card.id}`, { target });
  engine.playerTwo.attack(`prevent-damage-attacker-${card.id}`, target);

  expect(target.damage).toBe(0);
  expect(target.upgrades).not.toContain(`subject-${card.id}`);
  expect(subjectFor(engine, card).zone).toBe("discard");
  expect(engine.state.moveLog.some((entry) => entry.type === "effect.preventDamage")).toBe(true);
  return true;
}

function runConstantAbilityHappyPath(card: SwuCardDefinition, ability: SwuAbility): boolean {
  if (!constantAbilityIsExecutable(ability)) return false;
  const targetedStatEffect = firstTargetedStatEffect(ability.effects ?? []);
  const targetedKeywordEffect = firstTargetedKeywordEffect(ability.effects ?? []);
  const targetedTraitEffect = firstTargetedTraitEffect(ability.effects ?? []);
  const targetedEffect = targetedStatEffect ?? targetedKeywordEffect ?? targetedTraitEffect;
  if (!isCombatUnit(card) && !targetedEffect) return false;
  if (targetedEffect) {
    if (targetedEffect.target.type !== "card" && targetedEffect.target.type !== "attachedUnit") {
      return false;
    }
    const targetEntry = cardTargetFixture(card, targetedEffect.target);
    const targetCard = targetEntry.card;
    const sourceEntry = fixtureEntry(card);
    const sourceZone = cardStartZone(card);
    const targetZone = targetCard.arena === "space" ? "spaceArena" : "groundArena";
    const targetOwner =
      targetedEffect.target.type === "card" && targetedEffect.target.controller === "opponent"
        ? "playerTwo"
        : "playerOne";
    const playerOneGroundArena = [
      ...(sourceZone === "groundArena" ? [sourceEntry] : []),
      ...(targetOwner === "playerOne" && targetZone === "groundArena" ? [targetEntry] : []),
    ];
    const playerOneSpaceArena = [
      ...(sourceZone === "spaceArena" ? [sourceEntry] : []),
      ...(targetOwner === "playerOne" && targetZone === "spaceArena" ? [targetEntry] : []),
    ];
    const engine = SwuTestEngine.fromFixture({
      definitions: [card, targetCard],
      activePlayer: "player-one",
      playerOne: {
        base: sourceZone === "base" ? sourceEntry : undefined,
        leader: sourceZone === "leader" ? sourceEntry : undefined,
        hand: sourceZone === "hand" ? [sourceEntry] : [],
        groundArena: playerOneGroundArena,
        spaceArena: playerOneSpaceArena,
      },
      playerTwo:
        targetOwner === "playerTwo"
          ? {
              groundArena: targetZone === "groundArena" ? [targetEntry] : [],
              spaceArena: targetZone === "spaceArena" ? [targetEntry] : [],
            }
          : undefined,
    });
    const target = engine.findCard(`constant-target-${card.id}`);

    if (targetedEffect.target.type === "attachedUnit") {
      engine.playCard(`subject-${card.id}`, { target });
    }

    if (targetedStatEffect) {
      expect(effectivePower(engine.state, target)).toBe(
        (targetCard.power ?? 0) + (targetedStatEffect.power ?? 0),
      );
      expect(effectiveHp(engine.state, target)).toBe(
        (targetCard.hp ?? 0) + (targetedStatEffect.hp ?? 0),
      );
    }
    for (const effect of ability.effects ?? []) {
      if (effect.type === "gainKeyword" && effect.target.type === "card") {
        expect(effectiveKeywords(engine.state, target)).toContain(effect.keyword);
      }
      if (effect.type === "gainTrait" && effect.target.type !== "self") {
        expect(effectiveTraits(engine.state, target)).toContain(effect.trait);
      }
    }
    return true;
  }
  if (!isCombatUnit(card)) return false;
  const upgrade = vanillaUpgrade(`constant-upgrade-${card.id}`);
  const conditionAlly = ability.conditions?.find(
    (condition) => condition.type === "controlsAspect" || condition.type === "controlsTrait",
  );
  const conditionAllyEntry =
    conditionAlly?.type === "controlsAspect"
      ? {
          card: {
            ...vanillaUnit(`constant-condition-ally-${card.id}`),
            aspects: [conditionAlly.aspect],
          },
          instanceId: `constant-condition-ally-${card.id}`,
        }
      : conditionAlly?.type === "controlsTrait"
        ? {
            card: {
              ...vanillaUnit(`constant-condition-ally-${card.id}`),
              traits: [conditionAlly.trait],
            },
            instanceId: `constant-condition-ally-${card.id}`,
          }
        : undefined;
  const hasTargetCondition = ability.conditions?.find(
    (condition): condition is Extract<SwuCondition, { type: "hasTarget" }> =>
      condition.type === "hasTarget",
  );
  const conditionTargetEntry =
    hasTargetCondition && hasTargetCondition.target.type === "card"
      ? cardTargetFixture(card, hasTargetCondition.target)
      : undefined;
  const conditionTargetZone =
    conditionTargetEntry?.card.arena === "space" ? "spaceArena" : "groundArena";
  const zone = cardStartZone(card);
  const subjectEntry = {
    ...subjectFixtureEntry(card),
    damage:
      ability.conditions?.some((condition) => condition.type === "sourceIsDamaged") ||
      (ability.effects ?? []).some(
        (effect) => effect.type === "modifyStatsPer" && effect.per === "damageOnTarget",
      )
        ? 1
        : 0,
  };
  const needsResourceMultiplier = (ability.effects ?? []).some(
    (effect) => effect.type === "modifyStatsPer" && effect.per === "friendlyResources",
  );
  const countTargetEffect = (ability.effects ?? []).find(
    (effect): effect is Extract<SwuEffect, { type: "modifyStatsPer"; per: "targetCount" }> =>
      effect.type === "modifyStatsPer" && effect.per === "targetCount",
  );
  const countTargetEntry = countTargetEffect
    ? constantCountTargetFixture(card, countTargetEffect.count)
    : undefined;
  const countTargetZone =
    countTargetEffect?.count.type === "card" && countTargetEffect.count.zones?.includes("discard")
      ? "discard"
      : countTargetEffect?.count.type === "card" &&
          countTargetEffect.count.zones?.includes("spaceArena")
        ? "spaceArena"
        : countTargetEntry?.card.arena === "space"
          ? "spaceArena"
          : "groundArena";
  const engine = SwuTestEngine.fromFixture({
    phaseHistory: ability.conditions?.some(
      (condition) => condition.type === "unitsDefeatedThisPhase",
    )
      ? { unitsDefeatedByController: { "player-one": 1, "player-two": 1 } }
      : undefined,
    definitions: [
      card,
      upgrade,
      ...(conditionAllyEntry ? [conditionAllyEntry.card] : []),
      ...(conditionTargetEntry ? [conditionTargetEntry.card] : []),
      ...(countTargetEntry ? [countTargetEntry.card] : []),
    ],
    activePlayer: "player-one",
    playerOne: {
      hand: zone === "hand" ? [upgrade, subjectEntry] : [upgrade],
      resource: ability.conditions?.some((condition) => condition.type === "resources")
        ? 6
        : needsResourceMultiplier
          ? 3
          : 0,
      hasInitiative: true,
      discard: countTargetZone === "discard" && countTargetEntry ? [countTargetEntry] : [],
      groundArena:
        zone === "groundArena"
          ? [
              subjectEntry,
              ...(conditionAllyEntry ? [conditionAllyEntry] : []),
              ...(conditionTargetZone === "groundArena" && conditionTargetEntry
                ? [conditionTargetEntry]
                : []),
              ...(countTargetZone === "groundArena" && countTargetEntry ? [countTargetEntry] : []),
            ]
          : [
              ...(conditionAllyEntry ? [conditionAllyEntry] : []),
              ...(conditionTargetZone === "groundArena" && conditionTargetEntry
                ? [conditionTargetEntry]
                : []),
              ...(countTargetZone === "groundArena" && countTargetEntry ? [countTargetEntry] : []),
            ],
      spaceArena:
        zone === "spaceArena"
          ? [
              subjectEntry,
              ...(conditionTargetZone === "spaceArena" && conditionTargetEntry
                ? [conditionTargetEntry]
                : []),
              ...(countTargetZone === "spaceArena" && countTargetEntry ? [countTargetEntry] : []),
            ]
          : [
              ...(conditionTargetZone === "spaceArena" && conditionTargetEntry
                ? [conditionTargetEntry]
                : []),
              ...(countTargetZone === "spaceArena" && countTargetEntry ? [countTargetEntry] : []),
            ],
      base: zone === "base" ? subjectEntry : undefined,
      leader: zone === "leader" ? subjectEntry : undefined,
    },
  });
  const subject = subjectFor(engine, card);

  if (ability.conditions?.some((condition) => condition.type === "sourceIsUpgraded")) {
    engine.playCard(upgrade, { target: subject });
  }
  for (const condition of ability.conditions ?? []) {
    if (condition.type === "baseDamage") {
      engine.playerOne.cardsIn("base")[0].damage = condition.comparison.value;
    }
  }

  const stats = effectStatBonus(ability.effects ?? []);
  const upgradePower = subject.upgrades.length > 0 ? (upgrade.upgradePower ?? 0) : 0;
  const upgradeHp = subject.upgrades.length > 0 ? (upgrade.upgradeHp ?? 0) : 0;
  const dynamicPower = (ability.effects ?? []).reduce(
    (total, effect) =>
      total +
      (effect.type === "modifyStatsPer" && effect.target.type === "self"
        ? (effect.power ?? 0) *
          (effect.per === "friendlyResources"
            ? engine.state.players["player-one"].resources
            : effect.per === "targetCount"
              ? countTargetEntry
                ? 1
                : 0
              : subject.damage)
        : 0),
    0,
  );
  const dynamicHp = (ability.effects ?? []).reduce(
    (total, effect) =>
      total +
      (effect.type === "modifyStatsPer" && effect.target.type === "self"
        ? (effect.hp ?? 0) *
          (effect.per === "friendlyResources"
            ? engine.state.players["player-one"].resources
            : effect.per === "targetCount"
              ? countTargetEntry
                ? 1
                : 0
              : subject.damage)
        : 0),
    0,
  );
  if (stats.power !== 0) {
    expect(effectivePower(engine.state, subject)).toBe(
      (card.power ?? 0) + upgradePower + stats.power,
    );
  }
  if (stats.hp !== 0) {
    expect(effectiveHp(engine.state, subject)).toBe((card.hp ?? 0) + upgradeHp + stats.hp);
  }
  if (dynamicPower !== 0) {
    expect(effectivePower(engine.state, subject)).toBe(
      (card.power ?? 0) + upgradePower + dynamicPower,
    );
  }
  if (dynamicHp !== 0) {
    expect(effectiveHp(engine.state, subject)).toBe((card.hp ?? 0) + upgradeHp + dynamicHp);
  }
  for (const effect of ability.effects ?? []) {
    if (effect.type === "gainKeyword") {
      expect(effectiveKeywords(engine.state, subject)).toContain(effect.keyword);
    }
    if (effect.type === "gainTrait") {
      expect(effectiveTraits(engine.state, subject)).toContain(effect.trait);
    }
  }
  return true;
}

function runDefeatedAbilityHappyPath(card: SwuCardDefinition, ability: SwuAbility): boolean {
  if (ability.trigger?.event !== "defeated" || !abilityIsExecutableForCard(card, ability)) {
    return false;
  }
  const targets = genericTargets(card);
  const zone = cardStartZone(card);
  if (zone !== "groundArena" && zone !== "spaceArena") return false;
  if (/^When an? enemy unit is defeated:/i.test(ability.text)) {
    const victim = vanillaUnit(`defeated-victim-${card.id}`, card.arena ?? "ground");
    const attacker = {
      ...vanillaUnit(`defeated-attacker-${card.id}`, card.arena ?? "ground"),
      power: Math.max(8, victim.hp ?? 1),
    };
    const engine = SwuTestEngine.fromFixture({
      definitions: [
        card,
        attacker,
        victim,
        targets.friendlyGround.card,
        targets.friendlyTraitGround.card,
        targets.friendlySpace.card,
        targets.enemyGround.card,
        targets.enemySpace.card,
        targets.friendlyLowHpGround.card,
        targets.enemyLowHpGround.card,
        targets.enemyLowHpSpace.card,
        targets.drawCard.card,
        targets.friendlyDeckEventA.card,
        targets.friendlyDeckEventB.card,
        targets.friendlyDeckForceUnit.card,
        targets.enemyDeckCard.card,
        targets.enemyHandCard.card,
        targets.friendlyHandUnit.card,
        targets.friendlyHandVehicle.card,
        targets.friendlyHandEvent.card,
        targets.friendlyDiscardUnderworld.card,
        targets.friendlyDiscardVehicle.card,
        targets.friendlyResource.card,
        targets.enemyResource.card,
        targets.friendlyUpgrade.card,
        targets.enemyUpgrade.card,
      ],
      playerOne: {
        deck: [
          targets.drawCard,
          targets.friendlyDeckEventA,
          targets.friendlyDeckEventB,
          targets.friendlyDeckForceUnit,
        ],
        discard: [targets.friendlyDiscardUnderworld, targets.friendlyDiscardVehicle],
        hand: [targets.friendlyHandUnit, targets.friendlyHandVehicle, targets.friendlyHandEvent],
        resource: [targets.friendlyResource],
        groundArena:
          zone === "groundArena"
            ? [
                fixtureEntry(card),
                { card: attacker, instanceId: `defeated-attacker-${card.id}` },
                targets.friendlyGround,
                targets.friendlyTraitGround,
                targets.friendlyLowHpGround,
                targets.friendlyUpgrade,
              ]
            : [
                targets.friendlyGround,
                targets.friendlyTraitGround,
                targets.friendlyLowHpGround,
                targets.friendlyUpgrade,
              ],
        spaceArena:
          zone === "spaceArena"
            ? [
                fixtureEntry(card),
                { card: attacker, instanceId: `defeated-attacker-${card.id}` },
                targets.friendlySpace,
              ]
            : [targets.friendlySpace],
      },
      playerTwo: {
        deck: [targets.enemyDeckCard],
        hand: [targets.enemyHandCard],
        resource: [targets.enemyResource],
        groundArena:
          zone === "groundArena"
            ? [
                { card: victim, instanceId: `defeated-victim-${card.id}` },
                targets.enemyGround,
                targets.enemyLowHpGround,
                targets.enemyUpgrade,
              ]
            : [targets.enemyGround, targets.enemyLowHpGround, targets.enemyUpgrade],
        spaceArena:
          zone === "spaceArena"
            ? [
                { card: victim, instanceId: `defeated-victim-${card.id}` },
                targets.enemySpace,
                targets.enemyLowHpSpace,
              ]
            : [targets.enemySpace, targets.enemyLowHpSpace],
      },
    });
    engine.playerOne.cardsIn("base")[0].damage = 5;

    engine.playerOne.attack(`defeated-attacker-${card.id}`, `defeated-victim-${card.id}`);
    resolveAllChoices(engine);

    expect(engine.findCard(`defeated-victim-${card.id}`).zone).toBe("discard");
    expect(subjectFor(engine, card).zone).toBe(zone);
    expect(engine.state.moveLog.some((entry) => entry.type === "trigger.resolve")).toBe(true);
    expectAbilityEffectResolved(engine, ability);
    return true;
  }
  const attacker = {
    ...vanillaUnit(`defeated-attacker-${card.id}`, card.arena ?? "ground"),
    power: Math.max(8, card.hp ?? 1),
  };
  const engine = SwuTestEngine.fromFixture({
    definitions: [
      card,
      attacker,
      targets.friendlyGround.card,
      targets.friendlyTraitGround.card,
      targets.friendlySpace.card,
      targets.enemyGround.card,
      targets.enemySpace.card,
      targets.friendlyLowHpGround.card,
      targets.enemyLowHpGround.card,
      targets.enemyLowHpSpace.card,
      targets.drawCard.card,
      targets.friendlyDeckEventA.card,
      targets.friendlyDeckEventB.card,
      targets.friendlyDeckForceUnit.card,
      targets.enemyDeckCard.card,
      targets.enemyHandCard.card,
      targets.friendlyHandUnit.card,
      targets.friendlyHandVehicle.card,
      targets.friendlyHandEvent.card,
      targets.friendlyDiscardUnderworld.card,
      targets.friendlyDiscardVehicle.card,
      targets.friendlyResource.card,
      targets.enemyResource.card,
      targets.friendlyUpgrade.card,
      targets.enemyUpgrade.card,
    ],
    playerOne: {
      hasInitiative: false,
      deck: [
        targets.drawCard,
        targets.friendlyDeckEventA,
        targets.friendlyDeckEventB,
        targets.friendlyDeckForceUnit,
      ],
      discard: [targets.friendlyDiscardUnderworld, targets.friendlyDiscardVehicle],
      hand: [targets.friendlyHandUnit, targets.friendlyHandVehicle, targets.friendlyHandEvent],
      resource: [targets.friendlyResource],
      groundArena:
        zone === "groundArena"
          ? [
              { card: attacker, instanceId: `defeated-attacker-${card.id}` },
              targets.friendlyGround,
              targets.friendlyTraitGround,
              targets.friendlyLowHpGround,
              targets.friendlyUpgrade,
            ]
          : [
              targets.friendlyGround,
              targets.friendlyTraitGround,
              targets.friendlyLowHpGround,
              targets.friendlyUpgrade,
            ],
      spaceArena:
        zone === "spaceArena"
          ? [{ card: attacker, instanceId: `defeated-attacker-${card.id}` }, targets.friendlySpace]
          : [targets.friendlySpace],
    },
    playerTwo: {
      hasInitiative: true,
      deck: [targets.enemyDeckCard],
      hand: [targets.enemyHandCard],
      resource: [targets.enemyResource],
      groundArena:
        zone === "groundArena"
          ? [
              fixtureEntry(card),
              targets.enemyGround,
              targets.enemyLowHpGround,
              targets.enemyUpgrade,
            ]
          : [targets.enemyGround, targets.enemyLowHpGround, targets.enemyUpgrade],
      spaceArena:
        zone === "spaceArena"
          ? [fixtureEntry(card), targets.enemySpace, targets.enemyLowHpSpace]
          : [targets.enemySpace, targets.enemyLowHpSpace],
    },
  });
  engine.playerTwo.cardsIn("base")[0].damage = 5;

  engine.playerOne.attack(`defeated-attacker-${card.id}`, `subject-${card.id}`);
  resolveAllChoices(engine);

  expect(subjectFor(engine, card).zone).toBe(
    resourcesSelf(ability.effects ?? []) ? "resource" : "discard",
  );
  expect(engine.state.moveLog.some((entry) => entry.type === "trigger.resolve")).toBe(true);
  expectAbilityEffectResolved(engine, ability);
  return true;
}

function runTypedAbilityHappyPaths(card: SwuCardDefinition): number {
  let executed = 0;
  for (const [abilityIndex, ability] of (card.abilities ?? []).entries()) {
    if (
      ability.kind !== "keyword" &&
      (runPlayedAbilityHappyPath(card, ability) ||
        runGenericWhenAbilityHappyPath(card, ability) ||
        runDeployLeaderAbilityHappyPath(card, ability) ||
        runAttackAbilityHappyPath(card, ability) ||
        runAttackEndsAbilityHappyPath(card, ability) ||
        runAttackReactionHappyPath(card, ability) ||
        runAttackedAbilityHappyPath(card, ability) ||
        runDefeatedAbilityHappyPath(card, ability) ||
        runActionAbilityHappyPath(card, ability, abilityIndex) ||
        runAttackRestrictionHappyPath(card, ability) ||
        runCombatDamageFirstHappyPath(card, ability) ||
        runLoseHealingHappyPath(card, ability) ||
        runPreventDamageHappyPath(card, ability) ||
        runConstantAbilityHappyPath(card, ability) ||
        runAttachAbilityHappyPath(card, ability))
    ) {
      executed += 1;
    }
  }
  return executed;
}

function runSupportedKeywordHappyPaths(card: SwuCardDefinition): number {
  return [
    runAmbushHappyPath,
    runBountyHappyPath,
    runCoordinateHappyPath,
    runExploitHappyPath,
    runShieldedHappyPath,
    runGritHappyPath,
    runHiddenHappyPath,
    runRaidHappyPath,
    runSentinelHappyPath,
    runRestoreHappyPath,
    runOverwhelmHappyPath,
    runPilotingHappyPath,
    runSaboteurHappyPath,
    runSmuggleHappyPath,
    runSupportHappyPath,
  ].filter((run) => run(card)).length;
}

const cardCases: CardHappyPathCase[] = allCards.map((card) => ({
  name: testName(card),
  card,
}));

describe("Star Wars Unlimited per-card happy paths", () => {
  it("has one unit test case for each catalog card", () => {
    expect(cardCases).toHaveLength(allCards.length);
    expect(new Set(cardCases.map(({ card }) => card.id)).size).toBe(allCards.length);
  });

  it.each(cardCases)("$name", ({ card }) => {
    const engine = SwuTestEngine.fromFixture(fixtureFor(card));
    const subject = subjectFor(engine, card);
    const expectedKeywordAbilities = keywordAbilities(card);

    expect(subject.definitionId).toBe(card.id);
    expect(subject.zone).toBe(cardStartZone(card));
    const executedKeywordHappyPaths = runSupportedKeywordHappyPaths(card);
    const executedTypedHappyPaths = runTypedAbilityHappyPaths(card);

    if ((card.abilities ?? []).length === 0) {
      expect(card.abilities ?? []).toHaveLength(0);
      expect(subject.keywords).toEqual([...(card.keywords ?? [])]);
      expect(executedKeywordHappyPaths).toBe(0);
      expect(executedTypedHappyPaths).toBe(0);
      return;
    }

    for (const ability of expectedKeywordAbilities) {
      expect(ability.keyword).toBeDefined();
      expect(subject.keywords).toContain(ability.keyword);
      expect(card.keywords ?? []).toContain(ability.keyword);
    }
    if (hasRunnableSupportedKeyword(card)) {
      expect(executedKeywordHappyPaths).toBeGreaterThan(0);
    }
    if (typedAbilities(card).some((ability) => abilityIsExecutableForCard(card, ability))) {
      expect(executedTypedHappyPaths).toBeGreaterThan(0);
    }
    if (typedAbilities(card).some(actionAbilityIsExecutable)) {
      expect(executedTypedHappyPaths).toBeGreaterThan(0);
    }
  });
});
