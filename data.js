// === ATRAKCJE ===
var ATTR = [
  {"id": "kut_air", "lat": 42.1767, "lng": 42.4827, "name": "Kutaisi Airport (KUT)", "cat": "Lotnisko", "color": "#5f6368", "sz": 14, "rating": null, "reviews": null, "gmap": "https://www.google.com/maps/search/Kutaisi+Airport", "desc": "Przylot: 2.04 o 11:30 | Wylot: 9.04 o 12:30<br>Odbior/zwrot auta na lotnisku", "days": [1, 8], "inPlan": true},
  {"id": "kutaisi", "lat": 42.2679, "lng": 42.6946, "name": "Kutaisi", "cat": "Miasto", "color": "#1a73e8", "sz": 18, "rating": null, "reviews": null, "gmap": "https://www.google.com/maps/search/Kutaisi+Georgia", "desc": "Noclegi: dzien 1-2, 7<br>Bagrati, Bialy Most, Kolchis Fountain", "days": [1, 2, 7], "inPlan": true},
  {"id": "tbilisi", "lat": 41.7151, "lng": 44.8271, "name": "Tbilisi", "cat": "Miasto", "color": "#1a73e8", "sz": 18, "rating": null, "reviews": null, "gmap": "https://www.google.com/maps/search/Tbilisi+Old+Town", "desc": "Noclegi: dzien 3-6<br>Stare Miasto, Abanotubani, Narikala, Most Pokoju", "days": [3, 4, 5, 6], "inPlan": true},
  {"id": "sighnaghi", "lat": 41.6167, "lng": 45.9228, "name": "Sighnaghi", "cat": "Miasto", "color": "#1a73e8", "sz": 18, "rating": 4.7, "reviews": "3k", "gmap": "https://www.google.com/maps/search/Sighnaghi+Georgia", "desc": "Opcja w dniu 5: Miasto Milosci + NOCLEG!<br>Mury, widoki na doline Alazani<br>Guest House Vista (zarezerwowane, free cancel)", "days": [5], "inPlan": true},
  {"id": "prometheus", "lat": 42.3764, "lng": 42.6008, "name": "Jaskinia Prometeusza", "cat": "Atrakcja", "color": "#ea4335", "sz": 15, "rating": 4.6, "reviews": "5k+", "gmap": "https://www.google.com/maps/search/Prometheus+Cave+Kutaisi", "desc": "MUST-DO! Kolorowe oswietlenie + muzyka klasyczna<br>23 GEL/os, ~45 min. Opcja rejs lodka +17 GEL<br>Przyjechac rano - tlumy w sezonie!", "days": [2], "inPlan": true},
  {"id": "martvili", "lat": 42.4581, "lng": 42.3789, "name": "Kanion Martvili", "cat": "Atrakcja", "color": "#ea4335", "sz": 15, "rating": 4.5, "reviews": "6k+", "gmap": "https://www.google.com/maps/search/Martvili+Canyon+Georgia", "desc": "Turkusowa woda, rejs lodka (~15-20 min), piekne klify<br>20 GEL + lodka 20 GEL<br>UWAGA: dzieci <1m wzrostu NIE moga na lodke!<br>Spacer (800m) i tak wart zachodu", "days": [2], "inPlan": true},
  {"id": "okatse", "lat": 42.3903, "lng": 42.5044, "name": "Kanion Okatse", "cat": "Atrakcja", "color": "#ff7043", "sz": 12, "rating": 4.7, "reviews": "5.4k", "gmap": "https://www.google.com/maps/search/Okatse+Canyon+Georgia", "desc": "Most wiszacy nad kanionem, spektakularne widoki<br>ALE: 1h marszu w jedna strone - za trudny z dziecmi 3+5<br>Fantastyczny dla doroslych, skip z maluchami", "days": [], "inPlan": false},
  {"id": "gelati", "lat": 42.2961, "lng": 42.7681, "name": "Gelati Monastery", "cat": "UNESCO", "color": "#ea4335", "sz": 15, "rating": 4.8, "reviews": "7.5k", "gmap": "https://www.google.com/maps/search/Gelati+Monastery+Kutaisi", "desc": "XII-wieczny klasztor, przepiekne mozaiki<br>UNESCO - wejscie wolne", "days": [7], "inPlan": true},
  {"id": "mtskheta_jvari", "lat": 41.8385, "lng": 44.7332, "name": "Jvari Monastery", "cat": "UNESCO", "color": "#ea4335", "sz": 14, "rating": 4.8, "reviews": "11k", "gmap": "https://www.google.com/maps/search/Jvari+Monastery+Mtskheta", "desc": "VI-wieczny klasztor na wzgorzu<br>UNESCO - widok na Mtskhete i zbieg rzek<br>Dzien 6: po drodze z Sighnaghi do Tbilisi", "days": [6], "inPlan": true},
  {"id": "svetitskhoveli", "lat": 41.8422, "lng": 44.7209, "name": "Svetitskhoveli", "cat": "UNESCO", "color": "#ea4335", "sz": 14, "rating": 4.8, "reviews": "14.7k", "gmap": "https://www.google.com/maps/search/Svetitskhoveli+Cathedral+Mtskheta", "desc": "Katedra patriarchalna, XI w.<br>UNESCO - jedno z najswietszych miejsc w Gruzji<br>Dzien 6: po drodze z Sighnaghi do Tbilisi", "days": [6], "inPlan": true},
  {"id": "narikala", "lat": 41.688, "lng": 44.8088, "name": "Narikala", "cat": "Atrakcja", "color": "#ea4335", "sz": 14, "rating": 4.7, "reviews": "9.2k", "gmap": "https://www.google.com/maps/search/Narikala+Fortress+Tbilisi", "desc": "IV-wieczna twierdza nad Tbilisi<br>Panorama na cale miasto<br>Kolejka linowa z Rike Park", "days": [3], "inPlan": true},
  {"id": "baths", "lat": 41.6894, "lng": 44.8094, "name": "Laznie siarkowe", "cat": "Atrakcja", "color": "#ea4335", "sz": 13, "rating": 4.5, "reviews": "11.1k", "gmap": "https://www.google.com/maps/search/Abanotubani+sulfur+baths+Tbilisi", "desc": "Historyczne laznie siarkowe, Abanotubani<br>Prywatna sala: ~70 GEL/h (~26$)<br>Must do!", "days": [3], "inPlan": true},
  {"id": "mtatsminda", "lat": 41.6935, "lng": 44.7806, "name": "Mtatsminda Park", "cat": "Dzieci", "color": "#34a853", "sz": 16, "rating": 4.6, "reviews": "25.5k", "gmap": "https://www.google.com/maps/search/Mtatsminda+Park+Tbilisi", "desc": "Karuzele, diabelski mlyn, widoki na Tbilisi<br>Funicular ~5 GEL<br>RAJ DLA DZIECI!", "days": [4], "inPlan": true},
  {"id": "drybridge", "lat": 41.701, "lng": 44.8031, "name": "Dry Bridge Market", "cat": "Targ", "color": "#ea4335", "sz": 12, "rating": 4.5, "reviews": "9.7k", "gmap": "https://www.google.com/maps/search/Dry+Bridge+Market+Tbilisi", "desc": "Targ antykow i rekodziel (weekend!)<br>Pamiatki, obrazy, bizuteria", "days": [4], "inPlan": true},
  {"id": "pheasant", "lat": 41.6161, "lng": 45.9203, "name": "Pheasants Tears", "cat": "Winnica", "color": "#9c27b0", "sz": 12, "rating": 4.2, "reviews": "654", "gmap": "https://www.google.com/maps/search/Pheasants+Tears+Sighnaghi", "desc": "Kultowa winnica, swietne wino qvevri<br>Ale: wolna obsluga, male porcje, ryzykowne z dziecmi<br>Lepszy wybor: Okro's Wines", "days": [], "inPlan": false},
  {"id": "okros", "lat": 41.614, "lng": 45.926, "name": "Okro's Wines", "cat": "Winnica", "color": "#9c27b0", "sz": 15, "rating": 4.5, "reviews": "636", "gmap": "https://www.google.com/maps/search/Okros+Wines+Sighnaghi", "desc": "Fantastyczny taras z widokiem na Alazani!<br>Degustacja + jedzenie w jednym, wlasciciel mowi po angielsku<br>Lepszy wybor niz Pheasants Tears dla rodzin<br>Codziennie 11-20, tel: +995 551 622 228", "days": [5, 6], "inPlan": true},
  {"id": "khareba", "lat": 41.9547, "lng": 45.8147, "name": "Khareba Winery", "cat": "Winnica", "color": "#9c27b0", "sz": 15, "rating": 4.4, "reviews": "3.5k", "gmap": "https://www.google.com/maps/search/Khareba+Winery+Kvareli", "desc": "Tunel wina 7.7 km w skale!<br>PLAC ZABAW + LODZIARNIA<br>Ale: tourist trap, masowa degustacja, 2h od Tbilisi", "days": [], "inPlan": false},
  {"id": "kindzmarauli", "lat": 41.9528, "lng": 45.8239, "name": "Kindzmarauli Corp.", "cat": "Winnica", "color": "#9c27b0", "sz": 12, "rating": 4.6, "reviews": "291", "gmap": "https://www.google.com/maps/search/Kindzmarauli+Corporation+Kvareli", "desc": "Od 1533! Degustacja 5 win: 8 GEL/os<br>Kawiarnia z lodami", "days": [], "inPlan": false},
  {"id": "kazbegi", "lat": 42.6592, "lng": 44.6386, "name": "Kazbegi (Stepantsminda)", "cat": "Gory", "color": "#f9ab00", "sz": 18, "rating": 4.8, "reviews": "5k", "gmap": "https://www.google.com/maps/search/Kazbegi+Stepantsminda", "desc": "Widoki na Mt Kazbek (5047m) + Gergeti Trinity<br>4-5h od Tbilisi (z przystankami)<br>Droga gorska - lokalny kierowca rekomendowany!<br>W kwietniu mozliwy snieg na Cross Pass (2395m)", "days": [5], "inPlan": true},
  {"id": "ananuri", "lat": 42.1636, "lng": 44.7025, "name": "Ananuri", "cat": "Atrakcja", "color": "#f9ab00", "sz": 14, "rating": 4.6, "reviews": "14.9k", "gmap": "https://www.google.com/maps/search/Ananuri+Fortress+Georgia", "desc": "Twierdza nad jeziorem Zhinvali<br>1.5h od Tbilisi, po drodze na Kazbegi", "days": [5], "inPlan": true},
  {"id": "gudauri", "lat": 42.4569, "lng": 44.4728, "name": "Gudauri", "cat": "Atrakcja", "color": "#f9ab00", "sz": 13, "rating": 4.5, "reviews": "2k", "gmap": "https://www.google.com/maps/search/Gudauri+viewpoint+Georgia", "desc": "Punkt widokowy, Pomnik Przyjazni Narodow<br>Panorama Kaukazu<br>2h od Tbilisi", "days": [5], "inPlan": true},
  {"id": "botanical", "lat": 41.6876, "lng": 44.8134, "name": "Ogrod Botaniczny", "cat": "Atrakcja", "color": "#ff7043", "sz": 12, "rating": 4.6, "reviews": "12.4k", "gmap": "https://www.google.com/maps/search/Tbilisi+Botanical+Garden", "desc": "Za Narikala, ladne spacery<br>Wodospad w srodku!<br>~5 GEL", "days": [], "inPlan": false},
  {"id": "chronicle", "lat": 41.7558, "lng": 44.6969, "name": "Kronika Gruzji", "cat": "Atrakcja", "color": "#ea4335", "sz": 14, "rating": 4.8, "reviews": "12.4k", "gmap": "https://www.google.com/maps/search/Chronicle+of+Georgia+Tbilisi", "desc": "Monumentalne kolumny nad Tbilisi Sea<br>Gruzinski Stonehenge!<br>Bezplatnie, dojazd taxi ~15 min z centrum", "days": [4], "inPlan": true},
  {"id": "sataplia", "lat": 42.3156, "lng": 42.6733, "name": "Sataplia (dinozaury!)", "cat": "Dzieci", "color": "#34a853", "sz": 15, "rating": 4.5, "reviews": "1.1k", "gmap": "https://www.google.com/maps/search/Sataplia+Nature+Reserve+Kutaisi", "desc": "Slady dinozaurow! + jaskinia + szklany taras widokowy<br>10 min od Kutaisi, 1-2h<br>20 GEL/dorosly, dzieci <6 free<br>Bluza - 14°C w jaskini", "days": [2], "inPlan": true},
  {"id": "uplistsikhe", "lat": 41.9668, "lng": 44.2073, "name": "Uplistsikhe", "cat": "Atrakcja", "color": "#ff7043", "sz": 13, "rating": 4.7, "reviews": "11.4k", "gmap": "https://www.google.com/maps/search/Uplistsikhe+cave+town+Georgia", "desc": "Miasto skalne z epoki zelaza!<br>3000 lat historii<br>1h od Tbilisi", "days": [], "inPlan": false},
  {"id": "borjomi", "lat": 41.8367, "lng": 43.3903, "name": "Borjomi Park", "cat": "Dzieci", "color": "#34a853", "sz": 12, "rating": 4.6, "reviews": "15.1k", "gmap": "https://www.google.com/maps/search/Borjomi+Central+Park", "desc": "Park + wody mineralne ze zrodla<br>Kolejka linowa, baseny<br>Po drodze Kutaisi-Tbilisi (objazd)", "days": [], "inPlan": false},
  {"id": "turtle", "lat": 41.71, "lng": 44.76, "name": "Turtle Lake", "cat": "Dzieci", "color": "#34a853", "sz": 11, "rating": 4.4, "reviews": "1.6k", "gmap": "https://www.google.com/maps/search/Turtle+Lake+Tbilisi", "desc": "Jeziorko nad Tbilisi, kolejka<br>Trampoliny, plac zabaw<br>Dobre na polowe dnia", "days": [], "inPlan": false},
  {"id": "rike", "lat": 41.692, "lng": 44.806, "name": "Rike Park", "cat": "Dzieci", "color": "#34a853", "sz": 11, "rating": 4.7, "reviews": "15k", "gmap": "https://www.google.com/maps/search/Rike+Park+Tbilisi", "desc": "Park nad rzeka Kura<br>Kolejka linowa do Narikala stad!<br>Fontanny, plac zabaw", "days": [3], "inPlan": false},
  {"id": "bagrati", "lat": 42.2764, "lng": 42.6964, "name": "Katedra Bagrati", "cat": "UNESCO", "color": "#ff7043", "sz": 12, "rating": 4.7, "reviews": "5.4k", "gmap": "https://www.google.com/maps/search/Bagrati+Cathedral+Kutaisi", "desc": "XI-wieczna katedra na wzgorzu<br>Widok na cale Kutaisi<br>UNESCO", "days": [1], "inPlan": false}
];

