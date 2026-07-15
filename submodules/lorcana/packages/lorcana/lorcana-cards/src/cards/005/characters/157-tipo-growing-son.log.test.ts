import { describe, expect, it } from "bun:test";
import type { MoveLog, PlayerId } from "@tcg/lorcana-engine";
import {
  CANONICAL_PLAYER_ONE,
  CANONICAL_PLAYER_TWO,
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { tipoGrowingSon } from "./157-tipo-growing-son";

const practicedDetective = createMockCharacter({
  id: "tipo-practiced-detective",
  name: "Practiced Detective",
  cost: 1,
});
const PLAYER_ONE_ID = CANONICAL_PLAYER_ONE as PlayerId;
const PLAYER_TWO_ID = CANONICAL_PLAYER_TWO as PlayerId;

/**
 * MEASURE ME AGAIN puts a card from the controller's hand into their inkwell
 * facedown and exerted. The card moves from a private zone (hand) to a private
 * zone (inkwell, where every card is facedown by rule).
 *
 * These tests document the canonical log contract when the optional ability is
 * accepted with a chosen target.
 *
 * Public messages never contain the hidden inked card token. The controller gets
 * a private appendix that names the inked card.
 */
describe("Tipo - Growing Son — log lines per perspective", () => {
  function setup() {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [tipoGrowingSon, practicedDetective],
      inkwell: tipoGrowingSon.cost,
      deck: 1,
    });
    const detectiveId = engine.findCardInstanceId(practicedDetective, "hand", "p1");
    const tipoId = engine.findCardInstanceId(tipoGrowingSon, "hand", "p1");

    expect(engine.asPlayerOne().playCard(tipoGrowingSon)).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolvePendingByCard(tipoGrowingSon, {
        resolveOptional: true,
        targets: [detectiveId],
      }),
    ).toBeSuccessfulCommand();

    const moveLogs = engine.getServerEngine().getRuntime().getMoveLogHistory();

    return { engine, detectiveId, tipoId, moveLogs };
  }

  function visibleMessagesForViewer(log: MoveLog, viewerId: PlayerId | null) {
    return [...log.public, ...(viewerId ? (log.privateByPlayerId?.[viewerId] ?? []) : [])];
  }

  function normalizeForViewer(logs: readonly MoveLog[], viewerId: PlayerId | null) {
    return logs.map((log) => ({
      moveType: log.moveType,
      playerId: log.playerId,
      public: visibleMessagesForViewer(log, viewerId),
    }));
  }

  it("playCard log entry is identical for all viewers (Tipo enters play face-up)", () => {
    const { tipoId, moveLogs } = setup();
    const playCardEntry = moveLogs.find((log) => log.moveType === "playCard");

    expect(playCardEntry).toMatchObject({
      moveType: "playCard",
      playerId: CANONICAL_PLAYER_ONE,
      public: expect.arrayContaining([
        expect.objectContaining({
          key: "lorcana.move.playCard",
          values: expect.objectContaining({ cardId: tipoId }),
        }),
      ]),
    });

    // Tipo itself is public information (it was played from hand into play),
    // so this log does not need any viewer-specific appendix.
    expect(playCardEntry?.privateByPlayerId).toBeUndefined();
  });

  it("keeps the hidden inked card out of public resolveBag messages", () => {
    const { detectiveId, tipoId, moveLogs } = setup();
    const resolveBagEntry = moveLogs.find((log) => log.moveType === "resolveBag");
    const publicMessages = resolveBagEntry?.public ?? [];

    expect(resolveBagEntry?.moveType).toBe("resolveBag");
    expect(resolveBagEntry?.playerId).toBe(PLAYER_ONE_ID);
    expect(publicMessages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "lorcana.bag.resolve.completed.named",
          values: expect.objectContaining({
            sourceId: tipoId,
            abilityName: "MEASURE ME AGAIN",
          }),
        }),
      ]),
    );

    expect(
      publicMessages.some(
        (message) => "targets" in message.values && message.values.targets?.includes(detectiveId),
      ),
    ).toBe(false);
  });

  it("appends the inked card detail only for the controller", () => {
    const { detectiveId, moveLogs } = setup();

    const inkingEntry = moveLogs.find((log) =>
      log.privateByPlayerId?.[PLAYER_ONE_ID]?.some(
        (message) => message.key === "lorcana.outcome.cardInkedExerted",
      ),
    );
    expect(inkingEntry).toBeDefined();

    // Owner sees the inked card's id; the renderer resolves the name from
    // staticResources keyed off cardId, so no cardName is stored on the log
    // entry itself.
    expect(inkingEntry?.privateByPlayerId?.[PLAYER_ONE_ID]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "lorcana.outcome.cardInkedExerted",
          values: expect.objectContaining({ cardId: detectiveId }),
        }),
      ]),
    );

    // Opponent and spectator get no masked card token at all.
    expect(inkingEntry?.privateByPlayerId?.[PLAYER_TWO_ID]).toBeUndefined();

    const spectatorMessages = visibleMessagesForViewer(inkingEntry!, null);
    expect(
      spectatorMessages.some((message) => message.key === "lorcana.outcome.cardInkedExerted"),
    ).toBe(false);
  });

  it("snapshots the full per-perspective move log shape", () => {
    const { moveLogs } = setup();

    const ownerView = normalizeForViewer(moveLogs, PLAYER_ONE_ID);
    const opponentView = normalizeForViewer(moveLogs, PLAYER_TWO_ID);
    const spectatorView = normalizeForViewer(moveLogs, null);

    // Each role sees the same number of entries (visibility is field-level,
    // not entry-level, so entries are never dropped — only private appendices).
    expect(ownerView).toHaveLength(moveLogs.length);
    expect(opponentView).toHaveLength(moveLogs.length);
    expect(spectatorView).toHaveLength(moveLogs.length);

    // Move types are preserved across roles.
    expect(ownerView.map((log) => log.moveType)).toEqual(opponentView.map((log) => log.moveType));
    expect(ownerView.map((log) => log.moveType)).toEqual(spectatorView.map((log) => log.moveType));

    // Owner and opponent diverge because the owner receives the private inked-card
    // appendix. Opponent and spectator see identical public-only views.
    expect(opponentView).not.toEqual(ownerView);
    expect(spectatorView).toEqual(opponentView);
  });
});
