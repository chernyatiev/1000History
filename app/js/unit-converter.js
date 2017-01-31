var inputFrom;
var inputTo;
var listQuantities;
var selectQuantity;
var selectFrom;
var selectTo;
var precision;
var quantity;
var metaTagDescription;
var divSettings;
var divWhatsNew;
var divDisclaimer;
var divTips;
var currencies;

var defaultQuantityIndex = 9;
var quantities = [
  { 'name': 'Длины',
    'description': 'Convert length measurements like meter, inches, feet or light years.',
    'path': 'length.htm',
    'defaultUnitIndex': 18,
    'units': [
      ["сантиметры",                     "см",       0.01],
      ["дециметры",                      "дм",       0.1],
      ["гектары",                     "",       100],
      ["дюймы",                          "",       0.0254],
      ["километры",                      "км",       1000],
      ["метры",                          "м",        1],
      ["миллиметры",                     "мм",       0.001],
      ["нанометры",                      "нм",       1e-9],
      ["ярды",                           "",         0.9144]
    ]},
  { 'name': 'Веса',
    'description': 'Convert mass measurements like kilograms, pounds, stones.',
    'path': 'mass.htm',
    'defaultUnitIndex': 9,
    'units': [
      ["граммы",                          "г",    1e-3],
      ["гектары",                     "",   0.1],
      ["килограммы",                      "кг",   1],
      ["миллиграммы",                     "мг",   1e-6],
      ["нанограммы",                      "нг",   1e-12],
      ["тоны",                "",     1000]
    ]},
  { 'name': 'Объем',
    'description': 'Convert volume measurements like cubic meters, liters, gallons, pints.',
    'path': 'volume.htm',
    'defaultUnitIndex': 27,
    'units': [
      ["киллолитры",              "кл",     1e3],
      ["литры",                  "л", 1],
      ["литры (1901-1964)",      "",       1.000028],
      ["миллилитры",             "",     1e-3],
      ["микролитры",             "",     1e-6]
    ]},
  { 'name': 'Площади',
    'description': 'Convert area measurements like square meters, square feet, acres.',
    'path': 'area.htm',
    'defaultUnitIndex': 11,
    'units': [
      ["акры",                      "",    4046.8564224],
      ["ары",                       "",    100],
      ["гектары",                   "",    1e4],
      ["квадратные сантиметры",         "", 1e-4],
      ["квадратные футы (США и Великобритания)",      "",    0.09290304],
      ["квадратные футы (США)",    "",    0.092903411613],
      ["квадратные дюймы",              "",    0.00064516],
      ["квадратные километры",          "", 1e6],
      ["квадратные метры",              "",  1],
      ["квадратные мили",               "",    2589988.110336],
      ["квадратные миллиметры",         "", 1e-6],
      ["квадраты",        "",    9.290304],
      ["квадратные стержни (или столбы)",     "",    25.29285264],
      ["квадратные ярды",               "",    0.83612736]
    ]},
  { 'name': 'Время',
    'description': 'Convert time measurements like seconds, minutes, hours, days, weeks, years.',
    'path': 'time.htm',
    'defaultUnitIndex': 15,
    'units': [
      ["день",                         "д",   86400],
      ["декады",                      "",    315360000],
      ["часы",                        "ч",   3600],
      ["минуты",                      "мин", 60],
      ["месяцы",              "",    2628000],
      ["наносекунды",                  "нс",  1e-9],
      ["секунды",                      "с",   1],
      ["недели",                        "",    604800],
      ["годы",               "г",   31536000],
    ]},
{ 'name': 'Денежная',
    'description': 'Convert currency and calculate live foreign exchange rates with this free currency converter.',
    'path': 'currency.htm',
    'defaultUnitIndex': 30,
    'units': [
      ["Евро",                   "€",   'EUR'],
      ["Рубль",          "₽", 'RUB'],
      ["Доллар",   "$",   'USD']
    ]}
];

function findQuantityIndexFromPathname(aPathname) {
  for (var i=0; i<quantities.length; i++) {
    if (aPathname == quantities[i].path) return i;
  }
}

