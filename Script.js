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

PAGES.push("scratch", "math", "roblox", "web"); // the 4 new pages (names match the ids in the HTML and the hashes like #/scratch)
route();

// ---------- Register the simulation page ----------
PAGES.push("sim"); // the full-screen simulation page (hash #/sim)
route(); // run again so opening ...#/sim directly also works


// ===================================================================
// Model pictures: sliding carousel + big picture popup
// ===================================================================
var slides = document.querySelectorAll("#car .slide"); // the 4 model pictures
var cur = 0; // number of the picture that is in the middle now
var lb = $("#lb"); // the dark popup screen
var lbImg = $("#lbImg"); // the big picture inside the popup
var lbIdx = 0; // number of the picture shown in the popup

function paintCar() { // give every picture its place: middle (c), right (r), left (l) or hidden (h)
  slides.forEach(function (s, k) { // for every picture
    var pos = (k - cur + slides.length) % slides.length; // its distance from the middle one (0 = middle)
    var cls = pos === 0 ? "c" : pos === 1 ? "r" : pos === slides.length - 1 ? "l" : "h"; // choose the place name
    s.className = "slide " + cls; // CSS moves the picture according to this class
  }); // end of the loop
} // end of paintCar
paintCar(); // place the pictures at the start

setInterval(function () { // every few seconds...
  if (!lb.hidden || $("#project").hidden) return; // ...do nothing while the popup is open or the page is not visible
  cur = (cur + 1) % slides.length; // the next picture becomes the middle one
  paintCar(); // slide
}, 3000); // 3000 ms = 3 seconds

function lbShow(k) { // show picture number k in the popup
  lbIdx = (k + slides.length) % slides.length; // wrap around (before the first = the last, after the last = the first)
  lbImg.src = slides[lbIdx].querySelector("img").src; // copy the picture into the popup
  cur = lbIdx; // keep the carousel in sync with the popup
  paintCar(); // update the carousel
} // end of lbShow
function lbClose() { // close the popup
  lb.hidden = true; // hide it
} // end of lbClose

slides.forEach(function (s, k) { // for every picture
  s.addEventListener("click", function () { // when it is clicked...
    lbShow(k); // ...show it big
    lb.hidden = false; // ...and open the popup
  }); // end of click
}); // end of the loop
$("#lbX").addEventListener("click", lbClose); // the X button closes the popup
$("#lbPrev").addEventListener("click", function () { lbShow(lbIdx - 1); }); // the left arrow shows the previous picture
$("#lbNext").addEventListener("click", function () { lbShow(lbIdx + 1); }); // the right arrow shows the next picture
lb.addEventListener("click", function (e) { // clicking the dark area...
  if (e.target === lb) lbClose(); // ...closes the popup
}); // end
document.addEventListener("keydown", function (e) { // keyboard shortcuts while the popup is open
  if (lb.hidden) return; // popup closed? ignore
  if (e.key === "Escape") lbClose(); // Esc = close
  if (e.key === "ArrowLeft") lbShow(lbIdx - 1); // left key = previous
  if (e.key === "ArrowRight") lbShow(lbIdx + 1); // right key = next
}); // end
window.addEventListener("hashchange", lbClose); // close the popup whenever the page changes


// ===================================================================
// Simulation page: pictures of the machine program + invisible buttons
// ===================================================================
var SIM = { // the picture of every screen (rename here if your files have other names)
  start: "Pictures/StartPage.gif", // Start Page
  menu1: "Pictures/MenuPage1.png", // Menu page 1
  menu2: "Pictures/MenuPage2.png", // Menu page 2
  custom1: "Pictures/CustomPage1.png", // Custom page 1 (syrups, first half)
  custom2: "Pictures/CustomPage2.png", // Custom page 2 (syrups, second half)
  topping: "Pictures/ToppingPage.png", // sugar level + toppings
  pay: "Pictures/PayPage.png" // paying page
}; // end of SIM
var NEED_CHOICES = false; // true = "Done" works only after a sugar level AND a topping are chosen
var SW = 1280, SH = 800; // size (in pixels) of the screen pictures; the coordinates below use these pixels

Object.keys(SIM).forEach(function (k) { // for every screen picture...
  new Image().src = SIM[k]; // ...load it in advance so changing screens is instant
}); // end

function pct(r) { // turn a rectangle [x1, y1, x2, y2] (in picture pixels) into CSS percentages
  return "left:" + (r[0] / SW * 100) + "%;top:" + (r[1] / SH * 100) + "%;" + // left edge and top edge
    "width:" + ((r[2] - r[0]) / SW * 100) + "%;height:" + ((r[3] - r[1]) / SH * 100) + "%;"; // width and height
} // end of pct

