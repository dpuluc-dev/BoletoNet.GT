module.exports = (sequelize, Sequelize) => {
    const Estado = sequelize.define("estado", {

        estado: {
            type: Sequelize.STRING,
        },
        fecha_creacion: {
            type: Sequelize.DATEONLY
        },
        status: {
            type: Sequelize.BOOLEAN,
            toDefaultValue: true
        }

    }, {
        timestamps: false
    });

    return Estado;

} 
