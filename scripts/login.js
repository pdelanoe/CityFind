
function validate() {
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	var mesUsers = new Array();
	var userfind = false;
	//Fonction qui récupère les users
	$.getJSON('scripts/Users.json', function (donnees) {
		donnees.User.forEach(function (u) {
			mesUsers.push(u);
		});
		for (var i = 0; i < mesUsers.length; i++) {
			if (username == mesUsers[i].Name && password == mesUsers[i].Password) {
				userfind = true;
			}
		}
		if (userfind == true) {
			alert("Login successfully");
			return false;
		}
		else {
			alert("Wrong password or username");
		}
	});
}