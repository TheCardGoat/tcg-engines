<script lang="ts">
  import { Copy, Moon, Sun } from "lucide-svelte";
  import { tick } from "svelte";
  import { os } from "../os.svelte";
  import { theme } from "$lib/theme.svelte";

  let shareInput = $state<HTMLInputElement | null>(null);
  let shareValue = $state("");
  let copyStatus = $state<"idle" | "copied" | "error">("idle");
  let copyResetTimer = $state<ReturnType<typeof globalThis.setTimeout> | null>(
    null,
  );

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
      copyStatus = "copied";
    } catch {
      copyStatus = "error";
      return;
    } finally {
      if (copyResetTimer) globalThis.clearTimeout(copyResetTimer);
      copyResetTimer = globalThis.setTimeout(() => {
        copyStatus = "idle";
        copyResetTimer = null;
      }, 2000);
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
    class="fixed top-12 right-0 bottom-0 w-[360px] max-w-[90vw] bg-base-100 rounded-tl-2xl border-l border-base-300 shadow-2xl z-[9999] flex flex-col"
    aria-label="Notifications"
  >
    <div
      class="px-4 py-3 border-b border-base-300 flex items-center justify-between gap-3"
    >
      <div class="text-sm font-semibold text-base-content/80">
        Active windows
      </div>
      <div class="flex items-center gap-3">
        <button
          class="btn btn-ghost btn-xs"
          onclick={() => os.closeAllWindows()}
        >
          Close all
        </button>
        <button
          class="btn btn-ghost btn-sm btn-square"
          aria-label="Close"
          onclick={close}
        >
          <span class="text-lg text-base-content/70">›</span>
        </button>
      </div>
    </div>

    <div class="p-3 flex-1 overflow-auto">
      {#if activeWindows.length === 0}
        <div class="p-3 text-sm text-base-content/60">No active windows</div>
      {:else}
        <div class="space-y-2">
          {#each activeWindows as win (win.id)}
            <button
              class="btn btn-ghost w-full justify-between"
              onclick={() => {
                os.focusWindow(win.id);
                os.closeRightPanel();
              }}
            >
              <span class="text-sm font-semibold text-base-content/80 truncate">
                {win.title}
              </span>
              <span class="text-base-content/50">›</span>
            </button>
          {/each}
        </div>
      {/if}
    </div>

    <div class="p-4 border-t border-base-300 space-y-5">
      <div class="space-y-2">
        <div class="text-sm font-semibold text-base-content/80">Appearance</div>
        <div class="flex items-center justify-between gap-3">
          <div class="text-xs text-base-content/60">Theme</div>
          <button
            class="btn btn-ghost btn-sm gap-2"
            onclick={() => theme.toggle()}
            aria-label="Toggle theme"
          >
            {#if theme.current === "dark"}
              <Moon size={16} class="text-base-content/70" />
              <span class="text-xs">Dark</span>
            {:else}
              <Sun size={16} class="text-base-content/70" />
              <span class="text-xs">Light</span>
            {/if}
          </button>
        </div>
      </div>

      <div class="space-y-2">
        <div class="text-sm font-semibold text-base-content/80">
          Share your windows
        </div>
        <div class="mt-1 text-xs text-base-content/60">
          Copy the URL for this OS page.
        </div>

        <div class="mt-3 flex items-center gap-2">
          <input
            class="input input-bordered flex-1 font-mono text-xs"
            readonly
            value={shareValue}
            bind:this={shareInput}
            aria-label="Share URL"
          >
          <button
            class="btn btn-ghost btn-square"
            aria-label="Copy"
            onclick={copyShareLink}
          >
            <Copy size={18} class="text-base-content/70" />
          </button>
        </div>

        {#if copyStatus === "copied"}
          <div class="mt-2 text-xs text-success">Copied</div>
        {:else if copyStatus === "error"}
          <div class="mt-2 text-xs text-error">Copy failed</div>
        {/if}

        <div class="mt-2 text-xs text-base-content/50">
          Tip: Press
          <span class="px-1.5 py-0.5 rounded bg-base-200 border border-base-300"
            >Shift</span
          >
          <span class="px-1.5 py-0.5 rounded bg-base-200 border border-base-300"
            >C</span
          >
          to copy instantly.
        </div>
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
