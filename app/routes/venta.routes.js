module.exports = app => {
    const ventas = require("../controllers/venta.controller.js");
    var router = require("express").Router();

    router.post("/create/", ventas.create);
    router.get("/", ventas.findAll);
    router.get("/:id", ventas.findOne);
    router.put("/update/:id", ventas.update);
    router.delete("/delete/:id", ventas.delete);
    router.delete("/delete/", ventas.deleteAll);

    app.use("/api/ventas", router);
};
