var background = chrome.extension.getBackgroundPage();
initialConfiguration();
function e(inputName) {
	return document.getElementById(inputName);
};
function initialConfiguration() {
	e('breakTimeInput').value = background.Config.breakTime;	
	e('siteList').value = background.Config.sites.join('\n');
	e('trainingPeriodInput').value = background.Config.trainingPeriod;
	trainingTimeConfiguration();
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
				background.SaveConfig(background.Config);
				userConfig();
			}, function (error){
				alert(error);
			});
	};
}; 
function setBreakTime () {
	if (validateNumber(this.value)){
		background.Config.breakTime = this.value;
		background.SaveConfig(background.Config);
	} else {
		this.value = background.Config.breakTime;
	}
};
function updateSiteList () {
	var breakInput = e('siteList');	
	background.Config.sites = breakInput.value.split('\n').filter(function(n) { return n.length > 3; });//Trivial way to remove empty spaces.
	background.SaveConfig(background.Config);
};
function setTrainingPeriod () {
	if(validateNumber(this.value)) {
		background.Config.trainingPeriod = this.value;
		background.SaveConfig(background.Config);
	} else {
		this.value = background.Config.trainingPeriod;
	}
};
function setTrainingTime () {
	background.Config.trainingTime = this.value;
	background.SaveConfig(background.Config);
}
function validateNumber (number) {
	return !isNaN(parseFloat(number)) && isFinite(number)
};
function codingMode() {
	hideElementsByMode('break');
	var elements = document.querySelectorAll('input, textarea, select');
	var i = elements.length;
	while (i--) {
		elements[i].disabled = true;
	}
};
function breakMode() {
	hideElementsByMode('coding');
	e('username').addEventListener('keydown', userKeyDown);
	e('breakTimeInput').addEventListener('change', setBreakTime);
	e('trainingPeriodInput').addEventListener('change', setTrainingPeriod);
	e('trainingTimeInput').addEventListener('change', setTrainingTime);
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
		alert("Please add your username first");
	}
};
function trainingTimeConfiguration() {
	var element = e('trainingTimeInput');
	var options = Array.apply(null, {length : 24}).map(function(e, i) {
		element.options.add(new Option(i+':00',i));
		return i;
	});
	element.value = background.Config.trainingTime;
};