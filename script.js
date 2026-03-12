let currentUser = null
let role = "guest"



const admins = [
"riki","tahir","kamil","randhika","daud","budiyansah"
]


const approvers = [
"restu","oky","erwin","yoga","alda"
]

const developers = [
"Web Developer"
]

let tables = {}

let currentDate = "2026-03-10"


tables[currentDate] = {

rows:[

{nama:"SLAMET",po:"32601596",jumlah:642000},
{nama:"YUSUP",po:"41242703",jumlah:820000},
{nama:"DIKI",po:"31626797",jumlah:767000},
{nama:"RUBEN",po:"32208991",jumlah:642000},
{nama:"UJIB",po:"31240000",jumlah:820000},
{nama:"TKBM",po:"GALLON",jumlah:115200},
{nama:"EMPI",po:"31240008",jumlah:767000},
{nama:"JOKO",po:"KASBON",jumlah:100000}

],

cash:{

uangDiterimaAdmin:10000000,
totalDiterima:0,
totalDiserahkan:0,
sisaUang:0,
fisikUang:0,
selisih:0

},

approvals:{

"Pak Restu":{status:"pending",time:""},
"Ibu Oky":{status:"pending",time:""},
"Pak Erwin":{status:"pending",time:""},
"Pak Yoga":{status:"pending",time:""},
"Ibu Alda":{status:"pending",time:""}

}

}


function getTable(){
return tables[currentDate]
}


function renderTable(){

let table = tables[currentDate]
let data = table.rows

let body = document.getElementById("tableBody")

if(!body) return

body.innerHTML=""

let total = 0

data.forEach((d,i)=>{

total += d.jumlah

let tombolHapus = ""

if(role === "admin"){
tombolHapus = `<button onclick="hapusRow(${i})">Hapus</button>`
}

body.innerHTML += `

<tr>

<td>${i+1}</td>

<td contenteditable="false" class="editCell" id="nama${i}">
${d.nama}
</td>

<td contenteditable="false" class="editCell" id="po${i}">
${d.po}
</td>

<td contenteditable="false" class="editCell" id="jumlah${i}">
Rp ${Number(d.jumlah || 0).toLocaleString('id-ID')}
</td>

<td>${tombolHapus}</td>

</tr>

`

})



document.getElementById("totalDiserahkan").innerText =
"Rp " + total.toLocaleString('id-ID')

hitungKas()

renderApprovers()

}


function updateCash(){

let c = getTable().cash

c.totalDiterima = c.uangDiterimaAdmin

c.sisaUang =
c.totalDiterima - c.totalDiserahkan

c.selisih =
c.fisikUang - c.sisaUang

animateValue(
document.getElementById("uangAdmin"),
0,
c.uangDiterimaAdmin,
600
)

animateValue(
document.getElementById("totalDiterima"),
0,
c.totalDiterima,
600
)

animateValue(
document.getElementById("sisaUang"),
0,
c.sisaUang,
600
)

animateValue(
document.getElementById("fisikUang"),
0,
c.fisikUang,
600
)

animateValue(
document.getElementById("selisih"),
0,
c.selisih,
600
)

}


const userPhotos = {

"Pak Restu":"img/users/restu.jpg",
"Ibu Oky":"img/users/oky.jpg",
"Pak Erwin":"img/users/erwin.jpg",
"Pak Yoga":"img/users/yoga.jpg",
"Ibu Alda":"img/users/alda.jpg",

"Riki":"img/users/riki.jpg",
"Tahir":"img/users/tahir.jpg",
"Kamil":"img/users/kamil.jpg",
"Randhika":"img/users/randhika.jpg",
"Daud":"img/users/daud.jpg",
"Budiyansah":"img/users/budi.jpg",

"Web Developer":"img/users/dev.jpg"

}


