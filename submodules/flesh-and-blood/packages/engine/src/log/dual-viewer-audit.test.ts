/**
 * Dual-viewer audit over live engine receipts: a scripted corpus is checked
 * for the invariants both log consumers rely on —
 *
 * - every emitted key is registry vocabulary (no foreign key on the wire),
 * - every wire message is self-describing (`defaultMessage` re-renders from
 *   the catalog + its own values),
 * - private-family facts never ride a public array and only address known
 *   seats, and
 * - identities that only an appendix ever learned stay off every public
 *   surface (move-log defaults and the transient kernel player log).
 *
 * Rendering itself (owner "You" labels, reader redaction) is exercised by the
 * simulator projection tests; this file pins the canonical record they read.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../testing/test-engine.ts";
import { bravo, dash, heartOfFyendal, nimblismBlue, snatchRed } from "../rules/fixtures.ts";
import { hitTrainer } from "../rules/test-trainers.ts";
import { cerebellumProcessorBlue } from "../../../cards/src/cards/actions/cerebellum-processor.ts";
import type { FabMoveLog, FabMoveLogMessage } from "../moves.ts";
import { FAB_LOG_KEYS, renderFabLogTemplate, type FabLogKey } from "./index.ts";

/** Walk priority/pitch timing by hand so receipts stay deterministic. */
const MANUAL = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

/** Keys whose facts are appendix-only by contract (owner-scoped detail). */
const PRIVATE_FAMILY_KEYS: ReadonlySet<string> = new Set([
  "flesh-and-blood.draw.private",
  "flesh-and-blood.look.private",
  "flesh-and-blood.opt.private",
  "flesh-and-blood.search.found",
  "flesh-and-blood.decision.private",
]);

const REGISTRY_KEYS: ReadonlySet<string> = new Set(FAB_LOG_KEYS);

/** Value keys that carry card display names, possibly comma-joined. */
const CARD_NAME_VALUE_KEYS: ReadonlySet<string> = new Set([
  "cardName",
  "cardNames",
  "topNames",
  "bottomNames",
]);

function drawGame(): FabTestEngine {
  const attack = hitTrainer({
    slug: "log-audit-draw",
    effect: { type: "draw", count: 2, player: "controller" },
  });
  const game = FabTestEngine.start(
    {
      hero: bravo,
      hand: [attack],
      deck: [heartOfFyendal, heartOfFyendal, snatchRed, nimblismBlue],
    },
    { hero: dash, deck: 6 },
    MANUAL,
  );
  game.as(bravo).attackWith(attack);
  game.helpers.resolveUntilIdle();
  return game;
}

function optGame(): FabTestEngine {
  const attack = hitTrainer({ slug: "log-audit-opt", effect: { type: "opt", count: 2 } });
  const game = FabTestEngine.start(
    {
      hero: bravo,
      hand: [attack],
      deck: [heartOfFyendal, heartOfFyendal, snatchRed, nimblismBlue],
    },
    { hero: dash, deck: 6 },
    MANUAL,
  );
  game.as(bravo).attackWith(attack);
  game.helpers.resolveUntilIdle();
  return game;
}

/** Effect-granted resources (Blossom of Spring family) via a hit trigger. */
function grantResourcesGame(): FabTestEngine {
  const attack = hitTrainer({
    slug: "log-audit-grant-resources",
    effect: { type: "gain-resources", amount: 2 },
  });
  const game = FabTestEngine.start(
    {
      hero: bravo,
      hand: [attack],
      deck: [heartOfFyendal, heartOfFyendal, snatchRed, nimblismBlue],
    },
    { hero: dash, deck: 6 },
    MANUAL,
  );
  game.as(bravo).attackWith(attack);
  game.helpers.resolveUntilIdle();
  return game;
}

/** Effect-granted action points (Diamond Amulet family) via a hit trigger. */
function grantActionPointsGame(): FabTestEngine {
  const attack = hitTrainer({
    slug: "log-audit-grant-action-points",
    effect: { type: "gain-action-points", amount: 1 },
  });
  const game = FabTestEngine.start(
    {
      hero: bravo,
      hand: [attack],
      deck: [heartOfFyendal, heartOfFyendal, snatchRed, nimblismBlue],
    },
    { hero: dash, deck: 6 },
    MANUAL,
  );
  game.as(bravo).attackWith(attack);
  game.helpers.resolveUntilIdle();
  return game;
}

