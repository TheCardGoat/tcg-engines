import { describe, expect, test } from "vite-plus/test";
import {
  boundDeckProfile,
  buildDecisionContext,
  CyberpunkTestEngine,
  isTacticalAIStrategy,
  P1,
  tacticalStrategy,
  type CommandResult,
  type MoveDecision,
  type PlayerId,
} from "@tcg/cyberpunk-engine";
import {
  welcomeToNightCityRetail6thStreetRecruits,
  welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
  welcomeToNightCityRetailChromeReverie,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFloorIt,
  welcomeToNightCityRetailIndustrialAssembly,
  welcomeToNightCityRetailLaLloronaGhostOfThePast,
  welcomeToNightCityRetailLizzyWizzyDelicateWeapon,
  welcomeToNightCityRetailMeredithStoutStoneColdCorpo,
  welcomeToNightCityRetailMuamarReyesElCapitan,
  welcomeToNightCityRetailPlacideVoodooSentinel,
  welcomeToNightCityRetailPyramidSong,
  welcomeToNightCityRetailTrustNoOne,
  welcomeToNightCityRetailVStreetkid,
  welcomeToNightCityRetailZetatechFaceplate,
} from "@tcg/cyberpunk-cards";
import { authoredBotLabDeckSpecs } from "../src/authored-decks.ts";
import { bindStrategyToDeck } from "../src/bind-deck-strategy.ts";

const FORBIDDEN_HOSTS = [
  "Swordwise Huscle",
  "Kerry Eurodyne",
  "Johnny Silverhand",
  "Viktor Vektor",
];

const filler = [
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailCorpoSecurity,
];

function fullList(id: string): { legends: string[]; mainDeck: string[] } {
  const spec = authoredBotLabDeckSpecs.find((candidate) => candidate.id === id);
  if (!spec) throw new Error(`missing authored list ${id}`);
  const mainDeck: string[] = [];
  for (const [name, count] of Object.entries(spec.mainDeck)) {
    for (let copy = 0; copy < count; copy += 1) mainDeck.push(name);
  }
  return { legends: [...spec.legends], mainDeck };
}

function seated(id: string) {
  const list = fullList(id);
  expect(list.legends).toHaveLength(3);
  expect(list.mainDeck).toHaveLength(40);
  const bound = bindStrategyToDeck(tacticalStrategy, list);
  expect(isTacticalAIStrategy(bound)).toBe(true);
  const profile = boundDeckProfile(bound);
  expect(profile?.deckId).toBe(id);
  return { bound, profile: profile! };
}

function hostsOf(profile: NonNullable<ReturnType<typeof boundDeckProfile>>): string[] {
  return Object.values(profile.gearHosts ?? {}).flat();
}

describe("RRY and BBG bot-lab bind", () => {
  test("full lists bind plans whose keeps and hosts are cards those lists contain", () => {
    const rry = seated("authored-rry-llorona-steel-dragon");
    const bbg = seated("authored-bbg-towerfall-control");
    const rryHosts = hostsOf(rry.profile);
    const bbgHosts = hostsOf(bbg.profile);
    expect(rryHosts.length).toBeGreaterThan(0);
    expect(bbgHosts).toEqual([]);
    for (const host of [
      ...rryHosts,
      ...bbgHosts,
      ...rry.profile.coreCards,
      ...bbg.profile.coreCards,
    ]) {
      expect(FORBIDDEN_HOSTS).not.toContain(host);
    }
    expect(rry.profile.coreCards).toContain("Yorinobu Arasaka");
    expect(rryHosts).toContain("6th Street Recruits");
    expect(rryHosts).not.toContain("Swordwise Huscle");
    expect(bbg.profile.coreCards).toContain("Lizzy Wizzy");
    expect(bbg.profile.coreCards).toContain("Placide");
    expect(bbg.profile.preferredFreeCards).toContain("Chrome Reverie");
  });
});