function onDOMLoaded() {
  inputFrom      = document.getElementById('inputFrom');
  inputTo        = document.getElementById('inputTo');
  selectQuantity = document.getElementById('selectQuantity');
  listQuantities = document.getElementById('listQuantities');
  selectFrom     = document.getElementById('selectFrom');
  selectTo       = document.getElementById('selectTo');
  divSettings    = document.getElementById('settings');
  divWhatsNew    = document.getElementById('whatsNew');
  divDisclaimer  = document.getElementById('disclaimer');
  divTips        = document.getElementById('tips');
  precision      = loadData('precision', 6);

  var i;
  // Update description meta tag
  var lMetaTags = document.getElementsByTagName('meta');
  for (i=0; i < lMetaTags.length; i++) {
    if (lMetaTags[i].getAttribute("name") == 'description') {
      metaTagDescription = lMetaTags[i];
      break;
    }
  }

  var lListItems = '';
  for (i=0; i<quantities.length; i++) {
    addSelectOption(selectQuantity, quantities[i].name, '');
    // Do *not* use Ajax, but link to another page, because the google ads do not refresh with Ajax (it is not allowed).
//    lListItems += '<li id="list-item' + i + '"><a class="list-a" href="' + quantities[i].path + '" onclick="loadQuantity(' + i + '); return false;">' + quantities[i].name + '</a></li>';
    lListItems += '<li id="list-item' + i + '"><a class="list-a" href="' + quantities[i].path + '">' + quantities[i].name + '</a></li>';
  }
  listQuantities.innerHTML = lListItems;

  // Check if url contains a quantity
  var lURLFilename = getURLFilename();
  var lURLIndex;
  if (lURLFilename.length > 1) {
     lURLIndex = findQuantityIndexFromPathname(lURLFilename);
  }
  selectQuantity.selectedIndex = (lURLIndex != undefined)? lURLIndex : loadData('lastQuantityIndex', defaultQuantityIndex);
  loadQuantity(selectQuantity.selectedIndex);
}

function getURLFilename(){
  var lPath = window.location.pathname.substr(1).split("/");
  return lPath[1];
}

document.onclick = function() {
  closeSettings();
};

window.onkeydown = function(event) {
  if (event.keyCode == 27)
    closeSettings();
};

window.onpopstate = function() {
  var lPath = window.location.pathname.substr(1).split("/");
  var lURLIndex;
  if (lPath.length > 1) {
    lURLIndex = findQuantityIndexFromPathname(lPath[1]);
  }
  selectQuantity.selectedIndex = (lURLIndex != undefined)? lURLIndex : loadData('lastQuantityIndex', 0);
  loadQuantity(selectQuantity.selectedIndex, false);
};

function loadQuantity(aIndex, aPushState) {
  aPushState = (aPushState == undefined)? true : aPushState;
  quantity = quantities[aIndex];
  saveData('lastQuantityIndex', aIndex);
  document.title = "" + quantity.name + '';
  if ((aPushState && history.pushState) && (getURLFilename() != quantity.path)) {
    history.pushState(null, document.title, quantity.path);
  }
  var lTitle    = '';
  var lSymbol   = '';
  removeSelectOptions(selectFrom);
  removeSelectOptions(selectTo);
  var i;
  for (i=0; i<quantity.units.length; i++) {
    lSymbol = quantity.units[i][1];
    lSymbol = (lSymbol.length > 0)? ' [' + lSymbol + ']' : '';
    lTitle  = quantity.units[i][0] + lSymbol;
    addSelectOption(selectFrom, lTitle, '');
    addSelectOption(selectTo,   lTitle, ''); // IE8 does not work with copying options using innerhtml
  }
  document.getElementById('quantity-title').innerHTML = '' + quantity.name;
  metaTagDescription.content                          = quantity.description;
  inputFrom.value                                     = loadData('input' + quantity.name, 1);
  loadUnits();
  selectQuantity.selectedIndex = aIndex;
  var lItemID='';
  for (i=0; i<quantities.length; i++) {
    lItemID = 'list-item' + i;
    if (i == aIndex) document.getElementById(lItemID).className = 'selectedItem';
    else document.getElementById(lItemID).className = '';
  }

  convert();
}

if (document.addEventListener) {
  document.addEventListener( "DOMContentLoaded", function(){onDOMLoaded();}, false );
// IE8 and older do not support DOMContentLoaded
} else if ( document.attachEvent) {
  document.attachEvent("onreadystatechange", function(){if (document.readyState === "complete") {onDOMLoaded();} });
}