/** Effect-granted chi (Arc Ramp family) via a hit trigger. */
function grantChiGame(): FabTestEngine {
  const attack = hitTrainer({
    slug: "log-audit-grant-chi",
    effect: { type: "gain-chi", amount: 2 },
  });
  const game = FabTestEngine.start(
    {
      hero: bravo,
      hand: [attack],
      deck: [heartOfFyendal, heartOfFyendal, snatchRed, nimblismBlue],
    },
    { hero: dash, deck: 6 },
    MANUAL,
  );
  game.as(bravo).attackWith(attack);
  game.helpers.resolveUntilIdle();
  return game;
}

/** Effect-granted amp (Staff of Verdant Shoots family) via a hit trigger. */
function grantAmpGame(): FabTestEngine {
  const attack = hitTrainer({
    slug: "log-audit-grant-amp",
    effect: { type: "amp", amount: 1 },
  });
  const game = FabTestEngine.start(
    {
      hero: bravo,
      hand: [attack],
      deck: [heartOfFyendal, heartOfFyendal, snatchRed, nimblismBlue],
    },
    { hero: dash, deck: 6 },
    MANUAL,
  );
  game.as(bravo).attackWith(attack);
  game.helpers.resolveUntilIdle();
  return game;
}

/** Cranked item (CR 8.3.29): the action point is a procedural gain-assets. */
function crankGame(): FabTestEngine {
  const game = FabTestEngine.start(
    { hero: bravo, hand: [cerebellumProcessorBlue], deck: 4 },
    { hero: dash, life: 20, deck: 4 },
    MANUAL,
  );
  const bravoSeat = game.as(bravo);
  const dashSeat = game.as(dash);
  bravoSeat.must.play(cerebellumProcessorBlue);
  bravoSeat.must.passPriority();
  dashSeat.must.passPriority();
  return game;
}

function publicMessagesOf(game: FabTestEngine): readonly FabMoveLogMessage[] {
  return game.moveLogs().flatMap((log) => log.public);
}

function appendixMessagesOf(game: FabTestEngine): readonly FabMoveLogMessage[] {
  return game.moveLogs().flatMap((log) => Object.values(log.privateByPlayerId ?? {}).flat());
}

function cardNamesOf(messages: readonly FabMoveLogMessage[]): Set<string> {
  const names = new Set<string>();
  for (const message of messages) {
    for (const [name, value] of Object.entries(message.values ?? {})) {
      if (!CARD_NAME_VALUE_KEYS.has(name) || typeof value !== "string" || value.length === 0) {
        continue;
      }
      for (const part of value.split(/,\s*/)) {
        if (part.length > 0 && part !== "nothing" && part !== "a card") names.add(part);
      }
    }
  }
  return names;
}

