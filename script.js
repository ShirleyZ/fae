console.log("Hello World from script");


function activate() {
	console.log("=== Activate");
	Screen.changeNpc("felli");
	Player.initialise();
}


// **** CORE FUNCTIONALITY ****
Screen = {
	changeNpc: function(npcName) {
		console.log("=== Main: Changing Npc to "+npcName)
		var npcInfo = Npc[npcName];

		vm.mainInfo.type = "npc";
		vm.mainInfo.imgCaption = npcInfo.name;
		vm.mainInfo.greeting = npcInfo.greeting;
		vm.extraInfo.quote = npcInfo.extra[0];

	},
	changeScene: function(sceneName) {
		console.log("=== Main: Changing scene to "+sceneName)
	}
}

Player = {
	newPlayer: {
		name: "A bleary-eyed pixie",
		title: "",
		level: 1,
		totalXp: 200,
		currXp: 0,
		statcharisma: 5,
		stat_charm: 5,
		stat_deception: 5,
		stat_magic: 5,
		quests_active: [],
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
		// looks for existing data
		Player.loadPlayer();
		// if none exists, create new player
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
		vm.mainInfo.mainDesc="Ah, newly awakened are we? No trouble dear, we'll get you up and running in no time. But first, what are you known by?"
	}
}

// **** CHARACTERS ****
var Npc = {
	"pix": {
		name: "Pix the Troublemaker",
		port: "",
		extra: ["Always seen skulking around in the shadows, if something's gone wrong it's probably pix",
						"Pix is short for 'Pixie', and no one knows Pix's real name since they guard their secrets so closely."],
		greeting: "You didn't see me here, right pal?"

	},
	"felli": {
		name: "Flowergirl Felli",
		port: "",
		extra: ["More often than not, Felli seems to be off in her own little world. But despite appearances she knows everything that happens in the court.",
						"Many new pixies mistake Felli's appearance to mean that she is quite young, however few members of the court have been around for longer than she."],
		greeting: "Oh, the stars and sparrows whisper to me so. The things I know about the court..."
	},
	"tommen": {
		name: "Kitchenhand Tommen",
		port: "",
		extra: [""],
		greeting: ""
	},
	"teak": {
		name: "Tree Guardian Teak",
		port: "",
		extra: ["A common sight around the grove, Teak is constantly flitting about the boughs and making sure everything is well.",
						"Teak is oft looked up to as an elder sister figure by many pixies in the grove, in no small part due to her being the first to find many of them and helping them through the disorientation of Waking.",
						"Cheery and brightly coloured, Teak has taken it upon herself to welcome newly awakened pixies after watching far too many meet an early demise."],
		greeting: "Hey-ho! What can I do for you, dear?"
	},
	"willow": {
		name: "Tree Guardian Willow",
		port: "",
		extra: [""],
		greeting: "Hop away from that now! Yes, yes, can't you see you're crushing that sapling?"
	},
	"ink": {
		name: "Ink",
		port: "",
		extra: [""],
		greeting: ""
	},
	"tmp": {
		name: "tmp",
		port: "",
		extra: ["...","... who are you"],
		greeting: "you're not meant to be here"
	}
}

activate();
