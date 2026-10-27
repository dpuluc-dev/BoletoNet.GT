const db = require("../models");
const Usuario = db.usuario;
const Op = db.Sequelize.Op;
const crypto = require("crypto");
const bcrypt = require("bcryptjs");


// Crear un usuario

exports.create = async (req, res) => {
    try {
        const passwordPlano = req.body.password_hash;

        if (!passwordPlano || !String(passwordPlano).trim()) {
            return res.status(400).send({
                message: "La contraseña es obligatoria."
            });
        }

        const passwordHash = await bcrypt.hash(
            String(passwordPlano),
            12
        );

        const usuario = {
            nombre_completo: req.body.nombre_completo,
            nombre_usuario: req.body.nombre_usuario,
            password_hash: passwordHash,
            email: req.body.email,
            telefono: req.body.telefono,
            direccion: req.body.direccion,
            rol: req.body.rol,
            fecha_creacion: req.body.fecha_creacion,
            status: req.body.status ? req.body.status : false
        };

        const data = await Usuario.create(usuario);

        const resultado = data.toJSON();
        delete resultado.password_hash;

        return res.status(201).send(resultado);

    } catch (err) {
        console.error("Error al crear usuario:", err.message);

        return res.status(500).send({
            message: err.message ||
                "Se produjo un error al crear el usuario."
        });
    }
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

exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const cambios = { ...req.body };

        // Si se envía una contraseña, cifrarla antes de guardarla.
        if (cambios.password_hash) {
            cambios.password_hash = await bcrypt.hash(
                String(cambios.password_hash),
                12
            );
        } else {
            // No modificar la contraseña si no se envió una nueva.
            delete cambios.password_hash;
        }

        const [num] = await Usuario.update(cambios, {
            where: { id: id }
        });

        if (num === 1) {
            return res.send({
                message: "El usuario se actualizó correctamente."
            });
        }

        return res.status(404).send({
            message: `No se encontró el usuario con id=${id}.`
        });

    } catch (err) {
        console.error("Error al actualizar usuario:", err.message);

        return res.status(500).send({
            message: "Error al actualizar el usuario."
        });
    }
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



// Login: valida el usuario y la contraseña con bcrypt
exports.AccesoLogin = async (req, res) => {
    try {
        const nombre_usuario = req.params.nombre_usuario;
        const password = req.query.password;

        if (!password) {
            return res.status(400).send({
                message: "Debes ingresar la contraseña."
            });
        }

        const usuario = await Usuario.findOne({
            where: { nombre_usuario: nombre_usuario },
               attributes: {
        exclude: [
            "codigo_recuperacion_hash",
            "codigo_recuperacion_expira",
            "intentos_recuperacion"
        ]
    }
 });

        if (!usuario) {
            return res.status(401).send({
                message: "Usuario o contraseña incorrectos."
            });
        }

        const passwordValida = await bcrypt.compare(
            password,
            usuario.password_hash
        );

        if (!passwordValida) {
            return res.status(401).send({
                message: "Usuario o contraseña incorrectos."
            });
        }

        const resultado = usuario.toJSON();
        delete resultado.password_hash;

        return res.status(200).send(resultado);

    } catch (error) {
    console.error("Error en AccesoLogin:", error);

    return res.status(500).send({
        message: "Error interno al iniciar sesión."
    });
  }
};      
exports.solicitarRecuperacion = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !email.trim()) {
            return res.status(400).send({
                message: "Debes ingresar tu correo electrónico."
            });
        }

        const [diagnostico] = await Usuario.sequelize.query(`
    SELECT
        current_database() AS base_datos,
        current_schema() AS esquema,
        current_user AS usuario_bd,
        to_regclass('public.usuarios') AS tabla_usuarios,
        EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = 'usuarios'
              AND column_name = 'codigo_recuperacion_hash'
        ) AS existe_columna
`);

console.log("DIAGNOSTICO RECUPERACION:", diagnostico);
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
