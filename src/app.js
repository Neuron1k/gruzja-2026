// === MAPA ===
var map = L.map("map",{zoomControl:false}).setView([42.0,44.0],8);
L.control.zoom({position:"topright"}).addTo(map);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"OpenStreetMap",maxZoom:18}).addTo(map);

function mkI(c,s){return L.divIcon({html:'<div class="cm" style="background:'+c+';width:'+s+'px;height:'+s+'px"></div>',iconSize:[s,s],iconAnchor:[s/2,s/2],className:""});}

// === ATTRACTION → DAY LOOKUP ===
var attrToDays={};
DAYS_A.forEach(function(d,i){
  d.points.forEach(function(pid){
    if(!attrToDays[pid]) attrToDays[pid]=[];
    attrToDays[pid].push(i);
  });
});

var markers={};
ATTR.forEach(function(a){
  var pop='<span class="pop-badge" style="background:'+(a.color==="#1a73e8"?"#e8f0fe":a.color==="#9c27b0"?"#f3e8fd":a.color==="#34a853"?"#e6f4ea":a.color==="#f9ab00"?"#fef7e0":a.color==="#ff7043"?"#fff3e0":"#f1f3f4")+';color:'+(a.color==="#1a73e8"?"#1967d2":a.color==="#fff"?"#5f6368":a.color)+'">' +a.cat+'</span><b>'+a.name+'</b>';
  if(a.rating) pop+='<div class="pop-r">&#11088; '+a.rating+'/5 ('+a.reviews+' reviews)</div>';
  pop+=a.desc;
  pop+='<br><a class="pop-link" href="'+a.gmap+'" target="_blank">&#128205; Otworz w Google Maps</a>';
  if(a.georgiaTo) pop+='<br><a class="pop-link pop-link-gt" href="'+a.georgiaTo+'" target="_blank">&#127468;&#127466; Wiecej na georgia.to &rarr;</a>';
  if(attrToDays[a.id]){
    attrToDays[a.id].forEach(function(di){
      pop+='<br><span class="pop-day-link" onclick="goToDay('+di+')">\ud83d\udcc5 Dzie\u0144 '+(di+1)+'</span>';
    });
  }
  var m=L.marker([a.lat,a.lng],{icon:mkI(a.color,a.sz)});
  m.addTo(map);
  m.bindPopup(pop,{maxWidth:260});
  markers[a.id]={m:m,d:a};
});

var accMarkers=[];
NOCLEGI.forEach(function(city){
  city.options.forEach(function(opt){
    if(!opt.recommended && !opt.booked) return;
    var pop='<span class="pop-badge" style="background:#fce4ec;color:#c2185b">Nocleg</span><b>'+opt.name+'</b>';
    pop+='<div class="pop-r">\u2b50 '+opt.rating+'/5 ('+opt.reviews+' opinii)</div>';
    pop+=opt.platform+' \u00b7 '+opt.location+'<br>';
    pop+='<strong>'+opt.price+'</strong><br>';
    pop+='<a class="pop-link" href="'+opt.link+'" target="_blank">\ud83d\udd17 Rezerwuj</a>';
    var m=L.marker([opt.lat,opt.lng],{icon:mkI("#e91e63",14)}).addTo(map);
    m.bindPopup(pop,{maxWidth:260});
    accMarkers.push(m);
    markers['acc_'+opt.name.replace(/\s/g,'_')]={m:m,d:{color:"#e91e63",cat:"Zakwaterowanie"}};
  });
});

// === FILTRY ===
var hiddenCats={};
function toggleCat(color,el){
  if(hiddenCats[color]){
    delete hiddenCats[color];
    el.classList.remove("off");
    Object.keys(markers).forEach(function(id){
      var mk=markers[id];
      if(mk.d.color===color) mk.m.addTo(map);
    });
  }else{
    hiddenCats[color]=true;
    el.classList.add("off");
    Object.keys(markers).forEach(function(id){
      var mk=markers[id];
      if(mk.d.color===color) map.removeLayer(mk.m);
    });
  }
}

// === TRASY ===
var lineA=L.polyline(routeA,{color:"#1a73e8",weight:2,opacity:0.4,dashArray:"6,8"}).addTo(map);
var lineB=L.polyline(routeB,{color:"#f9ab00",weight:2,opacity:0.4,dashArray:"6,8"}).addTo(map);

