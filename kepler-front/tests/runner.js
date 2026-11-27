'use strict';
let pass=0,fail=0;const lines=[];
function test(name,fn){try{const r=fn();pass++;lines.push('  PASS  '+name+(r?'  ('+r+')':''))}catch(e){fail++;lines.push('  FAIL  '+name+'\n        '+e.message)}}
function near(a,b,tol,what){const rel=Math.abs(a-b)/Math.max(Math.abs(b),1e-9);if(!(rel<=tol))throw new Error((what||'nilai')+': hasil '+a.toPrecision(5)+' vs teori '+b.toPrecision(5)+' (galat '+(rel*100).toFixed(2)+'%, batas '+(tol*100)+'%)');return 'galat '+(rel*100).toFixed(2)+'%'}
function done(title){console.log(title);console.log(lines.join('\n'));console.log('  '+pass+' lulus, '+fail+' gagal\n');return fail}
module.exports={test,near,done};
