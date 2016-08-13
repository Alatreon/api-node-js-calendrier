var checkEmail = function(email){
	var emailSplit = email.split("@");
	if(emailSplit[1]=="isobar.com")
	{
		return true;
	}
	else
	{
		return false;
	}
}

exports.checkEmail = checkEmail