const twit = require('twit');
const config = require('./config.js');

const Twitter = new twit(config);

var retweet = function() {
  var params = {
    q: '#nodejs, #Nodejs',
    result_type: 'recent',
    lang: 'en'
  }

  Twitter.get('search/tweets', params, function(err,data){
    if(!err){
      var retweetId = data.statuses[0].id_str;
      Twitter.post('statuses/retweet/:id',{
        id: retweetId
      }, function(err, response){
        if(response){
          console.log('Retweeted!');
        }
        if(err){
          console.log('Error!');
        }
      });
    }else{
      console.log(err);
      console.log('Something went wrong...');
    }
  });
}

var replyMessages = function() {
  var stream = Twitter.stream('user', {replies:'all'});
  console.log('Stream online!');
  stream.on('tweet', function(tweet){
    if(tweet){
      if(tweet.user.screen_name != 'carder_bot'){
        var text = '@' + tweet.user.screen_name + ' ' + tweet.text.replace('@carder_bot ','');
        var params = {
          status: text,
          in_reply_to_status_id: tweet.id
        };
        Twitter.post('statuses/update',params, function(err, response){
          if(response){
            console.log('Responded!');
          }
          if(err){
            console.log('Error!');
          }
        });
      }
    }
  });
}
replyMessages();
