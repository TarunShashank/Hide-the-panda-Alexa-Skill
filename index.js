// 1. Text strings =====================================================================================================
 //    Modify these strings and messages to change the behavior of your Lambda function
let Scorecard ;
let LivesLeft = 3 ;
let Timesplayed ;
let rules = 1 ;
	
const hint=[
        "Corporate office in which Techgig code gladiators was conducted ",
        "an area with different species of animals and trees",
        "a place to eat and stay for a temporary period of time",
        "one of the seven wonders of the world located in united states of america",
        "one of the oldest monuments located in hyderabad and famous all over the india",
        "it was built to honor the favorite wife of emperor shah jahan",
        "wood with leaves and branches erected in soil",
        "a recreational spot where families spend casual time and people go for jogging everyday",
        "place to store things in our home",
        "a factory to produce sugar",
        "buildings in companies where delegates meet",
        "the biggest place in a house",
        "work place of an employee",
        "place to refresh and wash our body",
        "place where we sleep",
        "holes in mountains where the early man used to live",
        "biggest rocks in the world"
];

const answer=["reliance corporate park","jungle","hotel","statue of liberty","charminar","taj mahal","tree","park","cupboard","sugar cane factory","auditorium","hall","office","bathroom","bedroom","caves","mountains"];


let welcomeOutput ;
let welcomeReprompt;
let factIndex;

