<script lang="ts">
  import { os } from "../os.svelte";

  // Simple clock
  let time = $state(new Date());

  $effect(() => {
    const interval = setInterval(() => {
      time = new Date();
    }, 1000);
    return () => clearInterval(interval);
  });

  function toggleWindow(id: string) {
    const win = os.windows.find((w) => w.id === id);
    if (win) {
      if (win.id === os.activeWindowId && !win.isMinimized) {
        os.minimizeWindow(id);
      } else {
        os.focusWindow(id);
      }
    }
  }
</script>

<div
  class="h-12 bg-white/80 backdrop-blur-md border-t border-gray-200 fixed bottom-0 left-0 right-0 flex items-center justify-between px-4 z-[9999]"
  role="navigation"
  aria-label="Taskbar"
>
  <div class="flex items-center gap-4">
    <!-- Start Button -->
    <button
      class="p-2 rounded hover:bg-gray-100 transition-colors {os.isCommandCenterOpen ? 'bg-gray-200' : ''}"
      onclick={() => os.toggleCommandCenter()}
      aria-label={os.isCommandCenterOpen ? 'Close Command Center' : 'Open Command Center'}
    >
      <span class="text-xl">🐐</span>
    </button>

    <!-- Open Windows -->
    <div class="flex items-center gap-2">
      {#each os.windows as win (win.id)}
        <button
          class="
                        px-3 py-1.5 rounded-md flex items-center gap-2 transition-all
                        {os.activeWindowId === win.id && !win.isMinimized ? 'bg-gray-200 shadow-inner' : 'hover:bg-gray-100'}
                        {win.isMinimized ? 'opacity-70' : 'opacity-100'}
                    "
          onclick={() => toggleWindow(win.id)}
        >
          <span>{win.icon}</span>
          <span class="text-sm truncate max-w-[150px]">{win.title}</span>
        </button>
      {/each}
    </div>
  </div>

  <!-- System Tray -->
  <div class="flex items-center gap-4 text-sm text-gray-600">
    <span
      >{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span
    >
  </div>
</div>
