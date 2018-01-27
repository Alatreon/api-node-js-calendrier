node 5.9.1
quelque soit la version de NodeJs, la verion de npm doit etre inferieur a 3.
Python 2.7 et un compilateur C++ doivent etre installé pour le module node-gyp
mongoDB 3.2.4

Postman :

inscription:
POST http://127.0.0.1:8000/api/signup:
Body:x-www-form-urlencoded:{name:anyname,password:anypassword}

authentification:
POST http://127.0.0.1:8000/api/authenticate:
Body:x-www-form-urlencoded:{name:username,password:userpassword}
renvoie une clée : JWT 

exemple de route securisé :
http://127.0.0.1:8000/api/memberinfo:
Header:
Authorization:JWT

