// **** MAIN SCRIPT ****
/* Dependencies:
 * - player.js
 * - quests.js
 * - items.js
 * - npc.js
 */

function activate() {
	console.log("=== Activate");
	vm.pageEvents = [];
	vm.forms = {
		welcome: {}
	}

	vm.Items = Items;
	vm.Labels = Labels;
	vm.Quests = Quests;
	vm.Game = Game;

	Screen.changeNpc("felli");
	console.log("init");
	Game.initialise();
	
	vm.doAction = Game.doAction;
	vm.equipItem = Player.equipItem;
	vm.changeScreen = Screen.changeScreen;
	vm.changeScreenMode = Screen.changeScreenMode;
	vm.moveToMap = Screen.moveToMap;
	vm.moveToNpc = Screen.moveToNpc;
}


// **** CORE FUNCTIONALITY ****
Screen = {
	displayPartial: {
		welcome: false
	},
	changeNpc: function(npcName) {
		console.log("=== Main: Changing Npc to "+npcName)
		var npcInfo = Npc[npcName];

		// vm.mainInfo.type = "npc";
		Game.setSceneType("npc");
		vm.mainInfo.imgCaption = npcInfo.name;
		vm.mainInfo.greeting = npcInfo.greeting;
		vm.mainInfo.mainDesc = "";
		vm.extraInfo.quote = npcInfo.extra[0];
		vm.displayOptions.show("chat");

		vm.pageEvents = [];

		Game.currScene = npcName;
		Game.listActions();
	},
	changeScreenMode: function(screenName, mainDesc) {
		console.log("=== Main: Changing screen to "+screenName)
		vm.displayOptions.show(screenName);
		if (mainDesc) {
			vm.mainInfo.mainDesc = mainDesc;
		} else {
			vm.mainInfo.mainDesc = "";
		}
	},
	changeScreen: function(screenType, sceneName) {
		console.log("=== Main: Changing screen to "+screenType)
		vm.mainInfo.greeting = "";
		vm.mainInfo.mainDesc = "";
		vm.mainInfo.type = screenType;
		vm.displayOptions.show(screenType);
		vm.actions = [];
		vm.pageEvents = [];

		if (screenType == "map") {
			// - Deals with moving map to map
			// - Moving from other tab back to map

			// Grab relevant infos
			var currMapName = Player.getCurrMapLoc();
			if (currMapName == undefined) {
				currMapName = "lost";
			}
			var currMapInfo = GameMap[currMapName];

			var destination = null;
			if (sceneName == undefined) {
				destination = currMapName;
			} else if (GameMap.hasOwnProperty(destination) == -1) {
				destination = lost;
			} else {
				destination = sceneName;
			}
			
			// Check if destination is a valid exit
			if (!Game.checkValidMapMove(currMapName, destination)) {
				console.log("Not valid move");
			} else {
				// Update player location
				Player.moveToMap(destination);
				var destMapInfo = GameMap[destination];

				// Change screen elements
				vm.mapInfo.name = destMapInfo.name;
				vm.mapInfo.desc = destMapInfo.desc;
			}



		} else if (screenType == "node") {
			// - Moving from map to node

		} else if (screenType == "npc") {
			// - Moving from map to npc

			// Check if npc is available from current map


		} else if (screenType == "inventory") {
			// - Moving anything to inventory

		} else {
			// Bruh you mad lost
		}

		Game.listActions();
			// if (Game.currMap == undefined) {
			// 	// if no active npc and no active map, set to default

			// } else if (Game.currScene == undefined) {
			// 	Screen.changeNpc('felli');
			
			// } else {
			// 	Screen.changeNpc(Game.currScene);
			// }
	},
	moveToMap: function(toMap) {
		console.log("=== Moving map to: "+toMap)

		vm.mainInfo.greeting = "";
		vm.mainInfo.mainDesc = "";
		vm.mainInfo.type = "map";
		vm.extraInfo.quote = "";
		vm.displayOptions.show("map");

		vm.actions = [];
		vm.pageEvents = [];

		// - Deals with moving map to map
		// - Moving from other tab back to map

		// Grab relevant infos
		var currMapName = Player.getCurrMapLoc();
		if (currMapName == undefined) {
			currMapName = "lost";
		}
		var currMapInfo = GameMap[currMapName];

		var destination = null;
		if (toMap == undefined) {
			destination = currMapName;
		} else if (GameMap.hasOwnProperty(destination) == -1) {
			destination = "lost";
		} else {
			destination = toMap;
		}
		
		// Check if destination is a valid exit
		if (!Game.checkValidMapMove(currMapName, destination)) {
			console.log("Not valid move");
		} else {
			// TODO: Check that player meets map requirements
			// Update player location
			Player.moveToMap(destination);
			var destMapInfo = GameMap[destination];

			// Change screen elements
			vm.mapInfo.name = destMapInfo.name;
			vm.mapInfo.desc = destMapInfo.desc;
			// Todo: create list of actions from current map
			Game.listActions();
		}

	},
	moveToNpc: function(toNpc) {
		console.log("=== Moving to: "+toNpc);

		vm.mainInfo.greeting = "";
		vm.mainInfo.mainDesc = "";

		vm.actions = [];
		vm.pageEvents = [];

		// Check if the npc is on this map
		var currMapInfo = GameMap[Player.getCurrMapLoc()];
		if (currMapInfo == undefined) {
			console.log("No current map, cannot determine");
		} else if (!Game.checkNpcOnCurrMap(toNpc)) {		
			console.log("That npc isn't here");
		} else if (Game.checkNpcReqs(toNpc)) {
			// Congrats you can talk to them maybe
			vm.mainInfo.type = "npc";
			vm.displayOptions.show("chat");

			var npcInfo = Npc[toNpc];
			vm.mainInfo.greeting = npcInfo.greeting;
			vm.extraInfo.quote = NpcUtil.getNpcQuote(toNpc);

			Game.listActions();
		}
		

	}
}

