module.exports = app => {
    const clientes = require("../controllers/cliente.controller.js");
    var router = require("express").Router();
    router.post("/create/", clientes.create);
    router.get("/", clientes.findAll);
    router.get("/AccesoLogin/:rol", clientes.AccesoLogin);
    router.get("/:id", clientes.findOne);
    router.put("/update/:id", clientes.update);
    router.delete("/delete/:id", clientes.delete);
    app.use("/api/cliente", router);
};