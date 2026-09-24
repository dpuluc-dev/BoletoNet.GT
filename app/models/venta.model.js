module.exports = (sequelize, Sequelize) => {

    const Venta = sequelize.define("venta", {

        // Declaramos id_venta explicitamente porque el PDF pide ese nombre exacto
        // (Sequelize por defecto crea la PK como "id", pero aqui la necesitamos llamar "id_venta")
        id_venta: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        // FK real hacia la tabla usuario (el vendedor que proceso la venta)
        id_vendedor: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "usuarios",
                key: "id"
            }
        },

        // TIMESTAMP con default NOW(), tal como pide el PDF
        fecha_venta: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },

        total_venta: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false
        }

    }, {
        timestamps: false
    });

    return Venta;
} 
