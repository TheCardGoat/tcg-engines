<script lang="ts">
  import { m } from "$lib/i18n/messages.js";
  import * as Dialog from "$lib/design-system/primitives/dialog";
  import SimulatorSupportActions from "@/features/simulator/support/SimulatorSupportActions.svelte";
  import SupportProcessNote from "@/features/simulator/support/SupportProcessNote.svelte";

  interface SimulatorSupportDialogProps {
    open?: boolean;
    onOpenFeedback?: () => void;
    onOpenBugReport?: () => void;
  }

  let {
    open = $bindable(false),
    onOpenFeedback,
    onOpenBugReport,
  }: SimulatorSupportDialogProps = $props();

  function handleOpenFeedback(): void {
    open = false;
    onOpenFeedback?.();
  }

  function handleOpenBugReport(): void {
    open = false;
    onOpenBugReport?.();
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Portal>
    <Dialog.Overlay class="player-settings-overlay" />
    <Dialog.Content class="player-settings-dialog" showCloseButton={false}>
      <Dialog.Header class="gap-1">
        <Dialog.Title class="text-base font-semibold tracking-tight text-slate-100">
          {m["sim.support.title"]({})}
        </Dialog.Title>
        <Dialog.Description class="text-sm text-slate-400">
          {m["sim.support.description"]({})}
        </Dialog.Description>
      </Dialog.Header>

      <SimulatorSupportActions
        onOpenBugReport={handleOpenBugReport}
        onOpenFeedback={handleOpenFeedback}
      />
      <SupportProcessNote />

      <Dialog.Footer>
        <Dialog.Close class="player-settings-close" aria-label={m["sim.settings.closeAria"]({})}>
          {m["sim.settings.close"]({})}
        </Dialog.Close>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<style>
  :global(.player-settings-overlay) {
    position: fixed;
    inset: 0;
    z-index: 50;
    background: rgba(2, 8, 18, 0.7);
    backdrop-filter: blur(3px);
  }

  :global(.player-settings-dialog) {
    max-width: min(92vw, 420px) !important;
    border-radius: 0.95rem;
    border: 1px solid rgba(108, 145, 192, 0.35) !important;
    background: rgba(9, 16, 28, 0.96) !important;
    box-shadow: 0 18px 48px rgba(2, 8, 18, 0.5);
    padding: 1.25rem;
    color: #e5edf7 !important;
  }

  :global(.player-settings-close) {
    border-radius: 0.5rem;
    border: 1px solid rgba(125, 211, 252, 0.5);
    background: rgba(21, 48, 77, 0.8);
    color: #dbeafe;
    padding: 0.4rem 0.8rem;
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  :global(.player-settings-close:hover),
  :global(.player-settings-close:focus-visible) {
    background: rgba(34, 74, 117, 0.95);
    border-color: rgba(191, 219, 254, 0.82);
    outline: none;
  }
</style>