function cardNameIn(
  engine: CyberpunkTestEngine,
  playerId: PlayerId,
  instanceId: string,
): string | undefined {
  const view = engine.getFilteredView(playerId);
  for (const zone of Object.values(view.players[playerId as string]?.zones ?? {})) {
    if (!Array.isArray(zone)) continue;
    const card = zone.find((candidate) => candidate.instanceId === instanceId);
    if (card?.cardName) return card.cardName;
  }
  for (const player of Object.values(view.players)) {
    for (const zone of Object.values(player.zones)) {
      if (!Array.isArray(zone)) continue;
      const card = zone.find((candidate) => candidate.instanceId === instanceId);
      if (card?.cardName) return card.cardName;
    }
  }
  return undefined;
}

function laterTurn(engine: CyberpunkTestEngine) {
  engine.getState().G.turnMetadata.turnNumber = 11;
}

function choose(engine: CyberpunkTestEngine, strategy: ReturnType<typeof seated>["bound"]) {
  const active = engine.getActivePlayerId();
  const ctx = buildDecisionContext(engine.getLocalEngine(), active, () => 0);
  const decision = strategy.decideAction(ctx);
  return { active, decision };
}

let commandSeq = 0;

function apply(
  engine: CyberpunkTestEngine,
  playerId: PlayerId,
  decision: MoveDecision,
): CommandResult {
  expect(decision.kind).toBe("command");
  if (decision.kind !== "command") {
    return { success: false, error: "not a command", errorCode: "TEST", currentStateID: 0 };
  }
  commandSeq += 1;
  const result = engine.getLocalEngine().processCommand(
    {
      commandID: `rry-bbg-${commandSeq}`,
      move: decision.move,
      input: decision.args ? { args: decision.args } : undefined,
    },
    playerId,
  );
  expect(result.success, result.success ? "" : `${decision.move} ${result.error}`).toBe(true);
  return result;
}

