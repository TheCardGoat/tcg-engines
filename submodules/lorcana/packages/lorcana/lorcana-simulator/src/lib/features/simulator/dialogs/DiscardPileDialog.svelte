<script lang="ts">
  import { m } from "$lib/i18n/messages.js";
  import CardTargetDialog from "./CardTargetDialog.svelte";
  import type {
    LorcanaCardSnapshot,
    LorcanaPlayerSide,
  } from "@/features/simulator/model/contracts.js";
  import type { LorcanaCardTarget } from "@tcg/lorcana-engine";

  interface DiscardPileDialogProps {
    open?: boolean;
    cards: LorcanaCardSnapshot[];
    playerSide: LorcanaPlayerSide;
    viewerSide?: LorcanaPlayerSide | null;
    playableCardIds?: string[];
    target: LorcanaCardTarget;
    selectable?: boolean;
    selectedCardIds?: string[];
  }

  let {
    open = $bindable(false),
    cards,
    playerSide,
    viewerSide = null,
    playableCardIds = [],
    target,
    selectable = false,
    selectedCardIds = [],
  }: DiscardPileDialogProps = $props();

  const playerLabel = $derived(
    playerSide === "playerOne" ? m["sim.discard.playerOne"]({}) : m["sim.discard.playerTwo"]({}),
  );
</script>

<CardTargetDialog
  bind:open={open}
  {cards}
  {playerSide}
  {viewerSide}
  {playableCardIds}
  {target}
  {selectable}
  {selectedCardIds}
  titleText={m["sim.discard.dialog.title"]({ playerLabel })}
  emptyAllText={m["sim.discard.dialog.emptyAll"]({})}
  emptyNoMatchText={m["sim.discard.dialog.emptyNoMatch"]({})}
  closeButtonLabel={m["sim.discard.dialog.close"]({})}
  closeButtonAriaLabel={m["sim.discard.dialog.closeAria"]({})}
  summaryFormatter={(matchCount, totalCount) =>
    m["sim.discard.dialog.summary"]({ matchCount, totalCount })}
/>
