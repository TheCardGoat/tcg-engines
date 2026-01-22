<script lang="ts">
  import { os } from "../os.svelte";
  import Window from "./Window.svelte";
  import Taskbar from "./Taskbar.svelte";
  import DesktopIcon from "./DesktopIcon.svelte";
  import CommandCenter from "./CommandCenter.svelte";
  import { onMount } from "svelte";

  // Import Apps
  import HelloApp from "../apps/HelloApp.svelte";
  import BrowserApp from "../apps/BrowserApp.svelte";

  onMount(() => {
    // Register default apps if empty
    if (os.desktopIcons.length === 0) {
      os.registerApp({
        id: "hello",
        title: "Hello World",
        icon: "👋",
        component: HelloApp,
        defaultWidth: 400,
        defaultHeight: 300,
      });
      os.registerApp({
        id: "browser",
        title: "Web Browser",
        icon: "🌐",
        component: BrowserApp,
        defaultWidth: 800,
        defaultHeight: 600,
      });
    }

    os.hydrateFromStorage();
  });
</script>

<div
  class="fixed inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden select-none"
>
  <!-- Desktop Icons Grid -->
  <div
    class="absolute inset-0 p-4 grid grid-flow-col grid-rows-[repeat(auto-fill,6rem)] gap-4 content-start items-start justify-start w-fit"
  >
    {#each os.desktopIcons as app (app.id)}
      <DesktopIcon {app} />
    {/each}
  </div>

  <!-- Windows Layer -->
  <div class="absolute inset-0 pointer-events-none">
    {#each os.windows as win (win.id)}
      <!-- Pointer events need to be enabled for windows specifically -->
      <div class="pointer-events-auto contents">
        <Window windowState={win} />
      </div>
    {/each}
  </div>

  <!-- Taskbar -->
  <Taskbar />

  <!-- Command Center -->
  <CommandCenter />
</div>
