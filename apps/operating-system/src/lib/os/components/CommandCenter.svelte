<script lang="ts">
  import { Search } from "lucide-svelte";
  import { tick } from "svelte";
  import { fade, scale } from "svelte/transition";
  import { os } from "../os.svelte";

  let searchQuery = $state("");
  let searchInput = $state<HTMLInputElement | null>(null);

  $effect(() => {
    if (!os.isCommandCenterOpen) return;
    tick().then(() => {
      searchInput?.focus();
    });
  });

  let filteredApps = $derived(
    os.desktopIcons.filter((app) =>
      app.title.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  );

  function launchApp(id: string) {
    os.openWindow(id);
    os.isCommandCenterOpen = false;
    searchQuery = "";
  }
</script>

{#if os.isCommandCenterOpen}
  <button
    class="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]"
    onclick={() => (os.isCommandCenterOpen = false)}
    transition:fade={{ duration: 150 }}
    aria-label="Close Command Center"
  ></button>

  <div
    class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-base-100 rounded-box shadow-2xl border border-base-300 overflow-hidden z-[9999] flex flex-col max-h-[80vh]"
    transition:scale={{ duration: 200, start: 0.95 }}
    role="dialog"
    aria-label="Command Center"
    aria-modal="true"
  >
    <div class="p-4 border-b border-base-300">
      <div class="relative">
        <span
          class="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50"
        >
          <Search size={16} />
        </span>
        <input
          type="text"
          placeholder="Search apps..."
          class="input input-bordered w-full pl-10"
          bind:value={searchQuery}
          bind:this={searchInput}
        >
      </div>
    </div>

    <div class="p-4 overflow-y-auto">
      <h3
        class="text-xs font-semibold text-base-content/60 uppercase tracking-wider mb-3"
      >
        Applications
      </h3>

      <div class="grid grid-cols-4 gap-4">
        {#each filteredApps as app (app.id)}
          <button
            class="flex flex-col items-center gap-2 p-3 rounded-box hover:bg-base-200 transition-colors group"
            onclick={() => launchApp(app.id)}
          >
            <div
              class="w-12 h-12 flex items-center justify-center text-3xl bg-base-200 rounded-box group-hover:scale-110 transition-transform"
            >
              {app.icon}
            </div>
            <span class="text-xs font-medium text-base-content/80 text-center"
              >{app.title}</span
            >
          </button>
        {/each}
      </div>

      {#if filteredApps.length === 0}
        <div class="text-center py-8 text-base-content/60">
          No apps found matching "{searchQuery}"
        </div>
      {/if}
    </div>

    <div
      class="p-3 bg-base-200 border-t border-base-300 text-xs text-base-content/60 flex justify-between"
    >
      <span>Operating System v0.1</span>
      <span>{os.windows.length} active windows</span>
    </div>
  </div>
{/if}