let speechOutput;
let reprompt;
// 2. Skill Code =======================================================================================================
"use strict";
const Alexa = require('alexa-sdk');
//const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).
speechOutput = '';
const handlers = {
	"LaunchRequest": function () {
	    
	    if(Object.keys(this.attributes).length === 0){
	        
	         this.attributes['ScoreCard'] = 0;
	        this.attributes['TimesPlayed'] = 0;
	        
	   welcomeOutput = ' Welcome to getaway panda! <break time="0.3s"/> let us find the hiding panda from all around the world. <break time="0.4s"/> to know the rules, say, <say-as interpret-as="interjection">give me rules <break time="0.3s"/> Do you want to hide the panda? </say-as> ';
       welcomeReprompt = 'This skill helps to find panda, hiding around the world. Just say, yes, or, no, to find the panda ';
	    
	   this.response.speak(welcomeOutput).listen(welcomeReprompt);
         
        // this.emit(':ask',welcomeOutput,welcomeReprompt);
	    }
	    else{
	    
	    Scorecard = this.attributes['ScoreCard'];
        Timesplayed = this.attributes['TimesPlayed'];
	        
	     welcomeOutput = ' Welcome back <break time="0.3s"/> let us find the hiding panda from all around the world. <break time="0.4s"/> to know the rules, say, <say-as interpret-as="interjection"> give me rules <break time="0.3s"/> Do you want to hide the panda? </say-as> ';
        welcomeReprompt = ' This skill helps to find panda, hiding around the world. Just say, yes, or, no, to find the panda ';
	  this.response.speak(welcomeOutput).listen(welcomeReprompt);
	  
       //this.emit(':ask',welcomeOutput,welcomeReprompt);
	    }
	   //this.response.speak(welcomeOutput).listen(welcomeReprompt);
    //this.emit(':responseReady');
       // this.response.speak(welcomeOutput).listen(welcomeReprompt);
        this.emit(':ask', welcomeOutput, welcomeReprompt);
		
	},
	'AMAZON.HelpIntent': function () {
		speechOutput = 'With this skill, you can find the panda anywhere in the globe. Do you want to find your panda? ';
		reprompt = 'this skill helps you to find your panda across the globe. Do you want to find your panda?';
		this.emit(':ask', speechOutput, reprompt);
	},
   'AMAZON.CancelIntent': function () {
		speechOutput = 'You said cancel, To find your panda say, yes, or you can say stop to stop this skill';
		this.emit(':tell', speechOutput);
	},
   'AMAZON.StopIntent': function () {
       this.attributes['TimesPlayed']++;
		speechOutput = 'Thank you for finding the panda. Comeback tomorrow for more fun';
		this.emit(':tell', speechOutput);
   },
   'SessionEndedRequest': function () {
		this.emit(':saveState',true);//uncomment to save attributes to db on session end
   },
	'AMAZON.YesIntent': function () {
	    const factArr = hint;
        factIndex = Math.floor(Math.random() * factArr.length);

		//any intent slot variables are listed here for convenience
		 const randomFact = factArr[factIndex];
        speechOutput =  "Sure thing <audio src='https://s3.amazonaws.com/ask-soundlibrary/foley/amzn_sfx_clock_ticking_long_01.mp3'/> Panda is now hiding. Here is your hint, <amazon:effect name='whispered'>" +randomFact + "</amazon:effect>, can you guess where it is? ";


		//Your custom intent handling goes here
		
		this.emit(':ask', speechOutput, speechOutput);
    },
	'AMAZON.NoIntent': function () {
		speechOutput = "Thank you for using our skill. Hope you come back again";
		this.emit(':tell', speechOutput);
    },
	'AnswerIntent': function () {
      let placeSlotRaw = this.event.request.intent.slots.place.value;
      const randomFact = answer[factIndex];
       if(placeSlotRaw === randomFact )
       {
           this.attributes['ScoreCard']++;
           speechOutput = " <audio src='https://s3.amazonaws.com/ask-soundlibrary/human/amzn_sfx_crowd_applause_02.mp3'/> You got the right answer. Do you wanna play again ?";
           this.emit(':ask', speechOutput);
       }else{
       if(this.attributes['ScoreCard']==0){
         if(LivesLeft >= 0) {
             LivesLeft --;
            speechOutput =  " Sorry, The answer is " + randomFact +  " you have only " + LivesLeft + " lifes. Do you wanna play again ?" ;
            this.emit(':ask', speechOutput, speechOutput);
          }
        else {
            speechOutput = "Sorry, all lives are over. Comeback again to play from start ";
            this.emit(':tell', speechOutput);
        }
       }
        this.attributes['ScoreCard']--;
       }
		
    },
    'ScoreIntent' : function (){
        speechOutput =  "You have "+ LivesLeft + " lives left, and your score is " +Scorecard ;
         this.emit(':ask', speechOutput, speechOutput);
        
    },
	'RulesIntent': function () {
		//any intent slot variables are listed here for convenience
	    if(rules === 1){
		  speechOutput = 'For every wrong answer one life is lost' ;
		  rules++;
	    }else {
	        speechOutput = 'Default lives are three' ;
	    }
		 
		//Your custom intent handling goes here
	    const speechReprompt = 'This is a place has all the rules listed.You can say, <say-as interpret-as="interjection"> tell me rules, </say-as> for listening again.';
		this.emit(':ask', speechOutput, speechReprompt);
		
    },
	'Unhandled': function () {
        speechOutput = 'Sorry i dont know that, <break time="0.2s"/>  Do you want to try something else?';
        this.emit(':ask', speechOutput, speechOutput);
    }
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    // alexa.appId = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    //alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
	alexa.dynamoDBTableName='FindingthePanda';//uncomment this line to save attributes to DB
    alexa.execute();
};

//    END of Intent Handlers {} ========================================================================================
// 3. Helper Function  =================================================================================================

function resolveCanonical(slot){
	//this function looks at the entity resolution part of request and returns the slot value if a synonyms is provided
	let canonical;
    try{
		canonical = slot.resolutions.resolutionsPerAuthority[0].values[0].value.name;
	}catch(err){
	    console.log(err.message);
	    canonical = slot.value;
	};
	return canonical;
};

