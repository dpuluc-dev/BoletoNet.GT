module.exports = (sequelize, Sequelize) => {
    const Estado = sequelize.define("estado", {

        estado: {
            type: Sequelize.STRING,
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
