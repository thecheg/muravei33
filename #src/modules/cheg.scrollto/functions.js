/*
 * Scroll to element
*/
app.scrollTo = (id, offs, speed) => {
	if ($(id).length) {
		let scrollOffset = offs || 0,
			scrollPos = $(id).offset().top - scrollOffset,
			sp = speed || 500;
		$('html, body').animate({
			scrollTop: scrollPos
		}, sp);
	}
}