var background = chrome.extension.getBackgroundPage();
InitialConfiguration();

function InitialConfiguration()
{
	e('breakTimeInput').value = background.Config.breakTime;	
	e('siteList').value = background.Config.sites.join('\n');
	e('username').addEventListener('keydown', userKeyDown);
	e('breakTimeInput').addEventListener('keydown', setBreakTime);
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
	'<br/> Clan: ' + warrior.clan + 
	'<br/> Skills: ' + warrior.skills.join(', ') +
	'<br/> Honor: ' + warrior.honor + ' Leader Position: ' + warrior.leaderboardPosition +
	'<br/> Total Katas: '+ warrior.codeChallenges.totalCompleted;
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
function setBreakTime (event) {
	if (event.keyCode == 13)
	{
		var breakInput = e('breakTimeInput');	
		if(!isNaN(parseFloat(breakInput.value)) && isFinite(breakInput.value)){
			background.Config.breakTime = breakInput.value;
			background.SaveConfig(background.Config);
		} else {
			breakInput.value = background.Config.breakTime;
		}
	}
};