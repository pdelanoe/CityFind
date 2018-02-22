function validate(){
var username = document.getElementById("username").value;
var password = document.getElementById("password").value;
if ( username == "city" && password == "city"){
alert ("Login successfully");
window.location = ""; // afficher les high score
return false;
}
else
{
	alert ("Wrong password or username");
}
}