<script lang="ts">
	import { Dialog } from "bits-ui";

	let { ref = $bindable(null), ...restProps }: Dialog.TriggerProps = $props();
</script>

<Dialog.Trigger bind:ref data-slot="drawer-trigger" {...restProps} />
