<script module>
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import BoardViewport from "$lib/components/board/BoardViewport.svelte";

  const { Story } = defineMeta({
    argTypes: {
      background: { control: "color" },
      overflow: {
        control: { type: "select" },
        options: ["hidden", "auto", "scroll"],
      },
    },
    component: BoardViewport,
    parameters: {
      layout: "fullscreen",
    },
    tags: ["autodocs"],
    title: "Board/BoardViewport",
  });
</script>

<script>
  import BoardSurface from "$lib/components/board/BoardSurface.svelte";
</script>

<!-- Default viewport with centered board -->
<Story name="Default">
  <BoardViewport>
    <BoardSurface class="bg-green-800 border-8 border-amber-900">
      <div
        class="w-full h-full flex items-center justify-center text-white text-2xl"
      >
        Game Board Content
      </div>
    </BoardSurface>
  </BoardViewport>
</Story>

<!-- Custom background color -->
<Story name="Custom Background">
  <BoardViewport background="#1a1a2e">
    <BoardSurface class="bg-indigo-900 border-4 border-indigo-500">
      <div
        class="w-full h-full flex items-center justify-center text-white text-2xl"
      >
        Custom Background
      </div>
    </BoardSurface>
  </BoardViewport>
</Story>

<!-- Gradient background -->
<Story name="Gradient Background">
  <BoardViewport background="linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)">
    <BoardSurface class="bg-slate-800 border-4 border-slate-600">
      <div
        class="w-full h-full flex items-center justify-center text-white text-2xl"
      >
        Gradient Background
      </div>
    </BoardSurface>
  </BoardViewport>
</Story>
