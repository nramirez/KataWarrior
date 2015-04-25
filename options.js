var background = chrome.extension.getBackgroundPage();
initialConfiguration();

function e(inputName) {
	return document.getElementById(inputName);
};
function initialConfiguration() {
	e('breakTimeInput').value = background.Config.breakTime;	
	e('siteList').value = background.Config.sites.join('\n');
	if(background.IsBreakTime()) {
		breakMode();
	} else {
		codingMode();
	}
	userConfig();
};
function userConfig () {
	if(background.IsUserConfigured()) {
		e('username').value = background.Config.warrior.username;
		e('warriorBody').innerHTML = userTemplate(background.Config.warrior);
		e('invalidUserName').classList.add('hidden');
		e('warriorBody').classList.remove('hidden');
	} else {
		e('invalidUserName').classList.remove('hidden');
		e('warriorBody').classList.add('hidden');
	}
};
function userTemplate(warrior) {
	return warrior.ranks.overall.name  + ', ' + warrior.name + 
	'<br/> <strong>Clan:</strong> ' + warrior.clan + 
	'<br/> <strong>Skills:</strong> ' + warrior.skills.join(', ') +
	'<br/> <strong>Honor:</strong> ' + warrior.honor + 
	'<br/> <strong>Leader Position:</strong> ' + warrior.leaderboardPosition +
	'<br/> <strong>Total Katas:</strong> '+ warrior.codeChallenges.totalCompleted;
};
function userKeyDown (event) {
	if (event.keyCode == 13) {
		background.GetUserInfo(e('username').value,
			function(data){
				background.Config.warrior = data;
				background.UpdateUserBreak();
				background.SaveConfig(background.Config.warrior);
				userConfig();
			}, function (error){
				alert(error);
			});
	};
}; 
function setBreakTime () {
	var breakInput = e('breakTimeInput');
	if (!isNaN(parseFloat(breakInput.value)) && isFinite(breakInput.value)){
		background.Config.breakTime = breakInput.value;
		background.SaveConfig(background.Config);
	} else {
		breakInput.value = background.Config.breakTime;
	}
};
function updateSiteList () {
	var breakInput = e('siteList');	
	background.Config.sites = breakInput.value.split('\n').filter(function(n) { return n.length > 3; });//Trivial way to remove empty spaces.
	background.SaveConfig(background.Config);
};
function codingMode() {
	hideElementsByMode('break');
	var elements = document.querySelectorAll('input, textarea');
	var i = elements.length;
	while (i--) {
		elements[i].disabled = true;
	}
};
function breakMode() {
	hideElementsByMode('coding');
	e('username').addEventListener('keydown', userKeyDown);
	e('breakTimeInput').addEventListener('change', setBreakTime);
	e('siteList').addEventListener('blur', updateSiteList);
	e('codeModeBtn').addEventListener('click', activateCodingMode);
};
function hideElementsByMode(mode) {
	var elements = document.querySelectorAll('[data-mode=' + mode + ']');
	var i = elements.length;
	while (i--) {
		elements[i].classList.add('hidden');
	}
};
function activateCodingMode() {
	if (background.IsUserConfigured()) {
		background.ActivateCodingMode();
		location.reload();
	} else {
		alert("Please add your codewars' username first");
		//TODO: try to user chrome extension to create this alert, if it's posible to push it to the options tab
		//background.PushNotification("You should configure your user first");
	}
};