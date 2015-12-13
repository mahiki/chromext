/****************
 *
 * this is a jquery trumpblocker
 *
 ****************/

$(":contains(Trump),:contains(TRUMP),:contains(trump)")
	.filter(function(){
		return $(this).clone().children()
			.remove().end().text().toLowerCase().indexOf("trump")!=-1;
		}).remove();

$(":contains(Kanye),:contains(KANYE),:contains(kanye)")
	.filter(function(){
		return $(this).clone().children()
			.remove().end().text().toLowerCase().indexOf("kanye")!=-1;
		}).remove();

$(":contains(Kardashian),:contains(KARDASHIAN),:contains(kardashian)")
	.filter(function(){
		return $(this).clone().children()
			.remove().end().text().toLowerCase().indexOf("kardashian")!=-1;
		}).remove();
