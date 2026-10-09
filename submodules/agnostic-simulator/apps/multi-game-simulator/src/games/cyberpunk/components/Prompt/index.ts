/**
 * Cyberpunk prompt surface map (8 relevant components; not 8 interchangeable skins):
 *
 * Player-facing in the current board:
 * 1. PromptBanner (./PromptBanner.tsx) — the inline board decision surface for
 *    actions and spatial choices. Its source-card title uses CardNameToken;
 *    Kerry's Keep/Reroll choice belongs here, like Take a Gig Die.
 * 2. ChoiceModal (./ChoiceModal.tsx) — focused sheet for dense, private-zone,
 *    or multi-step choices. Do not route a known binary Gig decision here.
 * 3. PaymentSelectionPrompt (../PaymentSelection/PaymentSelectionPrompt.tsx) —
 *    replaces the board prompt while the player chooses payment sources.
 *
 * Supporting surfaces, not alternative player-choice skins:
 * 4. InteractionResolutionPrompt (@tcg/simulator-ui) — this game's PromptBanner
 *    uses it to narrate an opponent's pending choice in view mode. It is a
 *    reusable active prompt in other games, but not the Cyberpunk board banner.
 * 5. InteractionPanel (@tcg/simulator-ui) — hidden adapter/debug projection in
 *    CyberpunkInteractionPanel (also a generic-renderer fallback in
 *    BoardShared.page.tsx); it is not the native Cyberpunk decision UI.
 *
 * Exported shared primitives, not mounted for Cyberpunk player decisions:
 * 6. PromptBanner, 7. ChoiceModal, 8. ChoiceResolutionOverlay
 *    (packages/simulator-ui/src/components). These names overlap with native
 *    components above; check imports and mounts before choosing a surface.
 *
 * Desktop mount: ../CyberpunkInteractionPanel.tsx. Mobile mount:
 * ../GameBoard/MobileBoard.tsx. Keep this map and those mounts in sync.
 */
export { PromptBanner } from "./PromptBanner";
export { ChoiceModal } from "./ChoiceModal";