function delegateSlotCollection(){
  console.log("in delegateSlotCollection");
  console.log("current dialogState: "+this.event.request.dialogState);
    if (this.event.request.dialogState === "STARTED") {
      console.log("in Beginning");
	  let updatedIntent= null;
	  // updatedIntent=this.event.request.intent;
      //optionally pre-fill slots: update the intent object with slot values for which
      //you have defaults, then return Dialog.Delegate with this updated intent
      // in the updatedIntent property
      this.emit(":delegate", updatedIntent); //uncomment this is using ASK SDK 1.0.9 or newer

	  //this code is necessary if using ASK SDK versions prior to 1.0.9
	  if(this.isOverridden()) {
			return;
		}
		this.handler.response = buildSpeechletResponse({
			sessionAttributes: this.attributes,
			directives: getDialogDirectives('Dialog.Delegate', updatedIntent, null),
			shouldEndSession: false
		});
		this.emit(':responseReady', updatedIntent);

    } else if (this.event.request.dialogState !== "COMPLETED") {
      console.log("in not completed");
      // return a Dialog.Delegate directive with no updatedIntent property.
      this.emit(":delegate"); //uncomment this is using ASK SDK 1.0.9 or newer

	  //this code necessary is using ASK SDK versions prior to 1.0.9
		if(this.isOverridden()) {
			return;
		}
		this.handler.response = buildSpeechletResponse({
			sessionAttributes: this.attributes,
			directives: getDialogDirectives('Dialog.Delegate', null, null),
			shouldEndSession: false
		});
		this.emit(':responseReady');

    } else {
      console.log("in completed");
      console.log("returning: "+ JSON.stringify(this.event.request.intent));
      // Dialog is now complete and all required slots should be filled,
      // so call your normal intent handler.
      return this.event.request.intent;
    }
}


function randomPhrase(array) {
    // the argument is an array [] of words or phrases
    let i = 0;
    i = Math.floor(Math.random() * array.length);
    return(array[i]);
}
function isSlotValid(request, slotName){
        let slot = request.intent.slots[slotName];
        //console.log("request = "+JSON.stringify(request)); //uncomment if you want to see the request
        let slotValue;

        //if we have a slot, get the text and store it into speechOutput
        if (slot && slot.value) {
            //we have a value in the slot
            slotValue = slot.value.toLowerCase();
            return slotValue;
        } else {
            //we didn't get a value in the slot.
            return false;
        }
}

//These functions are here to allow dialog directives to work with SDK versions prior to 1.0.9
//will be removed once Lambda templates are updated with the latest SDK

function createSpeechObject(optionsParam) {
    if (optionsParam && optionsParam.type === 'SSML') {
        return {
            type: optionsParam.type,
            ssml: optionsParam['speech']
        };
    } else {
        return {
            type: optionsParam.type || 'PlainText',
            text: optionsParam['speech'] || optionsParam
        };
    }
}

function buildSpeechletResponse(options) {
    let alexaResponse = {
        shouldEndSession: options.shouldEndSession
    };

    if (options.output) {
        alexaResponse.outputSpeech = createSpeechObject(options.output);
    }

    if (options.reprompt) {
        alexaResponse.reprompt = {
            outputSpeech: createSpeechObject(options.reprompt)
        };
    }

    if (options.directives) {
        alexaResponse.directives = options.directives;
    }

    if (options.cardTitle && options.cardContent) {
        alexaResponse.card = {
            type: 'Simple',
            title: options.cardTitle,
            content: options.cardContent
        };

        if(options.cardImage && (options.cardImage.smallImageUrl || options.cardImage.largeImageUrl)) {
            alexaResponse.card.type = 'Standard';
            alexaResponse.card['image'] = {};

            delete alexaResponse.card.content;
            alexaResponse.card.text = options.cardContent;

            if(options.cardImage.smallImageUrl) {
                alexaResponse.card.image['smallImageUrl'] = options.cardImage.smallImageUrl;
            }

            if(options.cardImage.largeImageUrl) {
                alexaResponse.card.image['largeImageUrl'] = options.cardImage.largeImageUrl;
            }
        }
    } else if (options.cardType === 'LinkAccount') {
        alexaResponse.card = {
            type: 'LinkAccount'
        };
    } else if (options.cardType === 'AskForPermissionsConsent') {
        alexaResponse.card = {
            type: 'AskForPermissionsConsent',
            permissions: options.permissions
        };
    }

    let returnResult = {
        version: '1.0',
        response: alexaResponse
    };

    if (options.sessionAttributes) {
        returnResult.sessionAttributes = options.sessionAttributes;
    }
    return returnResult;
}

function getDialogDirectives(dialogType, updatedIntent, slotName) {
    let directive = {
        type: dialogType
    };

    if (dialogType === 'Dialog.ElicitSlot') {
        directive.slotToElicit = slotName;
    } else if (dialogType === 'Dialog.ConfirmSlot') {
        directive.slotToConfirm = slotName;
    }

    if (updatedIntent) {
        directive.updatedIntent = updatedIntent;
    }
    return [directive];
}
