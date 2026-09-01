module.exports = app => {
    const usuarios = require("../controllers/usuario.controller.js");
    var router = require("express").Router();
    router.post("/create/", usuarios.create);
    router.get("/", usuarios.findAll);
    router.get("/:id", usuarios.findOne);
    router.put("/update/:id", usuarios.update);
    router.delete("/delete/:id", usuarios.delete);
    app.use("/api/usuario", router);
};