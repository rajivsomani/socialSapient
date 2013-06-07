var streams = {};
streams.feeds = [];
streams.xmlFeed = [];
function commonAJAX(streamUrl, type, dataType){
	$.ajax({
	  dataType: dataType,
	  url: streamUrl,
	  success: function(data){
		switch(type){
			case "fbnitro":
				streams.fbnitro = data.entries;
				break;
			case "fbgs":
				streams.fbgs = data.entries;
				break;
			case "twnitro":
				streams.twnitro = data;
				break;
			case "twgs":
				streams.twgs = data;
				break;
			case "twgm":
				streams.twgm = data;
				break;
			case "rssnitro":
				streams.xmlFeed.newsnitro = parseXMLtoJSON(data, 'news nitro');
				break;
		}
	  }
	});
}
function parseXMLtoJSON(xmlFeed, belongsTo){
	var _xmlFeedItems = $(xmlFeed).find('item'),
		_xmlFeed = [];
	$.each(_xmlFeedItems, function(feed,i){
		var _feed = $(this);
		var _singleFeed = {
			title: _feed.children('title').text() ,
			link: _feed.children('link').text(),
			content: _feed.children('description').text(),
			date: _feed.children('pubDate').text(),
			by: belongsTo
		};
		_xmlFeed.push(_singleFeed);
	});
	return _xmlFeed;
}
function fb_sort(a, b) {
    return new Date(b.updated).getTime() - new Date(a.updated).getTime();
}

function tw_sort(a, b) {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
}

function feed_sort(a, b) {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
}
function alphaBeta(){
	var allFB = streams.fbnitro.concat(streams.fbgs);
	//console.log(allFB.length);
	allFB.sort(fb_sort);
	$.each(allFB, function(i, streamFeed){
		var _by = '',
			_userName = streamFeed.author.name,
			_title = $.trim(streamFeed.title);
		switch(_userName){
			case "Sapient Government Services":
				_by = 'facebook gs'
				break;
			case "SapientNitro":
				_by = 'facebook nitro'
				break;
		};
		var _singleFeed = {
			title: (_title == '') ? _userName : _title ,
			link: streamFeed.alternate,
			content: streamFeed.content,
			date: streamFeed.updated,
			by: _by
		};
		//console.log(streamFeed.author.name + "  " + new Date(streamFeed.updated) + " " + streamFeed.title);
		streams.feeds.push(_singleFeed);
	});
	var allTW = streams.twnitro.concat(streams.twgm),
		allTW = allTW.concat(streams.twgs);
	allTW.sort(tw_sort);
	$.each(allTW, function(i, streamFeed){
		var _username = streamFeed.user.name,
			_link = "https://twitter.com/"+ _username +"/status/"+streamFeed.id_str,
			_by = '';
		switch(streamFeed.user.id){
			case 44366931:
				_by = 'twitter nitro'
				break;
			case 117158064:
				_by = 'twitter gs'
				break;
			case 224404485:
				_by = 'twitter gm'
				break;
		};
		var _singleFeed = {
			title: streamFeed.text,
			link: _link,
			content: streamFeed.text,
			date: streamFeed.created_at,
			by: _by
		};
		streams.feeds.push(_singleFeed);
		//console.log(streamFeed.user.name + "  " + new Date(streamFeed.created_at) + " " + streamFeed.text);
	});
	streams.feeds = streams.feeds.concat(streams.xmlFeed.newsnitro);
	streams.feeds.sort(feed_sort);
	var _html = '';
	$.each(streams.feeds, function(i, streamFeed){
		if(i%2){
			_html+= '<a href="'+ streamFeed.link +'" target="_blank" class="col '+ streamFeed.by +'" data-id="'+ i +'">';
			_html+= '<span>'+ streamFeed.title +'</span></a></div>';
		}else{
			_html+= '<div class="row">';
			_html+= '<a href="'+ streamFeed.link +'" target="_blank" class="col '+ streamFeed.by +'" data-id="'+ i +'">';
			_html+= '<span>'+ streamFeed.title +'</span></a>';
		}
	});
	$('.feedContainer').hide().html(_html).slideDown('slow');
	//console.log(_html);
}
function showSingleFeed(dataId){
	$('.feedContainer').hide();
	$('.back').show();
	_singleFeed = streams.feeds[dataId];
	var _singleData = '<div class="details">';
    _singleData    += '<h3>'+ _singleFeed.title +'</h3>';
    _singleData    += '<div>'+ _singleFeed.content +'</div>';
    _singleData    += '<a href="'+ _singleFeed.link +'" target="_blank">Read More ...</a>';
    _singleData    += '<\/div>';
	$('.singlePost').html(_singleData).slideDown('slow');
}

$(function(){
/*
var fbSapientNitroEntries =  fbSapientNitro.entries;
$.each(fbSapientNitroEntries, function(i, entry){
        var _singleEntry = '<a href='+entry.alternate+' target="_blank">'+ entry.title+' <br />'+entry.content+'...</a> <br/>';
      //console.log(_singleEntry); 
    //$('.fbEntry').append(_singleEntry);
    
});
                                                                                                    
$.each(twSapientNitro, function(i, item){
   var tweetEntry = '<div class="tweet_text">';
    tweetEntry    += '<a  target="_blank" href="http://www.twitter.com/sapientnitro';
    tweetEntry    += '/status/' + item.id_str + '">';
    tweetEntry    += item.text + '<\/a><\/div>';
    tweetEntry    += '<div class="tweet_hours"> at ' + item.created_at;
    tweetEntry    += '<\/div>'; 
    //$('.twEntry').append(tweetEntry);
});
$(".col").hover(
  function () {
    $(this).children('span').slideDown();
  },
  function () {
    $(this).children('span').slideUp();
  }
);
*/
$(document).on('click','.col', function(event){
	event.preventDefault();
	showSingleFeed($(this).data('id'));
});

$(document).on('click','.back', function(event){
	event.preventDefault();
	$('.feedContainer').show();
	$('.back').hide();
	$('.singlePost').hide();
});

commonAJAX('media/json/facebook-nitro.json', 'fbnitro', 'json');
commonAJAX('media/json/facebook-gs.json', 'fbgs', 'json');
commonAJAX('media/json/twitter-gm.json', 'twgm', 'json');
commonAJAX('media/json/twitter-gs.json', 'twgs', 'json');
commonAJAX('media/json/twitter-nitro.json', 'twnitro', 'json');
commonAJAX('media/xml/news-press-release.xml', 'rssnitro', 'xml');
window.setTimeout(function(){ alphaBeta(); }, 2000);
});