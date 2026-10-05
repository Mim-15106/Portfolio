var IMG = { en: "Pictures/ENG.png", th: "Pictures/TH.png" }; 
var $ = function (s, r) { return (r || document).querySelector(s); }; 

var lang = "th"; // set thai as default
try { lang = localStorage.getItem("lang") || "th"; } catch (e) {} 
function setLang(l) { 
  lang = l; 
  document.documentElement.lang = l; 
  document.querySelectorAll("[data-th]").forEach(function (el) { 
    el.textContent = el.dataset[l]; 
  }); 
  $("#langImg").src = IMG[l]; 
  try { localStorage.setItem("lang", l); } catch (e) {}
} // end of setLang
$("#lang").addEventListener("click", function () { 
  setLang(lang === "th" ? "en" : "th"); 
}); 

var PAGES = ["home", "portfolio"]; 
function route() { 
  var p = location.hash.replace("#/", ""); 
  if (PAGES.indexOf(p) < 0) p = "home"; 
  PAGES.forEach(function (id) { 
    $("#" + id).hidden = id !== p;
  }); 
  document.documentElement.classList.toggle("lock", p === "home" || p === "portfolio"); // scroll in home page? , No
  $("#homeLink").hidden = p === "home"; // hide home button while on the first page
  window.scrollTo(0, 0); 
} 
window.addEventListener("hashchange", route); 

setLang(lang); 
route(); 

// ---------- allow about me page ----------
PAGES.push("about"); 
route(); 

// ---------- skill bars  ----------
document.querySelectorAll(".meter").forEach(function (m) { // for every skill bar
  var n = +m.dataset.level || 0; 
  var h = ""; // starts empty
  for (var i = 0; i < 5; i++) { // repeat 5 times - once per box
    h += '<i' + (i < n ? ' class="on"' : '') + '></i>'; // add one box; give it class "on" (filled) if its position is below the level
  } 
  m.innerHTML = h; // put boxes inside bar
}); 

// ---------- Popup ----------
function closeModal() { // closes  popup function
  $("#modal").hidden = true; 
} 
document.querySelectorAll(".skill").forEach(function (b) { // button for every additional kills
  b.addEventListener("click", function () { 
    $("#mt").textContent = b.textContent; 
    $("#modal").hidden = false; 
    $("#xBtn").focus(); 
  }); 
}); 
$("#xBtn").addEventListener("click", closeModal); // clicking the X button closes the popup
$("#modal").addEventListener("click", function (e) { // clicking anywhere on the dark area
  if (e.target === this) closeModal(); 
}); 
document.addEventListener("keydown", function (e) { // when any key is pressed
  if (e.key === "Escape") closeModal(); //  Esc key = close the popup
}); 

// ---------- Email button + closing the popup when the page changes ----------
var emailBtn = $("#emailBtn");               // find the email button
function resetEmail() {                      // put the button back to "email"
  emailBtn.classList.remove("open");
  emailBtn.textContent = "email";
}
emailBtn.addEventListener("click", function () {   // on every click
  var open = emailBtn.classList.toggle("open");    // switch open on-off
  emailBtn.textContent = open ? "emailnoomim@gmail.com" : "email"; // show the address or the word
});

function updateAboutExtras() { // a function for things that depend on the current page
  var p = location.hash.replace("#/", ""); // read the current page name from the address
  $("#emailBtn").hidden = p !== "about"; // show the email button only on the About me page
  resetEmail();   // always go back to "email" when the page changes
  closeModal(); // close the popup whenever the page changes
} // end of updateAboutExtras
window.addEventListener("hashchange", updateAboutExtras); // run it every time the address changes
updateAboutExtras(); // run it once now, for the page that is open at the start
