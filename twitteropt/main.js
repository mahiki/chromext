
// remove Twitter ugliness. So ugly!
var clean_twitter = function(){
  var ugly = [];
  ugly.push('.action-reply-container');
  ugly.push('.action-rt-container');
  ugly.push('.action-del-container');
  ugly.push('.action-fav-container');
  ugly.push('.more-tweet-actions');

  $('.promoted-tweet').hide(); // oops! :P

  for(var i=0;i<ugly.length;i++) {
    var u = $(ugly[i]).find('b');
    u.text('');
  }
}

var charge_tweets = function() {

  // get all tweets in twitter timeline
  var new_tweets = 0;
  var items = $('.tweet');
  for(var i=0;i<items.length;i++) {
    var it = items[i];

    // extract information from tweet HTML
    var original_user = $(it).attr('data-screen-name');
    var retweeter = $(it).attr('data-retweeter');
    var tweet_id = $(it).attr('data-tweet-id');

    // a bit of logic
    var charged_user = original_user;
    if(typeof retweeter !== 'undefined') {
      charged_user = retweeter;
    }

    // charge tweet to the user
    if(charge.hasOwnProperty(charged_user)) {
      var L = charge[charged_user];
      if($.inArray(tweet_id, L) === -1) {
        L.push(tweet_id);
        new_tweets += 1;
      }
    } else {
      charge[charged_user] = [tweet_id];
      new_tweets += 1;
    }
  }

  return new_tweets;
};

// for debugging mostly
var display_charges = function() {

  var items = $('.tweet');
  for(var i=0;i<items.length;i++) {
    var it = items[i];

    // grab charge number for this user
    var original_user = $(it).attr('data-screen-name');
    var retweeter = $(it).attr('data-retweeter');
    var charged_user = original_user;
    if(typeof retweeter !== 'undefined') {
      charged_user = retweeter;
    }
    var charged_tweets = charge[charged_user];
    var charge_count = charged_tweets.length;

    // display the number numerically
    var time_node = $(it).find('.time');
    if(time_node.length === 1) { // just to make sure, otherwise this is weird
      var seen_node = $(time_node[0]).find('.toptupc');
      if (seen_node.length == 0) {
       $(time_node).append('<div class="toptupc">' + charge_count + 'f</div>').css('text-align', 'right').hide().fadeIn();
      }  
    }

    // adjust highlight color of the tweet according to uniqueness
    if(charge_percentile > 0) {
      var ratio = charge_count / charge_percentile;
      var x = Math.floor(Math.min(ratio,1)*255);
      $(it).css('background-color', 'rgb(255,255,' + x + ')');
    }

    // check if user in VIP list and highlight if yes
    if($.inArray(charged_user, VIP) !== -1) {
      $(it).css('background-color', 'rgb(150,255,150)'); 
    }

  }
}

var periodic = function() {

  var L = document.getElementsByClassName('js-new-tweets-bar');

  // check if there are new tweets ready to process
  if(L.length > 0) {

    // load and process new tweets
    L[0].click();
    setTimeout(process_new_tweets(), 1000);
  }
}

var charge_percentile = 0;
var compute_stats = function() {

  // compute stats about the charges, especially the total sum
  // so that we can normalize properly
  var charge_vals = [];
  for (var user in charge) {
    if (charge.hasOwnProperty(user)) {
      charge_vals.push(charge[user].length)
    }
  }
  if(charge_vals.length === 0) { return; }

  // find 10 percentile spot
  charge_vals.sort(function(a,b){return b-a});
  var ix = Math.floor(charge_vals.length / 10.0 * 3);
  charge_percentile = charge_vals[ix];
}

var tweet_count_up = 0;
var process_new_tweets = function() {

  // there is slightly annoying part: tweets can be seen not only on
  // main timeline page but also on Connect, Discover, etc. But we can't filter
  // based on the URL because Twitter fakes things by not reloading the entire page
  // and injecting new code to same page. But it turns out that the main timeline
  // has your mini-profile on side and that's the only time we see it, so lets
  // use that as a flag. If we don't see it, lets not process any tweets
  var mp = document.getElementsByClassName('mini-profile');
  if(mp.length === 0) { return; }

  // new tweets have arrived into DOM. process it all
  clean_twitter(); // cosmetics: remove junk and hide ugly stuff
  var new_tweets = charge_tweets(); // charge all tweets to owners
  compute_stats(); // computes on charges
  display_charges(); // update DOM according to new charges

  // back up the charged tweets in local storage
  // but not every single time, maybe every time we get at least 
  // a build up of 10 new tweets
  tweet_count_up += new_tweets;
  if(tweet_count_up > 10) {
    tweet_count_up = 0;
    chrome.storage.local.set({'charge': charge});
  }
}

// if there is saved charge in local storage then load it
var charge = {}
chrome.storage.local.get('charge', function (result) {
  if(result.charge) {
    charge = result.charge;
    console.log('loaded tweet frequency stats:');
    console.log(charge);
  } else {
    console.log('no tweet frequency to load');
  }
});

// List of VIP users. 
// We will highlight all tweets by these users!
var VIP = ['elonmusk']

setInterval(periodic, 1000); // periodically look for new tweets bar 1/sec
setTimeout(process_new_tweets, 1000); // scan timeline 1sec after load
setInterval(process_new_tweets, 10000); // every 10 sec lets scan all
