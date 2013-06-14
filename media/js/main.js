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
function commonAJAX(streamUrl, type, dataClass, title, image,  isLast){
var api = "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&q=" + encodeURIComponent(streamUrl);
			api += "&num=10";
			api += "&output=json_xml"

	$.ajax({
	  dataType: "json",
	  url: api,
	  crossDomain: true,
	  success: function(data){if(typeof data.error != 'undefined') { return false;  }
	  $.each(data.responseData.feed.entries, function(i){
		data.responseData.feed.entries[i].author = title;
		data.responseData.feed.entries[i].feedClass = dataClass;
		data.responseData.feed.entries[i].image = image;
		if($.trim(data.responseData.feed.entries[i].title) == ''){
			data.responseData.feed.entries[i].title = title;
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
		_html += '<div class="span6 '+ streamFeed.feedClass +'">',
		_html += '<img class="img-circle" src="media/img/'+ streamFeed.image +'.png">',
		_html += '<h2>'+ streamFeed.author +'</h2>',
		_html += '<p>'+ streamFeed.title +'</p>',
		//_html += '<p><a class="btn" href="'+ streamFeed.link +'">View details &raquo;</a></p>';
		
		_html += '<p><a href="#myModal'+i+'" role="button" class="btn" data-toggle="modal">View details &raquo;</a></p>';
		_html += '<div id="myModal'+i+'" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">',
		_html += '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>',
		_html += '<h3 id="myModalLabel">'+ streamFeed.author +'</h3>',
		_html += '</div>',
		_html += '<div class="modal-body"><h4>'+ streamFeed.title +'</h4><p>'+ streamFeed.content +'</p></div>';
		_html += '<div class="modal-footer"><a class="btn" target="_blank" href="'+ streamFeed.link +'">View details &raquo;</a></div>',
		_html += '</div></div>';
	});
	$('.row').hide().html(_html).slideDown(1000);
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

function getFeed(getFeedFor){
	reset();
	if(getFeedFor == 'nitro' || getFeedFor == 'all'){
			commonAJAX('http://www.facebook.com/feeds/page.php?id=91839569587&format=rss20', 'fbNitro', 'facebook nitro', 'SapientNitro', 'facebook');
			commonAJAX('http://api.twitter.com/1/statuses/user_timeline.rss?screen_name=sapientnitro', 'twNitro', 'twitter nitro', 'SapientNitro', 'twitter');
	}
	if(getFeedFor == 'gs' || getFeedFor == 'all'){
		commonAJAX('https://www.facebook.com/feeds/page.php?id=113252395372359&format=rss20', 'fbGS', 'facebook gs', 'Sapient Government Services', 'facebook');
		commonAJAX('https://api.twitter.com/1/statuses/user_timeline.rss?screen_name=Sapientgov', 'twGS', 'twitter gs', 'Sapient Government Services', 'twitter');
	}
	if(getFeedFor == 'gm' || getFeedFor == 'all'){
		commonAJAX('http://api.twitter.com/1/statuses/user_timeline.rss?screen_name=sapientgm', 'twGM', 'twitter gm', 'Sapient Global Markets', 'twitter');
	}
	commonAJAX('http://www.sapient.com/en-us/News/Press-Releases/rss.xml', 'newsNitro', 'news', 'Sapient News', 'news',  0); 
}
$(function(){
$(document).on('click','.col', function(event){
	event.preventDefault();
	showSingleFeed($(this).data('id'));
});

$(document).on('click', '.nav li', function(event){
	event.preventDefault();
	getFeed($(this).children('a').attr('href').replace('#',''));
});
$(document).on('click','.back', function(event){
	event.preventDefault();
	$('.feedSelector').show();
	$('.feedContainer').show();
	$('.back').hide();
	$('.singlePost').hide();
});
getFeed('all');
});