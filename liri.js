// Add packages

let Twitter = require("twitter");
let inquirer = require("inquirer");
let spotify = require("spotify");
let request = require("request");
let fs = require("fs");

let login = require("./keys.js");
let client = new Twitter(login.twitterKeys);
function searchSpotify(param) {
	spotify.search(param, function(err, data) {
		if (err) {
		    throw err;
		}
		console.log("Artist: " + data.tracks.items[0].artists[0].name);
		console.log("Song: " + data.tracks.items[0].name);
		console.log("Album: " + data.tracks.items[0].href);
		console.log("Link: " + data.tracks.items[0].album.name);
	});
}
function searchMovie(param) {
	request('http://www.omdbapi.com/?type=movie&t=' + param, function (error, response, body) {
		if (error) {
			console.log('error:', error); // Print the error if one occurred 
			console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
		}
		let movie = JSON.parse(body);
		console.log("\n" + movie.Title + " (" + movie.Year + ")");
		console.log("-------------------------");
		console.log('Actors: ' + movie.Actors);
		console.log('Plot: ' + movie.Plot);
		console.log('\nLanguage: ' + movie.Language);
		console.log('Produced In: ' + movie.Country);
		console.log('\nIMDB Rating: ' + movie.Ratings[0].Value);
		console.log('Tomatometer: ' + movie.Ratings[1].Value);
	});
}

inquirer.prompt([
	{
		type: "list",
		name: "action",
		message: "What app would you like to use?",
		choices: ["Twitter", "Spotify", "Movie Database", "Surprise Me"]
	}
]).then(function(user) {
	if (user.action === "Twitter") {
		inquirer.prompt(
		{
			type: "list",
			name: "illusionOfChoice",
			message: "Would you like to see my tweets or your tweets?",
			choices: ["Your tweets", "MY TWEETS!"]
		}).then(function(twitter) {
			if (twitter.illusionOfChoice === "MY TWEETS!") {
				console.log("Too bad. You're getting my tweets");
			}

			// Pull tweets from Twitter API here
			client.get('statuses/user_timeline', {screen_name: 'max_gardner', count: 20}, function(error, tweets, response) {
				if (error) {
					throw error;
				} else {
					console.log("\n" + tweets[0].user.name + "'s Twitter Feed");
					console.log(tweets[0].user.description);
					console.log("\n-------------------------\n");
					for (i in tweets) {
						console.log(tweets[i].created_at + "\n");
						console.log(tweets[i].text + "\n");
						console.log("-------------------------------");
					}
				}
			});
		});
	} else if (user.action === "Spotify") {
		inquirer.prompt(
		{
			type: "input",
			name: "song",
			message: "What song do you want to look up? (optional)"
		}).then(function(user) {
			let param = {};
			if (user.song === "") {
				param.type = "track";
				param.query = "the sign ace of base";
				searchSpotify(param);
			} else {
				param.type = "track";
				param.query = user.song;
				searchSpotify(param);
			}
		});
	} else if (user.action === "Movie Database") {
		inquirer.prompt([
		{
			type: "input",
			name: "movie",
			message: "What movie do you want to look up? (optional)"
		}]).then(function(user) {
			let param = "";
			if (user.movie === "") {
				param = "Mr.+Nobody";
				searchMovie(param);
			} else {
				param = user.movie.split(" ").join("+");
				searchMovie(param);
			}
		})
	} else {
		fs.readFile("random.txt", "utf8", (err, data) => {
		    if (err) {
		        throw err;
		    }
		    let song = data.split(",");
		    let param = {
		    	type: "track",
		    	query: song[1]
		    };
		    searchSpotify(param);
		});
	}
});