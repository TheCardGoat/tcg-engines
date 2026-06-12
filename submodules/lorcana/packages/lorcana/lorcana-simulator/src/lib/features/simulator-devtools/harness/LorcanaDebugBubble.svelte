<script lang="ts">
  import { mergeProps } from "bits-ui";
  import ArrowLeftRightIcon from "@lucide/svelte/icons/arrow-left-right";
  import BugIcon from "@lucide/svelte/icons/bug";
  import EyeOffIcon from "@lucide/svelte/icons/eye-off";
  import PanelRightOpenIcon from "@lucide/svelte/icons/panel-right-open";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "$lib/design-system/primitives/dropdown-menu";

  interface BubbleDragState {
    pointerId: number;
    offsetX: number;
    offsetY: number;
    startClientX: number;
    startClientY: number;
    moved: boolean;
  }

  interface DebugBubbleProps {
    isOpen: boolean;
    wrapperElement: HTMLDivElement | null;
    onOpenPanel: () => void;
    onSwapPlayers: () => void;
  }

  const DEBUG_BUBBLE_MARGIN = 16;
  const DEBUG_BUBBLE_DRAG_THRESHOLD = 5;

  const { isOpen, wrapperElement, onOpenPanel, onSwapPlayers }: DebugBubbleProps = $props();

  let bubbleElement = $state<HTMLButtonElement | null>(null);
  let bubblePosition = $state<{ x: number; y: number }>({ x: DEBUG_BUBBLE_MARGIN, y: DEBUG_BUBBLE_MARGIN });
  let bubbleDragState = $state<BubbleDragState | null>(null);
  let bubblePositionInitialized = $state(false);
  let isBubbleHidden = $state(false);
  let suppressBubbleClick = $state(false);

  function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  function getBubbleSize(): { width: number; height: number } {
    const fallback = { width: 64, height: 64 };
    if (!bubbleElement) {
      return fallback;
    }

    return {
      width: bubbleElement.offsetWidth || fallback.width,
      height: bubbleElement.offsetHeight || fallback.height,
    };
  }

  function clampBubblePosition(nextX: number, nextY: number): { x: number; y: number } {
    if (!wrapperElement) {
      return {
        x: Math.max(DEBUG_BUBBLE_MARGIN, nextX),
        y: Math.max(DEBUG_BUBBLE_MARGIN, nextY),
      };
    }

    const { width: bubbleWidth, height: bubbleHeight } = getBubbleSize();
    const maxX = Math.max(DEBUG_BUBBLE_MARGIN, wrapperElement.clientWidth - bubbleWidth - DEBUG_BUBBLE_MARGIN);
    const maxY = Math.max(DEBUG_BUBBLE_MARGIN, wrapperElement.clientHeight - bubbleHeight - DEBUG_BUBBLE_MARGIN);

    return {
      x: clamp(nextX, DEBUG_BUBBLE_MARGIN, maxX),
      y: clamp(nextY, DEBUG_BUBBLE_MARGIN, maxY),
    };
  }

  function initializeBubblePosition(): void {
    if (!wrapperElement || bubblePositionInitialized) {
      return;
    }

    const { width: bubbleWidth, height: bubbleHeight } = getBubbleSize();
    const centeredY = wrapperElement.clientHeight / 2 - bubbleHeight / 2;
    const anchoredRightX = wrapperElement.clientWidth - bubbleWidth - DEBUG_BUBBLE_MARGIN;
    bubblePosition = clampBubblePosition(anchoredRightX, centeredY);
    bubblePositionInitialized = true;
  }

  function handleBubblePointerDown(event: PointerEvent): void {
    const bubbleTarget = event.currentTarget as HTMLElement | null;
    if (!bubbleTarget) {
      return;
    }

    const bubbleRect = bubbleTarget.getBoundingClientRect();
    bubbleDragState = {
      pointerId: event.pointerId,
      offsetX: event.clientX - bubbleRect.left,
      offsetY: event.clientY - bubbleRect.top,
      startClientX: event.clientX,
      startClientY: event.clientY,
      moved: false,
    };
    suppressBubbleClick = false;

    bubbleTarget.setPointerCapture(event.pointerId);
  }

  function handleBubblePointerMove(event: PointerEvent): void {
    if (!wrapperElement || !bubbleDragState || event.pointerId !== bubbleDragState.pointerId) {
      return;
    }

    // Only update position after drag threshold is met for efficiency
    const dragDistance = Math.hypot(
      event.clientX - bubbleDragState.startClientX,
      event.clientY - bubbleDragState.startClientY,
    );

    if (bubbleDragState.moved || dragDistance >= DEBUG_BUBBLE_DRAG_THRESHOLD) {
      if (!bubbleDragState.moved) {
        bubbleDragState = {
          ...bubbleDragState,
          moved: true,
        };
        suppressBubbleClick = true;
      }

      const wrapperRect = wrapperElement.getBoundingClientRect();
      const nextX = event.clientX - wrapperRect.left - bubbleDragState.offsetX;
      const nextY = event.clientY - wrapperRect.top - bubbleDragState.offsetY;
      bubblePosition = clampBubblePosition(nextX, nextY);
    }
  }

  function handleBubblePointerUp(event: PointerEvent): void {
    const bubbleTarget = event.currentTarget as HTMLElement | null;
    if (!bubbleDragState || event.pointerId !== bubbleDragState.pointerId) {
      return;
    }

    const wasDrag = bubbleDragState.moved;
    bubbleDragState = null;

    if (bubbleTarget?.hasPointerCapture(event.pointerId)) {
      bubbleTarget.releasePointerCapture(event.pointerId);
    }

    // Let click handle toggle. Drag release may emit an extra click, suppress that one.
    suppressBubbleClick = wasDrag;
  }

  function handleBubblePointerCancel(event: PointerEvent): void {
    const bubbleTarget = event.currentTarget as HTMLElement | null;
    if (bubbleTarget?.hasPointerCapture(event.pointerId)) {
      bubbleTarget.releasePointerCapture(event.pointerId);
    }
    bubbleDragState = null;
  }

  function handleBubbleClick(event: MouseEvent): void {
    if (suppressBubbleClick) {
      event.preventDefault();
      suppressBubbleClick = false;
      return;
    }
  }

  function handleHideBubble(): void {
    isBubbleHidden = true;
  }

  $effect(() => {
    if (!wrapperElement || !bubbleElement) {
      return;
    }

    initializeBubblePosition();

    const resizeObserver = new ResizeObserver(() => {
      if (bubblePositionInitialized) {
        bubblePosition = clampBubblePosition(bubblePosition.x, bubblePosition.y);
      }
    });

    resizeObserver.observe(wrapperElement);
    resizeObserver.observe(bubbleElement);

    const onWindowResize = () => {
      bubblePosition = clampBubblePosition(bubblePosition.x, bubblePosition.y);
    };

    window.addEventListener("resize", onWindowResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", onWindowResize);
    };
  });
