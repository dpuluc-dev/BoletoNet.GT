const { Router } = require("express");

module.exports = app => {
    const inventario = require("../controllers/inventario.controller.js");
    var router = require("express").Router();
    router.post("/create", inventario.inventario);
    router.get("/", inventario.findAll);
    router.get("/:id", inventario.findOne);
    router.put("/update/:id", inventario.update);
    router.delete("/delete/:id", inventario.delete);
    router.put("/descontar/:id", inventario.descontar);
    app.use("/api/inventario", router);
}; 
