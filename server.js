require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");

async function iniciarBaseDatos() {
    try {
        await db.sequelize.sync();
        const [diagnostico] = await db.sequelize.query(`
    SELECT
        current_database() AS base_datos,
        current_schema() AS esquema,
        current_user AS usuario_bd,
        to_regclass('public.usuarios') AS tabla_usuarios,
        EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = 'usuarios'
              AND column_name = 'codigo_recuperacion_hash'
        ) AS existe_columna_recuperacion;
`);

console.log("DIAGNOSTICO DE BASE DE DATOS:", diagnostico);

       await db.sequelize.query(`
    ALTER TABLE public.usuarios
    ADD COLUMN IF NOT EXISTS codigo_recuperacion_hash VARCHAR(255),
    ADD COLUMN IF NOT EXISTS codigo_recuperacion_expira TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS intentos_recuperacion INTEGER NOT NULL DEFAULT 0;
`);

const [columnas] = await db.sequelize.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'usuarios'
      AND column_name IN (
          'codigo_recuperacion_hash',
          'codigo_recuperacion_expira',
          'intentos_recuperacion'
      );
`);

console.log("Columnas de recuperación encontradas:", columnas);

        console.log("Base de datos sincronizada correctamente");
        console.log("Columnas de recuperación verificadas correctamente");

    } catch (err) {
        console.error("ERROR AL INICIAR LA BASE DE DATOS:", err);
        process.exit(1);
    }
}




app.get("/", (req, res) => {
    res.json({ message: "API funcionando correctamente!" });
});


require("./app/routes/usuario.routes.js")(app);
require("./app/routes/cliente.routes.js")(app);

require("./app/routes/artista.routes.js")(app);
require("./app/routes/concierto.routes.js")(app);

require("./app/routes/localidad.routes.js")(app);
require("./app/routes/inventario.routes.js")(app);

require("./app/routes/d_venta.routes.js")(app);
require("./app/routes/venta.routes.js")(app);

require("./app/routes/estado.routes.js")(app);

const PORT = process.env.PORT || 8081;

iniciarBaseDatos().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
    });
});
