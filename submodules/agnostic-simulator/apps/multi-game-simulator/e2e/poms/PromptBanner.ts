import { type Locator, type Page, expect } from "@playwright/test";
import type { Side } from "./GameBoardSection";

/**
 * The per-side prompt banner. Tags exposed by the React component
 * (`apps/multi-game-simulator/src/games/cyberpunk/components/Prompt/PromptBanner.tsx`):
 *
 *   - data-testid="prompt-banner"             — wrapper
 *   - data-state="select-action" | "select-target" | "mulligan" | "waiting-mulligan"
 *   - data-state="gain-gig" | "steal-gigs" | "optional-trigger" | "choose-trigger"
 *   - data-testid="prompt-banner-title"       — header text
 *   - data-testid="prompt-banner-message"     — body text (target / waiting modes)
 *   - data-testid="prompt-banner-verbs"       — verb-button row
 *   - data-testid={`prompt-verb-${moveId}`}   — individual verb button
 */
export class PromptBanner {
  readonly page: Page;
  readonly side: Side;
  readonly root: Locator;
  readonly title: Locator;
  readonly message: Locator;

  constructor(page: Page, side: Side) {
    this.page = page;
    this.side = side;
    this.root = page.locator(`[data-testid="prompt-banner"][data-side="${side}"]`);
    this.title = this.root.locator('[data-testid="prompt-banner-title"]');
    this.message = this.root.locator('[data-testid="prompt-banner-message"]');
  }

  verbButton(moveId: string): Locator {
    return this.root.locator(`[data-testid="prompt-verb-${moveId}"]`);
  }

  async expectState(state: PromptBannerState): Promise<void> {
    await expect(this.root).toHaveAttribute("data-state", state);
  }

  async expectHidden(): Promise<void> {
    await expect(this.root).toHaveCount(0);
  }
}

type PromptBannerState =
  | "select-action"
  | "select-target"
  | "mulligan"
  | "waiting-mulligan"
  | "gain-gig"
  | "steal-gigs"
  | "optional-trigger"
  | "choose-trigger";
