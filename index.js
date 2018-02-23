const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
app.set('port', (process.env.PORT || 5002))

const REQUIRE_AUTH = true
const AUTH_TOKEN = 'an-example-token'

app.get('/', function (req, res) {
  res.send('Use the /webhook endpoint.')
})
app.get('/webhook', function (req, res) {
  res.send('You must POST your request')
})

app.post('/webhook', function (req, res) {
  // we expect to receive JSON data from api.ai here.
  
  console.log("Request body is as below")
  // the payload is stored on req.body
  console.log(req.body)
  console.log("-----------------------------------------")
   
   //var apiAIReq = JSON.parse(req.body);
   
  // we have a simple authentication
 /* if (REQUIRE_AUTH) {
    if (req.headers['auth-token'] !== AUTH_TOKEN) {
      return res.status(401).send('Unauthorized')
    }
  }*/

  // and some validation too
/*if (!req.body || !req.body.result || !req.body.result.parameters) {
    return res.status(400).send('Bad Request')
  }*/

  // the value of Action from api.ai is stored in req.body.result.action
  //console.log('Authentication Successful...')

  // parameters are stored in req.body.result.parameters
  var intentName = req.body.result.metadata && req.body.result.metadata['intentName'] ? req.body.result.metadata['intentName'] : 'DefaultIntent';
  console.log('intentName=>'+intentName)
    var webhookReply = 'Something went wrong with your request.'
  if(intentName == 'Default Welcome Intent'){
      webhookReply = 'Welcome to TELUS. What can I do for you?'
   }else if(intentName == 'BillCycleIntent'){
     webhookReply =  getBillingCycleIntentRes(req);
   }else if(intentName == 'CountryIntent'){
     webhookReply = getCountryIntentRes(req);
   }else if(intentName == 'CustomHelpIntent'){
     webhookReply = 'CustomHelpIntent called'
   }else if(intentName == 'RoamingPassIntent'){
     webhookReply = getRoamingPassIntentRes(req);
   }else if(intentName == 'RoamingPassAddIntent'){
     webhookReply = 'RoamingPassAddIntent called'
   }else if(intentName == 'RoamingPassRemoveIntent'){
     webhookReply = 'RoamingPassAddIntent called'
   }else if(intentName == 'RoamingPassWithCountryIntent'){
     webhookReply = getRoamingPassWithCountryIntentRes(req);
   }else{
      webhookReply = 'Something went wrong with your request.'
   }


  // the most basic response
  res.status(200).json({
    source: 'webhook',
    speech: webhookReply,
    displayText: webhookReply
  })
})

function getBillingCycleIntentRes(req){
  var resText='';
  var key ='';
  var lob='';
  if(req.body.result && req.body.result.parameters){
    if(req.body.result.parameters['key']){
      key =req.body.result.parameters['key']; 
    }
    if(req.body.result.parameters['lob']){
      lob =req.body.result.parameters['lob']; 
    }
  }
  //resText= 'BillCycleIntent with key='+key+' and lob='+lob;
  resText='Your current home services bill cycle rests on February 28,2018. Your current mobile bill cycle rests on February 28, 2018';
  return resText;
}

function getCountryIntentRes(req){
  var resText='';
  var countryName='';
  if(req.body.result && req.body.result.parameters&&req.body.result.parameters['countryName']){
   countryName =req.body.result.parameters['countryName.original']; 
  }
  //resText= 'CountryIntent with countryName='+countryName;
  if(countryName!=''){
    resText='For '+countryName+' which information do you want like travel option, roaming passes, etc';
  }else{
    resText='Sorry I did not got the country. Would you please say it again.';
  }
  return resText;
}

function getRoamingPassIntentRes(req){
  var resText='';
  var key ='';
  var loro='';
  var countryName='';
  if(req.body.result && req.body.result.parameters){
    if(req.body.result.parameters['key']){
      key =req.body.result.parameters['key']; 
    }
    if(req.body.result.parameters['loro']){
      loro =req.body.result.parameters['lob']; 
    }
     if(req.body.result.parameters['countryName']){
      countryName =req.body.result.parameters['countryName.original']; 
    }
  }
  //resText= 'RoamingPassIntent with key='+key+' and loro='+loro+'and countryName='+countryName;
  if(countryName!=''){
    resText='The followng roaming passes are available on your account for '+countryName+'.'+countryName+' easy roam.What else I can do for you?';
  }else{
    resText='The followng roaming passes are available on your account. Easy roam, international roam,US easy roam.';
  }
  return resText;
}

function getRoamingPassWithCountryIntentRes(req){
  var resText='';
  var key ='';
  var loro='';
  var countryName='';
  if(req.body.contexts){
    console.log('contexts'=>req.body.contexts);
    for(var context of req.body.contexts){
      console.log('context.name=>'+context.name);
        if(context.name == 'havecountryname'){
            console.log("context.params"+context.parameters);
            if(context.parameters&&context.parameters['countryName.original']){
                countryName =context.parameters['countryName.original']; 
            }
            console.log("countryName=>"+countryName);
        }
      }     
  }else{
    console.log('No context=>'+req.body);
  }
  //resText= 'RoamingPassWithCountryIntent with key='+key+' and loro='+loro+'and countryName='+countryName;
  if(countryName!=''){
    resText='The followng roaming passes are available on your account for '+countryName+'.'+countryName+' easy roam.What else I can do for you?';
  }else{
    resText='The followng roaming passes are available on your account. Easy roam, international roam,US easy roam.';
  }
  return resText;
}
app.listen(app.get('port'), function () {
  console.log('* Webhook service is listening on port:' + app.get('port'))
})
