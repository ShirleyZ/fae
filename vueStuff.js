console.log("Hello comoponent")

// Defining Routes
// const Welcome = { template: "<div>Welcome</div>" }
// const Area = { template: "<div>Regular page</div>" }

// const routes = [
// 	{ path: '/welcome', component: Welcome },
// 	{ path: '/area', component: Area }
// ]

// const router = new VueRouter({
// 	routes
// })

var vm = new Vue({
	data: {
		playerInfo: {
			name: "Flippity Jack the Pixie",
			level: 1
		},
		mainInfo: {
			type: 'npc',
			imgSrc: '',
			imgCaption: '',
			greeting: '',
			mainDesc: '',
			actions: [
				{label: "Action 1",url: "", action:""},
				{label: "Action 2",url: "", action:""}
			]
		},
		extraInfo: {
			quote: ''
		},
		areaInfo: {
			npc: {},
			actions: {},
			desc: ""
		},
		displayOptions: {
			show: function(showThis) {
				for (var key in vm.displayOptions.values) {
					vm.displayOptions.values[key] = false;
					vm.displayOptions.values[showThis] = true;
				}
			},
			values: {
				welcome: false,
				shop: false,
				chat: false,
				quest: false,
				inventory: false
			}
		},
		pageEvents: []
	}
}).$mount('#wrapper')


