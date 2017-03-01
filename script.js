console.log("Hello World from script");



function activate() {
	console.log("=== Activate");
	vm.pageEvents = [];
	vm.Items = Items;

	Screen.changeNpc("felli");
	Game.initialise();
	
	vm.doAction = Game.doAction;
	vm.equipItem = Player.equipItem;
	vm.changeScreen = Screen.changeScreen;
	vm.changeScreenMode = Screen.changeScreenMode;
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
		vm.mainInfo.mainDesc = "";
		vm.extraInfo.quote = npcInfo.extra[0];
		vm.displayOptions.show("chat");

		vm.pageEvents = [];

		Game.currScene = npcName;
		Game.listActions();
	},
	changeScene: function(sceneName) {
		console.log("=== Main: Changing scene to "+sceneName)
		
	},
	changeScreenMode: function(screenName) {
		console.log("=== Main: Changing screen to "+screenName)
		vm.displayOptions.show(screenName);
		vm.mainInfo.mainDesc = ""
		
	},
	changeScreen: function(screenName) {
		console.log("=== Main: Changing screen to "+screenName)
		vm.mainInfo.greeting = ""
	}
}

Game = {
	currScene: "",
	initialise: function() {
		var playerExists = Player.loadPlayer();

		if (playerExists) {
			Screen.changeNpc("teak");
		}
	},
	saveForm: function(formName) {
		var formInfo = document.getElementById(formName);
		var formData = new FormData(formInfo);
		console.log("formData");
		console.log(formData);
	},
	giveItemsFromList: function(list, listName, pQuestInfo) {
		var gettin = "";
		for (var j = 0; j < list.length; j++) {
			gettin = list[j];

			if (gettin.type == "item") {
				Player.getItem(gettin.item);
				var newEvent = {
					type: "item_get",
					item: gettin.item,
					src: "giveItemsFromList"
				}

				if (gettin.label) {
					newEvent.label = gettin.label;
				} else {
					newEvent.label = "You received "+ Items[gettin.item].name;
				}

				vm.pageEvents.push(newEvent);
			} else if (gettin.type == "xp") {
				Player.getXp(gettin.amount);
				vm.pageEvents.push({
					type: "xp_get",
					amount: gettin.amount,
					label: "You received "+gettin.amount+" xp!",
					src: "giveItemsFromList"
				})
			}

		}
		pQuestInfo.get[listName] = true;
		console.log("Push evenets for list: "+listName);
		console.log(vm.pageEvents)
	},
	doAction: function(qName, qAction, qStage, param1) {
		console.log("=== "+qAction+" "+qName+" stage: "+qStage);

		// Getting infos
		var playerObj = Player.getInfo();
		var questNode = Quests[qName].stages[qStage];
		console.log(questNode);

		// Resetting screen
		vm.questActions = [];
		vm.pageEvents = [];
		
		// Handling action types
		if (qAction == "changeScreen") {
			if (param1) {
				Screen.changeScreen(param1);
			}

		// Regular quest progression
		} else {
			// Making changes to player data
			// - Starting quest if they haven't already
			if (qAction == "start") {
				console.log("Starting quest")
				playerObj.quests_active[qName] = {
					stage: qStage
				}
				console.log(playerObj.quests_active[qName])
			} else if (qAction == "progress") {
				console.log("Progressing");
				playerObj.quests_active[qName].stage = qStage;
			}

			// Calculate stuff
			var nextStage = true;
			if (questNode.passConditions) {
				for (var i = 0; i < questNode.passConditions.length; i++) {
					var cond = questNode.passConditions[i];
					// Player needs to wear certain equipment
					if (cond.type == "equipment") {
						if (!Player.isEquipping(cond.item)) {
							nextStage = false;
						}
					} else if (cond.type == "item") {
						nextStage = false;
					}
				}
			}

			// - Calculating if player needs to get any items
			var pQuestInfo = playerObj.quests_active[qName];
			if (pQuestInfo.get == undefined) {
				pQuestInfo.get = {};
			}

			if (questNode.stageGet && !(pQuestInfo.get.stageGet)) {
				Game.giveItemsFromList(questNode.stageGet, "stageGet", pQuestInfo);
			}

			// - Calculating if player gets any rewards
			if (nextStage && questNode.passRewards && !(pQuestInfo.get.passRewards)) {
				Game.giveItemsFromList(questNode.passRewards, "passRewards", pQuestInfo)
			}

			// Change screen stuff
			vm.mainInfo.mainDesc = questNode.textDesc;
			vm.displayOptions.show('quest');

			var newAction = {}
			if (nextStage) {
				newAction = {
					name: qName,
					action: questNode.textNodePass.action,
					stage: qStage+1,
					label: questNode.textNodePass.label
				}
			} else {
				newAction = {
					name: qName,
					action: questNode.textNodeNotPass.action,
					stage: qStage,
					label: questNode.textNodeNotPass.label
				}
				if (questNode.textNodeNotPass.action == "changeScreen") {
					newAction.param1 = questNode.textNodeNotPass.target;
				}
			}
			vm.questActions.push(newAction)
			console.log("vm.questActions")
			console.log(vm.questActions)
		}
		
	},
	listActions: function() {
		console.log("=== Listing actions")
		vm.actions = [];
		// Look through quests
		// Check which page you're on
		if (vm.mainInfo.type == "npc" && 
			  Game.currScene != undefined) {
			console.log("[NPC] "+Game.currScene)
			var currNpc = Npc[Game.currScene];
			var playerObj = Player.getInfo();
			var npcQuests = currNpc.quests;
			console.log(npcQuests);
			// Go through list of currNpc if it's not completed
			if (npcQuests != undefined) {
				for (var i = 0; i < npcQuests.length; i++) { 
					console.log("Q: "+npcQuests[i]);
					var currQuest = Quests[npcQuests[i]];
					// If the quest isn't completed
					if (playerObj.quests_completed.indexOf(npcQuests[i]) == -1) {
						var stageType = "";
						// Check if quest is in progress
						if (playerObj.quests_active[npcQuests[i]] != undefined) {
							// console.log("Quest in progress.")
							stageType = "progress";
							var playerQuestStage = playerObj.quests_active[npcQuests[i]].stage;
							if (playerQuestStage == undefined) {
								console.log("Error: quest in progress but no stage saved");
								break;								
							}
							var questNode = currQuest.stages[playerQuestStage];
							// console.log(questNode);

							// console.log("Adding to action list")
							var newAction = {
								name: npcQuests[i],
								action: stageType,
								stage: playerQuestStage,
								label: "["+currQuest.questName+"] "+questNode.textLabel
							}
							vm.actions.push(newAction)
						} else {
							// console.log("Unstarted quest. Checking prereqs")
							stageType = "start";
							// Check if you can start this quest
							// Set to true and if anything fails you can't start
							var passPrereqs = true;

							if (currQuest.prerequisites.length == 0) {
								// console.log("No requisites. Free pass");
							} else {
								for (var j = 0; j < currQuest.prerequisites.length; j++) {
									var prereq = currQuest.prerequisites[j]; 
									console.log(prereq);
									if (prereq.type == "quest" && prereq.state == "completed") {
										if (playerObj.quests_completed.indexOf(prereq.name) == -1) {
											passPrereqs = false;
										}
									} else {
										// console.log("Unrecognised prereq, please check data")
										passPrereqs = false;
									}
								}	
							}
							console.log("Prereqs pass state: "+passPrereqs);

							// If it passes, add it to the list of actions
							if (passPrereqs) {
								console.log("Adding to action list")
								var newAction = {
									name: npcQuests[i],
									action: 'start',
									stage: 0,
									label: currQuest.startQuestText
								}
								vm.actions.push(newAction)
							}
							
						}
					} else {
						console.log("Quest complete. Next.");
					}
				}
			}
			
			console.log("Actions");
			console.log(vm.actions);
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
			rhand: "",
			lhand: "",
			legs: "",
			feet: "",
			back: ""
		}
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
		var exists = true;

		if (data != undefined) {
			console.log("Found this");
			vm.playerInfo = JSON.parse(data)
		} else {
			console.log("Data not found");
			vm.playerInfo = Player.newPlayer;
			exists = false;
			Player.welcomePlayer();
		}
		console.log(vm.playerInfo);
		console.log("=== Fin Loading data");
		return exists;
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
	},
	isEquipping: function(itemName) {
		var itemParams = itemName.split('_');
		return vm.playerInfo.equipment[itemParams[0]] == itemName;
	},
	getItem: function(itemName) {
		vm.playerInfo.inventory.push(itemName);
	},
	getXp: function(amount) {
		vm.playerInfo.currXp += amount;
		var i = 0;

		while (vm.playerInfo.currXp >= vm.playerInfo.totalXp) {
			vm.playerInfo.currXp = vm.playerInfo.currXp - vm.playerInfo.totalXp;
			vm.playerInfo.level += 1;
			
			i++;
			if (i >= 10) {
				console.log("TOO MANY LEVELS");
				break;
			}
		}

		if (i > 0) {
			var newEvent = {
				type: "level"
			};

			if (i == 1) {
				newEvent.label = "You gained a level";
			} else if (i > 0) {
				newEvent.label = "You gained "+i+" levels";
			}
			vm.pageEvents.push(newEvent);
		}
		
	},
	equipItem: function(itemName) {
		var itemIndex = vm.playerInfo.inventory.indexOf(itemName);
		var successfulEquip = false;
		// Equip only if player has item
		if (itemIndex != -1) {
			vm.playerInfo.inventory.splice(itemIndex, 1);
			var slot = itemName.split("_")[0];
			vm.playerInfo.equipment[slot] = itemName;	
			successfulEquip = true;
		}
		
		return successfulEquip;
	}
}

activate();
