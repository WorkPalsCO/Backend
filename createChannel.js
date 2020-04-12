var request = require('request');
const slack = require('./slackConfig');



module.exports = function createChannel(name) {

    if (typeof name === 'string')
    {
        info = {
            name: name,
        }
        request.post({ headers: {'content-type' : 'application/json', "Authorization": "Bearer " + slack.key}
                       , url: slack.createChannelEndpoint, body: JSON.stringify(info) }
                       , function(error, response, body){
           return (body); 
        }); 

    }
}