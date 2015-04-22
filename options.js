var background = chrome.extension.getBackgroundPage();
InitialConfiguration();

function InitialConfiguration()
{
	e('breakTimeInput').value = background.Config.breakTime;	
	e('siteList').value = background.Config.sites.join('\n');
	e('username').addEventListener('keydown', userKeyDown);
	e('breakTimeInput').addEventListener('change', setBreakTime);
	e('siteList').addEventListener('blur', updateSiteList);
	if(background.IsBreakTime())
	{
		e('codingSpan').classList.add('hidden');
	}else{
		e('breakSpan').classList.add('hidden');
	}
	UserConfig();
};
function UserConfig () {
	if(background.Config.warrior)
	{
		e('username').value = background.Config.warrior.username;
		e('warriorBody').innerHTML = userTemplate(background.Config.warrior);
		e('invalidUserName').classList.add('hidden');
		e('warriorBody').classList.remove('hidden');
	}
	else
	{
		e('warriorBody').classList.add('hidden');
		e('invalidUserName').classList.remove('hidden');
	}
};
function e(inputName)
{
	return document.getElementById(inputName);
};
function userTemplate(warrior)
{
	return warrior.ranks.overall.name  + ', ' + warrior.name + 
	'<br/> <strong>Clan:</strong> ' + warrior.clan + 
	'<br/> <strong>Skills:</strong> ' + warrior.skills.join(', ') +
	'<br/> <strong>Honor:</strong> ' + warrior.honor + ' <strong>Leader Position:</strong> ' + warrior.leaderboardPosition +
	'<br/> <strong>Total Katas:</strong> '+ warrior.codeChallenges.totalCompleted;
};
function userKeyDown (event) {
	if (event.keyCode == 13)
	{
		background.GetUserInfo(e('username').value,
			function(data){
				background.Config.warrior = data;
				background.SaveConfig(background.Config.warrior);
				UserConfig();
			}, function (error){
				alert(error);
			});
	}
}; 
function setBreakTime () {
	var breakInput = e('breakTimeInput');
	console.log(breakInput.value);
	if(!isNaN(parseFloat(breakInput.value)) && isFinite(breakInput.value)){
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
