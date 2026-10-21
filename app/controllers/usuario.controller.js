const db = require("../models");
const Usuario = db.usuario;
const Op = db.Sequelize.Op;
const crypto = require("crypto");
const bcrypt = require("bcryptjs");


// Crear un usuario
exports.create = (req, res) => {
    const usuario = {
        nombre_completo: req.body.nombre_completo,
        nombre_usuario: req.body.nombre_usuario,
        password_hash: req.body.password_hash,
        email: req.body.email,
        telefono: req.body.telefono,
        direccion: req.body.direccion,
        rol: req.body.rol,
        fecha_creacion: req.body.fecha_creacion,
        status: req.body.status ? req.body.status : false
    }

    Usuario.create(usuario)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Se produjo un error al crear el usuario!"
            });
        });
};


// Listar todos los usuarios (con filtro opcional por nombre_completo)
exports.findAll = (req, res) => {
    const nombre_completo = req.query.nombre_completo;
    var condition = nombre_completo ? { nombre_completo: { [Op.iLike]: `%${nombre_completo}%` } } : null;

    Usuario.findAll({
    attributes: { exclude: ["password_hash"] },
    where: condition
})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Se produjo un error al recuperar los usuarios!"
            });
        });
};


// Obtener un usuario por id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Usuario.findByPk(id, {
    attributes: { exclude: ["password_hash"] }
})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al recuperar el usuario con id=" + id
            });
        });
};


// Actualizar un usuario por id
exports.update = (req, res) => {
    const id = req.params.id;

    Usuario.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "El usuario se actualizó correctamente."
                });
            } else {
                res.send({
                    message: `No se puede actualizar el usuario con id=${id}`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al actualizar el usuario con id=" + id
            });
        });
};


// Eliminar un usuario por id
exports.delete = (req, res) => {
    const id = req.params.id;

    Usuario.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "El usuario se eliminó correctamente!"
                });
            } else {
                res.send({
                    message: `No se puede eliminar el usuario con id=${id}`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "No se pudo eliminar el usuario con id=" + id
            });
        });
};


// Login - Busca por rol e incluye en password_hash 
exports.AccesoLogin = (req, res) => {
    const nombre_usuario = req.params.nombre_usuario;

    Usuario.findOne({ where: { nombre_usuario: nombre_usuario } })
        .then(data => {
            if (!data) {
                return res.status(404).send({ message: "Usuario no encontrado." });
            }
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al buscar el usuario: " + err.message
            });
        });
    };

        
