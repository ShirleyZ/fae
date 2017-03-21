// **** CHARACTERS ****

NpcUtil = {
	getNpcQuote: function(toNpc) {
		var npcInfo = Npc[toNpc];
		var max = npcInfo.extra.length;
		var min = 0;
		var randInt = Math.random() * (max - min) + min;
		return npcInfo.extra[randInt];
	}
}

Npc = {
	"pix": {
		name: "Pix the Troublemaker",
		port: "",
		extra: ["Always seen skulking around in the shadows, if something's gone wrong it's probably pix",
						"Pix is short for 'Pixie', and no one knows Pix's real name since they guard their secrets so closely."],
		greeting: "You didn't see me here, right pal?",
		quests: ["pix-quest1"]
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
						"Cheery and brightly coloured, Teak has taken it upon herself to welcome newly awakened pixies after watching one too many meet an early demise."],
		greeting: "Hey-ho! What can I do for you, dear?",
		quests: ["teak-intro1", "teak-intro2"],
		actions: ["", ""]
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