var BACK = { r: [38, 25, 100, 82], act: "back" }; // the little round arrow icon at the top-left of the pictures
var TABS = [ // the two white tabs above the white panel (Custom pages and Topping page)
  { r: [585, 243, 665, 315], act: "tabSyrup" }, // left tab = syrups
  { r: [690, 243, 765, 315], act: "tabTopping" } // right tab = sugar and toppings
]; // end of TABS

function item(id, x1, y1, x2, y2, rx, ry) { // one selectable syrup: (x1,y1,x2,y2) = the area you press, (rx,ry) = top-left corner of its round button in the picture
  return { r: [x1, y1, x2, y2], act: "syrup", arg: id, m: [rx + 4, ry + 4, rx + 16, ry + 16], shape: "dot" }; // m = the inside of the ring (12x12 px) that turns green when chosen
}

function menuSpots() { // the invisible buttons of a Menu page (both menu pages use the same places)
  var list = [ // the fixed buttons
    { r: [38, 677, 135, 759], act: "flip" }, // left arrow: switch between Menu 1 and Menu 2
    { r: [1145, 677, 1240, 759], act: "flip" }, // right arrow: switch between Menu 1 and Menu 2
    { r: [890, 45, 1210, 155], act: "toCustom" }, // the word CUSTOM: go to the Custom page
    BACK // the back arrow icon: go back to the Start Page
  ]; // end of the fixed buttons
  [[195, 440], [520, 770], [840, 1090]].forEach(function (c) { // the 3 columns of drinks (x from, x to)
    [[280, 500], [520, 740]].forEach(function (rw) { // the 2 rows of drinks (y from, y to)
      list.push({ r: [c[0], rw[0], c[1], rw[1]], act: "drink" }); // one button over each drink: go to the Topping page
    }); // end of rows
  }); // end of columns
  return list; // give the list back
} // end of menuSpots

var SPOTS = { // all invisible buttons of every screen
  start: [{ full: true, act: "go", arg: "menu1" }], // Start Page: one button over the WHOLE page
  menu1: menuSpots(), // Menu page 1
  menu2: menuSpots(), // Menu page 2
  custom1: [ // Custom page 1
    { r: [1213, 537, 1268, 584], act: "cflip" }, // right arrow: go to Custom page 2
    { r: [895, 60, 1215, 205], act: "toMenu" }, // the word MENU: go back to the Menu
    BACK, TABS[0], TABS[1], // back arrow and the two tabs
    item("lychee", 535, 370, 690, 555, 534, 522), item("salak", 765, 370, 915, 555, 802, 522), item("bluehawaii", 995, 370, 1185, 555, 1006, 522), // first row of syrups (last two numbers = where the round button is)
    item("blueberry", 535, 555, 690, 735, 534, 702), item("grape", 765, 555, 915, 735, 802, 702), item("strawberry", 995, 555, 1185, 735, 1006, 702), // second row of syrups
  ], // end of custom1
  custom2: [ // Custom page 2
    { r: [472, 540, 527, 584], act: "cflip" }, // left arrow: go back to Custom page 1
    { r: [895, 60, 1215, 205], act: "toMenu" }, // the word MENU: go back to the Menu
    BACK, TABS[0], TABS[1], // back arrow and the two tabs
    item("lime", 560, 365, 740, 550, 574, 522), item("watermelon", 775, 365, 975, 550, 810, 522), item("punch", 1040, 365, 1215, 550, 1070, 522), // first row of syrups
    item("mixberries", 545, 555, 740, 735, 574, 702), item("bluelemon", 800, 555, 975, 735, 810, 702), // second row of syrups
  ], // end of custom2
  topping: [ // Topping page
    BACK, TABS[0], TABS[1], // back arrow and the two tabs
    { r: [895, 60, 1215, 205], act: "toMenu" }, // the MENU sign: go back to the Menu
    { r: [72, 648, 318, 722], act: "done" }, // the DONE button: go to the Pay page
    { r: [570, 405, 690, 460], act: "sugar", arg: "25" }, // sugar 25%
    { r: [740, 405, 860, 460], act: "sugar", arg: "50" }, // sugar 50%
    { r: [905, 405, 1025, 460], act: "sugar", arg: "75" }, // sugar 75%
    { r: [1075, 405, 1195, 460], act: "sugar", arg: "100" }, // sugar 100%
    { r: [590, 545, 722, 726], act: "topping", arg: "cube" }, // Jelly Cube (chosen = green frame)
    { r: [738, 545, 870, 726], act: "topping", arg: "fruit" }, // Fruit Jelly
    { r: [886, 545, 1018, 726], act: "topping", arg: "bear" }, // Jelly Bear
    { r: [1038, 545, 1170, 726], act: "topping", arg: "none" } // No Toppings
  ], // end of topping
  pay: [ // Pay page
    { r: [90, 220, 530, 675], act: "pay" }, // the TrueMoney square: finish and go back to the Start Page
    { r: [717, 220, 1172, 675], act: "pay" } // the PromptPay square: finish and go back to the Start Page
  ] // end of pay
}; // end of SPOTS

