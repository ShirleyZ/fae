console.log("Hello World from script");


function activate() {
	console.log("=== Activate");
	Screen.changeNpc("felli");
	Player.initialise();
}


// **** CORE FUNCTIONALITY ****
Screen = {
	displayPartial: {
		welcome: false
	},
	changeNpc: function(npcName) {
		console.log("=== Main: Changing Npc to "+npcName)
		var npcInfo = Npc[npcName];

		vm.mainInfo.type = "npc";
		vm.mainInfo.imgCaption = npcInfo.name;
		vm.mainInfo.greeting = npcInfo.greeting;
		vm.extraInfo.quote = npcInfo.extra[0];
		vm.displayOptions.show("chat");

		Game.currScene = npcName;
		Game.listActions();
	},
	changeScene: function(sceneName) {
		console.log("=== Main: Changing scene to "+sceneName)
	}
}

Game = {
	currScene: "",
	saveForm: function(formName) {
		var formInfo = document.getElementById(formName);
		var formData = new FormData(formInfo);
		console.log(formData);
	},
	listActions: function() {
		console.log("=== Listing actions")
		// Look through quests
		// Check which page you're on
		if (vm.mainInfo.type == "npc" && Game.currScene != undefined) {
			console.log("[NPC] "+Game.currScene)
			var currNpc = Npc[Game.currScene];
			console.log(currNpc);
			var playerObj = Player.getInfo();
			var npcQuests = currNpc.quests;
			console.log(npcQuests);
			// Go through list of currNpc if it's not completed
			if (npcQuests != undefined) {
				for (var i = 0; i < npcQuests.length; i++) { 
					console.log("Q: "+npcQuests[i]);
					// If the quest isn't completed
					if (playerObj.quests_completed.indexOf(npcQuests[i]) == -1) {
						// Check if quest is in progress
						if (playerObj.quests_active[npcQuests[i]] != undefined) {

						} else {
							console.log("Unstarted quest. Checking prereqs")
							// Check if you can start this quest
							var currQuest = Quests[npcQuests[i]];
							// Set to true and if anything fails you can't start
							var passPrereqs = true;
							if (currQuest.prerequisites.length == 0) {
								console.log("No requisites. Free pass");
							} else {
								for (var j = 0; j < currQuest.prerequisites.length; j++) {
									var prereq = currQuest.prerequisites[j]; 
									console.log(prereq);
									if (prereq.type == "quests" && prereq.state == "completed") {
										console.log(playerInfo.quests_completed.indexOf(prereq.name) == -1)
										if (playerInfo.quests_completed.indexOf(prereq.name) == -1) {
											passPrereqs = false;
										}
									}
								}	
							}

							console.log("Prereqs pass state: "+passPrereqs);
							
						}
					} else {
						console.log("Quest complete. Next.");
					}
				}
			}
			
		}
	}
}

Player = {
	newPlayer: {
		name: "",
		title: "",
		race: "the Pixie",
		level: 1,
		totalXp: 200,
		currXp: 0,
		statcharisma: 5,
		stat_charm: 5,
		stat_deception: 5,
		stat_magic: 5,
		quests_active: {},
		quests_completed: [],
		game_version: "v0.0.1",
		inventory: [],
		equipment: {
			head: "",
			torso: "",
			r_hand: "",
			l_hand: "",
			legs: "",
			feet: "",
			back: ""
		}
	},
	initialise: function() {
		Player.loadPlayer();
		Screen.changeNpc("teak");
	},
	savePlayer: function() {
		console.log("=== Saving data")
		console.log(vm.playerInfo);
		var saveData = JSON.stringify(vm.playerInfo);
		localStorage.setItem("player_data", saveData);
		console.log("=== Fin Saving data")
	},
	loadPlayer: function() {
		console.log("=== Loading data");
		var data = localStorage.getItem("player_data");

		if (data != undefined) {
			console.log("Found this");
			vm.playerInfo = JSON.parse(data)
		} else {
			console.log("Data not found");
			vm.playerInfo = Player.newPlayer;
			Player.welcomePlayer();
		}
		console.log(vm.playerInfo);
		console.log("=== Fin Loading data");
	},
	deletePlayer: function() {
		localStorage.removeItem("player_data");
		Player.initialise();
	},
	welcomePlayer: function() {
		console.log("=== Welcoming player");
		Screen.changeNpc("teak");
		vm.displayOptions.show('welcome');
		vm.mainInfo.mainDesc="Ah, newly awakened are we? No trouble, we'll get you up and running in no time. But first, what are you known by?"
	},
	setName: function(playerName) {
		vm.playerInfo.name = playerName;
	},
	getInfo: function() {
		return vm.playerInfo;
	}
}

activate();
