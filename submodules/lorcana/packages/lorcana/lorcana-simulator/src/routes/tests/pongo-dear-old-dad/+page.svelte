<script lang="ts">
import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
import { pongoDearOldDadFixture as fixture } from "@/features/simulator-devtools/fixtures/pongo-dear-old-dad.js";
</script>

<LorcanaBrowserHarnessView {fixture} view="playerOne" />
