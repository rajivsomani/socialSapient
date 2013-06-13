var streams = {};
streams.feeds = [],
streams.xmlFeed = [],
streams.fbNitro = '',
streams.fbGS = '',
streams.twNitro = '',
streams.twGS = '',
streams.twGM = '';
function reset(){
	streams = {};
	streams.feeds = [],
	streams.xmlFeed = [],
	streams.fbNitro = '',
	streams.fbGS = '',
	streams.twNitro = '',
	streams.twGS = '',
	streams.twGM = '';
}
function commonAJAX(streamUrl, type, dataClass, isLast){
var api = "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&q=" + encodeURIComponent(streamUrl);
			api += "&num=10";
			api += "&output=json_xml"

	$.ajax({
	  dataType: "json",
	  url: api,
	  crossDomain: true,
	  success: function(data){if(typeof data.error != 'undefined') { return false;  }
	  $.each(data.responseData.feed.entries, function(i){
		data.responseData.feed.entries[i].author = dataClass;
		if($.trim(data.responseData.feed.entries[i].title) == ''){
			data.responseData.feed.entries[i].title = 'Sapient';
		}
	  });
		switch(type){
			case "fbNitro":
				streams.fbNitro = data.responseData.feed.entries;
				break;
			case "fbGS":
				streams.fbGS = data.responseData.feed.entries;
				break;
			case "twNitro":
				streams.twNitro = data.responseData.feed.entries;
				break;
			case "twGS":
				streams.twGS = data.responseData.feed.entries;
				break;
			case "twGM":
				streams.twGM = data.responseData.feed.entries;
				break;
			case "newsNitro":
				streams.xmlFeed.newsNitro = data.responseData.feed.entries;
				break;
		}
		if(isLast == 0){
			window.setTimeout(function(){ alphaBeta(); }, 1000);
		}
	  },
		error: function(result) {
			console.log("ERROR");
			console.log(result);
		}
	});
}
function feed_sort(a, b) {
    return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
}
function alphaBeta(){
	streams.feeds = (typeof streams.fbNitro === 'object') ? streams.feeds.concat(streams.fbNitro) : streams.feeds;
	streams.feeds = (typeof streams.fbGS === 'object') ? streams.feeds.concat(streams.fbGS) : streams.feeds;
		
	streams.feeds = (typeof streams.twGM === 'object') ? streams.feeds.concat(streams.twGM) : streams.feeds;
	streams.feeds = (typeof streams.twGS === 'object') ? streams.feeds.concat(streams.twGS) : streams.feeds;
	streams.feeds = (typeof streams.twNitro === 'object') ? streams.feeds.concat(streams.twNitro) : streams.feeds;
		
	streams.feeds = (streams.feeds.length > 0 ) ? streams.feeds.concat(streams.xmlFeed.newsNitro) : streams.xmlFeed.newsNitro;
	streams.feeds.sort(feed_sort);
	var _html = '';
	$.each(streams.feeds, function(i, streamFeed){
		if(i%2){
			_html+= '<a href="'+ streamFeed.link +'" target="_blank" class="col '+ streamFeed.author +'" data-id="'+ i +'">';
			_html+= '<span>'+ streamFeed.title +'</span></a></div>';
		}else{
			_html+= '<div class="row">';
			_html+= '<a href="'+ streamFeed.link +'" target="_blank" class="col '+ streamFeed.author +'" data-id="'+ i +'">';
			_html+= '<span>'+ streamFeed.title +'</span></a>';
		}
	});
	$('.feedContainer').hide().html(_html).slideDown('slow');
}
function showSingleFeed(dataId){
	$('.feedContainer').hide();
	$('.feedSelector').hide();
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
$(document).on('click','.col', function(event){
	event.preventDefault();
	showSingleFeed($(this).data('id'));
});

$(document).on('click','.back', function(event){
	event.preventDefault();
	$('.feedSelector').show();
	$('.feedContainer').show();
	$('.back').hide();
	$('.singlePost').hide();
});

$(document).on('click', '.getFeed', function(event){
	var _selectedCheck = $('input[name="feedSel"]:checked'),
		_getLast = 0,
		_getFeed = _selectedCheck.serialize(),
		_getFeed = _getFeed.replace(/feedSel=/g, ''),
		_getFeed = _getFeed.split('&');
	if(_selectedCheck.length > 0){
		_getLast = _selectedCheck.length;
		reset();
		commonAJAX('http://www.sapient.com/en-us/News/Press-Releases/rss.xml', 'newsNitro', 'news'); 
		if(_getFeed.indexOf('nitro') !== -1){
			_getLast--;
			commonAJAX('http://www.facebook.com/feeds/page.php?id=91839569587&format=rss20', 'fbNitro', 'facebook nitro');
			commonAJAX('http://api.twitter.com/1/statuses/user_timeline.rss?screen_name=sapientnitro', 'twNitro', 'twitter nitro', _getLast);
		}
		if(_getFeed.indexOf('gs') !== -1){
			_getLast--;
			commonAJAX('https://www.facebook.com/feeds/page.php?id=113252395372359&format=rss20', 'fbGS', 'facebook gs');
			commonAJAX('https://api.twitter.com/1/statuses/user_timeline.rss?screen_name=Sapientgov', 'twGS', 'twitter gs', _getLast);
		}
		if(_getFeed.indexOf('gm') !== -1){
			_getLast--;
			commonAJAX('http://api.twitter.com/1/statuses/user_timeline.rss?screen_name=sapientgm', 'twGM', 'twitter gm', _getLast);
		}
	}else{
		return false;
	}
});
});