function login(){

let user = document.getElementById("username").value.trim()
let pass = document.getElementById("password").value.trim()

/* cek user */

if(!admins.includes(user) && !approvers.includes(user)&& !developers.includes(user)){
alert("User tidak dikenal")
return
}

/* pastikan database ada */

let usersDB = JSON.parse(localStorage.getItem("usersDB")) || {}

/* jika user belum ada → buat password default */

if(!usersDB[user]){

usersDB[user] = {
password:"prg123",
firstLogin:true
}

localStorage.setItem("usersDB",JSON.stringify(usersDB))

}

/* cek password */

if(usersDB[user].password !== pass){

alert("Password salah")
return

}

/* login berhasil */

currentUser = user

if(developers.includes(user)){
role="developer"
}
else if(admins.includes(user)){
role="admin"
}
else{
role="approver"
}

/* cek login pertama */

if(usersDB[user].firstLogin){

let newPass = prompt("Login pertama. Silakan ganti password baru")

if(!newPass || newPass.length < 4){

alert("Password minimal 4 karakter")
return

}

usersDB[user].password = newPass
usersDB[user].firstLogin = false

localStorage.setItem("usersDB",JSON.stringify(usersDB))

alert("Password berhasil diganti")

}

/* sembunyikan form login */

document.getElementById("loginForm").style.display="none"

/* tampilkan profile */

document.getElementById("profileBox").style.display="flex"

document.getElementById("userName").innerText=user
document.getElementById("userRole").innerText=role

/* avatar huruf pertama */

let avatar = document.getElementById("avatar")

let photos = JSON.parse(localStorage.getItem("userPhotos")) || {}

if(photos[user]){
avatar.innerHTML = `<img src="${photos[user]}">`
}else{
avatar.innerText = user.charAt(0)
}

/* fungsi lama tetap */

setAdminAccess()

if(role !== "admin"){
document.getElementById("uangAdmin").value = ""
document.getElementById("tambahanCash").value = ""
}

if(role === "developer"){
document.getElementById("resetPassBtn").style.display="block"
}



/* render data */

renderTable()
renderApprovers()

}


function logout(){

currentUser = null
role = "guest"

/* tampilkan login */

document.getElementById("loginForm").style.display="flex"

/* sembunyikan profile */

document.getElementById("profileBox").style.display="none"

/* sembunyikan menu admin */

setAdminAccess()

}


function tambahData(){

let nama = prompt("Nama")
let po = prompt("No PO")
let jumlah = prompt("Jumlah")

if(!nama || !po || !jumlah) return

getTable().rows.push({

nama:nama,
po:po,
jumlah:parseInt(jumlah)

})

renderTable()

}


function editRow(i){

document.getElementById("nama"+i).focus()

}


function saveRow(i){

let table = getTable()

let nama = document.getElementById("nama"+i).innerText.trim()
let po = document.getElementById("po"+i).innerText.trim()

let jumlahText = document.getElementById("jumlah"+i).innerText

/* ambil hanya angka */
let jumlah = jumlahText.replace(/[^0-9]/g,'')

/* jika kosong jangan ubah data lama */
if(jumlah === ""){
jumlah = table.rows[i].jumlah
}

table.rows[i].nama = nama
table.rows[i].po = po
table.rows[i].jumlah = parseInt(jumlah)

/* render ulang */
renderTable()

}


function hapusRow(i){

if(confirm("hapus data?")){

getTable().rows.splice(i,1)

renderTable()

}

}


function inputUangAdmin(){

let v = prompt("Uang diterima admin")

if(!v) return

getTable().cash.uangDiterimaAdmin = parseInt(v)

document.getElementById("uangAdmin").value =
parseInt(v).toLocaleString('id-ID')

renderTable()

}


function inputFisik(){

let v = prompt("Input fisik uang")

if(!v) return

getTable().cash.fisikUang = parseInt(v)

document.getElementById("fisikUang").value =
parseInt(v).toLocaleString('id-ID')

renderTable()

}


function tableBaru(){

let tanggal = prompt("Tanggal baru contoh 2026-03-11")

if(!tanggal) return

if(!tables[tanggal]){

tables[tanggal] = JSON.parse(
JSON.stringify(tables[currentDate])
)

tables[tanggal].rows=[]

}

currentDate = tanggal

renderHistory()

renderTable()

}


function renderHistory(){

let select = document.getElementById("historySelect")

if(!select) return

select.innerHTML=""

Object.keys(tables).forEach(t=>{

select.innerHTML +=
`<option value="${t}">${t}</option>`

})

select.value=currentDate

}


function pilihHistory(){

let t = document.getElementById("historySelect").value

currentDate = t

renderTable()

}


