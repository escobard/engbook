// not sure how necessary this import is - sometimes testing frameworks give routes issues if you import
// models multiple times so we are loading the jobs scheme prior to the route callback
const mongoose = require("mongoose"),
	_ = require("lodash"),
	Path = require("path-parser").default,
	// this is an integrated module of the node.js platform
	{ URL } = require("url"),
	{ jobs, jobsWebhook, jobsThanks } = require("../constants/routes"),
	requireLogin = require("../middlewares/requireLogin"),
	requireCredits = require("../middlewares/requireCredits"),
	Mailer = require("../services/Mailer"),
	jobTemplate = require("../services/Mailer/emailTemplates/jobTemplate"),
	Job = mongoose.model("jobs");

module.exports = app => {
	// sets up our route to return some data to the user after they have clicked on a job link
	app.get(jobsThanks, (req, res) => {
		res.send("Thanks for voting!");
	});

	// sets up the route to handle the webhook data from emails
	app.post(jobsWebhook, (req, res) => {
		/* scrapped to instead use the lodash chain function, which allows us to avoid
		// pointless variable declarations
		// more on the lodash map function here: https://lodash.com/docs/#map
		// first argument is the array, second argument is the callback for each object
		// within the array - this returns all to an array assigned to the events constant
		const events = _.map(
			req.body,

			// the function's argument is the event passed from the webhook, with ES6 destructuring
			({ email, url }) => {
				// application breaks unless we define a url undefined rule, not part of the course
				if (!url || !email) {
					return;
				}

				// scrapped to remove unecessary variable, passed constructor into pattern argument instead
				// creates a URL from the url library
				/*
				const pathname =
					// grabs only the pathname of the URL
					new URL(url).pathname;
				*/
		/*
				// this passes the pathname URL to the Path function (assigned to const patterns)
				// which extracts the two variables defined on line 40 into an object that looks like:
				// {surveyId: surveyIdValue, choice: choiceValue}
				const match = pattern.test(new URL(url).pathname);

				// if no matches are found, the object is NULL - that way we can
				// filter out obsolete webhook events
				if (match) {
					let { jobId, choice } = match;
					// returns an object with all the data we want to keep, pushes it into a new array
					// assigned to the events constant
					return { email, jobId, choice };
				}
			}
		); 

		// returns the cleaned up events array
		// console.log('EVENTS', events)

		// uses the compact function of lodash, more on that here: https://lodash.com/docs/#compact
		// removes all unidentified objects
		const compactEvents = _.compact(events);

		// returns only unique objects, more on that here: https://lodash.com/docs/#uniqBy
		// removes all objects that contain duplicate email and surveyId values
		const uniqueEvents = _.uniqBy(compactEvents, "email", "surveyId");

		console.log("unique", uniqueEvents);
		*/

		// this tells sendGrid that the logic is working since the sendGrid API expends a response
		// from the Node API

		// creates the pattern we want to extract from the URL
		// both the :surveyId and :choice patterns extracts the values of the URL
		// into variables for later use
		// moved to outside of the loop, to avoid creating a new path helper per loop iteration
		const pattern = new Path("/api/jobs/:jobId/:choice");

		// using the chain helper of lodash to make this code cleaner, more on that here: https://lodash.com/docs/#chain
		// refer to line 24-78 to see original functionality, and deeper code breakdown
		const events = _.chain(req.body)
			.map(({ email, url }) => {
				if (!url || !email) {
					return;
				}

				const pathname = new URL(url).pathname;

				const match = pattern.test(new URL(url).pathname);

				if (match) {
					let { jobId, choice } = match;

					return { email, jobId, choice };
				}
			})
			.compact()
			.uniqBy("email", "surveyId")
			.value();

		// returns the end result of the webhook cleanup
		console.log(events);

		res.send({});
	});

	// we can add as many middlewares as we want to a route handl er
	// the only gotcha is that the middlewares MUST be added in the order
	// we want the middlewares to run
	app.post(jobs, requireLogin, requireCredits, async (req, res) => {
		// grabs the properties we need to store within mongo from the request
		const { title, subject, body, recipients } = req.body;

		// sets the properties of our new job instance
		const job = new Job({
			title,
			subject,
			body,

			// unecessarily complicated to handle this within the BE
			// we could easily have each recipient passed as an OBJECT within an ARRAY
			// within the front end instead of parsing the data as strings in the API
			// for the purposes of learning though we will go with the instructors solution
			recipients:
				// creates an array of strings from the front end data
				recipients
					.split(",")

					// maps through the array
					// un-abbreviated = .map(email =>{
					// returns each string within the array as an object containing a string, satisfying the
					// user schema data types for the RecipientSchema
					//return {email:
					// removes any trailing spaces
					// email.trim()}})
					.map(email => ({ email: email.trim() })),

			// grabs the user id from the request, and adds it to the schema
			// this will always exsist because of our middlewares which verify authentication + credits before
			// running the route handler
			_user: req.user.id,

			// creates our date for when the job request was received
			dateSent: Date.now()
		});

		//we will set up our mailer class to send to sendGrid here
		const mailer = new Mailer(
			// passes our new job mongoose schema to the mailer class
			job,

			// passes the HTML of the body
			jobTemplate(job)
		);

		// creates error handling for our requests to sendgrid / mongodb
		try {
			// sends the email off to sendGrid which sends the email to the user and sets up our custom links
			await mailer.send();

			// saves the job instance to our mongoDB
			await job.save();

			// removes a credit from the user once the job post has been sent
			req.user.credits -= 1;

			// saves the new user instance to our DB
			const user = await req.user.save();

			// sends back the user data to the front end, updating the new credit score
			res.send(user);
		} catch (err) {
			res.status(422).send(err);
		}
	});
};