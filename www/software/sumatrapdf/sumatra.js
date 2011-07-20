
// we also use the order of languages in this array
// to order links for translated pages
var gLanguages = [
	"en", ["English", "English"],
	"de", ["Deutsch", "German"],
	"es", ["Español", "Spanish"],
	"fr", ["Français", "French"],
	"pt", ["Português", "Portuguese"],
	"ru", ["Pусский", "Russian"],
	"ro", ["Română", "Romanian"],
	"ja", ["日本語", "Japanese"],
	"cn", ["简体中文", "Chinese"]
];

var gTransalatedPages = [
	"download-free-pdf-viewer", ["ru", "cn", "de", "es", "fr", "ja", "pt", "ro", "ru"],
	"download-prev", ["de", "es", "ja", "pt", "ro"],
	"downloadafter", ["de", "es", "ja", "pt", "ro"],
	"free-pdf-reader", ["cn", "de", "es", "ja", "pt", "ro", "ru"],
	"manual", ["ru", "cn", "de", "es", "ja", "pt", "ro", "ru"]
];

// return a list of langauges that a given page is translated into
function translationsForPage(baseUrl) {
	var i;
	for (i=0; i<gTransalatedPages.length / 2; i++) {
		if (gTransalatedPages[i*2] == baseUrl) {
			return gTransalatedPages[i*2+1];
		}
	}
	return [];
}

// A heuristic used to detect preffered language of the user
// based on settings in navigator object.
// TODO: we should also look at Accept-Language header, which might look like:
// Accept-Language:ru,en-US;q=0.8,en;q=0.6
// but headers are not available from JavaScript so I would have to
// pass this data somehow from the server to html or use additional
// request from javascript as described at http://stackoverflow.com/questions/1043339/javascript-for-detecting-browser-language-preference
function detectBrowserLang() {
	var n = window.navigator;
	// a heuristic: userLanguage and browserLanguage are for ie
	// language is for FireFox and Chrome
	var lang1 = n.userLanguage || n.browserLanguage || n.language || "en";
	// we only care about "en" part of languages like "en-US"
	return lang1.substring(0,2);
}

// sumatra urls are in format:
// /software/sumatrapdf/${url}[-${lang}].html
// return ${url} and ${lang} parts
// ${lang} can be "" which means english (en)
function getBaseUrlAndLang() {
	var lang = "";
	var url = location.pathname.split("/");
	url = url[url.length-1];
	url = url.split(".html")[0];
	if (url[url.length-3] == '-') {
		lang = url.substring(url.length-2)
		url = url.substring(0, url.length-3);
	}
	//alert(url + "," + lang);
	return [url, lang];	
}

function langNativeName(lang) {
	if ("" == lang) { return "English" };
	var i;
	for (i=0; i<gLanguages.length / 2; i++) {
		if (gLanguages[i*2] == lang) {
			return gLanguages[i*2+1][0];
		}
	}
	allert("No native name for lang '" + lang + "'");
	return "";
}

function isEng(lang) {
	return (lang == "") || (lang=="en");
}

// construct text like:
// <span class="trans"><a href="free-pdf-reader-de.html">Deutsch</a></span>
function langsLinkHtml(baseUrl, lang) {
	var url = baseUrl;
	if (!isEng(lang)) {
		url = url + "-" + lang;
	}
	url += ".html";
	return '<span class="trans"><a href="' + url + '">' + langNativeName(lang) + '</a></span>&nbsp;';
}

function sortByLang(l1, l2) {
	var l1Idx = gLanguages.indexOf(l1);
	var l2Idx = gLanguages.indexOf(l2);
	return l1Idx - l2Idx;
}

function langsNavHtml() {
	var i;
	var urlLang = getBaseUrlAndLang();
	var baseUrl = urlLang[0];
	var lang = urlLang[1];
	var translations = translationsForPage(baseUrl);
	translations.sort(sortByLang);
	if (0 == translations.length) {
		// shouldn't happen becase should only be called from pages
		// that were translated
		alert("No translations for page " + baseUrl);
	}
	var s = '<span style="float: right;">';
	var l;
	if (!isEng(lang)) {
		s += langsLinkHtml(baseUrl, "en");
	}
	for (i=0; i<translations.length; i++) {
		l = translations[i];
		if (l == lang) {
			continue;
		}
		s += langsLinkHtml(baseUrl, l);
	}
	s += '</span>';
	return s;
}

function installerHref(ver) {
	return '<a href="http://kjkpub.s3.amazonaws.com/sumatrapdf/rel/SumatraPDF-' + ver + '-install.exe">SumatraPDF-' + ver + '-install.exe</a>';
}
function zipHref(ver) {
	return '<a href="http://kjkpub.s3.amazonaws.com/sumatrapdf/rel/SumatraPDF-' + ver + '.zip">SumatraPDF-' + ver + '.zip</a>';
}

// used by download-prev* pages
// Update after releasing a new version
var gPrevSumatraVersion = [
	"1.6", 
	"1.5.1", "1.5", "1.4", "1.3", "1.2", "1.1", "1.0.1",
	"1.0", "0.9.4", "0.9.3", "0.9.1", "0.9", "0.8.1", 
	"0.8", "0.7", "0.6", "0.5", "0.4", "0.3", "0.2"
];

// used by download-prev* pages
function prevLanguagesList(installerStr, zipFileStr) {
	var s, i;
	var s = "";
	for (i=0; i < gPrevSumatraVersion.length; i++)
	{
		var ver = gPrevSumatraVersion[i];
		s += '<p>' + installerStr + ': ' + installerHref(ver) + '<br>\n';
		s += zipFileStr + ': ' + zipHref(ver) + '</p>\n';
	}
	return s;        
}

function buttonsHtml() {
return '<span style="position:relative; left: 22px; top: 6px;">\
<script type="text/javascript" src="http://apis.google.com/js/plusone.js"></script>\
<g:plusone size="medium" href="http://blog.kowalczyk.info/software/sumatrapdf/"></g:plusone>\
</span>\
<span style="position:relative; left: 12px; top: 6px;">\
<a href="http://twitter.com/share" class="twitter-share-button" data-url="http://blog.kowalczyk.info/software/sumatrapdf/free-pdf-reader.html" data-text="SumatraPDF - free PDF reader for Windows" data-count="horizontal" data-via="kjk">Tweet</a><script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script>\
</span>\
<span style="position:relative; top: 7px; left: 0px;">\
<iframe src="http://www.facebook.com/plugins/like.php?href=http%3A%2F%2Fblog.kowalczyk.info%2Fsoftware%2Fsumatrapdf%2F&amp;layout=button_count&amp;show_faces=false&amp;width=450&amp;action=like&amp;colorscheme=light&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:88px; height:21px;" allowTransparency="true"></iframe>\
</span>';
}

function googleAnalytics() {
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-194516-1']);
    _gaq.push(['_trackPageview']);

    (function() {
      var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
      ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
      (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(ga);
    })();
}