function renderApprovers(){

let panel = document.getElementById("approverPanel")

if(!panel) return

let approvals = getTable().approvals

panel.innerHTML=""

Object.keys(approvals).forEach(nama=>{

let data = approvals[nama]

let status=""

if(data.status==="acc"){

status =
`
<span class="statusAccAnim">
✔ ACC <small>${data.time}</small>
</span>
`

}

else{

if(role==="approver" && currentUser===nama){

status =
`
<button class="btnAcc" onclick="acc('${nama}')">
✔ ACC
</button>
`

}

else{

status =
`
<span class="statusPendingAnim">
⏳ Pending
</span>
`

}

}

panel.innerHTML +=

`
<div class="approverRow">

<div class="approverName">${nama}</div>

<div class="approverStatus">${status}</div>

</div>
`

})

}


function acc(nama){

let approvals = getTable().approvals

let now = new Date()

let time =
now.getHours().toString().padStart(2,"0")+":"+
now.getMinutes().toString().padStart(2,"0")

approvals[nama].status="acc"

approvals[nama].time=time

renderApprovers()

}


function hitungKas(){

if(role !== "admin") return

/* ambil angka saja */

let uangAdmin =
(document.getElementById("uangAdmin")?.value || "0")
.replace(/[^0-9]/g,'')

let tambahan =
(document.getElementById("tambahanCash")?.value || "0")
.replace(/[^0-9]/g,'')

let totalDiserahkan =
(document.getElementById("totalDiserahkan")?.innerText || "0")
.replace(/[^0-9]/g,'')


uangAdmin = parseInt(uangAdmin) || 0
tambahan = parseInt(tambahan) || 0
totalDiserahkan = parseInt(totalDiserahkan) || 0


/***************
1. TOTAL UANG DITERIMA
UANG ADMIN + TAMBAHAN PETTY CASH
****************/

let totalDiterima = uangAdmin + tambahan

document.getElementById("totalDiterima").innerText =
"Rp " + totalDiterima.toLocaleString('id-ID')


/***************
2. SELISIH FISIK DAN DATA
TOTAL DITERIMA - TOTAL DISERAHKAN
****************/

let selisih = totalDiterima - totalDiserahkan

document.getElementById("selisih").innerText =
"Rp " + selisih.toLocaleString('id-ID')

let selisihEl = document.getElementById("selisih")

selisihEl.innerText = "Rp " + selisih.toLocaleString('id-ID')

if(selisih < 0){
selisihEl.style.color = "red"
}else{
selisihEl.style.color = "green"
}

}

function formatInput(el){

if(role !== "admin") return

let value = el.value.replace(/[^0-9]/g,'')

if(value===""){
el.value=""
return
}

el.value = "Rp " + Number(value).toLocaleString('id-ID')

}


function setAdminAccess(){

let inputs = document.querySelectorAll(
"#uangAdmin,#tambahanCash,#fisikUang"
)

inputs.forEach(el=>{

if(!el) return

if(role === "admin"){
el.disabled = false
}
else{
el.disabled = true
el.value = el.value  // cegah perubahan manual
}

})


/* tampilkan menu admin */

let adminMenu = document.querySelectorAll(".adminOnly")

adminMenu.forEach(el=>{

if(role==="admin"){
el.style.display="inline-block"
}else{
el.style.display="none"
}

})

}


function editAll(){

if(role!=="admin") return

/* edit tabel */

let cells = document.querySelectorAll(".editCell")

cells.forEach(c=>{
c.contentEditable=true
c.style.background="#fff6b0"
})


/* edit kas */

let uangAdmin = document.getElementById("uangAdmin")
let tambahan = document.getElementById("tambahanCash")

if(uangAdmin){
uangAdmin.readOnly = false
uangAdmin.style.background="#fff6b0"
}

if(tambahan){
tambahan.readOnly = false
tambahan.style.background="#fff6b0"
}

}


