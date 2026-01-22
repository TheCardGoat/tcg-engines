<script lang="ts">
  import { onDestroy } from "svelte";
  import { scale } from "svelte/transition";
  import type { WindowSnapTarget, WindowState } from "../os.svelte";
  import { os } from "../os.svelte";

  let { windowState }: { windowState: WindowState } = $props();

  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };

  function getDragSnapTarget(e: MouseEvent): WindowSnapTarget | null {
    const chromeHeight = 48;
    if (e.clientY < chromeHeight) return null;

    const edgeThresholdPx = 56;
    if (e.clientX <= edgeThresholdPx) return "left";
    if (e.clientX >= window.innerWidth - edgeThresholdPx) return "right";
    return null;
  }

  function handleMouseDown() {
    os.focusWindow(windowState.id);
  }

  function startDrag(e: MouseEvent) {
    if (windowState.isMaximized) return;
    // Only allow dragging from header
    const target = e.target as HTMLElement;
    if (target.closest(".window-controls")) return;

    isDragging = true;
    os.startWindowDrag(windowState.id);
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

    os.setDragSnapTarget(getDragSnapTarget(e));
  }

  function stopDrag() {
    isDragging = false;
    window.removeEventListener("mousemove", handleDrag);
    window.removeEventListener("mouseup", stopDrag);

    const snapTarget = os.dragSnapTarget;
    os.endWindowDrag();
    if (snapTarget) {
      os.snapWindowToHalf(windowState.id, snapTarget);
    }
  }

  type ResizeHandle = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";
  const minWidth = 200;
  const minHeight = 150;

  let isResizing = false;
  let resizeHandle: ResizeHandle | null = null;
  let resizeStart = {
    x: 0,
    y: 0,
    bounds: { x: 0, y: 0, width: 0, height: 0 },
  };

  function startResize(handle: ResizeHandle, e: MouseEvent) {
    e.stopPropagation();
    if (windowState.isMaximized) return;
    os.focusWindow(windowState.id);

    isResizing = true;
    resizeHandle = handle;
    resizeStart = {
      x: e.clientX,
      y: e.clientY,
      bounds: {
        x: windowState.x,
        y: windowState.y,
        width: windowState.width,
        height: windowState.height,
      },
    };
    window.addEventListener("mousemove", handleResize);
    window.addEventListener("mouseup", stopResize);
  }

  function handleResize(e: MouseEvent) {
    if (!isResizing) return;
    if (!resizeHandle) return;

    const dx = e.clientX - resizeStart.x;
    const dy = e.clientY - resizeStart.y;

    let nextX = resizeStart.bounds.x;
    let nextY = resizeStart.bounds.y;
    let nextWidth = resizeStart.bounds.width;
    let nextHeight = resizeStart.bounds.height;

    if (resizeHandle.includes("e")) {
      nextWidth = Math.max(minWidth, resizeStart.bounds.width + dx);
    }
    if (resizeHandle.includes("s")) {
      nextHeight = Math.max(minHeight, resizeStart.bounds.height + dy);
    }
    if (resizeHandle.includes("w")) {
      const proposedWidth = resizeStart.bounds.width - dx;
      const clampedWidth = Math.max(minWidth, proposedWidth);
      const appliedDx = resizeStart.bounds.width - clampedWidth;
      nextX = resizeStart.bounds.x + appliedDx;
      nextWidth = clampedWidth;
    }
    if (resizeHandle.includes("n")) {
      const proposedHeight = resizeStart.bounds.height - dy;
      const clampedHeight = Math.max(minHeight, proposedHeight);
      const appliedDy = resizeStart.bounds.height - clampedHeight;
      nextY = resizeStart.bounds.y + appliedDy;
      nextHeight = clampedHeight;
    }

    os.updateWindowBounds(windowState.id, {
      x: nextX,
      y: nextY,
      width: nextWidth,
      height: nextHeight,
    });
  }

  function stopResize() {
    isResizing = false;
    resizeHandle = null;
    window.removeEventListener("mousemove", handleResize);
    window.removeEventListener("mouseup", stopResize);
  }

  onDestroy(() => {
    window.removeEventListener("mousemove", handleDrag);
    window.removeEventListener("mouseup", stopDrag);
    window.removeEventListener("mousemove", handleResize);
    window.removeEventListener("mouseup", stopResize);
  });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class={"absolute flex flex-col bg-white rounded-lg overflow-hidden border transition-shadow transition-colors duration-150 " +
    (os.activeWindowId === windowState.id
      ? "border-white/40 ring-2 ring-[#f59e0b]/70 shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
      : "border-black/10 shadow-xl")}
  style="
        left: {windowState.x}px; 
        top: {windowState.y}px; 
        width: {windowState.width}px; 
        height: {windowState.height}px; 
        z-index: {windowState.zIndex};
        display: {windowState.isMinimized ? 'none' : 'flex'};
    "
  onmousedown={handleMouseDown}
  in:scale={{ duration: 120, start: 0.98, opacity: 0 }}
  out:scale={{ duration: 110, start: 0.98, opacity: 0 }}
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
      <div class="absolute inset-0 bg-black/5"></div>
    {/if}
  </div>

  {#if !windowState.isMaximized}
    <div
      class="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize z-50"
      onmousedown={(e) => startResize("nw", e)}
    ></div>
    <div
      class="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize z-50"
      onmousedown={(e) => startResize("ne", e)}
    ></div>
    <div
      class="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize z-50"
      onmousedown={(e) => startResize("sw", e)}
    ></div>
    <div
      class="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize z-50"
      onmousedown={(e) => startResize("se", e)}
    ></div>

    <div
      class="absolute top-0 left-3 right-3 h-1 cursor-ns-resize z-40"
      onmousedown={(e) => startResize("n", e)}
    ></div>
    <div
      class="absolute bottom-0 left-3 right-3 h-1 cursor-ns-resize z-40"
      onmousedown={(e) => startResize("s", e)}
    ></div>
    <div
      class="absolute left-0 top-3 bottom-3 w-1 cursor-ew-resize z-40"
      onmousedown={(e) => startResize("w", e)}
    ></div>
    <div
      class="absolute right-0 top-3 bottom-3 w-1 cursor-ew-resize z-40"
      onmousedown={(e) => startResize("e", e)}
    ></div>
  {/if}
</div>
