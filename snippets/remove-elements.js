// removing all injected comcast content
document.getElementById('comcast_content').remove();  

// jquery line to remove elements mentioning trump 

$(":contains(Trump),:contains(TRUMP),:contains(trump)")
    .filter(function(){return $(this).clone().children().remove()
    .end().text().toLowerCase().indexOf("trump")!=-1;}).remove();