/*
 * Tabs
*/
app.tabs = {
	init(tabs) {
		let pref = '.ui-tabs',
			itemSel = pref+'__item',
			btnSel = pref+'__btn',
			items = tabs.find(itemSel),
			btns = tabs.find(btnSel),
			id = tabs.attr('data-tabs'),
			active = '';
	
		if (!tabs.find(itemSel+'.active').length || tabs.find(itemSel+'.active').length > 1) {
			items.removeClass('active');
			items.first().addClass('active');
		}
	
		btns.on('click', function () {
			let btn = $(this),
				item = btn.closest(itemSel);
	
			let tabId = btn.attr('data-tab');

			items
				.removeClass('active');
			$(pref+'-trigger[data-tabs='+id+'],'+pref+'-content[data-tabs="' + id + '"]')
				.removeClass('active');

			item.addClass('active');
			$(pref+'-trigger[data-tabs='+id+'][data-tab='+tabId+'],'+pref+'-content[data-tab="' + tabId + '"]')
				.addClass('active');

			active = tabId;
		});

		tabs.find(itemSel+'.active').find(btnSel).trigger('click');
	
		tabs.data('tabsInit', true);
	},
	bind() {
		$(document).on('click', '.ui-tabs-trigger', function() {
			$('.ui-tabs[data-tabs='+$(this).attr('data-tabs')+']')
			.find('.ui-tabs__btn[data-tab='+$(this).attr('data-tab')+']')
			.trigger('click');

			if (app.scroll.inited) {
				app.scroll.lenis.scrollTo('.subs__trigger[data-tab='+$(this).attr('data-tab')+']', {
					offset: 70
				});
			} else {
				app.scrollto('[data-tab='+$(this).attr('data-tab')+']');
			}
		});
	}
}