</script>

{#if !isBubbleHidden}
  <DropdownMenu>
    <DropdownMenuTrigger>
      {#snippet child({ props })}
        <button
          bind:this={bubbleElement}
          {...mergeProps(props, {
            class: "debug-bubble",
            "aria-label": "Open simulator debug actions",
            style: `left: ${bubblePosition.x}px; top: ${bubblePosition.y}px;`,
            onpointerdown: handleBubblePointerDown,
            onpointermove: handleBubblePointerMove,
            onpointerup: handleBubblePointerUp,
            onpointercancel: handleBubblePointerCancel,
            onclick: handleBubbleClick,
          })}
        >
          <BugIcon class="debug-bubble__icon" />
        </button>
      {/snippet}
    </DropdownMenuTrigger>

    <DropdownMenuContent
      side="left"
      align="start"
      sideOffset={12}
      avoidCollisions
      class="w-60 rounded-[18px] border-sky-300/20 bg-slate-950/95 p-2 text-slate-50 shadow-[0_22px_60px_rgba(0,0,0,0.45),0_8px_18px_rgba(11,79,173,0.2)] backdrop-blur-xl"
    >
      <DropdownMenuItem
        class="grid grid-cols-[auto_1fr] items-center gap-3 rounded-[14px] px-3 py-3 data-highlighted:bg-sky-500/15"
        disabled={isOpen}
        onSelect={onOpenPanel}
      >
        <PanelRightOpenIcon class="size-4 text-sky-300" />
        <span class="debug-menu__item-copy">
          <span class="debug-menu__item-label">{isOpen ? "Debug panel open" : "Open debug panel"}</span>
          <span class="debug-menu__item-hint">
            {isOpen ? "Already visible" : "Show the inspector sidebar"}
          </span>
        </span>
      </DropdownMenuItem>

      <DropdownMenuItem
        class="grid grid-cols-[auto_1fr] items-center gap-3 rounded-[14px] px-3 py-3 data-highlighted:bg-sky-500/15"
        onSelect={onSwapPlayers}
      >
        <ArrowLeftRightIcon class="size-4 text-sky-300" />
        <span class="debug-menu__item-copy">
          <span class="debug-menu__item-label">Swap players</span>
          <span class="debug-menu__item-hint">Toggle between player-one and player-two</span>
        </span>
      </DropdownMenuItem>

      <DropdownMenuItem
        class="grid grid-cols-[auto_1fr] items-center gap-3 rounded-[14px] px-3 py-3 data-highlighted:bg-sky-500/15"
        onSelect={handleHideBubble}
      >
        <EyeOffIcon class="size-4 text-sky-300" />
        <span class="debug-menu__item-copy">
          <span class="debug-menu__item-label">Hide bubble</span>
          <span class="debug-menu__item-hint">Dismiss until the page reloads</span>
        </span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
{/if}

<style>
  .debug-bubble {
    position: absolute;
    z-index: 2147483647;
    width: 64px;
    height: 64px;
    border: 1px solid rgba(146, 194, 255, 0.5);
    border-radius: 999px;
    background: radial-gradient(circle at 30% 25%, #4cb5ff, #1566cc 65%);
    box-shadow:
      0 12px 30px rgba(11, 79, 173, 0.44),
      inset 0 1px 0 rgba(255, 255, 255, 0.5);
    color: #f3f8ff;
    cursor: grab;
    touch-action: none;
    user-select: none;
    pointer-events: auto;
    display: grid;
    place-items: center;
    outline: none;
    transition:
      transform 140ms ease,
      box-shadow 140ms ease,
      border-color 140ms ease;
  }

  .debug-bubble:hover {
    transform: translateY(-1px) scale(1.02);
    box-shadow:
      0 16px 34px rgba(11, 79, 173, 0.48),
      inset 0 1px 0 rgba(255, 255, 255, 0.56);
  }

  .debug-bubble:focus-visible {
    border-color: rgba(213, 234, 255, 0.95);
    box-shadow:
      0 0 0 4px rgba(86, 167, 255, 0.28),
      0 16px 34px rgba(11, 79, 173, 0.48),
      inset 0 1px 0 rgba(255, 255, 255, 0.56);
  }

  .debug-bubble:active {
    cursor: grabbing;
  }

  .debug-bubble__icon {
    width: 1.35rem;
    height: 1.35rem;
    filter: drop-shadow(0 1px 2px rgba(6, 34, 82, 0.35));
  }

  .debug-menu__item-copy {
    display: grid;
    gap: 0.12rem;
  }

  .debug-menu__item-label {
    font-family: "Trebuchet MS", "Segoe UI", sans-serif;
    font-size: 0.9rem;
    font-weight: 700;
    line-height: 1.15;
  }

  .debug-menu__item-hint {
    font-family: "Trebuchet MS", "Segoe UI", sans-serif;
    font-size: 0.74rem;
    line-height: 1.2;
    color: rgba(220, 234, 255, 0.72);
  }

  @media (max-width: 720px) {
    .debug-bubble {
      width: 58px;
      height: 58px;
    }

    :global([data-slot="dropdown-menu-content"]) {
      width: 220px;
    }
  }
</style>
