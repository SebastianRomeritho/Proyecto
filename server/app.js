// Importar las dependencias necesarias
const { error } = require("console");
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

// Crear una instancia de la aplicación Express
const app = express();
const port = process.env.PORT || "8080";

// Configurar la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "tienda",
  port: "3306",
});

// Conectar a la base de datos
connection.connect((error) => {
  if (error) {
    console.error("Error al conectar a la base de datos: ", error);
  } else {
    console.log("Conexión exitosa a la base de datos");
  }
});

// Middleware para permitir solicitudes de diferentes dominios
app.use(cors());

// Middleware para analizar el cuerpo de las solicitudes como JSON
app.use(express.json());

// Ruta principal
app.get("/", (req, res) => {
  res.send("¡Bienvenido a mi API!");
});

// Ruta para obtener todos los fabricantes
app.get("/fabricantes", (req, res) => {
  connection.query("SELECT * FROM fabricante", (error, results) => {
    if (error) {
      console.error("Error al ejecutar la consulta: ", error);
      res.status(500).send("Error en el servidor");
    } else {
      res.json(results);
    }
  });
});

// Ruta para obtener todos los productos
app.get("/productos", (req, res) => {
  connection.query("SELECT * FROM producto", (error, results) => {
    error ? res.status(500).send("Error") : res.json(results);
  });
});

//Ruta para obtener un fabricante
app.get("/fabricante/:id_fabricante", (req, res) => {
  const {id_fabricante} = req.params;
  connection.query("SELECT * FROM fabricante WHERE codigo = ?", [id_fabricante], (error, results) => {
    error ? res.status(500).send("Error") : res.json(results);
  });
});

//Ruta para obtener un producto
app.get("/producto/:id_producto", (req, res) => {
  const {id_producto} = req.params;
  connection.query("SELECT * FROM producto WHERE codigo = ?", [id_producto], (error, results) => {
    error ? res.status(500).send("Error") : res.json(results);
  });
});



// Ruta para insertar un nuevo producto
app.post("/producto", (req, res) => {
  const { nombre, precio, codigo_fabricante } = req.body;
  connection.query(
    "INSERT INTO producto(nombre, precio, codigo_fabricante) VALUES(?,?,?)",
    [nombre, precio, codigo_fabricante],
    (error, result) => {
      error ? res.status(500).send("Error al realizar la inserción") : res.status(200).send("Inserción exitosa");
    }
  );
});

// Ruta para insertar un nuevo fabricante
app.post("/fabricante", (req, res) => {
  const { nombre } = req.body;
  connection.query(
    "INSERT INTO fabricante(nombre) VALUES(?)",
    [nombre],
    (error, result) => {
      error ? res.status(500).send("Error al realizar la inserción") : res.status(200).send("Inserción exitosa");
    }
  );
});

// Ruta para actualizar un producto por su ID
app.put("/producto/:id_producto", (req, res) => {
  const { id_producto } = req.params;
  const { nombre, precio, codigo_fabricante } = req.body;
  connection.query(
    "UPDATE producto SET nombre = ?, precio = ?, codigo_fabricante = ? WHERE codigo = ?",
    [nombre, precio, codigo_fabricante, id_producto],
    (error, result) => {
      error ? res.status(500).send("Error al realizar la actualización") : res.status(200).send("Actualización exitosa");
    }
  );
});

// Ruta para actualizar un fabricante por su ID
app.put("/fabricante/:id_fabricante", (req, res) => {
  const { id_fabricante } = req.params;
  const { nombre } = req.body;
  connection.query(
    "UPDATE fabricante SET nombre = ? WHERE codigo = ?",
    [nombre, id_fabricante],
    (error, result) => {
      error ? res.status(500).send("Error al realizar la actualización") : res.status(200).send("Actualización exitosa");
    }
  );
});

// Ruta para eliminar un producto por su ID
app.delete("/producto/:id_producto", (req, res) => {
  const { id_producto } = req.params;
  connection.query("DELETE FROM producto WHERE codigo = ?", [id_producto], (error, result) => {
    error ? res.status(500).send("Error al eliminar el producto", error) : res.status(200).send("Se ha eliminado correctamente");
  });
});

// Ruta para eliminar un fabricante por su ID
app.delete("/fabricante/:id_fabricante", (req, res) => {
  const id_fabricante = req.params.id_fabricante;
  
  connection.query("SELECT * FROM producto WHERE codigo_fabricante = ?", [id_fabricante], (error, result) => {
    if(result.length > 0){
      res.status(500).send("No se puede eliminar el fabricante porque tiene productos asociados");
    }else{
      connection.query("DELETE FROM fabricante WHERE codigo = ?", [id_fabricante], (error, result) => {
        error ? res.status(500).send("Error al eliminar el fabricante", error) : res.status(200).send("Se ha eliminado correctamente");
      });
    }

  });
  
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
