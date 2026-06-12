<script lang="ts">
  import { m } from "$lib/i18n/messages.js";
  import CardTargetDialog from "./CardTargetDialog.svelte";
  import type {
    LorcanaCardSnapshot,
    LorcanaPlayerSide,
  } from "@/features/simulator/model/contracts.js";
  import type { LorcanaCardTarget } from "@tcg/lorcana-engine";

  interface InkwellDialogProps {
    open?: boolean;
    cards: LorcanaCardSnapshot[];
    playerSide: LorcanaPlayerSide;
    viewerSide?: LorcanaPlayerSide | null;
    target: LorcanaCardTarget;
  }

  let {
    open = $bindable(false),
    cards,
    playerSide,
    viewerSide = null,
    target,
  }: InkwellDialogProps = $props();

  const playerLabel = $derived(
    playerSide === "playerOne" ? m["sim.inkwell.playerOne"]({}) : m["sim.inkwell.playerTwo"]({}),
  );
</script>

<CardTargetDialog
  bind:open={open}
  {cards}
  {playerSide}
  {viewerSide}
  {target}
  titleText={m["sim.inkwell.dialog.title"]({ playerLabel })}
  emptyAllText={m["sim.inkwell.dialog.emptyAll"]({})}
  emptyNoMatchText={m["sim.inkwell.dialog.emptyNoMatch"]({})}
  closeButtonLabel={m["sim.inkwell.dialog.close"]({})}
  closeButtonAriaLabel={m["sim.inkwell.dialog.closeAria"]({})}
  summaryFormatter={(matchCount, totalCount) =>
    m["sim.inkwell.dialog.summary"]({ matchCount, totalCount })}
/>
