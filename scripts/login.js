function validate(){
var username = document.getElementById("username").value;
var password = document.getElementById("password").value;
if ( username == "city" && password == "city"){
alert ("Login successfully");
document.getElementById('id02').style.display='block'
return false;
}
else
{
	alert ("Wrong password or username");
}
}