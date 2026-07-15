<script module>
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import BoardSurface from "$lib/components/board/BoardSurface.svelte";

  const { Story } = defineMeta({
    argTypes: {
      aspectRatio: {
        control: { type: "select" },
        options: ["16/9", "3/2", "4/3", "9/16", "2/3", "1/1"],
      },
      mobileAspectRatio: {
        control: { type: "select" },
        options: ["16/9", "3/2", "4/3", "9/16", "2/3", "1/1"],
      },
      desktopAspectRatio: {
        control: { type: "select" },
        options: ["16/9", "3/2", "4/3", "9/16", "2/3", "1/1"],
      },
      maxWidth: { control: "text" },
      width: { control: "text" },
    },
    component: BoardSurface,
    parameters: {
      layout: "fullscreen",
    },
    tags: ["autodocs"],
    title: "Board/BoardSurface",
  });
</script>

<!-- Default 3:2 aspect ratio -->
<Story name="Default (3:2)">
  <div
    class="bg-base-300 w-screen h-screen p-8 flex items-center justify-center"
  >
    <BoardSurface class="bg-green-800 border-8 border-amber-900">
      <div
        class="w-full h-full flex items-center justify-center text-white text-xl"
      >
        3:2 Aspect Ratio (Default)
      </div>
    </BoardSurface>
  </div>
</Story>

<!-- Widescreen 16:9 -->
<Story name="Widescreen (16:9)">
  <div
    class="bg-base-300 w-screen h-screen p-8 flex items-center justify-center"
  >
    <BoardSurface
      aspectRatio="16/9"
      class="bg-blue-900 border-8 border-blue-700"
    >
      <div
        class="w-full h-full flex items-center justify-center text-white text-xl"
      >
        16:9 Widescreen
      </div>
    </BoardSurface>
  </div>
</Story>

<!-- Portrait 9:16 -->
<Story name="Portrait (9:16)">
  <div
    class="bg-base-300 w-screen h-screen p-8 flex items-center justify-center"
  >
    <BoardSurface
      aspectRatio="9/16"
      class="bg-purple-900 border-8 border-purple-700"
    >
      <div
        class="w-full h-full flex items-center justify-center text-white text-xl"
      >
        9:16 Portrait
      </div>
    </BoardSurface>
  </div>
</Story>

<!-- Square 1:1 -->
<Story name="Square (1:1)">
  <div
    class="bg-base-300 w-screen h-screen p-8 flex items-center justify-center"
  >
    <BoardSurface aspectRatio="1/1" class="bg-red-900 border-8 border-red-700">
      <div
        class="w-full h-full flex items-center justify-center text-white text-xl"
      >
        1:1 Square
      </div>
    </BoardSurface>
  </div>
</Story>

<!-- Responsive (different ratios for mobile/desktop) -->
<Story name="Responsive">
  <div
    class="bg-base-300 w-screen h-screen p-8 flex items-center justify-center"
  >
    <BoardSurface
      aspectRatio="3/2"
      mobileAspectRatio="9/16"
      desktopAspectRatio="16/9"
      class="bg-teal-900 border-8 border-teal-700"
    >
      <div
        class="w-full h-full flex flex-col items-center justify-center text-white text-center p-4"
      >
        <p class="text-xl font-bold">Responsive Board</p>
        <p class="text-sm mt-2">Default: 3:2</p>
        <p class="text-sm">Mobile Portrait: 9:16</p>
        <p class="text-sm">Desktop Landscape: 16:9</p>
      </div>
    </BoardSurface>
  </div>
</Story>
