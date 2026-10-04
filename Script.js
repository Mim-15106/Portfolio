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