Game = {
	currScene: "",
	currSceneType: "",
	currMap: {},
	initialise: function() {
		var playerExists = Player.loadPlayer();

		if (playerExists) {
			Screen.changeNpc("teak");
		}
	},
	setSceneType: function(type) {
		Game.currSceneType = type;
	},
	getSceneType: function() {
		return Game.currSceneType;
	},
	saveForm: function(formName) {
		var formData = vm.forms[formName];
		console.log("formData");
		console.log(formData);
		if (formName == "welcome") {
			Player.setName(formData.playerName);
			var mainDesc = "Steady on your feet now, dear. Waking is always a disorienting experience.";
			Screen.changeScreenMode('chat', mainDesc);

		}
	},
	checkNpcOnCurrMap: function(npcName) {
		var currMapInfo = GameMap[Player.getCurrMapLoc()];
		var found = false;
		for (var i = 0; i < currMapInfo.npcs.length; i++) {
			if (currMapInfo.npcs[i].name == npcName) {
				found = true;
			}
		}
		return found;
	},
	checkNpcReqs: function(npcName) {
		// Todo: write this
		return true;
	},
	checkValidMapMove: function(fromMap, toMap) {
		// Returns true/false
		var validity = false;

		if (fromMap == toMap) {
			validity = true;
		} else if (GameMap.hasOwnProperty(fromMap) && GameMap.hasOwnProperty(toMap)) {
			var fromMapInfo = GameMap[fromMap];
			if (fromMapInfo.exits.indexOf(toMap) != -1) {
				validity = true;
			}
		}

		return validity;
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
			var nextStage = QuestsUtil.checkPassConditions(qName, playerObj, qStage);

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
			// console.log(npcQuests);

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
							var passPrereqs = QuestsUtil.checkPrereqs(npcQuests[i], playerObj);
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
		} else if (vm.mainInfo.type == "map" && Player.getCurrMapLoc() != undefined) {
			// Check through npcs
			var currMapInfo = GameMap[Player.getCurrMapLoc()];
			if (currMapInfo != undefined && currMapInfo.npcs.length > 0) {

			}
			// Check through map nodes

			// Check through exits
		}
	}
}


activate();