var st; // the state of the fake program (what screen it is on and what the user chose)
var simImg = $("#simImg"); // the screen picture element
var simHot = $("#simHot"); // the layer for the invisible buttons
var simBack = $("#simBack"); // the "<" button of the website


function isPicked(s) { // is this syrup / topping chosen? (these get a green FILL, not a frame)
  if (s.act === "syrup") return st.syrups.indexOf(s.arg) >= 0; // a syrup: is it in the chosen list?
  if (s.act === "topping") return st.topping === s.arg; // a topping: is it the chosen one?
  return false; // everything else: no
} // end of isPicked
function isOn(s) { // does this button get the green FRAME? (sugar levels and toppings; syrups get a green fill instead)
  return (s.act === "sugar" && st.sugar === s.arg) || // a sugar level: is it the chosen one?
    (s.act === "topping" && st.topping === s.arg); // a topping: is it the chosen one?
}

function simDraw() { // show the current screen: picture + invisible buttons
  var want = SIM[st.screen]; // the picture file of this screen
  if (simImg.getAttribute("src") !== want) simImg.src = want; // change the picture only when needed
  simHot.innerHTML = ""; // remove the old invisible buttons
  SPOTS[st.screen].forEach(function (s) { // make a button for every spot of this screen
    var b = document.createElement("button"); // a new button
    b.type = "button"; // a normal button
    b.className = "hs" + (s.full ? " full" : "") + (isOn(s) ? " on" : ""); // "full" = whole page, "on" = green frame
    b.setAttribute("aria-label", s.act + (s.arg ? " " + s.arg : "")); // a name for screen readers
    if (!s.full) b.style.cssText = pct(s.r); // place it over the picture (the full one needs no place)
    b.addEventListener("click", function () { simClick(s); }); // run the action when clicked
    simHot.appendChild(b); // put it on the page
    if (s.m && isPicked(s)) { // a chosen syrup / topping: lay a green fill over its round button / bar
      var k = document.createElement("div"); // a new mark
      k.className = "mk " + s.shape; // "mk dot" (round) or "mk bar" (rectangle)
      k.style.cssText = pct(s.m); // place it over the picture
      simHot.appendChild(k); // put it on the page
    }
  }); // end of the loop
} // end of simDraw

function simShow(name) { // go to another screen
  st.screen = name; // remember it
  simDraw(); // show it
} // end of simShow

function simReset() { // start again from the Start Page with nothing chosen
  st = { screen: "start", flow: "", menuPage: "menu1", syrups: [], sugar: "", topping: "" }; // flow = "menu" or "custom" (how the user reached the Topping page)
  simDraw(); // show the Start Page
} // end of simReset

