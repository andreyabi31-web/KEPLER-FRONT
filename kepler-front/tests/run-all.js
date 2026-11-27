const {spawnSync}=require('child_process'),path=require('path');let bad=0;
for(const f of ['physics.test.js','ui.test.js','multiplayer.test.js']){const r=spawnSync(process.execPath,[path.join(__dirname,f)],{encoding:'utf8'});process.stdout.write(r.stdout+(r.stderr||''));if(r.status)bad++}
console.log(bad?'ADA SUITE YANG GAGAL':'SEMUA SUITE LULUS');process.exit(bad?1:0);