describe("FabLog dual-viewer audit (live corpus)", () => {
  const games: readonly { readonly label: string; readonly game: FabTestEngine }[] = [
    { label: "draw corpus", game: drawGame() },
    { label: "opt corpus", game: optGame() },
  ];

  it("accumulates a representative slice of the vocabulary", () => {
    for (const { label, game } of games) {
      const keys = new Set(
        [...publicMessagesOf(game), ...appendixMessagesOf(game)].map((message) => message.key),
      );
      // The merged combat narration removed the step/reaction echo lines, so
      // a single mid-phase action carries fewer distinct keys by design.
      expect(keys.size, `${label}: expected a rich corpus`).toBeGreaterThanOrEqual(10);
      // Phase/turn machinery only logs on real transitions, which a single
      // mid-phase attack does not cross; anchor on the stable combat facts.
      for (const expected of ["flesh-and-blood.attack", "flesh-and-blood.combat.chain-close"]) {
        expect(keys, `${label}: expected ${expected}`).toContain(expected);
      }
    }
    // The appendix families this corpus is designed to exercise must appear.
    const appendixKeys = new Set(
      games.flatMap(({ game }) => [...appendixMessagesOf(game)].map((message) => message.key)),
    );
    expect(appendixKeys).toContain("flesh-and-blood.draw.private");
    expect(appendixKeys).toContain("flesh-and-blood.opt.private");
  });

  it("emits only registry vocabulary with self-describing default messages", () => {
    const problems: string[] = [];
    for (const { label, game } of games) {
      const logs: readonly FabMoveLog[] = game.moveLogs();
      const messages = logs.flatMap((log) => [
        ...log.public,
        ...Object.values(log.privateByPlayerId ?? {}).flat(),
      ]);
      for (const message of messages) {
        if (!REGISTRY_KEYS.has(message.key)) {
          problems.push(`${label}: foreign key "${message.key}" on the wire`);
          continue;
        }
        const rendered = renderFabLogTemplate(message.key as FabLogKey, message.values ?? {});
        if (rendered.includes("{") || rendered.includes("}")) {
          problems.push(`${label}: ${message.key} left placeholder braces: "${rendered}"`);
        }
        if (rendered !== message.defaultMessage) {
          problems.push(
            `${label}: ${message.key} defaultMessage drifted from catalog render\n  wire: "${message.defaultMessage}"\n  now:  "${rendered}"`,
          );
        }
      }
    }
    expect(problems).toEqual([]);
  });

  it("keeps private-family facts out of public arrays and unknown seats", () => {
    const problems: string[] = [];
    for (const { label, game } of games) {
      const seats: ReadonlySet<string> = new Set<string>(game.getState().playerIds);
      for (const log of game.moveLogs()) {
        for (const message of log.public) {
          if (PRIVATE_FAMILY_KEYS.has(message.key)) {
            problems.push(`${label}: private key "${message.key}" leaked into a public array`);
          }
        }
        for (const viewer of Object.keys(log.privateByPlayerId ?? {})) {
          if (!seats.has(viewer)) {
            problems.push(`${label}: appendix addressed unknown seat "${viewer}"`);
          }
        }
      }
    }
    expect(problems).toEqual([]);
  });

  it("never surfaces appendix-only card identities on any public surface", () => {
    for (const { label, game } of games) {
      const secretNames = [...cardNamesOf(appendixMessagesOf(game))].filter(
        (name) => !cardNamesOf(publicMessagesOf(game)).has(name),
      );
      expect(
        secretNames.length,
        `${label}: corpus should learn private identities`,
      ).toBeGreaterThan(0);

      const publicText = [
        ...publicMessagesOf(game).map((message) => message.defaultMessage),
        ...game.playerLogs().map((entry) => entry.message),
      ];
      for (const name of secretNames) {
        for (const text of publicText) {
          expect(text, `${label}: "${name}" leaked publicly`).not.toContain(name);
        }
      }
    }
  });

  it("narrates effect-granted assets with their amount and source card", () => {
    const resourcesGame = grantResourcesGame();
    const resourcesFact = [
      ...publicMessagesOf(resourcesGame),
      ...appendixMessagesOf(resourcesGame),
    ].find((message) => message.key === "flesh-and-blood.assets.granted");
    expect(resourcesFact?.values).toMatchObject({ resources: 2, plural: "s" });
    expect(typeof resourcesFact?.values?.cardName).toBe("string");
    expect(resourcesFact?.defaultMessage).toContain("gained 2 resources");

    const actionPointsGame = grantActionPointsGame();
    const actionPointsFact = [
      ...publicMessagesOf(actionPointsGame),
      ...appendixMessagesOf(actionPointsGame),
    ].find((message) => message.key === "flesh-and-blood.assets.granted.action-points");
    expect(actionPointsFact?.values).toMatchObject({ actionPoints: 1, plural: "" });
    expect(actionPointsFact?.defaultMessage).toContain("gained 1 action point");

    const chiGame = grantChiGame();
    const chiFact = [...publicMessagesOf(chiGame), ...appendixMessagesOf(chiGame)].find(
      (message) => message.key === "flesh-and-blood.assets.granted.chi",
    );
    expect(chiFact?.values).toMatchObject({ chi: 2 });
    expect(chiFact?.defaultMessage).toContain("gained 2 chi");

    const ampGame = grantAmpGame();
    const ampFact = [...publicMessagesOf(ampGame), ...appendixMessagesOf(ampGame)].find(
      (message) => message.key === "flesh-and-blood.assets.granted.amp",
    );
    expect(ampFact?.values).toMatchObject({ amp: 1 });
    expect(ampFact?.defaultMessage).toContain("gained 1 amp");
  });

  it("does not duplicate the crank line with a procedural asset grant", () => {
    const game = crankGame();
    const messages = [...publicMessagesOf(game), ...appendixMessagesOf(game)];
    // CR 8.3.29: the crank line narrates the action point; the procedural
    // gain-assets companion must not add a second asset line.
    expect(messages.some((message) => message.key === "flesh-and-blood.crank")).toBe(true);
    expect(
      messages.some(
        (message) =>
          message.key === "flesh-and-blood.assets.granted" ||
          message.key === "flesh-and-blood.assets.granted.action-points",
      ),
    ).toBe(false);
  });
});
