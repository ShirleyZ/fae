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
		console.log("=== Main: Changing screen to "+screenType);
		console.log("SceneName: "+sceneName);
		vm.mainInfo.greeting = "";
		vm.mainInfo.mainDesc = "";
		vm.mainInfo.type = screenType;
		vm.displayOptions.show(screenType);
		vm.actions = [];
		vm.pageEvents = [];
		vm.mapInfo.nodes = [];
		vm.mapInfo.npcs = [];

		if (screenType == "map") {
			// - Deals with moving map to map
			// - Moving from other tab back to map

			// Grab relevant infos
			var currMapName = Player.getCurrMapLoc();
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
			console.log("Hello nodo");
			// - Moving from map to node
			// Grab relevant infos
			var currMapName = Player.getCurrMapLoc();
			var nodeInfo = Nodes[sceneName];
			console.log("Player at: "+currMapName);
			console.log("Node is:");
			console.log(nodeInfo);

			// Check if destination is a valid exit
			if (!Game.checkValidNodeMove(currMapName, sceneName)) {
				console.log("Not valid move");
			} else {
				// Player location doesn't need to be updated

				// Change screen elements
				vm.mapInfo.name = nodeInfo.name;
				vm.mapInfo.desc = nodeInfo.desc;
			}

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
			vm.mapInfo.nodes = [];
			vm.mapInfo.npcs = [];
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
	checkPassConditions: function(reqList) {
		var passCond = true;

		for (var i = 0; i < reqList.length; i++) {
			var cond = reqList[i];
			
			if (cond === true) {
				// Let them pass, and ignore other checks
			} else if (cond === false) {
				passCond = false;
			} else if (cond.type == "equipment") {
				// Player needs to wear certain equipment
				if (!Player.isEquipping(cond.item)) {
					passCond = false;
				}
			} else if (cond.type == "item") {
				// Todo: Player needs to have a certain item
				passCond = false;
			} else if (cond.type == "quest" && cond.state == "completed") {
				if (playerObj.quests_completed.indexOf(cond.name) == -1) {
					// console.log("Not completed");
					passCond = false;
				}
			}

		} // End for loop
		return passCond;
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
	checkValidNodeMove: function(fromMap, toNode) {
		var validity = false;
		var currMapInfo = GameMap[fromMap];

		for (var i = 0; i < currMapInfo.nodes.length; i++) {
			if (currMapInfo.nodes[i].name == toNode) {
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
	doAction: function(qName, qAction, param1, param2) {
		console.log("=== "+qAction+" "+qName+" stage: "+param1);
		console.log("Extra params 1:"+param1+" 2:"+param2);

		// Getting infos
		var playerObj = Player.getInfo();

		// Resetting screen
		vm.questActions = [];
		vm.pageEvents = [];
		
		// Handling action types
		if (qAction == "changeScreen") {
			console.log("yes this is change screen");
			console.log(param2);
			if (param2) {
				Screen.changeScreen(param2);
			}
		} else if (qAction == "changeMap") {
			Screen.changeScreen("map", param2);
		} else if (qAction == "changeNode") {
			Screen.changeScreen("node", qName);
		} else if (qAction == "changeNpc") {
			Screen.moveToNpc(qName);
		// Regular quest progression
		} else if (qAction == "quest-start" || qAction == "quest-progress") {
			var questNode = Quests[qName].stages[param1];
			console.log(questNode);
			// Making changes to player data
			// - Starting quest if they haven't already
			if (qAction == "quest-start") {
				console.log("Starting quest")
				playerObj.quests_active[qName] = {
					stage: param1
				}
				console.log(playerObj.quests_active[qName])
			} else if (qAction == "quest-progress") {
				console.log("Progressing");
				playerObj.quests_active[qName].stage = param1;
			}

			// Calculate stuff
			var nextStage = QuestsUtil.checkPassConditions(qName, playerObj, param1);

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
					stage: param1+1,
					label: questNode.textNodePass.label
				}
			} else {
				newAction = {
					name: qName,
					action: questNode.textNodeNotPass.action,
					stage: param1,
					label: questNode.textNodeNotPass.label
				}
				if (questNode.textNodeNotPass.action == "changeScreen") {
					newAction.param1 = questNode.textNodeNotPass.target;
					newAction.qName = questNode.textNodeNotPass.target;
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
			
			NpcUtil.listNpcActions(Game.currScene, playerObj);
			
			console.log("Actions");
			console.log(vm.actions);


		} else if (vm.mainInfo.type == "map" && Player.getCurrMapLoc() != undefined) {
			console.log("Listing actions for map:"+Player.getCurrMapLoc());
			// Check through npcs
			var currMapInfo = GameMap[Player.getCurrMapLoc()];
			// console.log(currMapInfo);
			if (currMapInfo != undefined && currMapInfo.npcs.length > 0) {
				for (var i = 0; i < currMapInfo.npcs.length; i++) {
					var currNpc = currMapInfo.npcs[i];
					// console.log(currNpc);
					if (!Game.checkPassConditions(currNpc.reqs)) {
						// console.log("Npc reqs for "+currNpc.name+" not met");
					} else if (Game.checkPassConditions(currNpc.reqs)) {
						// console.log("Checks pass");
						ActionUtil.addMoveToNpc(currNpc.name, vm.mapInfo.npcs);
					}
				}
			}
			// Check through map nodes
			if (currMapInfo != undefined && currMapInfo.nodes.length > 0) {
				// vm.mapInfo.nodes = "You see ";
				for (i = 0; i < currMapInfo.nodes.length; i++) {
					var currNode = currMapInfo.nodes[i];
					// console.log(currNode);
					if (!Game.checkPassConditions(currNode.reqs)) {
						// console.log("Node reqs for "+currNode.name+" not met");
					} else if (Game.checkPassConditions(currNode.reqs)) {
						// console.log("Checks pass");
						ActionUtil.addMoveToNode(currNode.name, vm.mapInfo.nodes);
					}
				}
				// vm.mapInfo.nodes += " nearby.";
				console.log(vm.mapInfo.nodes);
			}

			// Check through exits
		}
	}
}


activate();
