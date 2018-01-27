<h5>Versions
</h5>
<p> Node 5.9.1 </p>
<p> Quelque soit la version de NodeJs, la verion de npm doit etre inferieur a 3. </p>
<p> Python 2.7 et un compilateur C++ doivent etre installé pour le module node-gyp </p>
<p> MongoDB 3.2.4 </p>

<h5>
Postman :
</h5>

<p>inscription:</p>
<p>POST http://127.0.0.1:8000/api/signup:</p>
<p>Body:x-www-form-urlencoded:{name:anyname,password:anypassword}</p>

<p>authentification:</p>
<p>POST http://127.0.0.1:8000/api/authenticate:</p>
<p>Body:x-www-form-urlencoded:{name:username,password:userpassword}</p>
<p>renvoie une clée : JWT</p>

<p>exemple de route securisé :</p>
<p>http://127.0.0.1:8000/api/memberinfo:</p>
<p>Header:</p>
<p>Authorization:JWT</p>