function saveAll(){

if(role!=="admin") return

let table = tables[currentDate]

/* save tabel */

table.rows.forEach((r,i)=>{

let nama =
document.getElementById("nama"+i).innerText.trim()

let po =
document.getElementById("po"+i).innerText.trim()

let jumlahText =
document.getElementById("jumlah"+i).innerText

let jumlah =
jumlahText.replace(/[^0-9]/g,'')

table.rows[i].nama = nama
table.rows[i].po = po
table.rows[i].jumlah = parseInt(jumlah) || 0

})


/* save kas */

let uangAdmin =
parseInt(
(document.getElementById("uangAdmin").value || "0").replace(/\./g,'')
) || 0

let tambahan =
parseInt(
(document.getElementById("tambahanCash").value || "0").replace(/\./g,'')
) || 0

table.cash.uangDiterimaAdmin = uangAdmin
table.cash.tambahanCash = tambahan


/* kunci kembali input */

document.getElementById("uangAdmin").readOnly=true
document.getElementById("tambahanCash").readOnly=true

document.getElementById("uangAdmin").style.background=""
document.getElementById("tambahanCash").style.background=""


/* kunci tabel */

let cells = document.querySelectorAll(".editCell")

cells.forEach(c=>{
c.contentEditable=false
c.style.background=""
})


renderTable()

}




function toggleDarkMode(){

document.body.classList.toggle("dark-mode");

if(document.body.classList.contains("dark-mode")){

localStorage.setItem("mode","dark");

}else{

localStorage.setItem("mode","light");

}

}

window.onload = function(){

/* load dark mode */

if(localStorage.getItem("mode")=="dark"){
document.body.classList.add("dark-mode")
}

/* render system */

renderHistory()
renderTable()
renderApprovers()

}

function animateValue(element,start,end,duration){

start = parseInt(start) || 0
end = parseInt(end) || 0

let startTime=null

function animation(currentTime){

if(!startTime) startTime=currentTime

let progress=Math.min((currentTime-startTime)/duration,1)

let value=Math.floor(progress*(end-start)+start)

element.innerText=value.toLocaleString("id-ID")

if(progress<1){
requestAnimationFrame(animation)
}

}

requestAnimationFrame(animation)

}

function renderApprover(){

const panel = document.getElementById("approverPanel");

panel.innerHTML="";

approvers.forEach((a,i)=>{

const avatar = a.nama.charAt(0);

const status = a.acc
? '<span class="statusAcc">✔ Approved</span>'
: '<span class="statusPending">Pending</span>';

const btn = a.acc
? ''
: `<button class="btnAcc" onclick="accApprover(${i})">ACC</button>`;

panel.innerHTML += `

<div class="approverRow">

<div class="approverLeft">

<div class="apAvatar">${avatar}</div>

<div class="approverName">${a.nama}</div>

</div>

<div class="approverStatus">

${status}

</div>

${btn}

</div>

`;

});

updateProgress();

}

function accApprover(i){

approvers[i].acc = true;

renderApprover();

}

function updateProgress(){

let total = approvers.length;

let acc = approvers.filter(a=>a.acc).length;

let percent = (acc/total)*100;

document.getElementById("progressFill").style.width = percent+"%";

}

function resetPasswordUser(){

if(role !== "developer"){
alert("Hanya Web Developer yang bisa reset password")
return
}

let user = prompt("Masukkan nama user yang ingin di reset")

let usersDB = JSON.parse(localStorage.getItem("usersDB")) || {}

if(!usersDB[user]){
alert("User tidak ditemukan")
return
}

usersDB[user].password = "prg123"
usersDB[user].firstLogin = true

localStorage.setItem("usersDB",JSON.stringify(usersDB))

alert("Password berhasil direset ke prg123")

}

function toggleProfileMenu(){

let dropdown = document.getElementById("profileDropdown")
let menu = document.getElementById("profileBox")

dropdown.classList.toggle("showMenu")
menu.classList.toggle("active")

}

function uploadFoto(){

let input = document.createElement("input")
input.type = "file"
input.accept = "image/*"

input.onchange = function(){

let file = input.files[0]

let reader = new FileReader()

reader.onload = function(e){

let photos = JSON.parse(localStorage.getItem("userPhotos")) || {}

photos[currentUser] = e.target.result

localStorage.setItem("userPhotos",JSON.stringify(photos))

document.getElementById("avatar").innerHTML =
`<img src="${e.target.result}">`

}

reader.readAsDataURL(file)

}

input.click()

}

document.addEventListener("click", function(e){

let profile = document.querySelector(".profileMenu")

let dropdown = document.getElementById("profileDropdown")

if(!profile.contains(e.target)){
dropdown.classList.remove("showMenu")
}

})