module.exports = app => {
    const estados = require("../controllers/estado.controller.js");
    var router = require("express").Router();
    router.post("/create", estados.create);
    router.get("/", estados.findAll);
    router.get("/:id", estados.findOne);
    router.put("/update/:id", estados.update);
    router.delete("/delete/:id", estados.delete);
    app.use("/api/estado", router);
};
