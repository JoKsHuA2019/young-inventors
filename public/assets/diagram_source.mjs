// Editable science/reference diagrams. These show relationships, not breadboard holes.
export function drawDiagram(slide,l,text,accent){
 const id=l.id,ink='#172A42';
 const box=(name,label,x,y,w,h,fill='#E2EFF1',size=24)=>{
  slide.shapes.add({name,geometry:'rect',position:{left:x,top:y,width:w,height:h},fill,line:{style:'solid',fill:accent,width:2}});
  text(slide,name+'-label',label,x+9,y+6,w-18,h-10,size,ink,true);
 };
 const line=(x,y,w,h)=>{
  const W=Math.max(1,Math.abs(w)),H=Math.max(1,Math.abs(h));
  return slide.shapes.add({geometry:'custom',position:{left:Math.min(x,x+w),top:Math.min(y,y+h),width:W,height:H},fill:'none',line:{style:'solid',fill:ink,width:3},customPaths:[{width:W,height:H,commands:[{moveTo:{x:w<0?W:0,y:h<0?H:0}},{lineTo:{x:w<0?0:W,y:h<0?0:H}}]}]});
 };
 const arrow=(x,y)=>text(slide,'arrow-'+x+'-'+y,'➜',x,y,45,40,30,accent,true);
 text(slide,'diagram-heading',l.board==='none'?'A quick sketch':'Connection map',692,210,520,40,28,accent,true);
 if(id==='p01'||id==='p04'){
  const waves=id==='p01'?[.5,.5]:[.25,.75];
  for(let row=0;row<waves.length;row++){
   const top=290+row*140;
   text(slide,'wave-caption-'+row,id==='p01'?(row?'Shorter waits, faster blinks':'Longer waits, slower blinks'):(row?'More on-time':'Less on-time'),700,top-35,500,40,23,ink);
   const period=id==='p01'?(row?100:200):150,duty=waves[row];
   let x=710;
   while(x+period<=1190){line(x,top,period*duty,0);line(x+period*duty,top,0,55);line(x+period*duty,top+55,period*(1-duty),0);line(x+period,top,0,55);x+=period;}
  }
  text(slide,'wave-legend','High = on     Low = off',700,595,500,36,23,ink);return;
 }
 if(id==='m01'){
  text(slide,'load-label','Paper load',700,285,200,35,25,ink,true);text(slide,'push-label','Push here',1000,285,190,35,25,ink,true);
  line(720,390,450,0);box('pivot','Pivot',850,425,135,60,'#FFE1A8');line(910,390,0,35);
  text(slide,'load-distance','6 cm',740,340,160,35,25,accent,true);text(slide,'effort-distance','6 or 14 cm',980,340,210,35,25,accent,true);
  text(slide,'lever-note','Same load. Same lift height.\nTry two push points.',700,535,480,90,27,ink);return;
 }
 if(id==='m02'||id==='i03'){
  const pts=[[745,480],[815,325],[1065,355],[1145,480]];
  for(let i=0;i<3;i++){const [a,b]=[pts[i],pts[i+1]];line(a[0],a[1],b[0]-a[0],b[1]-a[1]);}
  line(745,480,400,0);
  pts.forEach(([x,y],i)=>{slide.shapes.add({name:'pivot-'+i,geometry:'ellipse',position:{left:x-9,top:y-9,width:18,height:18},fill:'#F1BC3B',line:{style:'solid',fill:ink,width:2}});});
  text(slide,'fixed-label','Fixed pivots',810,510,370,40,26,ink,true);
  text(slide,'link-label','Links turn at the pivots.\nStop if anything catches.',700,565,500,65,25,ink);return;
 }
 if(l.board==='none'){
  const labelSets={i01:['Try a gentle push','Watch the tab','Compare two ideas'],i04:['Try handle A','Try handle B','What felt easier?'],i05:['Make version A','Try one change','Test version B'],i06:['Your first guess','What happened','What you changed']};
  const labels=labelSets[id]||['Your idea','Your test','Your next change'];
  for(let i=0;i<3;i++){box('idea-'+i,labels[i],730,275+i*110,430,65,i===1?'#FFF0D2':'#E2EFF1',27);if(i<2)text(slide,'down-'+i,'↓',920,342+i*110,40,40,30,accent,true);}
  return;
 }
 const short=v=>v.replace('2 matched AA alkaline cells','2 AA cells').replace('External regulated 5 V +','External 5 V (+)').replace('External source GND and Uno GND','Supply GND + Uno GND').replace('External source +','External (+)').replace('No connection to Uno 5 V','Keep off Uno 5 V').replace('Branch A: 220 ohms, then red LED A','A: 220 Ω + red LED').replace('Branch B: separate 220 ohms, then red LED B','B: 220 Ω + red LED').replace('Button contact ','Button ').replace('Red LED cathode (−)','LED cathode (-)').replace('Red LED cathode K','LED cathode K').replace('Red LED anode (+)','LED anode (+)').replace('adult-prepared regulated 5 V','External 5 V');
 let rows=l.connections.filter(c=>!c.source.startsWith('Allowed fault') && c.source!=='Holder' && c.source!=='USB');
 if(rows.length>6)rows=rows.slice(0,6);
 const gap=Math.min(59,300/rows.length);
 rows.forEach((c,i)=>{
  const y=270+i*gap;box('from-'+i,short(c.source),692,y,220,gap-4,'#FFF9EE',19);arrow(922,y+4);box('to-'+i,short(c.destination),970,y,235,gap-4,'#E2EFF1',19);
 });
 text(slide,'diagram-note','Match the labels to your parts.\nUse the full table for every check.',700,280+rows.length*gap,500,65,22,ink);
}