exports.solicitarRecuperacion = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !email.trim()) {
            return res.status(400).send({
                message: "Debes ingresar tu correo electrónico."
            });
        }

        const usuario = await Usuario.findOne({
            where: {
                email: email.trim().toLowerCase()
            }
        });
        console.log("PASO 1: Búsqueda de usuario terminada");
        console.log("PASO 2: Usuario encontrado:", !!usuario);

        // Respuesta genérica para no revelar si existe el correo.
        if (!usuario) {
            return res.send({
                message: "Si el correo está registrado, recibirás instrucciones."
            });
        }

        // Generar código de recuperación de 6 dígitos.
        const codigo = crypto.randomInt(100000, 1000000).toString();

        // Guardar solamente el hash del código.
        const codigoHash = await bcrypt.hash(codigo, 10);

        await usuario.update({
            codigo_recuperacion_hash: codigoHash,
            codigo_recuperacion_expira: new Date(Date.now() + 10 * 60 * 1000),
            intentos_recuperacion: 0
        });
        console.log("PASO 3: Código de recuperación guardado");

        
        console.log("Enviando correo mediante la API de Brevo...");

        if (!process.env.BREVO_API_KEY) {
            throw new Error("Falta configurar BREVO_API_KEY.");
        }

        if (!process.env.SMTP_FROM) {
            throw new Error("Falta configurar SMTP_FROM.");
        }

        const respuestaCorreo = await fetch(
            "https://api.brevo.com/v3/smtp/email",
            {
                method: "POST",
                headers: {
                    "accept": "application/json",
                    "api-key": process.env.BREVO_API_KEY,
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    sender: {
                        name: "BoletoNet.GT",
                        email: process.env.SMTP_FROM
                    },
                    to: [
                        {
                            email: usuario.email
                        }
                    ],
                    subject: "Recuperación de contraseña - BoletoNet.GT",
                    textContent: `Tu código de recuperación es: ${codigo}

Vence en 10 minutos. Si no solicitaste este código, puedes ignorar este correo.`
                })
            }
        );

        if (!respuestaCorreo.ok) {
            const detalle = await respuestaCorreo.text();

            console.error(
                "Error de Brevo:",
                respuestaCorreo.status,
                detalle
            );

            throw new Error(
                `Brevo rechazó el envío. Código HTTP: ${respuestaCorreo.status}`
            );
        }

        const resultadoCorreo = await respuestaCorreo.json();

        console.log(
            "Solicitud aceptada por Brevo. Message ID:",
            resultadoCorreo.messageId
        );


        return res.send({
            message: "Si el correo está registrado, recibirás instrucciones."
        });

    } catch (error) {
        console.error("Error en recuperación:", error.message);

        return res.status(500).send({
            message: "No se pudo procesar la solicitud. Intenta más tarde."
        });
    }
};
exports.verificarRecuperacion = async (req, res) => {
    try {
        const { email, codigo } = req.body;

        if (!email || !codigo) {
            return res.status(400).send({
                message: "Debes ingresar el correo y el código."
            });
        }

        if (!/^\d{6}$/.test(String(codigo))) {
            return res.status(400).send({
                message: "El código debe tener 6 dígitos."
            });
        }

        const usuario = await Usuario.findOne({
            where: {
                email: email.trim().toLowerCase()
            }
        });

        if (!usuario || !usuario.codigo_recuperacion_hash) {
            return res.status(400).send({
                message: "Código inválido o vencido."
            });
        }

        if (
            !usuario.codigo_recuperacion_expira ||
            new Date(usuario.codigo_recuperacion_expira) <= new Date()
        ) {
            await usuario.update({
                codigo_recuperacion_hash: null,
                codigo_recuperacion_expira: null,
                intentos_recuperacion: 0
            });

            return res.status(400).send({
                message: "El código venció. Solicita uno nuevo."
            });
        }

        if (usuario.intentos_recuperacion >= 5) {
            await usuario.update({
                codigo_recuperacion_hash: null,
                codigo_recuperacion_expira: null,
                intentos_recuperacion: 0
            });

            return res.status(429).send({
                message: "Superaste el límite de intentos. Solicita un código nuevo."
            });
        }

        const codigoCorrecto = await bcrypt.compare(
            String(codigo),
            usuario.codigo_recuperacion_hash
        );

        if (!codigoCorrecto) {
            await usuario.increment("intentos_recuperacion");

            return res.status(400).send({
                message: "Código incorrecto."
            });
        }

        return res.send({
            message: "Código verificado correctamente."
        });

    } catch (error) {
        console.error("Error verificando recuperación:", error.message);

        return res.status(500).send({
            message: "No se pudo verificar el código."
        });
    }

};

exports.restablecerContrasena = async (req, res) => {
    try {
        const { email, codigo, nuevaContrasena } = req.body;

        if (!email || !codigo || !nuevaContrasena) {
            return res.status(400).send({
                message: "Debes ingresar correo, código y nueva contraseña."
            });
        }

        if (!/^\d{6}$/.test(String(codigo))) {
            return res.status(400).send({
                message: "El código debe tener 6 dígitos."
            });
        }

        if (String(nuevaContrasena).length < 8) {
            return res.status(400).send({
                message: "La contraseña debe tener al menos 8 caracteres."
            });
        }

        const usuario = await Usuario.findOne({
            where: {
                email: email.trim().toLowerCase()
            }
        });

        if (!usuario || !usuario.codigo_recuperacion_hash) {
            return res.status(400).send({
                message: "Código inválido o vencido."
            });
        }

        if (
            !usuario.codigo_recuperacion_expira ||
            new Date(usuario.codigo_recuperacion_expira) <= new Date()
        ) {
            await usuario.update({
                codigo_recuperacion_hash: null,
                codigo_recuperacion_expira: null,
                intentos_recuperacion: 0
            });

            return res.status(400).send({
                message: "El código venció. Solicita uno nuevo."
            });
        }

        if (usuario.intentos_recuperacion >= 5) {
            await usuario.update({
                codigo_recuperacion_hash: null,
                codigo_recuperacion_expira: null,
                intentos_recuperacion: 0
            });

            return res.status(429).send({
                message: "Superaste el límite. Solicita un código nuevo."
            });
        }

        const codigoCorrecto = await bcrypt.compare(
            String(codigo),
            usuario.codigo_recuperacion_hash
        );

        if (!codigoCorrecto) {
            await usuario.increment("intentos_recuperacion");

            return res.status(400).send({
                message: "Código incorrecto."
            });
        }

        const passwordHash = await bcrypt.hash(
            String(nuevaContrasena),
            10
        );

        await usuario.update({
            password_hash: passwordHash,
            codigo_recuperacion_hash: null,
            codigo_recuperacion_expira: null,
            intentos_recuperacion: 0
        });

        return res.send({
            message: "Contraseña restablecida correctamente."
        });

    } catch (error) {
        console.error("Error restableciendo contraseña:", error.message);

        return res.status(500).send({
            message: "No se pudo restablecer la contraseña."
        });
    }
};
