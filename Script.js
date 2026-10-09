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


PAGES.push("projects", "project"); // add the Projects page and the blank project page to the list of pages that exist

// Project pictures and cards 
var PICS = { // the picture file for each project (name on the left, file on the right)
  obby: "Pictures/RobloxGame.png", // Roblox game
  math: "Pictures/MathFight.jpg", // math game
  scratch: "Pictures/ScratchGame.jpg", // Scratch game
  micro: "Pictures/Microbit.jpg", // micro:bit project
  site: "Pictures/PortfolioWebsite.jpg" // this portfolio website
}; 
// Each card is: [Thai caption, English caption, picture name, true = show the whole picture on white]
var CARDS = [ // the list of project cards
  ["โปรเจกต์พัฒนาเกมบนแพลตฟอร์ม Roblox", "Roblox Game", "obby"], // card 1: picture fills the frame
  ["เกมเสริมการเรียนรู้คณิตศาสตร์", "Math Game", "math"], // card 2
  ["โปรเจกต์เกมจากโปรแกรม Scratch", "Scratch Game", "scratch"], // card 3
  ["โปรเจกต์จากไมโครบิต", "Project From Microbit", "micro", true], // card 4: whole picture on white
  ["เว็บไซต์พอร์ตโฟลิโอ", "Portfolio Website", "site", true] // card 5: whole picture on white
]; // end of the list

$("#cards").innerHTML = CARDS.map(function (c) { // turn every card in the list into HTML text...
  return '<a class="card" href="#/project">' + // ...a link; clicking opens the blank project page
    '<span class="frame' + (c[3] ? ' w' : '') + '">' + // ...the picture frame (adds class "w" for white background when c[3] is true)
    '<img class="bg' + (c[3] ? ' fit' : '') + '" src="' + PICS[c[2]] + '" alt=""></span>' + // ...the picture (class "fit" = show it whole)
    '<span data-th="' + c[0] + '" data-en="' + c[1] + '"></span>' + 
    '</a>'; // ...end of the link
}).join(""); // glue all cards together and put them inside the #cards box

setLang(lang); // run the language again so the new captions get their Thai / English text
route(); // run route() again so that opening ...#/projects directly also works
