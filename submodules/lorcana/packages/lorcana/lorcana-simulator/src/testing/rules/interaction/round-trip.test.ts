import { describe, expect, it } from "bun:test";
import { CANONICAL_PLAYER_ONE, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  aladdinPrinceAli,
  developYourBrain,
  healingGlow,
  mickeyMouseTrueFriend,
  tinkerBellPeterPansAlly,
} from "@tcg/lorcana-cards/cards/001";
import { jafarAspiringRuler } from "@tcg/lorcana-cards/cards/007";
import { buildPlayerInteractionView, type Interaction } from "@tcg/lorcana-interaction";
import { simulateClick } from "@tcg/lorcana-interaction/testing";
import type { CardInstanceId, PlayerId } from "@tcg/lorcana-types";

/**
 * End-to-end "click and resolve" round-trip:
 *
 * 1. Drive a real engine fixture to a pending choice via `LorcanaMultiplayerTestEngine`.
 * 2. Project the board, build the `PlayerInteractionView`.
 * 3. Pick an interaction with `simulateClick`, hand the resulting payload back
 *    to the engine via `resolvePendingByCard`.
 * 4. Assert the engine accepts the payload AND the post-state effect happened.
 *
 * This is the test class that catches the two bugs that motivated the
 * rewrite: the **locked-state** invariant (chooser + active prompt + not
 * auto-rejected ⇒ at least one interaction) and the **wrong-targets**
 * invariant (the engine accepts the payload simulateClick produced).
 */
describe("PlayerInteractionView round-trip", () => {
  it("plays Jafar Aspiring Ruler, exposes a target, and resolves through the new view", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [jafarAspiringRuler],
      play: [{ card: mickeyMouseTrueFriend, isDrying: false }],
      inkwell: jafarAspiringRuler.cost,
      deck: 2,
    });

    expect(engine.asPlayerOne().playCard(jafarAspiringRuler)).toBeSuccessfulCommand();

    const client = engine.asPlayerOne();
    const board = client.getBoard();
    const view = buildPlayerInteractionView(board, CANONICAL_PLAYER_ONE as PlayerId);

    expect(view.viewerRole).toBe("chooser");
    expect(view.activePrompt).not.toBeNull();
    expect(view.activePrompt?.kind).toBe("target-selection");

    // Locked-state invariant: a chooser with an active, non-rejected prompt
    // MUST have at least one interaction. This is the single test that
    // generically catches the "no clickable affordance" bug class.
    expect(view.submission.autoRejected).toBe(false);
    expect(view.interactions.length).toBeGreaterThan(0);

    const mickeyId = engine.findCardInstanceId(mickeyMouseTrueFriend, "play");
    expect(mickeyId).toBeDefined();

    const cardInteractions = view.interactions.filter(isSelectCard);
    const candidateIds = cardInteractions.map((i) => i.cardId);
    expect(candidateIds).toContain(mickeyId as CardInstanceId);

    const click = simulateClick(view, { kind: "card", cardId: mickeyId as CardInstanceId });
    expect(click.ok).toBe(true);
    if (!click.ok) return;

    expect(
      engine.asPlayerOne().resolvePendingByCard(jafarAspiringRuler, click.payload),
    ).toBeSuccessfulCommand();

    expect(engine.hasKeyword(mickeyMouseTrueFriend, "Challenger")).toBe(true);
    expect(engine.hasKeyword(jafarAspiringRuler, "Challenger")).toBe(false);
  });

  it("Develop Your Brain — exposes scry destinations and revealed cards, accepts a placement payload", () => {
    // Real-engine round-trip for the scry kind. Mirrors the existing
    // card-side test in @tcg/lorcana-cards/cards/001/actions/161-develop-your-brain
    // so any divergence between the view's scry shape and the engine's
    // accepted payload surfaces here.
    //
    // Develop Your Brain: "Look at the top 2, put 1 to hand, 1 to deck-bottom."
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [developYourBrain],
      inkwell: developYourBrain.cost,
      deck: [aladdinPrinceAli, tinkerBellPeterPansAlly, healingGlow],
    });

    expect(engine.asPlayerOne().playCard(developYourBrain)).toBeSuccessfulCommand();

    const board = engine.asPlayerOne().getBoard();
    const view = buildPlayerInteractionView(board, CANONICAL_PLAYER_ONE as PlayerId);

    expect(view.viewerRole).toBe("chooser");
    expect(view.activePrompt?.kind).toBe("scry-selection");
    expect(view.surface).toBe("scry-overlay");

    // Two destinations published: hand (min:1, max:1) + deck-bottom (remainder).
    const destinations = view.activePrompt?.scryDestinations;
    expect(destinations).not.toBeNull();
    expect(destinations).toHaveLength(2);
    const handDest = destinations?.find((d) => d.zone === "hand");
    const deckBottomDest = destinations?.find((d) => d.zone === "deck-bottom");
    expect(handDest).toBeDefined();
    expect(handDest?.min).toBe(1);
    expect(handDest?.max).toBe(1);
    expect(handDest?.remainder).toBe(false);
    expect(deckBottomDest).toBeDefined();
    expect(deckBottomDest?.remainder).toBe(true);

    // Two revealed cards exposed, each unassigned at the start of the prompt.
    const revealed = view.activePrompt?.scryRevealed;
    expect(revealed).not.toBeNull();
    expect(revealed).toHaveLength(2);
    for (const card of revealed ?? []) {
      expect(card.currentDestinationId).toBeNull();
      expect(card.orderIndex).toBeNull();
    }

    const [firstRevealed, secondRevealed] = revealed ?? [];
    expect(firstRevealed).toBeDefined();
    expect(secondRevealed).toBeDefined();

    // Construct the destinations payload manually — the view's
    // submitPayload only reflects engine-confirmed assignments, and we
    // haven't placed anything via the engine yet. The test asserts the
    // engine accepts a payload built FROM the view's destination shape.
    expect(
      engine.asPlayerOne().resolvePendingEffect(developYourBrain, {
        destinations: [
          { zone: "hand", cards: [secondRevealed.cardId] },
          { zone: "deck-bottom", cards: [firstRevealed.cardId] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(engine.asPlayerOne().getPendingEffects()).toHaveLength(0);

    // Locked-state invariant for scry: chooser + active prompt with revealed
    // cards + non-rejected ⇒ at least the destinations and revealed cards
    // are exposed (interactions may also include scry-place entries; the
    // canSubmit gate is governed by min/max per destination).
    const stuckBeforeSubmit =
      view.activePrompt !== null &&
      view.viewerRole === "chooser" &&
      !view.submission.autoRejected &&
      (revealed?.length ?? 0) > 0 &&
      (destinations?.length ?? 0) === 0;
    expect(stuckBeforeSubmit).toBe(false);
  });

  it("returns a spectator view for a third-party viewer mid-prompt", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [jafarAspiringRuler],
      play: [{ card: mickeyMouseTrueFriend, isDrying: false }],
      inkwell: jafarAspiringRuler.cost,
      deck: 2,
    });

    expect(engine.asPlayerOne().playCard(jafarAspiringRuler)).toBeSuccessfulCommand();

    const board = engine.asPlayerOne().getBoard();
    const view = buildPlayerInteractionView(board, "player_three" as PlayerId);

    expect(view.viewerRole).toBe("spectator");
    expect(view.interactions).toEqual([]);
    expect(view.surface).toBe("none");
    expect(view.activePrompt).not.toBeNull();
  });
});

function isSelectCard(
  interaction: Interaction,
): interaction is Extract<Interaction, { kind: "select-card" }> {
  return interaction.kind === "select-card";
}
