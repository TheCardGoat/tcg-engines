<script lang="ts">
  import type { WindowState } from "../os.svelte";
  import { os } from "../os.svelte";

  let { windowState }: { windowState: WindowState } = $props();

  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };
  let windowElement: HTMLElement;

  function handleMouseDown(e: MouseEvent) {
    os.focusWindow(windowState.id);
  }

  function startDrag(e: MouseEvent) {
    if (windowState.isMaximized) return;
    // Only allow dragging from header
    const target = e.target as HTMLElement;
    if (target.closest(".window-controls")) return;

    isDragging = true;
    dragOffset = {
      x: e.clientX - windowState.x,
      y: e.clientY - windowState.y,
    };
    window.addEventListener("mousemove", handleDrag);
    window.addEventListener("mouseup", stopDrag);
  }

  function handleDrag(e: MouseEvent) {
    if (!isDragging) return;
    os.updateWindowBounds(windowState.id, {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    });
  }

  function stopDrag() {
    isDragging = false;
    window.removeEventListener("mousemove", handleDrag);
    window.removeEventListener("mouseup", stopDrag);
  }

  // Resizing logic can be added later or now. Let's add basic bottom-right resize.
  let isResizing = false;
  let resizeStart = { x: 0, y: 0, width: 0, height: 0 };

  function startResize(e: MouseEvent) {
    e.stopPropagation();
    isResizing = true;
    resizeStart = {
      x: e.clientX,
      y: e.clientY,
      width: windowState.width,
      height: windowState.height,
    };
    window.addEventListener("mousemove", handleResize);
    window.addEventListener("mouseup", stopResize);
  }

  function handleResize(e: MouseEvent) {
    if (!isResizing) return;
    const dx = e.clientX - resizeStart.x;
    const dy = e.clientY - resizeStart.y;
    os.updateWindowBounds(windowState.id, {
      width: Math.max(200, resizeStart.width + dx),
      height: Math.max(150, resizeStart.height + dy),
    });
  }

  function stopResize() {
    isResizing = false;
    window.removeEventListener("mousemove", handleResize);
    window.removeEventListener("mouseup", stopResize);
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="absolute flex flex-col bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 transition-shadow duration-200"
  style="
        left: {windowState.x}px; 
        top: {windowState.y}px; 
        width: {windowState.width}px; 
        height: {windowState.height}px; 
        z-index: {windowState.zIndex};
        display: {windowState.isMinimized ? 'none' : 'flex'};
    "
  onmousedown={handleMouseDown}
>
  <!-- Title Bar -->
  <div
    class="h-9 bg-gray-100 border-b border-gray-200 flex items-center justify-between px-3 select-none cursor-default"
    onmousedown={startDrag}
    ondblclick={() => os.maximizeWindow(windowState.id)}
  >
    <div class="flex items-center gap-2">
      {#if windowState.icon}
        <span class="text-lg">{windowState.icon}</span>
      {/if}
      <span class="text-sm font-medium text-gray-700">{windowState.title}</span>
    </div>

    <div class="window-controls flex items-center gap-2">
      <button
        class="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 border border-yellow-500/50"
        onclick={(e) => { e.stopPropagation(); os.minimizeWindow(windowState.id); }}
        aria-label="Minimize"
      ></button>
      <button
        class="w-3 h-3 rounded-full bg-green-400 hover:bg-green-500 border border-green-500/50"
        onclick={(e) => { e.stopPropagation(); os.maximizeWindow(windowState.id); }}
        aria-label="Maximize"
      ></button>
      <button
        class="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 border border-red-500/50"
        onclick={(e) => { e.stopPropagation(); os.closeWindow(windowState.id); }}
        aria-label="Close"
      ></button>
    </div>
  </div>

  <!-- Content -->
  <div class="flex-1 overflow-auto bg-white relative">
    <windowState.component />

    <!-- Overlay to capture clicks when not focused, ensuring click-to-focus works smoothly -->
    {#if os.activeWindowId !== windowState.id}
      <div class="absolute inset-0 bg-transparent"></div>
    {/if}
  </div>

  <!-- Resize Handle (Bottom Right) -->
  {#if !windowState.isMaximized}
    <div
      class="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50 hover:bg-gray-200 rounded-tl"
      onmousedown={startResize}
    ></div>
  {/if}
</div>
