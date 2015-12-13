/****************
 *
 * this is a jquery trumpblocker
 *
 ****************/

$(":contains(Trump),:contains(TRUMP),:contains(trump),:contains(Kanye),:contains(Kardashian)")
	.filter(function(){
		return $(this).clone().children()
			.remove().end().text().toLowerCase().indexOf("trump")!=-1;
		}).remove();