var lTempDiv = document.createElement("div");
lTempDiv.innerHTML = "<!--[if lt IE 10]><i></i><![endif]-->";
var isIE9AndLower = (lTempDiv.getElementsByTagName("i").length == 1);

// Works in IE8: IE8 does not work with innerHTML or adding <option> html elements.
function addSelectOption(aSelect, aName, aValue) {
  aSelect.options[aSelect.options.length] = new Option(aName, aValue);
}

// Shim: IE8 does not support Date.now
if (!Date.now) {
  Date.now = function() { return new Date().getTime(); };
}

function removeSelectOptions(aSelect)
{
  for(var i=aSelect.options.length-1; i>=0; i--) aSelect.remove(i);
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function callServer(aURL, aCallback, aAsync) {
  if (aAsync === undefined ) {aAsync = true;}

  var lXMLHttp = new XMLHttpRequest();
  lXMLHttp.onreadystatechange=function(){
    if (lXMLHttp.readyState == 4 && lXMLHttp.status == 200)
      aCallback(lXMLHttp.responseText);
  };

  // Note: Use POST to prevent IE from caching the AJAX request
  lXMLHttp.open("GET", aURL, aAsync);
  lXMLHttp.send();
}

function getCurrencyRate(aFrom, aTo) {
  // Load currency data from server
  if ((currencies == undefined) || (Date.now() - getCurrencyRate.cache_timestamp > 1000 * 60 * 1)){
    var lURL = 'currencies.php';
    callServer(lURL,
      function(aResponse) {
        currencies = JSON.parse(aResponse);
        getCurrencyRate.cache_timestamp = Date.now();
      }, false
    );
  }

  var lFromRate = (aFrom == 'USD')? 1 : currencies.rates[aFrom];
  var lToRate   = (aTo   == 'USD')? 1 : currencies.rates[aTo];

  return lToRate / lFromRate;
}

function setConversionInfo(aText){
  var lDiv = document.getElementById('conversionInfo');
  if (aText == '') {
    lDiv.innerHTML = '';
    lDiv.display = 'none';
  } else {
    lDiv.innerHTML = aText;
    lDiv.display = 'block';
  }
}

function refreshCurrency(){
  convert(true);
}

function ConvertInternal(aFromUnitIndex, value, aToUnitIndex, aAnimate) {
  aAnimate = aAnimate || false;
  setConversionInfo('');
  var lUnit           = quantities[selectQuantity.selectedIndex];
  var lUnitFromFactor = lUnit.units[aFromUnitIndex][2];
  var lUnitToFactor   = lUnit.units[aToUnitIndex][2];

  if (quantity.name == 'Currency') {
    var lRate = getCurrencyRate(lUnitFromFactor, lUnitToFactor);
    value = value * lRate;
    var lDate = new Date(currencies.timestamp * 1000);
    setConversionInfo(
      lUnitFromFactor + '/' + lUnitToFactor +  ' exchange rate: ' + lRate.toFixed(4) +
      ' at ' + lDate.toLocaleString() + '<img id="imageRefresh" src="images/refresh.png" onclick="refreshCurrency();"><img id="imageRefreshProgress" src="images/progress_refresh.gif">');
    if (aAnimate) {
      var lImgRefresh  = document.getElementById('imageRefresh');
      var lImgProgress = document.getElementById('imageRefreshProgress');

      lImgRefresh.style.display  = 'none';
      lImgProgress.style.display = 'inline';

      setTimeout(
        function(){
          lImgRefresh.style.display  = 'inline';
          lImgProgress.style.display = 'none';
        }, 1000
      );
    }
  }
  else {
    if (isNumber(lUnitFromFactor)) {
      value = value * lUnitFromFactor;
    }
    else {
      value = eval(lUnitFromFactor);
    }

    if (isNumber(lUnitToFactor)) {
      value = value / lUnitToFactor;
    }
    else {
      value = eval(lUnit.units[aToUnitIndex][3]);
    }
  }
  return value;
}

function ie9minusConvert() {
  // oninput does not work in IE8- and is buggy in IE9. So we use the onkeyup even for ie9- not ideal (eg paste does not work),
  // but that is how the old converter worked.
  if (isIE9AndLower) convert();
}

function ie9minusConvertBack(){
  if (isIE9AndLower) convertBack();
}

function switchUnits() {
  var lToIndex = selectFrom.selectedIndex;
  selectFrom.selectedIndex = selectTo.selectedIndex;
  selectTo.selectedIndex   = lToIndex;
  saveUnits();
  convert();
}

function loadUnits(){
  function findIndexByText(aText) {
    for (var i=0; i<quantity.units.length; i++) {
      if (quantity.units[i][0] == aText) return i;
    }
    return -1;
  }

  selectFrom.selectedIndex = findIndexByText(loadData('from' + quantity.name, ''));
  // Index backup for backward compatibility
  if (selectFrom.selectedIndex == -1) selectFrom.selectedIndex = loadData('fromIndex' + quantity.name, quantity.defaultUnitIndex);

  selectTo.selectedIndex = findIndexByText(loadData('to' + quantity.name, ''));
  if (selectTo.selectedIndex == -1) selectTo.selectedIndex = loadData('toIndex' + quantity.name, quantity.defaultUnitIndex);
}

function saveUnits(){
  saveData('from' + quantity.name, quantity.units[selectFrom.selectedIndex][0]);
  saveData('to'   + quantity.name, quantity.units[selectTo.selectedIndex][0]);
}

function onChangeUnit() {
  saveUnits();
  convert();
}

function formatFloat(aFloat) {
  // http://stackoverflow.com/questions/7312468/javascript-round-to-a-number-of-decimal-places-but-strip-extra-zeros
  return parseFloat(aFloat.toFixed(precision));
}

function convert(aAnimate){
  var lFromValue = parseFloat(inputFrom.value);
  if (isNaN(lFromValue)) {
    inputTo.value = '';
  }
  else {
    var lUnitFromIndex = selectFrom.selectedIndex;
    var lUnitToIndex   = selectTo.selectedIndex;

    var lResult = ConvertInternal(lUnitFromIndex, lFromValue, lUnitToIndex, aAnimate);
    inputTo.value = formatFloat(lResult);
    saveData('input' + quantity.name, lFromValue);
  }
}

function convertBack() {
  var lFromValue = parseFloat(inputTo.value);

  if (isNaN(lFromValue)) {
    inputFrom.value = '';
  }
  else {
    var lUnitFromIndex = selectTo.selectedIndex;
    var lUnitToIndex   = selectFrom.selectedIndex;

    var lResult = ConvertInternal(lUnitFromIndex, lFromValue, lUnitToIndex);
    inputFrom.value = formatFloat(lResult);
  }
}

function saveData(aName, aValue) {
  try {
    localStorage.setItem(aName, aValue);
  } catch(e) {
    // Do nothing Safari in Private mode can not set localstorage.
  }
}

function loadData(aName, aDefaultValue) {
  var lValue = localStorage.getItem(aName);
  if (lValue != null) return lValue;
  else return aDefaultValue;
}

function stopEventPropagation(aEvent) {
  if (aEvent.stopPropagation) {
    aEvent.stopPropagation();
  }
  else if (window.event) {
    window.event.cancelBubble = true;
  }
}

function toggleSettings(event){
  divSettings.style.display = (divSettings.style.display != 'block')? 'block' : 'none';
  document.getElementById('inputOptionsDigits').value = precision;
  stopEventPropagation(event);
}

function toggleInfoForm(event, aDiv) {
  if (aDiv.clientHeight < 10) {
    aDiv.style.maxHeight = '0';
    setTimeout(function(){aDiv.style.display = 'block';setTimeout(function(){aDiv.style.maxHeight = '450px';}, 10);}, 10);
  } else {
    aDiv.style.maxHeight = '0';
    setTimeout(function(){aDiv.style.display = 'none';}, 500);
  }
  stopEventPropagation(event);
}

function toggleWhatsNew(event){
  toggleInfoForm(event, divWhatsNew);
}

function toggleTips(event){
  toggleInfoForm(event, divTips);
}

function toggleDisclaimer(event){
  toggleInfoForm(event, divDisclaimer);
}

function closeSettings(){
  divSettings.style.display = 'none';
}

function ie9minusSavePrecision(){
  if (isIE9AndLower) savePrecision();
}

function savePrecision() {
  precision = parseInt(document.getElementById('inputOptionsDigits').value);
  if (isNumber(precision)) {
    precision = (precision <= 17)? precision : 17;
    precision = (precision >= 2)?  precision : 2;
    saveData('precision', precision);
    convert();
  }
}