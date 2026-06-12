// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import type { CardEffect } from "@tcg/gundam-types";
import { asPlayerId, type GundamG, type PendingEffect } from "@tcg/gundam-engine";

import { renderSimulator } from "../../test/renderSimulator.tsx";
import { findCardsByName } from "../../test/queries.ts";
import { loadPendingEffectClickGuardDemo } from "../../game/fixtures/pending-effect-click-guard-demo.ts";
import { loadCommandMultiTargetDemo } from "../../game/fixtures/command-multi-target-demo.ts";

/**
 * Rule 5-2 — while a pending effect from rule 10-1-6 awaits resolution,
 * no other player-initiated action is legal. The engine gate in
 * `packages/engine/src/gundam/moves/core/pending-guards.ts` removes
 * `enterBattle` (and other player-action moves) from
 * `enumerateAvailableMovesDetailed` while `g.pendingEffects.length > 0`,
 * so the simulator's `pickMoveForCard` returns null and clicking the
 * viewer's own Unit on the battle area is a no-op.
 *
 * Reproduces the screenshot bug: with a Hawk-of-Endymion-style prompt
 * open ("CHOOSE 1 ENEMY UNIT…"), clicking the viewer's own Unit must
 * NOT initiate the attack-targeting flow ("Challenge with …").
 */
