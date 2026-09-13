module.exports = app => {
    const localidad = require("../controllers/localidad.controller.js");
    var router = require("express").Router();
    router.post("/create", localidad.create);
    router.get("/", localidad.findAll);
    router.get("/:id", localidad.findOne);
    router.put("/update/:id", localidad.update);
    router.delete("/delete/:id", localidad.delete);
    app.use("/api/localidad", router);
};