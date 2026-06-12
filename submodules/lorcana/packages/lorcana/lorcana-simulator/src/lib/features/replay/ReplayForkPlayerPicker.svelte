<script lang="ts">
  import { Button } from "$lib/design-system/primitives/button";
  import * as Dialog from "$lib/design-system/primitives/dialog";
  import { GitFork } from "@lucide/svelte";

  interface Props {
    open: boolean;
    player1Label: string;
    player2Label: string;
    /** Which player is the active actor at the current step. */
    activePlayerSide?: "playerOne" | "playerTwo";
    onfork: (humanSide: "playerOne" | "playerTwo") => void;
    oncancel: () => void;
  }

  let { open = $bindable(), player1Label, player2Label, activePlayerSide, onfork, oncancel }: Props = $props();

  function handleOpenChange(value: boolean) {
    if (!value) oncancel();
  }
</script>

<Dialog.Root bind:open onOpenChange={handleOpenChange}>
  <Dialog.Portal>
    <Dialog.Overlay class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
    <Dialog.Content class="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-slate-950/95 p-6 shadow-2xl backdrop-blur-md">
      <Dialog.Header class="mb-4">
        <Dialog.Title class="flex items-center gap-2 text-lg font-semibold text-slate-100">
          <GitFork class="size-5 text-amber-400" />
          Play from Here
        </Dialog.Title>
        <Dialog.Description class="text-sm text-slate-400">
          Choose which player to control. The other player will be handled by the AI.
        </Dialog.Description>
      </Dialog.Header>

      <div class="flex flex-col gap-2">
        <Button
          variant="outline"
          class="justify-start gap-3 border-white/10 bg-slate-900/60 text-slate-200 hover:border-amber-400/40 hover:bg-slate-800/80 hover:text-slate-100 {activePlayerSide === 'playerOne' ? 'border-amber-400/30 ring-1 ring-amber-400/20' : ''}"
          onclick={() => onfork("playerOne")}
        >
          <span class="flex size-6 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-400">1</span>
          <span class="flex-1 text-left">{player1Label}</span>
          {#if activePlayerSide === "playerOne"}
            <span class="text-xs text-amber-400">Active</span>
          {/if}
        </Button>

        <Button
          variant="outline"
          class="justify-start gap-3 border-white/10 bg-slate-900/60 text-slate-200 hover:border-amber-400/40 hover:bg-slate-800/80 hover:text-slate-100 {activePlayerSide === 'playerTwo' ? 'border-amber-400/30 ring-1 ring-amber-400/20' : ''}"
          onclick={() => onfork("playerTwo")}
        >
          <span class="flex size-6 items-center justify-center rounded-full bg-rose-500/20 text-xs font-bold text-rose-400">2</span>
          <span class="flex-1 text-left">{player2Label}</span>
          {#if activePlayerSide === "playerTwo"}
            <span class="text-xs text-amber-400">Active</span>
          {/if}
        </Button>
      </div>

      <Dialog.Footer class="mt-4">
        <Button
          variant="ghost"
          size="sm"
          class="w-full text-slate-500 hover:text-slate-300"
          onclick={oncancel}
        >
          Cancel
        </Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
