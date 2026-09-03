module.exports = (sequelize, Sequelize) => {

    const Cliente = sequelize.define("cliente", {

        nombre_completo: {
            type: Sequelize.STRING
        },

        nombre_usuario: {
            type: Sequelize.STRING
        },

        password_hash: {
            type: Sequelize.STRING
        },

        email: {
            type: Sequelize.STRING
        },

        telefono: {
            type: Sequelize.STRING
        },

        direccion: {
            type: Sequelize.STRING
        },

        fecha_creacion: {
            type: Sequelize.DATEONLY
        },

        status: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }

    }, {
        timestamps: false
    });

    return Cliente;
}