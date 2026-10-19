async page => {

  await page.evaluate(() => {
    window.__perf = {longTasks:[],events:[],frames:[],start:performance.now(),botTurnCompleteMs:null};
    const completed = new MutationObserver(() => {
      if (document.body.innerText.includes('Turn 2 started.')) {
        window.__perf.botTurnCompleteMs=performance.now()-window.__perf.start;
        completed.disconnect();
      }
    });
    completed.observe(document.body,{subtree:true,childList:true,characterData:true});
    new PerformanceObserver(list => window.__perf.longTasks.push(...list.getEntries().map(e=>({start:e.startTime,duration:e.duration})))).observe({type:'longtask'});
    new PerformanceObserver(list => window.__perf.events.push(...list.getEntries().filter(e=>e.name==='click'||e.name==='pointerdown').map(e=>({name:e.name,duration:e.duration,delay:e.processingStart-e.startTime})))).observe({type:'event',durationThreshold:16});
    let previous=performance.now();
    function frame(now){window.__perf.frames.push({start:previous,duration:now-previous});previous=now;requestAnimationFrame(frame)}
    requestAnimationFrame(frame);
  });

 await page.getByTestId("prompt-verb-keepHand").click();
 await page.waitForTimeout(20000);
 return await (async page => {
 return await page.evaluate(()=>{
  const p=window.__perf;const sorted=p.frames.map(f=>typeof f==='number'?f:f.duration).sort((a,b)=>a-b);
  return {url:location.href,botTurnCompleteMs:p.botTurnCompleteMs,elapsed:performance.now()-p.start,longTasks:p.longTasks,totalBlockingMs:p.longTasks.reduce((s,t)=>s+Math.max(0,t.duration-50),0),clicks:p.events.filter(e=>e.name==='click'),frames:sorted.length,frameP95:sorted[Math.floor(sorted.length*.95)],maxFrameMs:sorted.at(-1),text:document.body.innerText.slice(0,700)};
 });
}
)(page);
}
