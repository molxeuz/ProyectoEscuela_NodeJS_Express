const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Arreglo de usuarios

const users = [
  { username: 'admin', fullname: 'admin', password: 'admin123', rol: 1 },
  { username: 'user', fullname: 'user', password: 'user123', rol: 2 },
];

// Arreglo del property

const property = [];


// -------------------------------

// Middleware de validación de usuario y contraseña (login del inicio / )

function validateUser(username, password) {
  return users.find(
    (user) => user.username === username && user.password === password
  );
}


// Middleware para verificar el rol del usuario y autenticar (login a /costumers y /controlpanel)

const authenticate = (req, res, next) => {

    const { username, password } = req.body;
    const user = users.find((u) => u.username === username && u.password === password);
    
    if (user) {
      req.rol = user.rol === 1 ? 'admin' : 'customer';
      next();
    } else {
      res.status(401).send('Credenciales inválidas');
    }
};  

// -------------------------------

// GET / (inicio)

app.get("/", (req, res) => {
  const { username, password } = req.body;
  const user = validateUser(username, password);
  if (user) {
    req.user = user;
    res.sendFile(__dirname + "/views/index.html");
  } else {
    res.send("Usuario o contraseña incorrectos");
  }
});


// GET /quienessomos

app.get('/quienessomos', (req, res) => {
    res.sendFile(__dirname + '/views/quienessomos.html');
});


// GET /customers (login para usuarios y administradores)

app.get('/customers', authenticate, (req, res) => {
  
  if (req.rol === 'customer' || req.rol === 'admin') {
      res.sendFile(__dirname + '/views/costumers.html');
  } else {
      res.send('No tienes acceso.');
  }
  
});


// GET /controlpanel (login para administradores)

app.get('/controlpanel', authenticate, (req, res) => {

  if (req.rol === 'admin') {
    res.sendFile(__dirname + '/views/controlpanel.html');
  } else {
    res.send('No tienes acceso.');
  }

});

// -------------------------------


// POST /property

app.post("/property", (req, res) => {

  const { idProperty, addressProperty, valueProperty } = req.body;

  const propertyExists = property.some(
    (property) => property.idProperty === idProperty
  );

  if (propertyExists) {
    res.status(400).send("El idProperty ya existe");
  } else {
    property.push({ idProperty, addressProperty, valueProperty });
    res.send("Propiedad agregada con éxito");
  }

});

app.get("/property_search", (req, res) => {
  res.json(property);
});

// -------------------------------

// PUT /

app.put('/', (req, res) => {
  res.send('Se ha ingresado a la ruta PUT /');
});

// DELETE /student

app.delete('/student', (req, res) => {
  res.send('Se ha ingresado a la ruta DELETE /student');
});

// --------------------------

app.listen(port, () => {
    console.log(`Server in http://localhost:${port}`);
})