// === PLAN DZIENNY ===
var DAYS_A = [
  {"num": 1, "date": "Czw 2.04", "title": "Przylot - Kutaisi", "drive": "~30 min", "easter": false, "points": ["kut_air", "kutaisi", "bagrati"], "nocleg": "Kutaisi \u00b7 Apt Soho Tabidze", "program": ["Lot KTW-KUT, ladowanie 11:30", "Odbior auta ~12:30", "Obiad w Kutaisi", "Katedra Bagrati + Bialy Most + Kolchis Fountain", "Spacer nad rzeka Rioni"], "food": [["Palaty", "4.5 (800)", "Obiad: polecana przez lokalsow, otwarta na lunch", "https://www.google.com/maps/search/Palaty+Kutaisi"], ["Sisters", "4.3 (1.4k)", "Kolacja: muzyka na zywo (otwieraja o 18:00!)", "https://www.google.com/maps/search/Sisters+restaurant+Kutaisi"], ["El Depo", "4.5 (1.5k)", "Alternatywa: najlepsze khinkali", "https://www.google.com/maps/search/El+Depo+Kutaisi"]], "tips": ["Spokojny start - dzieci zmeczone po locie", "Nie planuj za duzo na dzien 1", "Sisters otwiera o 18:00 - nie na obiad!"]},
  {"num": 2, "date": "Pt 3.04", "title": "Jaskinie i kaniony", "drive": "~3h lacznie", "easter": false, "points": ["prometheus", "sataplia", "martvili", "kutaisi"], "nocleg": "Kutaisi \u00b7 Apt Soho Tabidze", "program": ["Jaskinia Prometeusza (rano! 40 min jazdy, ~45 min)", "Sataplia (po drodze, 10 min od Kutaisi, 1-2h) - dinozaury!", "Kanion Martvili (po poludniu) - rejs lodka!"], "food": [["Baraqa", "4.4 (1k)", "Ogromne menu, rodzinne", "https://www.google.com/maps/search/Baraqa+Kutaisi"], ["Palaty", "4.5 (800)", "Polecana przez lokalsow", "https://www.google.com/maps/search/Palaty+Kutaisi"]], "tips": ["Prometeusz: 23 GEL/os, opcja rejsu lodka +17 GEL. Rano = mniej tlumow!", "Sataplia: dinozaury = hit dla 3- i 5-latka! 20 GEL/dorosly, dzieci <6 free. Bluza (14\u00b0C)", "Martvili: 20 GEL + lodka 20 GEL. UWAGA: dzieci <1m wzrostu NIE moga na lodke!", "Okatse: SKIP z dziecmi - 1h marszu, za trudny z maluchami", "Martvili parking: 'lokalni' mowia ze zamkniete - to scam, jedz do kasy!"]},
  {"num": 3, "date": "Sob 4.04", "title": "Przejazd do Tbilisi", "drive": "~3h", "easter": false, "points": ["kutaisi", "tbilisi", "narikala", "baths", "rike"], "nocleg": "Tbilisi \u00b7 Apartament Old Tbilisi", "program": ["Przejazd Kutaisi - Tbilisi (3h)", "Stare Miasto: Abanotubani, Most Pokoju", "Narikala - kolejka linowa z Rike Park!", "Wieczor: laznie siarkowe (prywatna sala!)"], "food": [["Keto & Kote", "4.4 (2.7k)", "World's 50 Best Discovery. REZERWACJA!", "https://www.google.com/maps/search/Keto+Kote+restaurant+Tbilisi"], ["Shavi Lomi", "4.5 (2k)", "Nowoczesna gruzinska, ogrod z kotami. Rezerwuj!", "https://www.google.com/maps/search/Shavi+Lomi+Tbilisi"]], "tips": ["Narikala: kolejka z Rike Park 2.5 GEL/os, 2 min. Dzieci kochaja!", "Laznie: Royal Bath House polecane. Sala ~70 GEL/h (4-6 os, potrzeba 2 sal!)", "UWAGA: goraca siarka za intensywna dla dzieci 3+5 - dorosli wieczorem, opieka na zmiane", "Rike Park: fontanny, plac zabaw + kolejka do Narikala", "Keto & Kote: ukryta uliczka, uprzedz o 9-os grupie!"]},
  {"num": 4, "date": "Ndz 5.04", "title": "WIELKANOC w Tbilisi", "drive": "0h (pieszy!)", "easter": true, "points": ["tbilisi", "mtatsminda", "drybridge", "botanical", "chronicle", "turtle"], "nocleg": "Tbilisi \u00b7 Apartament Old Tbilisi", "program": ["Sniadanie wielkanocne!", "Kosciol: Sameba lub Sioni", "Mtatsminda Park - funicular + karuzele + widoki", "Dry Bridge Market - antyki, rekodziel, pamiatki", "Opcja: Zoo / Contact Zoo Faunaland", "Kolacja: supra (tradycyjna uczta UNESCO!)"], "food": [["Barbarestan", "4.6 (2.7k)", "MUST-HAVE! Kuchnia z XIX-w. ksiazki kucharskiej. REZERWUJ JUZ!", "https://www.google.com/maps/search/Barbarestan+restaurant+Tbilisi"], ["Ethnographer", "4.5 (1k)", "Supra z muzyka i tancem na zywo!", "https://www.google.com/maps/search/Ethnographer+restaurant+Tbilisi"], ["Mapshalia", "4.5 (800)", "Autentyczna, nie-turystyczna", "https://www.google.com/maps/search/Mapshalia+Tbilisi"]], "tips": ["WIELKANOC KATOLICKA! Zaplanuj cos specjalnego", "Mtatsminda: funicular 15 GEL (obie strony), wstep free, atrakcje $2-5. Zaplanuj 2-3h!", "Dry Bridge Market: najlepszy w weekendy - ndz wielkanocna = ideal! 30-60 min", "Sameba: najwieksza katedra, darmowa. Wielkanoc prawoslawna - piekne ale tlumy", "Gruzini tez maluja czerwone jajka! Jejili = trawka wielkanocna z pszenica", "Opcja: Kronika Gruzji (4.8, darmowe, wow-efekt, ~15 min taxi)"]},
  {"num": 5, "date": "Pon 6.04", "title": "Dzien opcji (SPLIT!)", "drive": "0\u20132h", "easter": false, "points": ["tbilisi", "ananuri", "gudauri", "kazbegi", "sighnaghi", "okros"], "nocleg": "Tbilisi lub Sighnaghi \u00b7 Guest House Vista", "program": ["Kazdy wybiera swoja opcje!", "---", "\ud83c\udfd4\ufe0f Opcja KAZBEGI (dorosli, caly dzien):", "   Lokalny kierowca (4x4) z Tbilisi", "   Ananuri + Gudauri + Stepantsminda", "   Widoki na Kazbek (5047m!)", "   4-5h w jedna strone! Powrot wieczorem", "   \ud83c\udfe0 Nocleg: Tbilisi", "---", "\ud83c\udf77 Opcja SIGHNAGHI (caly dzien + NOCLEG):", "   Przejazd Tbilisi \u2192 Sighnaghi (~2h)", "   Spacer po murach + Okro's Wines", "   \ud83c\udfe0 Nocleg: Guest House Vista (free cancel!)", "   Mtskheta (UNESCO) robimy jutro po drodze!", "---", "\ud83c\udfe0 Opcja TBILISI (spokojny dzien):", "   Mtatsminda Park / Zoo / spacer", "   \ud83c\udfe0 Nocleg: Tbilisi"], "food": [["Rooms Hotel Kazbegi", "4.7 (2k)", "Obiad z widokiem! (opcja Kazbegi)", "https://www.google.com/maps/search/Rooms+Hotel+Kazbegi"], ["Okro's Wines", "4.5 (636)", "Taras z widokiem! (opcja Sighnaghi)", "https://www.google.com/maps/search/Okros+Wines+Sighnaghi"], ["Mapshalia", "4.5 (800)", "Autentyczna gruzinska (opcja Tbilisi)", "https://www.google.com/maps/search/Mapshalia+Tbilisi"]], "tips": ["Kazbegi: 4-5h w jedna strone. Lokalny kierowca (4x4) rekomendowany!", "Sighnaghi: nocleg w Guest House Vista (zarezerwowane, free cancel!)", "Sighnaghi z dziecmi OK! Mury + wino + spokojny wieczor", "Mtskheta (UNESCO) robimy w dniu 6 po drodze z Sighnaghi", "Bez trekkingu do Gergeti (za stromo)"], "split": true},
  {"num": 6, "date": "Wt 7.04", "title": "Powrot + Mtskheta + Cooking class", "drive": "~2.5h", "easter": false, "points": ["tbilisi", "sighnaghi", "svetitskhoveli", "mtskheta_jvari"], "nocleg": "Tbilisi \u00b7 Apartament Old Tbilisi", "program": ["Cala grupa spotyka sie w Tbilisi na cooking class!", "---", "Ci z Sighnaghi (rano):", "   Wyjazd ~10:00 z Sighnaghi", "   Opcja: Khareba Winery po drodze (30 min)", "   Mtskheta: Jvari + Svetitskhoveli (UNESCO!)", "   Przyjazd Tbilisi ~14:00", "---", "Wszyscy razem (popoludnie):", "   Cooking class: khinkali + khachapuri! \ud83e\udd5f", "   Kolacja: to co ugotowaliscie!"], "food": [["Cooking class", "", "Najlepszy posilek dnia! Eat This! Tours (4.8+)", ""], ["Sasadilo at Zeche", "4.5 (1.5k)", "Kolacja: fuzja w dawnej fabryce tytoniu", "https://www.google.com/maps/search/Sasadilo+at+Zeche+Tbilisi"]], "tips": ["Cooking class: MUST-DO! 20-50 EUR/os. Rezerwuj wczesniej, family-friendly!", "Dzieci kochaja lepienie khinkali!", "Sighnaghi \u2192 Mtskheta \u2192 Tbilisi: naturalny szlak, Mtskheta lezy po drodze!", "Svetitskhoveli + Jvari: UNESCO, darmowe, 30-45 min", "Khareba: tunel 7.7 km w skale + plac zabaw + lody (30 min od Sighnaghi)", "Lekkie popoludnie po intensywnym dniu 5"]},
  {"num": 7, "date": "Sr 8.04", "title": "Tbilisi - Kutaisi", "drive": "~3h", "easter": false, "points": ["tbilisi", "gelati", "kutaisi"], "nocleg": "Kutaisi \u00b7 Apt Soho Tabidze", "program": ["Przejazd Tbilisi - Kutaisi (3h)", "Gelati Monastery (UNESCO) - mozaiki!", "Ostatnie zakupy na rynku w Kutaisi", "Churchkhela, wino, przyprawy na prezenty"], "food": [["Bikentia", "4.5 (1k)", "Legendarny kebab od 1954!", "https://www.google.com/maps/search/Bikentia+Kutaisi"], ["Nikhrikia", "4.5 (800)", "Kultowe miesne dania od lat 50.", "https://www.google.com/maps/search/Nikhrikia+Kutaisi"], ["Sisters", "4.3 (1.4k)", "Kolacja: muzyka na zywo, atmosfera!", "https://www.google.com/maps/search/Sisters+restaurant+Kutaisi"]], "tips": ["Gelati (4.8): MUST-DO! UNESCO, XII-w. mozaiki, 30-45 min, darmowe, 20 min od Kutaisi", "Rynek = najlepsze miejsce na pamiatki", "Ostatni wieczor - Sisters na kolacje dla atmosfery!"]},
  {"num": 8, "date": "Czw 9.04", "title": "Wylot", "drive": "~30 min", "easter": false, "points": ["kutaisi", "kut_air"], "nocleg": null, "program": ["Wyjazd z Kutaisi ~10:30", "Zwrot auta na lotnisku", "Wylot 12:30 - do domu!"], "food": [["Sniadanie w hotelu", "", "", ""]], "tips": ["Min 2h przed lotem (zwrot auta + odprawa)"]}
];