function simClick(s) { // what happens when an invisible button is pressed
  var a = s.act; // the action name
  if (a === "go") { // Start Page -> Menu 1
    simShow(s.arg); // go to the screen written in the spot
  } else if (a === "flip") { // arrows on the Menu pages
    simShow(st.screen === "menu1" ? "menu2" : "menu1"); // switch between Menu 1 and Menu 2
  } else if (a === "drink") { // a drink on a Menu page
    st.flow = "menu"; // the user came from the Menu
    st.menuPage = st.screen; // remember which Menu page (for the back arrow)
    st.syrups = []; st.sugar = ""; st.topping = ""; // clear old choices
    simShow("topping"); // go to the Topping page
  } else if (a === "toCustom") { // the word CUSTOM on a Menu page
    st.menuPage = st.screen; // remember which Menu page the user came from (Menu 1 or Menu 2)
    st.flow = "custom"; // the user is making a custom drink
    st.syrups = []; st.sugar = ""; st.topping = ""; // clear old choices
    simShow("custom1"); // go to Custom page 1
  } else if (a === "toMenu") { // the word MENU on a Custom page
    st.flow = ""; // not custom any more
    st.syrups = []; st.sugar = ""; st.topping = ""; // clear old choices
    simShow(st.menuPage || "menu1"); // go back to the Menu page the user came from (Menu 1 if unknown) 
  } else if (a === "cflip") { // arrows on the Custom pages
    simShow(st.screen === "custom1" ? "custom2" : "custom1"); // switch between Custom 1 and Custom 2
  } else if (a === "syrup") { // pressing a syrup
    var i = st.syrups.indexOf(s.arg); // is it already chosen?
    var added = false; // did we just add one?
    if (i >= 0) { // already chosen...
      st.syrups.splice(i, 1); // ...so unselect it
    } else if (st.syrups.length < 3) { // not chosen and there is still room (maximum 3)...
      st.syrups.push(s.arg); // ...so select it
      added = true; // remember that we added one
    } // end of choosing
    simDraw(); // show the green frame (or remove it)
    if (added && st.syrups.length === 3) { // the third syrup was chosen...
      setTimeout(function () { // ...wait a moment so the green frame can be seen...
        if (st.screen.indexOf("custom") === 0) simShow("topping"); // ...then go to the Topping page automatically
      }, 350); // 350 ms
    } // end of auto jump
  } else if (a === "tabTopping") { // the right white tab
    if (st.screen.indexOf("custom") === 0 && st.syrups.length > 0) simShow("topping"); // on a Custom page: allowed only if at least 1 syrup is chosen
  } else if (a === "tabSyrup") { // the left white tab
    if (st.screen === "topping" && st.flow === "custom") simShow("custom1"); // from the Topping page back to Custom (NOT allowed if the user came from the Menu)
  } else if (a === "sugar") { // a sugar level
    st.sugar = st.sugar === s.arg ? "" : s.arg; // choose it, or press again to unchoose
    simDraw(); // update the frame
  } else if (a === "topping") { // a topping
    st.topping = st.topping === s.arg ? "" : s.arg; // choose it, or press again to unchoose
    simDraw(); // update the frame
  } else if (a === "done") { // the DONE button
    if (NEED_CHOICES && (!st.sugar || !st.topping)) return; // (optional rule) both choices are needed
    simShow("pay"); // go to the Pay page
  } else if (a === "pay") { // TrueMoney or PromptPay
    simReset(); // back to the Start Page, everything cleared
  } else if (a === "back") { // the "<" button (or the little arrow drawn in the pictures): go back ONE screen
    if (st.screen === "pay") { // on the Pay page...
      simShow("topping"); // ...go back to the Topping page
    } else if (st.screen === "topping") { // on the Topping page...
      simShow(st.flow === "menu" ? st.menuPage : "custom1"); // ...go back to where the user came from
    } else if (st.screen.indexOf("custom") === 0) { // on a Custom page...
      simClick({ act: "toMenu" }); // ...go back to the Menu
    } else { // on a Menu page...
      simReset(); // ...go back to the Start Page
    } // end of back
  } // end of the actions
} // end of simClick

function onSimRoute() { // runs whenever the address changes
  var on = location.hash === "#/sim"; // are we on the simulation page?
  document.documentElement.classList.toggle("sim", on); // the "sim" class hides the top bar and the scrolling
  if (on) simReset(); // always start from the Start Page when the page is opened
} // end of onSimRoute
window.addEventListener("hashchange", onSimRoute); // run it every time the address changes
simReset(); // prepare the state once now
onSimRoute(); // and check once now, for the page that is open at the start


// ===================================================================
// Simulation page on a phone: force the landscape (full screen) view
// ===================================================================
var isTouch = window.matchMedia && window.matchMedia("(pointer: coarse)").matches; // true on phones and tablets (not on a computer with a mouse)

function enterLandscape() { // try to make the phone really full screen and landscape
  if (!isTouch) return; // a computer: do nothing
  var d = document.documentElement; // the whole page
  try { // (every step can be refused by some browsers, so nothing here may break the page)
    var p = d.requestFullscreen ? d.requestFullscreen() : null; // 1) ask for full screen (the browser only allows it right after a tap)
    if (p && p.then) { // 2) when full screen is on...
      p.then(function () { // ...ask the phone to turn to landscape
        if (screen.orientation && screen.orientation.lock) screen.orientation.lock("landscape").catch(function () {}); // lock landscape (Android Chrome); if refused, the CSS rotation is used instead
      }).catch(function () {}); // full screen refused: the CSS rotation is used instead
    } // end of if
  } catch (e) {} // ignore any error
} // end of enterLandscape

function leaveLandscape() { // give the phone its normal screen back
  if (!isTouch) return; // a computer: do nothing
  try { // (ignore any error)
    if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); // allow the phone to turn freely again
    if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(function () {}); // leave full screen
  } catch (e) {} // ignore any error
} // end of leaveLandscape

document.querySelectorAll('a[href="#/sim"]').forEach(function (a) { // the GIF and the "Robot Bartender" button that open the simulation
  a.addEventListener("click", enterLandscape); // a real tap: the only moment the browser allows full screen
}); // end of the loop
window.addEventListener("hashchange", function () { // every time the address changes...
  if (location.hash !== "#/sim") leaveLandscape(); // ...and we are no longer on the simulation page, go back to normal
}); // end