// === PLAN DZIENNY ===
var ad=null;

function getDays(){
  return JSON.parse(JSON.stringify(DAYS_A));
}

function render(){
  var days=getDays(),h="";
  h+='<div class="day-nav">';
  days.forEach(function(d,i){
    var cls=''+(ad===i?' dn-on':'')+(d.easter?' dn-easter':'');
    h+='<button class="'+cls.trim()+'" onclick="event.stopPropagation();sel('+i+')">'+d.num+'</button>';
  });
  h+='</div>';
  days.forEach(function(d,i){
    var cls="dc"+(d.easter?" easter-bg":"")+(ad===i?" on":"");
    h+='<div class="'+cls+'" onclick="sel('+i+')">';
    h+='<div class="dh"><div class="dn">'+d.num+'</div><div class="dd">'+d.date+'</div></div>';
    h+='<div class="dt">'+d.title+'</div>';
    var cityOnly=d.nocleg?d.nocleg.split(' \u00b7 ')[0]:null;
    h+='<div class="dr">&#128663; '+d.drive+(cityOnly?' &nbsp;|&nbsp; \ud83c\udfe0 '+cityOnly:'')+'</div>';
    h+='<div class="det'+(ad===i?" show":"")+'">';
    if(d.split) h+='<div class="ds split-box"><h4>&#128161; OPCJA SPLIT</h4>Kazdy wybiera swoja opcje! Chetni na Kazbegi z lokalnym kierowca (caly dzien, dorosli). Reszta do Sighnaghi z noclegiem (Guest House Vista, free cancel!) lub spokojny dzien w Tbilisi. Cooking class razem w dniu 6!</div>';
    h+='<div class="ds prog"><h4>&#128205; Program</h4><ul>';
    d.program.forEach(function(p){
      var txt=Array.isArray(p)?p[0]:p;
      var pid=Array.isArray(p)?p[1]:null;
      if(txt==="---") h+='<li class="sep"></li>';
      else if(pid&&markers[pid]) h+='<li class="prog-link" onclick="event.stopPropagation();flyTo(\''+pid+'\')">'+txt+'</li>';
      else h+="<li>"+txt+"</li>";
    });
    h+="</ul></div>";
    h+='<div class="ds food"><h4>&#127869; Jedzenie</h4>';
    d.food.forEach(function(f){
      h+='<div class="food-item"><span class="food-name">'+f[0]+'</span>';
      if(f[1]) h+=' <span class="food-stars">&#11088; '+f[1]+'</span>';
      if(f[2]) h+=' <span style="color:#5f6368">'+f[2]+'</span>';
      if(f[3]) h+=' <a href="'+f[3]+'" target="_blank">Maps</a>';
      h+="</div>";
    });
    h+="</div>";
    h+='<div class="ds tip"><h4>&#128161; Tips</h4><ul>';
    d.tips.forEach(function(t){h+="<li>"+t+"</li>";});
    h+="</ul></div>";
    h+='<div class="day-map-cta" onclick="event.stopPropagation();showDayOnMap('+i+')">\ud83d\uddfa\ufe0f Pokaz wszystkie punkty na mapie</div>';
    if(d.nocleg){
      var nCity=d.nocleg.split(' \u00b7 ')[0];
      h+='<div class="ds" style="background:#e8f5e9;border:1px solid #c8e6c9;text-align:center;font-weight:600;color:#2e7d32;cursor:pointer" onclick="event.stopPropagation();goToNocleg(\''+nCity.replace(/'/g,"\\'")+'\')">\ud83c\udfe0 Nocleg: '+d.nocleg+'</div>';
    }
    h+="</div></div>";
  });
  document.getElementById("daysList").innerHTML=h;
}

function sel(i){
  ad=ad===i?null:i;
  render();
  if(ad!==null){
    var navBtn=document.querySelector('.day-nav .dn-on');
    if(navBtn)navBtn.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
    var days=getDays(),d=days[ad],bounds=[];
    d.points.forEach(function(pid){if(markers[pid])bounds.push(markers[pid].m.getLatLng());});
    if(bounds.length>1)map.fitBounds(bounds,{padding:[50,50],maxZoom:11});
    else if(bounds.length===1)map.setView(bounds[0],11);
    setTimeout(function(){highlightDayMarkers(d.points);},100);
  }else{
    highlightDayMarkers(null);
  }
}

function toggleExtras(){
  var el=document.getElementById("extraList");
  el.classList.toggle("show");
  if(el.classList.contains("show")&&!el.innerHTML){
    var extras=ATTR.filter(function(a){return !a.inPlan;});
    var h="";
    extras.forEach(function(a){
      h+='<div class="ex" onclick="flyTo(\''+a.id+'\')">';
      h+='<div class="en">'+a.name+' <span class="ec">'+a.cat+'</span>';
      if(a.rating) h+=' <span class="er">&#11088; '+a.rating+' ('+a.reviews+')</span>';
      h+=' <a href="'+a.gmap+'" target="_blank" onclick="event.stopPropagation()">Maps</a></div>';
      h+='<div class="ec">'+a.desc.replace(/<br>/g," | ")+'</div>';
      h+="</div>";
    });
    el.innerHTML=h;
  }
}

var backBtnTimer=null;
function showBackBtn(){
  var btn=document.getElementById('mapBackBtn');
  if(btn){btn.classList.add('show');clearTimeout(backBtnTimer);backBtnTimer=setTimeout(hideBackBtn,5000);}
}
function hideBackBtn(){
  var btn=document.getElementById('mapBackBtn');
  if(btn)btn.classList.remove('show');
  clearTimeout(backBtnTimer);
}

function flyTo(id){
  if(markers[id]){
    var m=markers[id].m;
    if(!map.hasLayer(m))m.addTo(map);
    if(window.innerWidth<=768){mobileView('map');showBackBtn();}
    map.setView(m.getLatLng(),12);
    setTimeout(function(){m.openPopup();},200);
  }
}

function goToDay(i){
  if(window.innerWidth<=768) mobileView('list');
  ad=i;
  render();
  var card=document.querySelectorAll('.dc')[i];
  if(card) card.scrollIntoView({behavior:'smooth',block:'start'});
}

function showDayOnMap(i){
  var days=getDays(),d=days[i],bounds=[];
  d.points.forEach(function(pid){if(markers[pid])bounds.push(markers[pid].m.getLatLng());});
  if(window.innerWidth<=768){mobileView('map');showBackBtn();}
  if(bounds.length>1)map.fitBounds(bounds,{padding:[50,50],maxZoom:12});
  else if(bounds.length===1)map.setView(bounds[0],12);
  highlightDayMarkers(d.points);
}

function goToNocleg(city){
  var btn=document.querySelector('.main-tabs button:nth-child(2)');
  mainTab('noclegi',btn);
  setTimeout(function(){
    var headers=document.querySelectorAll('#noclegiPanel h4');
    var parts=city.split(/ lub | \/ /);
    for(var i=0;i<headers.length;i++){
      for(var p=0;p<parts.length;p++){
        if(headers[i].textContent.indexOf(parts[p].trim())!==-1){
          headers[i].scrollIntoView({behavior:'smooth',block:'start'});
          return;
        }
      }
    }
  },50);
}

// === BUDŻET ===
function renderBudget(){
  var el=document.getElementById("budgetPanel");
  el.innerHTML=
    '<h4>&#128663; Transport \u2014 por\u00f3wnanie (7 dni)</h4>'+
    '<table>'+
    '<tr><th>Opcja</th><th>Koszt 7 dni</th><th>/osoba</th></tr>'+
    '<tr><td><strong>\u2b50 CheckInKutaisi</strong><br>KIA Carnival 9-os, diesel, CDW gratis, foteliki gratis</td><td>\u20ac350 + ~\u20ac200 paliwo<br>= <strong>\u20ac550</strong></td><td class="best">~\u20ac61</td></tr>'+
    '<tr><td>LocalRent (Starex)<br>Automat, foteliki 2\u00d7$35, dep. $500</td><td>$785 + ~$200 paliwo<br>= ~\u20ac900</td><td>~\u20ac100</td></tr>'+
    '<tr><td>Martyna z Gruzji \ud83e\uddd1\u200d\u2708\ufe0f<br>Z kierowc\u0105, zero stresu</td><td>\u20ac1260 + ~\u20ac250 paliwo<br>= \u20ac1510</td><td>~\u20ac168</td></tr>'+
    '<tr><td>Kierowca + przewodnik PL \ud83c\uddf5\ud83c\uddf1<br>Kierowca + polski przewodnik (+\u20ac200/dzie\u0144)</td><td>\u20ac1260 + \u20ac1400 przewodnik<br>+ ~\u20ac250 paliwo = <strong>\u20ac2910</strong></td><td>~\u20ac323</td></tr>'+
    '</table>'+
    '<div class="note">\ud83d\udca1 CheckInKutaisi: dep. \u20ac100 zwrotny, foteliki gratis, CDW w cenie. Kierowca = +\u20ac107/os ale zero stresu + zna drogi (Kazbegi!). Przewodnik PL: +\u20ac156/os ale komfort i wiedza.</div>'+
    '<div class="note">\ud83c\udfd4\ufe0f Opcja Kazbegi: Lokalny kierowca z 4x4 na ca\u0142y dzie\u0144 to ok. 150-200 GEL (~\u20ac55-75) \u2014 dzielone na ch\u0119tnych.</div>'+

    '<h4>&#128176; Szacunek na osob\u0119 (self-drive)</h4>'+
    '<div class="brow"><span>\ud83d\ude97 Transport (CheckInKutaisi)</span><span class="best">~\u20ac61</span></div>'+
    '<div class="brow"><span>\ud83c\udfe8 Noclegi (7 nocy)</span><span>~\u20ac50\u201370</span></div>'+
    '<div class="brow"><span>\ud83c\udf7d Jedzenie (7 dni, ~\u20ac10\u201315/dzie\u0144)</span><span>~\u20ac70\u2013100</span></div>'+
    '<div class="brow"><span>\ud83c\udfaf Atrakcje (jaskinia, kanion, \u0142a\u017anie, cooking)</span><span>~\u20ac20\u201330</span></div>'+
    '<div class="brow"><span>\ud83c\udf77 Wino / degustacje</span><span>~\u20ac15\u201325</span></div>'+
    '<div class="brow"><span>\ud83c\udf81 Pami\u0105tki + SIM + ubezpieczenie</span><span>~\u20ac25\u201340</span></div>'+
    '<div class="brow total"><span>RAZEM (self-drive)</span><span class="best">~\u20ac250\u2013350</span></div>'+
    '<div class="brow total"><span>RAZEM (z kierowc\u0105)</span><span>~\u20ac350\u2013450</span></div>'+
    '<div class="brow total"><span>RAZEM (kierowca + przewodnik)</span><span>~\u20ac500\u2013600</span></div>'+

    '<h4>&#127919; Atrakcje \u2014 rozpiska koszt\u00f3w</h4>'+
    '<div class="brow"><span>Jaskinia Prometeusza</span><span>23 GEL/os (+17 GEL \u0142\u00f3dka)</span></div>'+
    '<div class="brow"><span>Kanion Martvili</span><span>~20 GEL/os (~\u20ac7)</span></div>'+
    '<div class="brow"><span>\u0141a\u017anie siarkowe (sala/h)</span><span>70 GEL (~\u20ac25) \u00f7 grupa</span></div>'+
    '<div class="brow"><span>Cooking class</span><span>\u20ac20\u201350/os</span></div>'+
    '<div class="brow"><span>Supra wielkanocna</span><span>$30\u201350/os</span></div>'+
    '<div class="brow"><span>Sataplia</span><span>20 GEL/os (dzieci <6 free)</span></div>'+
    '<div class="brow"><span>Mtatsminda Park</span><span>funicular 15 GEL + atrakcje $2\u20135</span></div>'+
    '<div class="brow"><span>Gelati, Mtskheta, Jvari</span><span>bezp\u0142atne</span></div>'+

    '<h4>&#128722; Ceny w Gruzji</h4>'+
    '<div class="brow"><span>Khinkali (1 szt.)</span><span>1\u20132 GEL (\u20ac0.50)</span></div>'+
    '<div class="brow"><span>Obiad (restauracja)</span><span>25\u201350 GEL (\u20ac9\u201318)</span></div>'+
    '<div class="brow"><span>Kawa</span><span>2\u20136 GEL (\u20ac1\u20132)</span></div>'+
    '<div class="brow"><span>Piwo (restauracja)</span><span>6\u201310 GEL (\u20ac2\u20134)</span></div>'+
    '<div class="brow"><span>Wino (sklep)</span><span>5\u201312 GEL (\u20ac2\u20134)</span></div>'+
    '<div class="brow"><span>Taxi (Bolt, kr\u00f3tki)</span><span>6\u201310 GEL (\u20ac2\u20134)</span></div>';
}

// === PAKOWANIE ===
var PACK_ITEMS=[
  {cat:"\ud83d\udc55 Ubrania"},
  {text:"Kurtka przeciwdeszczowa (kwiecie\u0144 = kapry\u015bny!)",imp:true},
  {text:"Polar / bluza na wieczory (g\u00f3ry ch\u0142odne)"},
  {text:"Wygodne buty do chodzenia (du\u017co bruku!)"},
  {text:"Sanda\u0142y / klapki (\u0142a\u017anie siarkowe)"},
  {text:"Koszulki, spodnie na ~20\u00b0C dzie\u0144 / ~8\u00b0C noc"},
  {text:"Czapka z daszkiem / okulary"},
  {cat:"\ud83d\udc76 Dla ch\u0142opc\u00f3w (3 i 5 lat)"},
  {text:"Przek\u0105ski na drog\u0119 (du\u017co!)"},
  {text:"Lekki w\u00f3zek spacerowy (opcja)"},
  {text:"Bluzy zapasowe (khinkali = ba\u0142agan)"},
  {cat:"\ud83d\udcc4 Dokumenty"},
  {text:"Paszport (min. 6 mies. wa\u017cno\u015bci!)",imp:true},
  {text:"Revolut / karta wielowalutowa (GEL!)",imp:true},
  {text:"Ubezpieczenie podr\u00f3\u017cne + EKUZ"},
  {text:"Wydruk rezerwacji (hotel, auto, loty)"},
  {text:"Prawo jazdy (kat. B wystarczy)"},
  {cat:"\ud83d\udc8a Apteczka"},
  {text:"Ibuprofen / paracetamol"},
  {text:"Leki na biegunk\u0119 (zmiana kuchni!)"},
  {text:"Plastry, \u015brodek odka\u017caj\u0105cy"},
  {text:"Krem z filtrem SPF30+"},
  {text:"\u015arodek na komary (wieczory nad rzek\u0105)"},
  {cat:"\ud83d\ude97 W aucie"},
  {text:"Foteliki \u2014 NA MIEJSCU (CheckInKutaisi: gratis!)"},
  {text:"Nawigacja offline (Maps.me lub Google Maps)"},
  {text:"\u0141adowarka USB / powerbank"},
  {text:"Woda, chusteczki mokre"},
  {cat:"\ud83d\udcf1 Technika"},
  {text:"SIM / eSIM (Magti/Geocell na lotnisku, ~\u20ac5)"},
  {text:"Powerbank"}
];

function getPackState(){
  try{return JSON.parse(localStorage.getItem("gruzja-packing"))||{};}catch(e){return {};}
}
function savePackState(s){
  try{localStorage.setItem("gruzja-packing",JSON.stringify(s));}catch(e){}
}
function togglePack(idx){
  var s=getPackState();
  if(s[idx]) delete s[idx]; else s[idx]=true;
  savePackState(s);
  renderPacking();
}
function resetPacking(){
  try{localStorage.removeItem("gruzja-packing");}catch(e){}
  renderPacking();
}

function renderPacking(){
  var el=document.getElementById("packingPanel");
  var state=getPackState();
  var total=0,checked=0;
  PACK_ITEMS.forEach(function(p,i){
    if(p.text){total++;if(state[i])checked++;}
  });
  var pct=total>0?Math.round(checked/total*100):0;
  var h='<div class="pack-progress">Spakowano: <strong>'+checked+'/'+total+'</strong>';
  h+='<div class="pack-progress-bar"><div class="pack-progress-fill" style="width:'+pct+'%"></div></div></div>';
  PACK_ITEMS.forEach(function(p,i){
    if(p.cat){
      h+='<div class="pack-cat">'+p.cat+'</div>';
    }else{
      var cls='pack-item'+(p.imp?' important':'')+(state[i]?' checked':'');
      h+='<div class="'+cls+'" onclick="togglePack('+i+')">'+p.text+'</div>';
    }
  });
  h+='<div class="note" style="margin-top:12px">\ud83d\udd0c Adapter gniazdka NIE jest potrzebny \u2014 Gruzja ma takie same gniazdka jak Polska (typ C/F).</div>';
  h+='<button class="pack-reset" onclick="resetPacking()">\u21bb Resetuj pakowanie</button>';
  el.innerHTML=h;
}

// === NOCLEGI ===
function renderNoclegi(){
  var el=document.getElementById("noclegiPanel");
  var h='';
  NOCLEGI.forEach(function(city){
    h+='<h4>\ud83d\udccd '+city.city+' \u2014 '+city.dates+'</h4>';
    city.options.forEach(function(opt){
      var cls='acc-card'+(opt.recommended?' recommended':'')+(opt.booked?' booked':'');
      h+='<div class="'+cls+'">';
      if(opt.booked) h+='<span class="acc-badge book">\u2705 Zarezerwowano</span>';
      if(opt.recommended) h+='<span class="acc-badge rec">\u2b50 Rekomendacja</span>';
      h+='<div class="acc-name">'+opt.name+'</div>';
      h+='<div class="acc-detail">'+opt.platform+' \u00b7 \u2b50 '+opt.rating+' ('+opt.reviews+') \u00b7 '+opt.location+'</div>';
      h+='<div class="acc-detail">'+opt.rooms+'</div>';
      h+='<div class="acc-price">'+opt.price+'</div>';
      h+='<div class="acc-detail">Anulowanie: '+opt.cancel+'</div>';
      h+='<div class="acc-links"><a href="'+opt.link+'" target="_blank">\ud83d\udd17 Zobacz na '+opt.platform+'</a></div>';
      h+='</div>';
    });
  });
  h+='<h4>\ud83d\udcb0 Podsumowanie nocleg\u00f3w</h4>';
  h+='<div class="note">Wariant ekonomiczny: ~2 852 z\u0142 (~$713) za 8 nocy na 9 os\u00f3b = <strong>~$10/os./noc</strong><br>';
  h+='Wariant comfort: ~$138/os. za ca\u0142y tydzie\u0144</div>';
  el.innerHTML=h;
}

// === ANKIETA ===
function renderAnkieta(){
  var el=document.getElementById("ankietaPanel");
  el.innerHTML='<a class="survey-btn" href="'+SURVEY_FORM+'" target="_blank">\ud83d\udcdd Wype\u0142nij ankiet\u0119</a>'+
    '<div class="survey-loading">\u23f3 \u0141adowanie wynik\u00f3w ankiety...</div>';
  fetch(SURVEY_URL)
    .then(function(r){return r.json();})
    .then(function(data){
      var h='<a class="survey-btn" href="'+SURVEY_FORM+'" target="_blank">\ud83d\udcdd Wype\u0142nij ankiet\u0119</a>';
      h+='<div class="survey-respondents">Odpowiedzi: <strong>'+data.total+'</strong> \u2014 '+data.respondents.join(", ")+'</div>';
      data.questions.forEach(function(q,qi){
        h+='<div class="survey-q"><h4>'+q.title+'</h4>';
        var total=0;
        Object.keys(q.results).forEach(function(k){total+=q.results[k];});
        Object.keys(q.results).forEach(function(k,ki){
          var count=q.results[k];
          var pct=total>0?Math.round(count/total*100):0;
          var color=surveyColors[ki%surveyColors.length];
          h+='<div class="survey-bar-wrap">';
          h+='<div class="survey-bar-label">'+k+'</div>';
          h+='<div class="survey-bar-track"><div class="survey-bar-fill" style="width:'+pct+'%;background:'+color+'"><span class="survey-bar-pct">'+(pct>8?pct+'%':'')+'</span></div></div>';
          h+='<div class="survey-bar-count">'+count+'</div>';
          h+='</div>';
        });
        h+='</div>';
      });
      if(data.comments&&data.comments.length){
        h+='<div class="survey-q"><h4>\ud83d\udcac Uwagi i pomys\u0142y</h4>';
        data.comments.forEach(function(c){
          h+='<div class="survey-comment">"'+c+'"</div>';
        });
        h+='</div>';
      }
      el.innerHTML=h;
    })
    .catch(function(err){
      el.innerHTML='<a class="survey-btn" href="'+SURVEY_FORM+'" target="_blank">\ud83d\udcdd Wype\u0142nij ankiet\u0119</a>'+
        '<div class="survey-error">\u274c Nie uda\u0142o si\u0119 za\u0142adowa\u0107 wynik\u00f3w.<br>Sprawd\u017a czy Apps Script jest wdro\u017cony.<br><small>'+err.message+'</small></div>';
    });
}

// === TABS ===
function mainTab(tab,btn){
  document.querySelectorAll('.main-tabs button').forEach(function(b){b.classList.remove('on');});
  btn.classList.add('on');
  document.querySelectorAll('.tab-pane').forEach(function(p){p.classList.remove('active');});
  document.getElementById('pane-'+tab).classList.add('active');
}

// === MOBILE FILTRY ===
function toggleMapFilters(){
  var ov=document.getElementById("mapFilterOverlay");
  if(ov.classList.contains("show")){ov.classList.remove("show");return;}
  var cats=[
    ["#1a73e8","Miasto"],["#ea4335","Atrakcja"],["#9c27b0","Winnica"],
    ["#34a853","Dzieci"],["#f9ab00","Kazbegi"],["#ff7043","Bonus"],["#e91e63","Noclegi"]
  ];
  var h='<div style="font-size:10px;font-weight:600;color:#5f6368;text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px">Filtry</div>';
  cats.forEach(function(c){
    var off=hiddenCats[c[0]]?" off":"";
    h+='<div class="leg-i'+off+'" onclick="toggleCatMobile(\''+c[0]+'\',this)"><div class="leg-d" style="background:'+c[0]+'"></div>'+c[1]+'</div>';
  });
  ov.innerHTML=h;
  ov.classList.add("show");
}
function toggleCatMobile(color,el){
  toggleCat(color,el);
  var panelItems=document.querySelectorAll('.leg .leg-i');
  panelItems.forEach(function(item){
    var dot=item.querySelector('.leg-d');
    if(dot&&dot.style.background===color){
      if(hiddenCats[color]) item.classList.add('off');
      else item.classList.remove('off');
    }
  });
}

// === HIGHLIGHT ===
function highlightDayMarkers(dayPoints){
  Object.keys(markers).forEach(function(id){
    var el=markers[id].m.getElement&&markers[id].m.getElement();
    if(!el) return;
    var dot=el.querySelector('.cm');
    if(!dot) return;
    if(!dayPoints){
      dot.classList.remove('cm-dim','cm-highlight');
      return;
    }
    if(dayPoints.indexOf(id)!==-1){
      dot.classList.remove('cm-dim');
      dot.classList.add('cm-highlight');
    }else{
      dot.classList.remove('cm-highlight');
      dot.classList.add('cm-dim');
    }
  });
}

// === MOBILE VIEW ===
function mobileView(v){
  var b=document.body;
  if(v==='map'){
    b.classList.add('m-map');b.classList.remove('m-list');
    document.getElementById('btn-map').classList.add('active');
    document.getElementById('btn-list').classList.remove('active');
    setTimeout(function(){if(typeof map!=='undefined')map.invalidateSize();},150);
  }else{
    b.classList.add('m-list');b.classList.remove('m-map');
    document.getElementById('btn-list').classList.add('active');
    document.getElementById('btn-map').classList.remove('active');
    var ov=document.getElementById('mapFilterOverlay');if(ov)ov.classList.remove('show');
  }
}
if(window.innerWidth<=768)document.body.classList.add('m-list');
window.addEventListener('resize',function(){
  if(window.innerWidth>768){document.body.classList.remove('m-map','m-list');if(typeof map!=='undefined')map.invalidateSize();}
});

// === INIT ===
render();
renderBudget();
renderPacking();
renderNoclegi();
renderAnkieta();