describe("RRY and BBG chooser lines", () => {
  test("Lizzy's play plays Chrome Reverie onto a rival unit that can attack", () => {
    const { bound } = seated("authored-bbg-towerfall-control");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [
          welcomeToNightCityRetailLizzyWizzyDelicateWeapon,
          welcomeToNightCityRetailChromeReverie,
          welcomeToNightCityRetailFloorIt,
        ],
        legendArea: [
          { card: welcomeToNightCityRetailAltCunninghamSoulkillerArchitect, faceDown: true },
        ],
        eddies: 5,
        deck: filler,
      },
      {
        field: [{ card: welcomeToNightCityRetail6thStreetRecruits, spent: false, hasLag: false }],
        eddies: 0,
        deck: filler,
      },
    );
    laterTurn(engine);
    const first = choose(engine, bound);
    expect(first.decision.kind).toBe("command");
    if (first.decision.kind !== "command") return;
    expect(first.decision.move).toBe("playCard");
    expect(cardNameIn(engine, first.active, String(first.decision.args?.cardId ?? ""))).toBe(
      "Lizzy Wizzy",
    );
    const played = apply(engine, first.active, first.decision);
    const trace: string[] = [
      `play events ${played.success ? played.gameEvents.map((event) => (event.type === "actionLog" ? event.messageKey : event.type)).join(",") : "fail"}`,
    ];

    let locked = false;
    for (let step = 0; step < 4; step += 1) {
      const active = engine.getActivePlayerId();
      const prompt = engine.getPrompt(active);
      const choice = prompt.choice?.type === "chooseTarget" ? prompt.choice : undefined;
      trace.push(
        `prompt ${prompt.status} ${prompt.choice?.type ?? ""} purpose=${choice?.payload.targetPurpose ?? ""} eligible=${(choice?.payload.eligibleIds ?? []).join(",")} names=${(choice?.payload.cards ?? []).map((card) => card.cardName).join(",")}`,
      );
      if (prompt.status !== "choice") break;
      const next = choose(engine, bound);
      if (next.decision.kind !== "command") {
        trace.push(`decision ${next.decision.kind}`);
        break;
      }
      trace.push(
        `decision ${next.decision.move} ${cardNameIn(engine, next.active, String(next.decision.args?.cardId ?? "")) ?? ""} ${JSON.stringify(next.decision.args ?? {})}`,
      );
      const playedId = Array.isArray(next.decision.args?.targetIds)
        ? String(next.decision.args.targetIds[0] ?? "")
        : String(next.decision.args?.cardId ?? "");
      if (
        next.decision.move === "resolveCardToPlay" ||
        (next.decision.move === "resolveEffectTarget" && playedId && !locked)
      ) {
        const playedName = cardNameIn(engine, next.active, playedId);
        if (playedName === "Chrome Reverie" || playedName === "Floor It") {
          expect(playedName).toBe("Chrome Reverie");
        }
      }
      const result = apply(engine, next.active, next.decision);
      if (result.success) {
        const keys = result.gameEvents.map((event) =>
          event.type === "actionLog" ? event.messageKey : event.type,
        );
        trace.push(`events ${keys.join(",")}`);
        locked ||= result.gameEvents.some(
          (event) =>
            event.type === "actionLog" && event.messageKey === "trigger.grantRule.cantAttack",
        );
      }
    }
    expect(locked, trace.join(" | ")).toBe(true);
  });

  test("Placide discards a program and bottom-decks a rival unit", () => {
    const { bound } = seated("authored-bbg-towerfall-control");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailPlacideVoodooSentinel, welcomeToNightCityRetailFloorIt],
        legendArea: [
          { card: welcomeToNightCityRetailAltCunninghamSoulkillerArchitect, faceDown: false },
        ],
        eddies: 8,
        deck: filler,
      },
      {
        field: [{ card: welcomeToNightCityRetail6thStreetRecruits, spent: false, hasLag: false }],
        eddies: 0,
        deck: filler,
      },
    );
    laterTurn(engine);
    const first = choose(engine, bound);
    expect(first.decision.kind).toBe("command");
    if (first.decision.kind !== "command") return;
    expect(first.decision.move).toBe("playCard");
    expect(cardNameIn(engine, first.active, String(first.decision.args?.cardId ?? ""))).toBe(
      "Placide",
    );
    apply(engine, first.active, first.decision);

    let discarded = false;
    let bottomDecked = false;
    for (let step = 0; step < 6; step += 1) {
      const prompt = engine.getPrompt(engine.getActivePlayerId());
      if (prompt.status !== "choice") break;
      const next = choose(engine, bound);
      if (next.decision.kind !== "command") break;
      expect(next.decision.args?.pass).not.toBe(true);
      if (next.decision.move === "resolveDiscardFromHand") discarded = true;
      const result = apply(engine, next.active, next.decision);
      if (result.success) {
        bottomDecked ||= result.gameEvents.some((event) =>
          JSON.stringify(event).includes("deckBottom"),
        );
        bottomDecked ||= result.moveLogs.some((log) => JSON.stringify(log).includes("deckBottom"));
      }
    }
    expect(discarded).toBe(true);
    expect(bottomDecked).toBe(true);
  });

  test("Trust No One is played to set the min Gig the payoff needs", () => {
    const { bound } = seated("authored-bbg-towerfall-control");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailTrustNoOne, welcomeToNightCityRetailFloorIt],
        legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: true }],
        eddies: 1,
        gigArea: [4],
        deck: filler,
      },
      {
        eddies: 0,
        deck: filler,
      },
    );
    laterTurn(engine);
    const first = choose(engine, bound);
    expect(first.decision.kind).toBe("command");
    if (first.decision.kind !== "command") return;
    expect(first.decision.move).toBe("playCard");
    expect(cardNameIn(engine, P1, String(first.decision.args?.cardId ?? ""))).toBe("Trust No One");
    apply(engine, first.active, first.decision);

    let setMin = false;
    for (let step = 0; step < 4; step += 1) {
      const prompt = engine.getPrompt(engine.getActivePlayerId());
      if (prompt.status !== "choice") break;
      const next = choose(engine, bound);
      expect(next.decision.kind).toBe("command");
      if (next.decision.kind !== "command") break;
      expect(next.decision.args?.pass).not.toBe(true);
      if (next.decision.move === "resolveAdjustGig") {
        expect(next.decision.args?.value).toBe(1);
        setMin = true;
      }
      apply(engine, next.active, next.decision);
    }
    expect(setMin).toBe(true);
  });

  test("Trust No One sets a friendly Gig to 1 when a rival Gig is also legal", () => {
    const { bound } = seated("authored-bbg-towerfall-control");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailTrustNoOne, welcomeToNightCityRetailFloorIt],
        legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: true }],
        eddies: 1,
        gigArea: [3],
        deck: filler,
      },
      {
        eddies: 0,
        gigArea: [6],
        deck: filler,
      },
    );
    laterTurn(engine);
    const first = choose(engine, bound);
    expect(first.decision.kind).toBe("command");
    if (first.decision.kind !== "command") return;
    expect(first.decision.move).toBe("playCard");
    apply(engine, first.active, first.decision);

    let friendlyMin = false;
    for (let step = 0; step < 4; step += 1) {
      const active = engine.getActivePlayerId();
      const prompt = engine.getPrompt(active);
      if (prompt.status !== "choice") break;
      const next = choose(engine, bound);
      expect(next.decision.kind).toBe("command");
      if (next.decision.kind !== "command") break;
      if (next.decision.move === "resolveAdjustGig") {
        const dieId = String(next.decision.args?.dieId ?? "");
        const friendly = engine.getFilteredView(active).players[active as string]?.zones.gigArea;
        const own = Array.isArray(friendly) && friendly.some((gig) => gig.instanceId === dieId);
        expect(next.decision.args?.value).toBe(1);
        expect(own).toBe(true);
        friendlyMin = true;
      }
      apply(engine, next.active, next.decision);
    }
    expect(friendlyMin).toBe(true);
  });

  test("sells Pyramid Song instead of passing when it cannot be cast yet", () => {
    const { bound } = seated("authored-bbg-towerfall-control");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailPyramidSong],
        legendArea: [
          {
            card: welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
            faceDown: false,
            spent: true,
          },
        ],
        eddies: 0,
        deck: filler,
      },
      { eddies: 0, deck: filler },
    );
    const first = choose(engine, bound);
    expect(first.decision.kind).toBe("command");
    if (first.decision.kind !== "command") return;
    const played = cardNameIn(engine, first.active, String(first.decision.args?.cardId ?? ""));
    expect(`${first.decision.move} ${played ?? ""}`).toBe("sellCard Pyramid Song");
  });
});

