const express = require("express");
const axios = require("axios");

const app = express();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server ejecutandose en: ${PORT}`);
});

// Ruta de inicio
app.get("/", (req, res) => {
  res.send("Deivid Nicolas Urrea Lara - ID:0000304871");
});

//===================================================================================
// Simulación de base de datos de usuarios
const users = [
  { id: 1, nombre: "Samuel", apellido: "Acero" },
  { id: 2, nombre: "Darek", apellido: "Aljuri" },
  { id: 3, nombre: "Juan", apellido: "Cepeda" },
  { id: 4, nombre: "Ana", apellido: "Chaves" },
  { id: 5, nombre: "Carlos", apellido: "Cruz" },
  { id: 6, nombre: "Diego", apellido: "Díaz" },
  { id: 7, nombre: "Jorge", apellido: "Díaz" },
  { id: 8, nombre: "Esteban", apellido: "Díaz" },
  { id: 9, nombre: "Juan", apellido: "Forero" },
  { id: 10, nombre: "Santiago", apellido: "Gutierrez" },
  { id: 11, nombre: "Samuel", apellido: "Lopez" },
  { id: 12, nombre: "Michael", apellido: "Medina" },
  { id: 13, nombre: "Katherin", apellido: "Moreno" },
  { id: 14, nombre: "Juan", apellido: "Moreno" },
  { id: 15, nombre: "Nicolás", apellido: "Muñoz" },
  { id: 16, nombre: "Santiago", apellido: "Navarro" },
  { id: 17, nombre: "Juan", apellido: "Parrado" },
  { id: 18, nombre: "Daniel", apellido: "Ramirez" },
  { id: 19, nombre: "Juan", apellido: "Restrepo" },
  { id: 20, nombre: "Gabriela", apellido: "Reyes" },
  { id: 21, nombre: "Juan", apellido: "Rodríguez" },
  { id: 22, nombre: "Valentina", apellido: "Ruiz" },
  { id: 23, nombre: "Mariana", apellido: "Salas" },
  { id: 24, nombre: "Sebastian", apellido: "Sanchez" },
  { id: 25, nombre: "Josue", apellido: "Sarmiento" },
  { id: 26, nombre: "Santiago", apellido: "Soler" },
  { id: 27, nombre: "Maria", apellido: "Tamayo" },
  { id: 28, nombre: "Nicolas", apellido: "Urrea" },
  { id: 29, nombre: "Andres", apellido: "Azcona" },
];

// Función para manejar errores
const handleNotFound = (res, resourceName) => {
  res
    .status(404)
    .send(`El nombre de ${resourceName} no fue encontrado en la base de datos`);
};

//verificacion Endpoint
app.get(["/users/","/user"], (req, res) => {
    res.status(400).send("La ruta /user/ requiere un numero entero");
  });

// Endpoint para obtener la lista de usuarios
app.get("/users/:count", (req, res) => {
  const count = parseInt(req.params.count);
  if (isNaN(count) || count <= 0) {
    return res
      .status(400)
      .json({ error: "El parámetro count debe ser un número entero positivo" });
  }

  let userList = users.slice(); // Clonar la lista completa de usuarios

  // Verificar si se debe ordenar la lista
  let sortParam = req.query.sort;
  // Si no se proporciona un parámetro de orden, establecerlo en 'ASC' por defecto
  if (!sortParam) {
    sortParam = "ASC";
  }

  // Ordenar la lista en función del parámetro de orden
  userList = userList.sort((a, b) => {
    if (sortParam.toUpperCase() === "ASC") {
      return a.apellido.localeCompare(b.apellido);
    } else if (sortParam.toUpperCase() === "DESC") {
      return b.apellido.localeCompare(a.apellido);
    } else {
      return res
        .status(400)
        .json({ error: "Parametro sort invalido es ASC o DESC" });
    }
  });

  // Obtener los primeros 'count' usuarios
  userList = userList.slice(0, count);

  // Devolver la lista de usuarios ordenada
  res.json(
    userList.map((user) => ({ nombre: user.nombre, apellido: user.apellido }))
  );
});

//=============================================================================================
// Ruta para /coin/:coinName
app.get(["/coin", "/coin/"], (req, res) => {
  res.status(400).send("La ruta /coin/ requiere un nombre de moneda");
});

app.get("/coin/:coinName", async (req, res) => {
  const coinName = req.params.coinName.toLowerCase();

  try {
    const response = await axios.get(
      `https://api.coincap.io/v2/assets/${coinName}`
    );

    if (response.data.data) {
      const price = response.data.data.priceUsd;
      res.send(
        `El precio en dólares de la moneda ${coinName} para el día de hoy es ${price}`
      );
    } else {
      handleNotFound(res, `la moneda ${coinName}`);
    }
  } catch (error) {
    handleNotFound(res, `la moneda ${coinName}`);
  }
});

app.use(express.json());

//===============================================================================================================================
//"creación" de usuarios
app.post("/users", (req, res) => {
  const { name, lastName, email, city, country } = req.body;
  const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Verificar si el cuerpo de la solicitud está vacío o no contiene los campos necesarios
  if (!req.body || !name || !lastName || !email) {
    return res.status(400).json({ error: "Faltan parámetros obligatorios" });
  }

  // Validar el formato del correo electrónico
  if (!correoRegex.test(email)) {
    return res.status(400).json({ error: "El formato del correo electrónico no es válido - EJEMPLO: pepito@example.com" });
  }

  if (!name.trim() || !lastName.trim() || !email.trim()) {
    return res.status(400).json({ error: 'Faltan parámetros obligatorios' });
  }

  const isNameValid = name.trim() !== '';
  const isLastNameValid = lastName.trim() !== '';

  // Verificar si city es una cadena vacía o consiste solo de espacios en blanco
  const isCityValid = city && city.trim() !== '';

  // Verificar si country es una cadena vacía o consiste solo de espacios en blanco
  const isCountryValid = country && country.trim() !== '';

  const usuario = {
    name: isNameValid ? name.trim() : '',
    lastName: isLastNameValid ? lastName.trim() : '',
    email,
    city: isCityValid ? city.trim() : "Bogotá",
    country: isCountryValid ? country.trim() : "Colombia"
  };

  // Simular la creación del usuario y retornar la información
  return res.status(201).json(usuario);
});