// === NOCLEGI ===
var NOCLEGI = [
  {
    "city": "Kutaisi",
    "dates": "2-4.04 + 8-9.04 (3 noce)",
    "options": [
      {
        "name": "Apartment Soho Tabidze",
        "platform": "Booking.com",
        "rating": 9.7,
        "reviews": 150,
        "location": "0.6 km od centrum",
        "rooms": "2x apartament (2 syp. + 2 \u0142az. + salon + kuchnia, 65-75 m\u00b2)",
        "price": "868 z\u0142 / 2 noce (~$12/os./noc)",
        "cancel": "Bezp\u0142atne",
        "recommended": true,
        "booked": false,
        "link": "https://www.booking.com/searchresults.html?ss=Kutaisi%2C+Georgia&checkin=2026-04-02&checkout=2026-04-04&group_adults=7&group_children=2&age=3&age=5&no_rooms=3&nflt=ht_id%3D201",
        "lat": 42.271,
        "lng": 42.700
      },
      {
        "name": "Apartment BESO",
        "platform": "Booking.com",
        "rating": 8.9,
        "reviews": 376,
        "location": "1 km od centrum",
        "rooms": "2x apartament z balkonem (1 syp. + salon + \u0142az. + kuchnia)",
        "price": "871 z\u0142 / 2 noce (~$12/os./noc)",
        "cancel": "Bezp\u0142atne",
        "recommended": false,
        "booked": false,
        "link": "https://www.booking.com/searchresults.html?ss=Kutaisi%2C+Georgia&checkin=2026-04-02&checkout=2026-04-04&group_adults=7&group_children=2&age=3&age=5&no_rooms=3&nflt=ht_id%3D201",
        "lat": 42.265,
        "lng": 42.698
      }
    ]
  },
  {
    "city": "Tbilisi",
    "dates": "4-6 + 7-8.04 (3 noce, w tym Wielkanoc 5.04)",
    "options": [
      {
        "name": "Cabernet Corner \u2014 Old Tbilisi",
        "platform": "Booking.com",
        "rating": 8.6,
        "reviews": 125,
        "location": "250 m od centrum, Old Tbilisi",
        "rooms": "1 apartament \u00b7 4 sypialnie \u00b7 2 \u0142azienki \u00b7 150 m\u00b2",
        "price": "3 375 z\u0142 / 4 noce (~$23/os./noc)",
        "cancel": "Bezp\u0142atne",
        "recommended": true,
        "booked": false,
        "link": "https://www.booking.com/searchresults.html?ss=Tbilisi%2C+Georgia&checkin=2026-04-04&checkout=2026-04-08&group_adults=7&group_children=2&age=3&age=5&no_rooms=3&nflt=ht_id%3D201",
        "lat": 41.691,
        "lng": 44.810
      },
      {
        "name": "Apartament w starym Tbilisi",
        "platform": "Airbnb",
        "rating": 5.0,
        "reviews": 10,
        "location": "Old Tbilisi",
        "rooms": "4 sypialnie \u00b7 12 \u0142\u00f3\u017cek",
        "price": "1 267 z\u0142 / 4 noce (~$8/os./noc)",
        "cancel": "Bezp\u0142atne",
        "recommended": false,
        "booked": false,
        "link": "https://www.airbnb.com/s/Tbilisi--Georgia/homes?checkin=2026-04-04&checkout=2026-04-08&adults=7&children=2&children_ages=3%2C5&min_bedrooms=3&room_types%5B%5D=Entire%20home%2Fapt",
        "lat": 41.693,
        "lng": 44.808
      },
      {
        "name": "Natali Apartment",
        "platform": "Booking.com",
        "rating": 9.1,
        "reviews": 72,
        "location": "2.8 km od centrum",
        "rooms": "3 sypialnie \u00b7 1 salon \u00b7 150 m\u00b2",
        "price": "1 312 z\u0142 / 4 noce (~$9/os./noc)",
        "cancel": "Bezp\u0142atne",
        "recommended": false,
        "booked": false,
        "link": "https://www.booking.com/searchresults.html?ss=Tbilisi%2C+Georgia&checkin=2026-04-04&checkout=2026-04-08&group_adults=7&group_children=2&age=3&age=5&no_rooms=3&nflt=ht_id%3D201",
        "lat": 41.720,
        "lng": 44.795
      }
    ]
  },
  {
    "city": "Sighnaghi",
    "dates": "6-7.04 (1 noc)",
    "options": [
      {
        "name": "Guest House Vista",
        "platform": "Booking.com",
        "rating": 9.4,
        "reviews": 467,
        "location": "7 min od Muzeum Narodowego",
        "rooms": "Pok\u00f3j dwuosobowy z balkonem \u2014 19 m\u00b2",
        "price": "102 z\u0142 / 1 noc",
        "cancel": "Bezp\u0142atne",
        "recommended": true,
        "booked": true,
        "link": "https://www.booking.com/hotel/ge/guest-house-vista.html",
        "lat": 41.619,
        "lng": 45.925
      },
      {
        "name": "Zandarashvili Guest House",
        "platform": "Booking.com",
        "rating": 8.9,
        "reviews": 582,
        "location": "1.1 km, lok. 9.6",
        "rooms": "4 pokoje (basic + podw\u00f3jny + 2x rodzinny)",
        "price": "283 z\u0142 / 1 noc (~$8/os.)",
        "cancel": "Bezp\u0142atne",
        "recommended": false,
        "booked": false,
        "link": "https://www.booking.com/searchresults.html?ss=Sighnaghi&checkin=2026-04-06&checkout=2026-04-07&group_adults=7&group_children=2&age=3&age=5&no_rooms=3",
        "lat": 41.614,
        "lng": 45.918
      }
    ]
  }
];

// === TRASY NA MAPIE ===
var routeA = [[42.1767,42.4827],[42.2679,42.6946],[42.3764,42.6008],[42.4581,42.3789],[42.2679,42.6946],[41.7151,44.8271],[41.8417,44.7186],[41.6167,45.9228],[41.7151,44.8271],[42.2961,42.7681],[42.2679,42.6946],[42.1767,42.4827]];
var routeB = [[41.7151,44.8271],[42.1636,44.7025],[42.4569,44.4728],[42.6592,44.6386],[42.4569,44.4728],[42.1636,44.7025],[41.7151,44.8271]];

// === ANKIETA ===
var SURVEY_URL = "https://script.google.com/macros/s/AKfycbzWpSpBHkmgHB3h0YyYf41FCnRbN6qI3ovgX2_3MuREr81gZ3CjjQ1igOeSqxYTk-tM/exec";
var SURVEY_FORM = "https://forms.gle/23WicBwzDSRhvPkH8";
var surveyColors = ["#1a73e8","#ea4335","#34a853","#f9ab00","#9c27b0","#ff7043","#e91e63"];
