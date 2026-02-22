var fs=require("fs");
var attrSrc=fs.readFileSync("src/data/attractions.js","utf8");
var daysSrc=fs.readFileSync("src/data/days.js","utf8");
var ATTR=JSON.parse(attrSrc.replace(/^\/\/.*\n/,"").replace(/^var ATTR = /,"").replace(/;\s*$/,""));
var DAYS_A=JSON.parse(daysSrc.replace(/^\/\/.*\n/,"").replace(/^var DAYS_A = /,"").replace(/;\s*$/,""));
var ids=new Set(ATTR.map(function(a){return a.id}));
var ok=true;
DAYS_A.forEach(function(d){
  d.program.forEach(function(p){
    if(Array.isArray(p) && !ids.has(p[1])){console.error("MISSING PROG: day "+d.num+" ref "+p[1]);ok=false;}
  });
  d.points.forEach(function(pid){
    if(!ids.has(pid)){console.error("MISSING POINT: day "+d.num+" ref "+pid);ok=false;}
  });
});
if(ok) console.log("All references valid!");
console.log("\nDays summary:");
DAYS_A.forEach(function(d){console.log("  Day "+d.num+": "+d.title+" | points: "+d.points.join(","))});
