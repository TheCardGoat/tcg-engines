<script lang="ts">
    import { os } from '../os.svelte';
    import type { AppDefinition } from '../os.svelte';

    let { app }: { app: AppDefinition } = $props();
</script>

<button 
    class="flex flex-col items-center justify-center gap-1 w-24 h-24 rounded-lg hover:bg-white/20 transition-colors group text-white shadow-sm"
    ondblclick={() => os.openWindow(app.id)}
>
    <div class="text-4xl filter drop-shadow-md group-hover:scale-110 transition-transform duration-200">
        {app.icon}
    </div>
    <span class="text-sm font-medium drop-shadow-md text-center leading-tight line-clamp-2 px-1">
        {app.title}
    </span>
</button>
