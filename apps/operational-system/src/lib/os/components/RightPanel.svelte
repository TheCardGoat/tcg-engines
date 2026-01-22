<script lang="ts">
  import { os } from "../os.svelte";
  import { tick } from "svelte";

  let shareInput = $state<HTMLInputElement | null>(null);
  let shareValue = $state("");

  let activeWindows = $derived(
    os.windows
      .filter((w) => !w.isMinimized)
      .slice()
      .sort((a, b) => b.zIndex - a.zIndex),
  );

  async function copyShareLink() {
    if (typeof navigator === "undefined") return;
    const text = shareValue;
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
  }

  $effect(() => {
    if (!os.isRightPanelOpen) return;
    if (typeof window !== "undefined") {
      shareValue = window.location.href;
    }
    tick().then(() => {
      shareInput?.select();
    });
  });

  function close() {
    os.closeRightPanel();
  }
</script>

{#if os.isRightPanelOpen}
  <button
    class="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]"
    onclick={close}
    aria-label="Close panel"
  ></button>

  <aside
    class="fixed top-12 right-0 bottom-0 w-[360px] max-w-[90vw] bg-white rounded-tl-2xl border-l border-black/10 shadow-2xl z-[9999] flex flex-col"
    aria-label="Notifications"
  >
    <div
      class="px-4 py-3 border-b border-black/10 flex items-center justify-between gap-3"
    >
      <div class="text-sm font-semibold text-black/80">Active windows</div>
      <div class="flex items-center gap-3">
        <button
          class="text-xs text-black/50 hover:text-black/70 transition-colors"
          onclick={() => os.closeAllWindows()}
        >
          Close all
        </button>
        <button
          class="h-8 w-8 grid place-items-center rounded-md hover:bg-black/5 transition-colors"
          aria-label="Close"
          onclick={close}
        >
          <span class="text-lg">›</span>
        </button>
      </div>
    </div>

    <div class="p-3 flex-1 overflow-auto">
      {#if os.windows.length === 0}
        <div class="p-3 text-sm text-black/50">No active windows</div>
      {:else}
        <div class="space-y-2">
          {#each activeWindows as win (win.id)}
            <button
              class="w-full px-3 py-2 rounded-xl bg-black/5 hover:bg-black/10 transition-colors text-left flex items-center justify-between gap-2"
              onclick={() => {
                os.focusWindow(win.id);
                os.closeRightPanel();
              }}
            >
              <span class="text-sm font-semibold text-black/80 truncate">
                {win.title}
              </span>
              <span class="text-black/40">›</span>
            </button>
          {/each}
        </div>
      {/if}
    </div>

    <div class="p-4 border-t border-black/10">
      <div class="text-sm font-semibold text-black/80">Share your windows</div>
      <div class="mt-1 text-xs text-black/50">
        Copy the URL to share your open windows & layout.
      </div>

      <div class="mt-3 flex items-center gap-2">
        <input
          class="flex-1 h-10 px-3 rounded-xl bg-black/5 border border-black/10 font-mono text-xs text-black/70"
          readonly
          value={shareValue}
          bind:this={shareInput}
          aria-label="Share URL"
        >
        <button
          class="h-10 w-10 grid place-items-center rounded-xl bg-black/5 hover:bg-black/10 transition-colors"
          aria-label="Copy"
          onclick={copyShareLink}
        >
          <span class="text-lg">⧉</span>
        </button>
      </div>

      <div class="mt-2 text-xs text-black/40">
        Tip: Press
        <span class="px-1.5 py-0.5 rounded bg-black/5 border border-black/10"
          >Shift</span
        >
        <span class="px-1.5 py-0.5 rounded bg-black/5 border border-black/10"
          >C</span
        >
        to copy instantly.
      </div>
    </div>
  </aside>
{/if}

<svelte:window
  onkeydown={(e) => {
    if (!os.isRightPanelOpen) return;
    if (e.key === "Escape") close();
    if (e.shiftKey && e.key.toLowerCase() === "c") {
      e.preventDefault();
      copyShareLink();
    }
  }}
/>
