module.exports = (sequelize, Sequelize) => {

    const DetalleVenta = sequelize.define("detalle_venta", {

        id_detalle: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        // FK real hacia la tabla venta (a que venta pertenece este detalle/item)
        id_venta: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "venta",
                key: "id_venta"
            }
        },

        // FK real hacia la tabla inventarios (registro especifico de evento/localidad comprado)
        // Nota: el modelo de tu compañero se llama "inventario" en el codigo, pero la tabla real en la BD es "inventarios"
        id_inventario: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "inventarios",
                key: "id_inventario"
            }
        },

        cantidad: {
            type: Sequelize.INTEGER,
            allowNull: false
        },

        precio_unitario: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false
        },

        subtotal: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false
        }

    }, {
        timestamps: false
    });

    return DetalleVenta;
}