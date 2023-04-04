/*
 * Menu
*/
app.menu = {
	/*
	 * Open menu
	*/
	open() {
		$('body').addClass('body--menu-opened');
		app.scrollLock();

		app.settings.menuOpened = true;
	},
	
	/*
	 * Close menu
	*/
	close() {
		$('body').removeClass('body--menu-opened');
		app.scrollLock('unlock');

		app.settings.menuOpened = false;
	}
}