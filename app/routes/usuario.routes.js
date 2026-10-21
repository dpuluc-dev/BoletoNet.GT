
module.exports = app => {
    const usuarios = require("../controllers/usuario.controller.js");
    var router = require("express").Router();

    router.post("/create/", usuarios.create);
    router.get("/", usuarios.findAll);
    router.get("/AccesoLogin/:nombre_usuario", usuarios.AccesoLogin);
    router.get("/:id", usuarios.findOne);
    router.put("/update/:id", usuarios.update);
    router.delete("/delete/:id", usuarios.delete);

    // Recuperación de contraseña
    router.post(
    "/recuperacion/solicitar",
     usuarios.solicitarRecuperacion
    );

    router.post(
    "/recuperacion/verificar",
     usuarios .verificarRecuperacion
     );
     
    router.post(
    "/recuperacion/restablecer",
    usuarios.restablecerContrasena
    );
    app.use("/api/usuario", router);
};