describe("Main-phase · click-during-pending-choice gate · rule 5-2", () => {
  it("clicking the viewer's own unit while a target prompt is open is a no-op", async () => {
    const { dev } = renderSimulator(loadPendingEffectClickGuardDemo);

    // Sanity: no attack-targeting overlay at boot.
    expect(screen.queryByText(/select target/i)).toBeNull();

    // Seed a `targetSelection`-shaped pending effect via the test-only
    // mutation hook. The shape mirrors what a Hawk-of-Endymion main
    // effect would enqueue at resolution time: choose 1 opponent Unit
    // (count: 1 filter → engine surfaces a `targetSelection` prompt).
    const restEnemyUnitEffect: CardEffect = {
      type: "activated",
      activation: { timing: ["activate:main"] },
      directives: [
        {
          action: {
            action: "rest",
            target: { owner: "opponent", cardType: "unit", count: 1 },
          },
        },
      ],
      sourceText: "Choose 1 enemy Unit. Rest it.",
    };
    const viewerCardOnBoard = findCardsByName(dev, /Viewer Mock/i)[0]!;
    const viewerCardId = viewerCardOnBoard.dataset.cardId!;
    const p1Id = asPlayerId(dev.p1Id as unknown as string);
    dev.runtime.runTestMutation(p1Id, ({ G }) => {
      const entry: PendingEffect = {
        id: "test-pe",
        sourceCardId: viewerCardId,
        effectIndex: 0,
        kind: "activated",
        controllerId: p1Id as unknown as string,
        effect: restEnemyUnitEffect,
      };
      (G as GundamG).pendingEffects.push(entry);
    });

    fireEvent.click(screen.getByText(/Actions \/ Log/i));

    // Pending-choice interaction shows up in the shared action surface after
    // the engine state update.
    await waitFor(() => {
      expect(
        document.querySelector("[data-testid='interaction-card:action:resolveEffect']"),
      ).not.toBeNull();
      expect(screen.queryByText(/select target/i)).not.toBeNull();
    });

    // Click the viewer's own Unit on the battle area.
    fireEvent.click(viewerCardOnBoard);

    // Flush microtasks to rule out a deferred overlay opening.
    await Promise.resolve();
    await Promise.resolve();

    // No attack-targeting overlay opened (no "SELECT TARGET" banner,
    // no "Challenge with …" prompt). The engine gate dropped
    // `enterBattle` from the move list, so `pickMoveForCard` was a no-op.
    expect(screen.queryByText(/challenge with/i)).toBeNull();

    // Pending-choice interaction is still open — the click did not advance
    // or dismiss the resolution.
    expect(
      document.querySelector("[data-testid='interaction-card:action:resolveEffect']"),
    ).not.toBeNull();
    expect(screen.queryByText(/select target/i)).not.toBeNull();
  });

  it.skip("stages a legal target and resolves only after Confirm", async () => {
    const { dev } = renderSimulator(loadPendingEffectClickGuardDemo);

    const setActiveEnemyUnitEffect: CardEffect = {
      type: "activated",
      activation: { timing: ["activate:main"] },
      directives: [
        {
          action: {
            action: "setActive",
            target: { owner: "opponent", cardType: "unit", count: 1 },
          },
        },
      ],
      sourceText: "Choose 1 enemy Unit. Set it as active.",
    };
    const viewerCardOnBoard = findCardsByName(dev, /Viewer Mock/i)[0]!;
    const viewerCardId = viewerCardOnBoard.dataset.cardId!;
    const p1Id = asPlayerId(dev.p1Id as unknown as string);
    dev.runtime.runTestMutation(p1Id, ({ G }) => {
      const entry: PendingEffect = {
        id: "test-pe",
        sourceCardId: viewerCardId,
        effectIndex: 0,
        kind: "activated",
        controllerId: p1Id as unknown as string,
        effect: setActiveEnemyUnitEffect,
      };
      (G as GundamG).pendingEffects.push(entry);
    });

    await waitFor(() => {
      expect(screen.queryByText(/Choose 1 enemy Unit\. Set it as active\./i)).not.toBeNull();
    });

    const confirm = screen.getByRole("button", { name: /^confirm$/i }) as HTMLButtonElement;
    expect(confirm.disabled).toBe(true);

    const enemyCard = findCardsByName(dev, /Rested Mock/i)[0]!;
    const enemyCardId = enemyCard.dataset.cardId!;
    fireEvent.click(enemyCard);

    expect(screen.queryByText(/Choose 1 enemy Unit\. Set it as active\./i)).not.toBeNull();
    expect(confirm.disabled).toBe(false);
    expect((dev.runtime.getState().G as GundamG).exhausted[enemyCardId]).toBe(true);

    fireEvent.click(confirm);

    await waitFor(() => {
      expect(screen.queryByText(/Choose 1 enemy Unit\. Set it as active\./i)).toBeNull();
    });
    expect((dev.runtime.getState().G as GundamG).exhausted[enemyCardId]).not.toBe(true);
  });

  it.skip("visually marks every staged play-zone target for multi-target effects", async () => {
    const { dev } = renderSimulator(loadCommandMultiTargetDemo);

    const restTwoEnemyUnitsEffect: CardEffect = {
      type: "activated",
      activation: { timing: ["activate:main"] },
      directives: [
        {
          action: {
            action: "rest",
            target: { owner: "opponent", cardType: "unit", count: 2 },
          },
        },
      ],
      sourceText: "Choose 2 enemy Units. Rest them.",
    };
    const sourceCardId = screen
      .getByRole("list", { name: /your hand/i })
      .querySelector<HTMLElement>("[data-card-id]")!.dataset.cardId!;
    const p1Id = asPlayerId(dev.p1Id as unknown as string);
    dev.runtime.runTestMutation(p1Id, ({ G }) => {
      const entry: PendingEffect = {
        id: "test-pe-multi",
        sourceCardId,
        effectIndex: 0,
        kind: "activated",
        controllerId: p1Id as unknown as string,
        effect: restTwoEnemyUnitsEffect,
      };
      (G as GundamG).pendingEffects.push(entry);
    });

    await waitFor(() => {
      expect(screen.queryByText(/Choose 2 enemy Units\. Rest them\./i)).not.toBeNull();
    });

    const zaku = findCardsByName(dev, /Zaku II/i)[0]!;
    const dom = findCardsByName(dev, /Dom/i)[0]!;
    fireEvent.click(zaku);
    fireEvent.click(dom);

    expect(zaku.className).toContain("gd-target-selected");
    expect(dom.className).toContain("gd-target-selected");
  });

  it.skip("surfaces chooseOne prompts as selectable token option cards", async () => {
    const { dev } = renderSimulator(loadPendingEffectClickGuardDemo);

    const strikerPackChoiceEffect: CardEffect = {
      type: "command",
      activation: { timing: ["main"] },
      directives: [
        {
          kind: "chooseOne",
          options: [
            {
              label: "Sword Strike Gundam",
              directives: [{ action: { action: "draw", count: 0 } }],
            },
            {
              label: "Launcher Strike Gundam",
              directives: [{ action: { action: "draw", count: 0 } }],
            },
          ],
        },
      ],
      sourceText: "Deploy 1 [Sword Strike Gundam] or 1 [Launcher Strike Gundam] Unit token.",
    };
    const viewerCardOnBoard = findCardsByName(dev, /Viewer Mock/i)[0]!;
    const viewerCardId = viewerCardOnBoard.dataset.cardId!;
    const p1Id = asPlayerId(dev.p1Id as unknown as string);
    dev.runtime.runTestMutation(p1Id, ({ G }) => {
      const entry: PendingEffect = {
        id: "test-pe-choose-one",
        sourceCardId: viewerCardId,
        effectIndex: 0,
        kind: "command",
        controllerId: p1Id as unknown as string,
        effect: strikerPackChoiceEffect,
      };
      (G as GundamG).pendingEffects.push(entry);
    });

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: /Deploy 1 \[Sword Strike/i })).not.toBeNull();
    });

    expect(screen.getByRole("button", { name: /choose sword strike gundam/i })).not.toBeNull();
    expect(screen.getByAltText("Sword Strike Gundam")).not.toBeNull();
    expect(screen.getByAltText("Launcher Strike Gundam")).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /choose launcher strike gundam/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: /Deploy 1 \[Sword Strike/i })).toBeNull();
    });
  });
});
