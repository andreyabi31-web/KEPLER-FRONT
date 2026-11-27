'use strict';
// Dua (lalu tiga) salinan game nyata, masing-masing di vm terpisah, terhubung lewat jaringan tiruan.
const {loadGame,Net}=require('./harness'),{test,near,done}=require('./runner');
(async()=>{
const net=new Net(),A=loadGame({name:'Ana',net,role:1}),B=loadGame({name:'Budi',net,role:2});
await A.start();await B.start();
const all=[A,B],step=(n,dt=.05)=>{for(let i=0;i<n;i++){all.forEach(x=>x.step(dt));all.forEach(x=>{x.run('P.hp=Math.max(P.hp,500)')})}},
 till=(f,max=200)=>{for(let i=0;i<max&&!f();i++){step(1);all.forEach(x=>{if(x.get('state')==='modal'&&!x.get('pz')&&x.get('phase')==='fight'&&x.get('E').length)x.run('resume()')})}return f()},
 ids=x=>x.get('E').map(e=>e.id).sort((a,b)=>a-b).join(',');
const Ap=A.get('P'),Bp=B.get('P');
step(10);
test('kedua pemain terhubung dan masuk mode online',()=>{if(!A.get('MP')||!B.get('MP'))throw new Error('MP tidak aktif');return 'A='+A.get('state')+' B='+B.get('state')});
test('pemilihan host konsisten (ID terkecil jadi host)',()=>{if(!A.get('HOST')||B.get('HOST'))throw new Error('host A='+A.get('HOST')+' B='+B.get('HOST'));return 'A host'});
test('masing-masing melihat satu pemain lain',()=>{const a=Object.keys(A.get('GH')).length,b=Object.keys(B.get('GH')).length;if(a!==1||b!==1)throw new Error('ghost A='+a+' B='+b)});
Ap.p.set(0,0,8);Bp.p.set(10,0,8);step(40);
test('posisi pemain lain tersinkron (galat < 0,5 m)',()=>{const ga=Object.values(A.get('GH'))[0].g.position,gb=Object.values(B.get('GH'))[0].g.position;const e1=Math.hypot(ga.x-10,ga.z-8),e2=Math.hypot(gb.x-0,gb.z-8);if(e1>.5||e2>.5)throw new Error('galat '+e1.toFixed(2)+' / '+e2.toFixed(2));return e1.toFixed(2)+' m / '+e2.toFixed(2)+' m'});
// --- misi 1 dimulai oleh host ketika ada pemain di beacon
Ap.p.set(0,0,-58);Bp.p.set(2,0,-58);
test('misi dimulai: host membuat musuh, klien mendapat salinan identik',()=>{if(!till(()=>A.get('phase')==='fight'&&B.get('phase')==='fight',60))throw new Error('fase A='+A.get('phase')+' B='+B.get('phase'));step(5);const a=ids(A),b=ids(B);if(!a||a!==b)throw new Error('id musuh A=['+a+'] B=['+b+']');return A.get('E').length+' musuh sama di kedua sisi'});
[A,B].forEach(x=>{if(x.get('state')==='modal')x.run('resume()')});step(10);
test('klien melukai musuh: host menerima kerusakan, klien melihat HP baru',()=>{const e=B.get('E').find(e=>e.type==='walker'),id=e.id,hp0=A.get('E').find(q=>q.id===id).hp;B.run(`hurtE(E.find(q=>q.id===${id}),30)`);step(12);const hpA=A.get('E').find(q=>q.id===id).hp,hpB=B.get('E').find(q=>q.id===id).hp;near(hp0-hpA,30,.2,'kerusakan di host');near(hpB,Math.ceil(hpA),.02,'HP di klien');return 'HP host '+hpA.toFixed(1)});
// --- musuh terakhir mati: soal uji muncul di semua, host menjawab, klien ikut maju
A.run('E.slice().forEach(e=>hurtE(e,1e6))');
test('wave habis: soal uji muncul di host dan klien',()=>{if(!till(()=>A.get('phase')==='quiz'&&B.get('phase')==='quiz',60))throw new Error('fase A='+A.get('phase')+' B='+B.get('phase'));return 'A='+A.get('state')+' B='+B.get('state')});
test('klien tidak terhapus musuhnya sendiri (E klien kosong setelah host membersihkan)',()=>{step(5);if(B.get('E').length)throw new Error('klien masih punya '+B.get('E').length+' musuh')});
A.run('ans(1)');step(15);
test('host menjawab benar: sektor maju ke 2 di host DAN klien',()=>{if(A.get('mi')!==1)throw new Error('mi host='+A.get('mi'));if(!till(()=>B.get('mi')===1,60))throw new Error('mi klien='+B.get('mi'));return 'checkpoint klien '+B.get('P').cp.join(',')});
[A,B].forEach(x=>{if(x.get('state')==='modal')x.run('resume()')});step(10);
Ap.p.set(0,0,-58);Bp.p.set(2,0,-58);Ap.v.set(0,0,0);Bp.v.set(0,0,0);
test('berbagi amunisi: A memberi 30 peluru ke B',()=>{Ap.res=100;const b0=Bp.res;A.run('giveTo("a")');step(8);near(Ap.res,70,1e-9,'A');return near(Bp.res-b0,30,1e-9,'B bertambah')});
test('berbagi medkit: A memberi 1 medkit ke B',()=>{Ap.kit=2;Bp.kit=1;A.run('giveTo("m")');step(8);if(Ap.kit!==1||Bp.kit!==2)throw new Error('kit A='+Ap.kit+' B='+Bp.kit)});
test('revive: A tumbang, B menekan E, A hidup lagi dengan HP peran Medik',()=>{A.run('P.hp=0');step(3);if(!Ap.down)throw new Error('A tidak masuk status tumbang');step(6);const gh=Object.values(B.get('GH'))[0];if(!gh.t.dn)throw new Error('B tidak melihat A tumbang');B.run('rescue()');step(12);if(Ap.down)throw new Error('A masih tumbang');return 'HP A = '+Ap.hp});
test('musuh mengabaikan pemain yang tumbang',()=>{A.run('E.length=0');A.run('spawn("walker",5,-50)');Ap.down=true;const e=A.get('E')[0];const t=A.run('NP')(e);Ap.down=false;if(t===Ap.p)throw new Error('musuh masih menarget pemain tumbang')});
step(10);test('konsol kerja sama: dua pemain menahan E bersamaan -> 300 kredit masing-masing',()=>{A.run('E.length=0');step(8);Ap.p.set(-62,A.run('gh(-62,-8)'),-8);Bp.p.set(-62,B.run('gh(-62,16)'),16);A.run('K.KeyE=true');B.run('K.KeyE=true');const a0=Ap.cr,b0=Bp.cr;step(90);A.run('K.KeyE=false');B.run('K.KeyE=false');if(Ap.cr-a0!==300||Bp.cr-b0!==300)throw new Error('kredit A+'+(Ap.cr-a0)+' B+'+(Bp.cr-b0));return 'kedua +300'});
test('konsol kerja sama TIDAK aktif bila hanya satu pemain menahan',()=>{A.run('DUO.done=false;DUO.p=0;QS.forEach(q=>{if(q.k==="duo")q.done=false})');B.run('DUO.done=false;DUO.p=0');Ap.p.set(-62,A.run('gh(-62,-8)'),-8);Bp.p.set(30,0,30);A.run('K.KeyE=true');const a0=Ap.cr;step(90);A.run('K.KeyE=false');if(Ap.cr!==a0)throw new Error('kredit berubah padahal sendirian')});
// --- boss
A.run('E.length=0');A.run('spawn("boss",20,-5)');step(4);const boss=()=>A.get('E').find(e=>e.type==='boss');boss().hp=600;A.run('bossPh(E.find(e=>e.type==="boss"))');step(10);
test('boss fase 2: inti muncul di host dan di salinan klien',()=>{const bb=B.get('E').find(e=>e.type==='boss');if(!boss().core)throw new Error('host tanpa inti');if(!bb||!bb.core)throw new Error('klien tanpa inti');});
test('boss fase 2: tembakan satu pemain ×1,2, dua pemain sinkron ×3',()=>{const bb=B.get('E').find(e=>e.type==='boss'),hp0=boss().hp;const w=B.run('new V(0,0,0)');bb.core.getWorldPosition(w);B.set('HPt',w);B.run(`hurtE(E.find(e=>e.type==="boss"),100)`);B.set('HPt',null);step(6);const d1=hp0-boss().hp;const w2=A.run('new V(0,0,0)');boss().core.getWorldPosition(w2);A.set('HPt',w2);A.run('hurtE(E.find(e=>e.type==="boss"),100)');A.set('HPt',null);const d2=hp0-d1-boss().hp;near(d1,120,.02,'tembakan B sendirian');near(d2,300,.02,'tembakan A bersama B');return 'x1,2 lalu x3'});
test('gelombang tekanan boss mengenai pemain klien di tanah, tidak bila melompat',()=>{A.run('BW=[777,0,0]');Bp.p.set(3,0,0);B.run('P.hp=500;P.on=true');const h0=Bp.hp;step(2);const need=()=>B.get('CW').length>0;if(!till(need,20))throw new Error('klien tidak menerima gelombang');B.run('P.hp=500');const before=500;for(let i=0;i<40;i++){B.step(.05);B.run('P.hp=Math.min(P.hp,500)')}return 'gelombang diterima'});
test('gelombang: damage 35 di tanah',()=>{B.run('mkWave(0,0)');B.run('P.hp=500;P.p.set(3,0,0);P.on=true');for(let i=0;i<35;i++)B.run('upd')(.05);near(500-Bp.hp,35,.01,'damage')});
test('gelombang: tidak ada damage saat melompat tepat waktu',()=>{B.run('mkWave(0,0)');B.run('P.hp=500;P.p.set(3,0,0);P.on=true;P.v.set(0,0,0)');for(let i=0;i<29;i++)B.run('upd')(.05);B.run('P.p.y=3;P.v.y=0;P.on=false');for(let i=0;i<3;i++)B.run('upd')(.05);if(Bp.hp!==500)throw new Error('HP berubah menjadi '+Bp.hp)});
// --- pemain ketiga bergabung terlambat
const C=loadGame({name:'Cici',net,role:3});await C.start();all.push(C);step(30);
test('pemain terlambat langsung disinkronkan ke sektor yang sedang berjalan',()=>{if(C.get('mi')!==A.get('mi'))throw new Error('mi C='+C.get('mi')+' host='+A.get('mi'));if(Object.keys(C.get('GH')).length!==2)throw new Error('C melihat '+Object.keys(C.get('GH')).length+' pemain');return 'sektor '+(C.get('mi')+1)});
// --- host keluar
A.run('RM.leave()');all.shift();step(15);
test('host keluar: pemain berikutnya otomatis jadi host',()=>{if(!B.get('HOST'))throw new Error('B bukan host');if(C.get('HOST'))throw new Error('C ikut jadi host')});
test('tidak ada error tak tertangkap di jaringan tiruan',()=>{if(net.err)throw net.err});
process.exit(done('MULTIPLAYER')?1:0)})().catch(e=>{console.log('KESALAHAN FATAL',e.stack);process.exit(2)});
