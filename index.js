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
     webhookReply = 'BillCycleIntent called'
   }else if(intentName == 'CountryIntent'){
     webhookReply = 'CountryIntent called'
   }else if(intentName == 'CustomHelpIntent'){
     webhookReply = 'CustomHelpIntent called'
   }else if(intentName == 'RoamingPassIntent'){
     webhookReply = 'RoamingPassIntent called'
   }else if(intentName == 'RoamingPassAddIntent'){
     webhookReply = 'RoamingPassAddIntent called'
   }else if(intentName == 'RoamingPassRemoveIntent'){
     webhookReply = 'RoamingPassAddIntent called'
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

function getBillingCycleIntentRes(request){
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
}
app.listen(app.get('port'), function () {
  console.log('* Webhook service is listening on port:' + app.get('port'))
})
