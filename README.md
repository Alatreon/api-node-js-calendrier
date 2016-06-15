node 5.9.1
mongoDB 3.2.4

Postman :

inscription:
POST http://127.0.0.1:8000/api/signup:
Body:x-www-form-urlencoded:{name:anyname,password:anypassword}

authentification:
POST http://127.0.0.1:8000/api/authenticate:
Body:x-www-form-urlencoded:{name:username,password:userpassword}
renvoie une clée : (JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmY4NzJmNGIyZGZjZTZjMGUxOTlhM2IiLCJuYW1lIjoidGVzdCIsInBhc3N3b3JkIjoiJDJhJDEwJExHLkkybTkyMHpiZTRLNzRiam9nSC5EMXZaL2JrdDJ2OFJHR3FpaE1RZkhBWFU1dURJcE9xIiwiX192IjowfQ.ErI1Y7v6e92yJxB1YMKP74KiyiJBs8vE0BMH93-JEiQ)

exemple de route securisé :
http://127.0.0.1:8000/api/memberinfo:
Header:
Authorization:JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmY4NzJmNGIyZGZjZTZjMGUxOTlhM2IiLCJuYW1lIjoidGVzdCIsInBhc3N3b3JkIjoiJDJhJDEwJExHLkkybTkyMHpiZTRLNzRiam9nSC5EMXZaL2JrdDJ2OFJHR3FpaE1RZkhBWFU1dURJcE9xIiwiX192IjowfQ.ErI1Y7v6e92yJxB1YMKP74KiyiJBs8vE0BMH93-JEiQ

