<script lang="ts">
  import { onMount } from "svelte";

  // Import Apps
  import BrowserApp from "../apps/BrowserApp.svelte";
  import HelloApp from "../apps/HelloApp.svelte";
  import { os } from "../os.svelte";
  import CommandCenter from "./CommandCenter.svelte";
  import DesktopIcon from "./DesktopIcon.svelte";
  import RightPanel from "./RightPanel.svelte";
  import Topbar from "./Topbar.svelte";
  import Window from "./Window.svelte";

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
    class="absolute inset-0 p-4 pt-16 grid grid-flow-col grid-rows-[repeat(auto-fill,6rem)] gap-4 content-start items-start justify-start w-fit"
  >
    {#each os.desktopIcons as app (app.id)}
      <DesktopIcon {app} />
    {/each}
  </div>

  <!-- Windows Layer -->
  <div class="absolute inset-0 pointer-events-none">
    {#if os.dragSnapTarget}
      <div
        class={"absolute top-12 bottom-0 border border-white bg-white/20 backdrop-blur-sm z-[9990] transition-opacity duration-150 " +
          (os.dragSnapTarget === "left" ? "left-0 right-1/2" : "left-1/2 right-0")}
      ></div>
    {/if}

    {#each os.windows as win (win.id)}
      <!-- Pointer events need to be enabled for windows specifically -->
      <div class="pointer-events-auto contents">
        <Window windowState={win} />
      </div>
    {/each}
  </div>

  <Topbar />

  <!-- Command Center -->
  <CommandCenter />

  <RightPanel />
</div>