describe("RRY gear stays on the curve bodies", () => {
  test("sells a spare program instead of attaching Faceplate to a Legend", () => {
    const { bound } = seated("authored-rry-llorona-steel-dragon");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [
          welcomeToNightCityRetailZetatechFaceplate,
          welcomeToNightCityRetailIndustrialAssembly,
        ],
        legendArea: [{ card: welcomeToNightCityRetailMuamarReyesElCapitan, faceDown: false }],
        eddies: 2,
        deck: filler,
      },
      { eddies: 0, deck: filler },
    );
    const first = choose(engine, bound);
    expect(first.decision.kind).toBe("command");
    if (first.decision.kind !== "command") return;
    expect(first.decision.move).toBe("sellCard");
    expect(cardNameIn(engine, first.active, String(first.decision.args?.cardId ?? ""))).toBe(
      "Industrial Assembly",
    );
  });

  test("plays La Llorona before Meredith when both are affordable", () => {
    const { bound } = seated("authored-rry-llorona-steel-dragon");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [
          welcomeToNightCityRetailLaLloronaGhostOfThePast,
          welcomeToNightCityRetailMeredithStoutStoneColdCorpo,
        ],
        legendArea: [
          { card: welcomeToNightCityRetailMuamarReyesElCapitan, faceDown: false, spent: true },
        ],
        eddies: 4,
        deck: filler,
      },
      { eddies: 0, deck: filler },
    );
    laterTurn(engine);
    const first = choose(engine, bound);
    expect(first.decision.kind).toBe("command");
    if (first.decision.kind !== "command") return;
    expect(first.decision.move).toBe("playCard");
    expect(cardNameIn(engine, first.active, String(first.decision.args?.cardId ?? ""))).toBe(
      "La Llorona",
    );
  });
});
