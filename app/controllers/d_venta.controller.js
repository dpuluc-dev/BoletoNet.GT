const db = require("../models");
const DetalleVenta = db.d_venta;

// Create and Save a new DetalleVenta
exports.create = (req, res) => {
    if (!req.body.id_venta || !req.body.id_inventario || !req.body.cantidad || !req.body.precio_unitario) {
        res.status(400).send({
            message: "id_venta, id_inventario, cantidad y precio_unitario son obligatorios!"
        });
        return;
    }

    // Calculamos el subtotal automaticamente (cantidad * precio_unitario), tal como pide el PDF
    const subtotalCalculado = req.body.cantidad * req.body.precio_unitario;

    const detalle = {
        id_venta: req.body.id_venta,
        id_inventario: req.body.id_inventario,
        cantidad: req.body.cantidad,
        precio_unitario: req.body.precio_unitario,
        subtotal: subtotalCalculado
    };

    DetalleVenta.create(detalle)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the DetalleVenta."
            });
        });
};

// Retrieve all DetalleVentas from the database.
exports.findAll = (req, res) => {
    DetalleVenta.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving detalle_ventas."
            });
        });
};

// Find a single DetalleVenta with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    DetalleVenta.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving DetalleVenta with id=" + id
            });
        });
};

// Update a DetalleVenta by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    DetalleVenta.update(req.body, {
        where: { id_detalle: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "DetalleVenta was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update DetalleVenta with id=${id}. Maybe it was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating DetalleVenta with id=" + id
            });
        });
};

// Delete a DetalleVenta with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    DetalleVenta.destroy({
        where: { id_detalle: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "DetalleVenta was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete DetalleVenta with id=${id}. No fue encontrado!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete DetalleVenta with id=" + id
            });
        });
};

// Delete all DetalleVentas from the database.
exports.deleteAll = (req, res) => {
    DetalleVenta.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} DetalleVentas were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all detalle_ventas."
            });
        });
};
