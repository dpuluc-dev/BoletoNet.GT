module.exports = (sequelize, Sequelize) => {
    const Concierto = sequelize.define("concierto", {

        idArtista: {
            type: Sequelize.INTEGER,
        },
        titulo_evento: {
            type: Sequelize.STRING
        },
        descripcion: {
            type: Sequelize.STRING
        },
        fecha_concierto: {
            type: Sequelize.DATEONLY,
        },
        recinto: {
            type: Sequelize.STRING,
        },
        estado: {
            type: Sequelize.STRING,
        },
        capacidad_total: {
            type: Sequelize.INTEGER
        },
        fecha_inicio_venta: {
            type: Sequelize.DATEONLY
        },
        fecha_final_venta: {
            type: Sequelize.DATEONLY
        }
    }, {
        timestamps: false
    });

    return Concierto;

}