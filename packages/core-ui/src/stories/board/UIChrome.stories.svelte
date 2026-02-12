<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import UIChrome from "$lib/components/board/UIChrome.svelte";

  const { Story } = defineMeta({
    argTypes: {
      position: {
        control: { type: "select" },
        options: [
          "top-left",
          "top-right",
          "bottom-left",
          "bottom-right",
          "top-center",
          "bottom-center",
          "left-center",
          "right-center",
        ],
      },
      zIndex: { control: "number" },
    },
    component: UIChrome,
    parameters: {
      layout: "fullscreen",
    },
    tags: ["autodocs"],
    title: "Board/UIChrome",
  });
</script>

<!-- Note: UIChrome uses position: fixed, so it will appear relative to the viewport -->

<!-- Top Right (default) -->
<Story name="Top Right">
  <div class="relative w-full h-screen bg-base-300">
    <UIChrome position="top-right">
      <div class="bg-base-100 shadow-lg rounded-lg p-4">
        <p class="text-base-content font-bold">Life: 20</p>
      </div>
    </UIChrome>
    <div class="flex items-center justify-center h-full">
      <p class="text-base-content/50">Game Board Area</p>
    </div>
  </div>
</Story>

<!-- Top Left -->
<Story name="Top Left">
  <div class="relative w-full h-screen bg-base-300">
    <UIChrome position="top-left">
      <div class="bg-base-100 shadow-lg rounded-lg p-4">
        <p class="text-base-content font-bold">Menu</p>
      </div>
    </UIChrome>
    <div class="flex items-center justify-center h-full">
      <p class="text-base-content/50">Game Board Area</p>
    </div>
  </div>
</Story>

<!-- Bottom Center -->
<Story name="Bottom Center">
  <div class="relative w-full h-screen bg-base-300">
    <UIChrome position="bottom-center">
      <div class="bg-base-100 shadow-lg rounded-lg p-4 flex gap-2">
        <button class="btn btn-primary btn-sm">Pass Turn</button>
        <button class="btn btn-secondary btn-sm">End Phase</button>
      </div>
    </UIChrome>
    <div class="flex items-center justify-center h-full">
      <p class="text-base-content/50">Game Board Area</p>
    </div>
  </div>
</Story>

<!-- Multiple UI Elements -->
<Story name="Multiple Elements">
  <div class="relative w-full h-screen bg-base-300">
    <!-- Player life -->
    <UIChrome position="bottom-right">
      <div class="bg-base-100 shadow-lg rounded-lg p-4">
        <p class="text-xs text-base-content/70">Your Life</p>
        <p class="text-2xl font-bold text-success">20</p>
      </div>
    </UIChrome>

    <!-- Opponent life -->
    <UIChrome position="top-left">
      <div class="bg-base-100 shadow-lg rounded-lg p-4">
        <p class="text-xs text-base-content/70">Opponent</p>
        <p class="text-2xl font-bold text-error">18</p>
      </div>
    </UIChrome>

    <!-- Turn indicator -->
    <UIChrome position="top-center">
      <div
        class="bg-primary text-primary-content shadow-lg rounded-full px-6 py-2"
      >
        <p class="font-bold">Your Turn</p>
      </div>
    </UIChrome>

    <!-- Action buttons -->
    <UIChrome position="bottom-center">
      <div class="bg-base-100 shadow-lg rounded-lg p-2 flex gap-2">
        <button class="btn btn-primary btn-sm">Attack</button>
        <button class="btn btn-secondary btn-sm">Pass</button>
        <button class="btn btn-ghost btn-sm">Settings</button>
      </div>
    </UIChrome>

    <div class="flex items-center justify-center h-full">
      <p class="text-base-content/50">Game Board Area</p>
    </div>
  </div>
</Story>

<!-- All Positions Demo -->
<Story name="All Positions">
  <div class="relative w-full h-screen bg-base-300">
    <UIChrome position="top-left">
      <div class="bg-red-500 text-white rounded px-3 py-1 text-sm">
        top-left
      </div>
    </UIChrome>
    <UIChrome position="top-center">
      <div class="bg-orange-500 text-white rounded px-3 py-1 text-sm">
        top-center
      </div>
    </UIChrome>
    <UIChrome position="top-right">
      <div class="bg-yellow-500 text-black rounded px-3 py-1 text-sm">
        top-right
      </div>
    </UIChrome>
    <UIChrome position="left-center">
      <div class="bg-green-500 text-white rounded px-3 py-1 text-sm">
        left-center
      </div>
    </UIChrome>
    <UIChrome position="right-center">
      <div class="bg-teal-500 text-white rounded px-3 py-1 text-sm">
        right-center
      </div>
    </UIChrome>
    <UIChrome position="bottom-left">
      <div class="bg-blue-500 text-white rounded px-3 py-1 text-sm">
        bottom-left
      </div>
    </UIChrome>
    <UIChrome position="bottom-center">
      <div class="bg-indigo-500 text-white rounded px-3 py-1 text-sm">
        bottom-center
      </div>
    </UIChrome>
    <UIChrome position="bottom-right">
      <div class="bg-purple-500 text-white rounded px-3 py-1 text-sm">
        bottom-right
      </div>
    </UIChrome>

    <div class="flex items-center justify-center h-full">
      <p class="text-base-content/50">All 8 positions shown</p>
    </div>
  </div>
</Story>
