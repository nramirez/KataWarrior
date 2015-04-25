var DefaultConfig = {
	sites:[
	'facebook.com',
	'chess.com',
	'youtube.com',
	'twitter.com',
	'tumblr.com',
	'instagram.com',
	'messenger.com',
	'netflix.com',
	'stumbleupon.com',
	'reddit.com'
	],
	breakTime: 15,
	lastTotalCompleted : 0,
};
var Config = LoadConfig();
var KataUserApi = "https://www.codewars.com/api/v1/users/";
var DojoUrl = "http://www.codewars.com/dashboard";
function LoadConfig () {
	var config = localStorage['kataConfig'];
	return config === undefined ? SaveConfig(DefaultConfig) : JSON.parse(config);
};
function SaveConfig(config) {
	console.log('Saving Date: ' + config.lastBreak); 
	localStorage['kataConfig'] = JSON.stringify(config);
	return config;
};
var KataTrack = function(tab) {
	if (IsUserConfigured() && !IsUrlAllowed(tab.url)) {
		GetUserInfo(Config.warrior.username, 
			function(data) {
				Config.warrior = data;
				if(!IsBreakTime())
				{
					chrome.tabs.update(tab.id, {url : DojoUrl});
				}

			}, 
			function(errorMessage) {
			//TODO: Print Message.
			PushNotification(errorMessage, true);
		});
	};
};
var IsUrlAllowed = function(url) {
	var position = Config.sites.length;
	while (position--) {
		if (url.indexOf(Config.sites[position]) > -1) {
			return false;
		};
	};
	return true;
};
var IsBreakTime = function() {
	if (!IsUserConfigured()) return true; //if warrior hasn't been configure yet. 
	//A warrior that solves katas, deserves breaks. :D 
	if (Config.warrior.codeChallenges.totalCompleted > Config.lastTotalCompleted) {
		UpdateUserBreak();
	};
	var endOfTheBreak = new Date(Config.lastBreak.getTime() + Config.breakTime*60000);
	return endOfTheBreak > new Date();
};
var UpdateUserBreak = function() {
	Config.lastTotalCompleted = Config.warrior.codeChallenges.totalCompleted;
	Config.lastBreak = new Date();
	SaveConfig(Config);
};
var ActivateCodingMode = function () {
	//Let's set the lastBreak a time before the max break time
	Config.lastBreak =  new Date(Config.lastBreak.getTime() - Config.breakTime*60000);
	SaveConfig(Config);
};
var IsUserConfigured = function (){
	return Config.warrior;
};
var GetUserInfo = function(userName, successCallback, errorCallback) {
	var xhr =  new XMLHttpRequest();
	xhr.open("GET",KataUserApi + userName, true);
	xhr.responseType = 'json';
	xhr.onload = function() {
		var response = xhr.response;
		if (!response) {
			errorCallback('Unexisting warrior!');
			return;
		}
		successCallback(response);
	};
	xhr.onerror = function() {
		errorCallback('Network error.');
	};
	xhr.send();
};
var PushNotification = function(message, isError){
	var opt = {
		type: "basic",
		title: isError ? "Something is wrong!" : "Hey! ",
		message: message,
		iconUrl: "icon.png"
	};
	chrome.notifications.create('',opt);
};
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	KataTrack(tab);
});