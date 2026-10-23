module.exports = (sequelize, Sequelize) => {

    const Usuario = sequelize.define("usuario", {

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

        rol: {
            type: Sequelize.STRING
        },

        fecha_creacion: {
            type: Sequelize.DATEONLY
        },

        status: {
            type: Sequelize.BOOLEAN
        },
        
        codigo_recuperacion_hash: {
            type: Sequelize.STRING,
            allowNull: true
        },

        codigo_recuperacion_expira: {
            type: Sequelize.DATE,
            allowNull: true
        },

        intentos_recuperacion: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
        }, {
        tableName: "usuarios",
        schema: "public",
        timestamps: false
    });
    return Usuario;

}
