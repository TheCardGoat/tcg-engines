<script module>
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { fn } from "storybook/test";
  import Card from "$lib/components/board/Card.svelte";

  const { Story } = defineMeta({
    title: "Board/Card",
    component: Card,
    tags: ["autodocs"],
    argTypes: {
      tapped: { control: "boolean" },
      faceDown: { control: "boolean" },
      hoverable: { control: "boolean" },
      selected: { control: "boolean" },
      draggable: { control: "boolean" },
      aspectRatio: {
        control: { type: "select" },
        options: ["2.5/3.5", "5/7", "63/88", "1/1"],
      },
    },
    args: {
      onclick: fn(),
    },
    parameters: {
      layout: "centered",
    },
  });
</script>

<!-- Default card -->
<Story name="Default">
  <div class="bg-base-300 p-8" style="width: 120px;">
    <Card>
      <div
        class="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold"
      >
        Card
      </div>
    </Card>
  </div>
</Story>

<!-- Tapped/Exhausted card -->
<Story name="Tapped">
  <div class="bg-base-300 p-16" style="width: 200px; height: 200px;">
    <div style="width: 80px;">
      <Card tapped>
        <div
          class="w-full h-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-sm"
        >
          Tapped
        </div>
      </Card>
    </div>
  </div>
</Story>

<!-- Face-down card -->
<Story name="Face Down">
  <div class="bg-base-300 p-8" style="width: 120px;">
    <Card faceDown></Card>
  </div>
</Story>

<!-- Selected card -->
<Story name="Selected">
  <div class="bg-base-300 p-8" style="width: 120px;">
    <Card selected>
      <div
        class="w-full h-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center text-white font-bold"
      >
        Selected
      </div>
    </Card>
  </div>
</Story>

<!-- No hover effects -->
<Story name="No Hover">
  <div class="bg-base-300 p-8" style="width: 120px;">
    <Card hoverable={false}>
      <div
        class="w-full h-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center text-white font-bold text-sm"
      >
        Static
      </div>
    </Card>
  </div>
</Story>

<!-- Custom card back -->
<Story name="Custom Card Back">
  <div class="bg-base-300 p-8" style="width: 120px;">
    <Card faceDown>
      {#snippet cardBack()}
        <div
          class="w-full h-full bg-gradient-to-br from-amber-600 to-amber-900 flex items-center justify-center"
        >
          <div
            class="w-3/4 h-3/4 rounded border-2 border-amber-400/50 bg-amber-500/20 flex items-center justify-center"
          >
            <span class="text-amber-200 text-2xl">?</span>
          </div>
        </div>
      {/snippet}
    </Card>
  </div>
</Story>

<!-- Multiple cards showcase -->
<Story name="Card States">
  <div class="bg-base-300 p-8 flex gap-4 items-start">
    <div style="width: 80px;">
      <p class="text-xs text-center mb-2 text-base-content">Normal</p>
      <Card>
        <div
          class="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xs"
        >
          1
        </div>
      </Card>
    </div>
    <div style="width: 80px;">
      <p class="text-xs text-center mb-2 text-base-content">Selected</p>
      <Card selected>
        <div
          class="w-full h-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center text-white font-bold text-xs"
        >
          2
        </div>
      </Card>
    </div>
    <div style="width: 80px;">
      <p class="text-xs text-center mb-2 text-base-content">Face Down</p>
      <Card faceDown></Card>
    </div>
    <div class="pt-8" style="width: 120px;">
      <p class="text-xs text-center mb-2 text-base-content">Tapped</p>
      <div style="width: 80px;">
        <Card tapped>
          <div
            class="w-full h-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-xs"
          >
            4
          </div>
        </Card>
      </div>
    </div>
  </div>
</Story>

<!-- With image content -->
<Story name="With Image">
  <div class="bg-base-300 p-8" style="width: 150px;">
    <Card>
      <img
        src="https://picsum.photos/250/350"
        alt="Sample card art"
        class="w-full h-full object-cover"
      >
    </Card>
  </div>
</Story>
