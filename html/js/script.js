$(function () {
	var head1 = $('ul.breadcrumb[data-category]');
	if (head1.length > 0) {
		var target = $('#cat_' + head1.data('category'));
		target.addClass('active');
	}

	$(window).load(function () {
		if (this.location.hash.length > 0) {
			var hash = decodeURI(document.location.hash);
			var target = $("a[name='" + hash.substring(1) + "']");
			if (target.length == 0) target = $(hash);
			if (target.length > 0) {
				target.addClass('anchoroffset');
				document.location.hash = hash;
			}
		}
	});

	// Page Top
	var topBtn = $('#page-top');
	topBtn.hide();
	$(window).scroll(function () {
		if ($(this).scrollTop() > 100) {
			topBtn.fadeIn();
		} else {
			topBtn.fadeOut();
		}
		$(".anchoroffset").removeClass('anchoroffset');
	});
	topBtn.click(function () {
		$(window).scrollTop(0);
		return false;
	});

	$("a[href^='#']").click(function () {
		var hash = decodeURI(this.hash);
		var target = $("a[name='" + hash.substring(1) + "']");
		if (target.length == 0) target = $(hash);
		if (target.length > 0) {
			target.addClass('anchoroffset');
			/*
			var targetOffset = target.offset().top;
			var position = targetOffset-70;
			$(window).scrollTop(position);
			return false;
			*/
		}
	});
	
	$('pre.code').wrap('<div />');
	$('pre.code').before('<input type="button" class="copy" onclick="copy($(this).next(\'.code\'));" />');

});

function insert(code) {
	document.location = "rdr://designer/insert?" + code.id;
}
function copy(code) {
    var ua = window.navigator.userAgent.toLowerCase();

	if (ua.indexOf("msie") != -1){
		window.clipboardData.setData("Text" , code.text().replace(/\r/g,"\r\n"));
	} else {
		var board = $('<textarea></textarea>');
		board.text(code.text());
		code.append(board);
		board.select();
		document.execCommand('copy');
		board.remove();
	}
	alert("クリップボードへコピーしました。");
}
