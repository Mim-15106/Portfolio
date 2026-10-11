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
// cards below
var CARDS = [ // the list of cards, in the order they are shown
  ["โปรเจกต์เกมจากโปรแกรม Scratch", "Scratch Game", "scratch", "#/scratch"], 
  ["เกมเสริมการเรียนรู้คณิตศาสตร์", "Math Game", "math", "#/math"], 
  ["โปรเจกต์พัฒนาเกมบนแพลตฟอร์ม Roblox", "Roblox Game", "obby", "#/roblox"] 
];

$("#cards").innerHTML = CARDS.map(function (c) { // turn every card into HTML text
  return '<a class="card" href="' + c[3] + '">' + 
    '<span class="frame"><img class="bg" src="' + PICS[c[2]] + '" alt=""></span>' + 
    '<span data-th="' + c[0] + '" data-en="' + c[1] + '"></span>' + 
    '</a>'; 
}).join("");

setLang(lang); // run the language again so the new captions get their Thai / English text
route(); // run route() again so that opening ...#/projects directly also works

/ ---------- Home page when click View more ---------- /
var homeEl = $("#home"); 
$(".btn").addEventListener("click", function (e) { // when "View more" is clicked
  e.preventDefault(); // stop the instant jump
  if (homeEl.classList.contains("opening")) return; // already animating? ignore extra clicks
  homeEl.classList.add("opening"); // add class "opening" hides the button, picture goes left, name goes right
  setTimeout(function () { // wait until the slide has finished
    location.hash = "#/portfolio"; // then go to page 2
  }, 700); // 7s 
}); 

// ---------- zoom when About me / Projects is clicked ----------
document.querySelectorAll("#portfolio .panel").forEach(function (a) { // for every panel on page 2
  a.addEventListener("click", function (e) { // when that panel is clicked
    e.preventDefault(); // cancel the instant jump
    var pf = $("#portfolio"); 
    if (pf.classList.contains("zooming")) return; // already zooming? ignore extra clicks
    var target = a.getAttribute("href"); // remember where this panel goes
    pf.classList.add("zooming"); // add class "zooming": CSS zooms in and fades out
    setTimeout(function () { // wait until the zoom has finished
      location.hash = target; // then go to the target page
    }, 600); //6s 
  }); 
}); 

// ---------- Clean the animations every time the page changes  ----------
window.addEventListener("hashchange", function () { // when the address changes
  homeEl.classList.remove("opening"); // take the home animation class off
  $("#portfolio").classList.remove("zooming"); // take the zoom class off page 2
});

// ---------- Arrow button,  scroll to bottom ----------
$("#dlBtn").addEventListener("click", function () { // when the arrow button is clicked
  window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" }); // scroll smoothly to the end of the page
});