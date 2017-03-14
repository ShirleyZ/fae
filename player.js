// **** PLAYER ****
/* Dependencies:
 * - screen.js
 */

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
		Player.initPlayer();
	},
	initPlayer: function() {
		vm.playerInfo = Player.newPlayer;
		Player.savePlayer;

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