'use strict';
angular.module('shipper.models')

.provider('UsuarioModel', [

    function() {


        this.$get = [

            function() {
                //Variables globales del Provider
                var Database = undefined;
                var API = undefined;
                var AuthService = undefined;

                //variable del Modelo de Usuario
                var Modelo = {};

                //estructura general del modelo de Usuario
                Modelo.data = {
                    _id: '',
                    nombres: '',
                    apellidos: '',
                    correo: '',
                    celular: '',
                    avatar_principal: '',
                    contrasena: '',
                    pais: '',
                    puntos: '',
                    configuracion: '',
                    contactos: '',
                    sincronizado: '',
                    foto_publica: '',
                    vehiculo: {
                        placa: '',
                        modelo: '',
                        foto: ''
                    }
                };

                //función de incialiazación del modelo de usuario
                Modelo.init = function(db, api, auth) {
                    Database = db;
                    API = api;
                    AuthService = auth;
                    return new Promise(function(fulfill, reject) {
                        var consulta = "SELECT * FROM usuario;";
                        //establecemos si existe la tabla
                        Database.ejecutarSQL(consulta, []).then(
                            function(resultado) {
                                //existe la tabla de Usuario, no hay que proceder
                                fulfill(true);
                            },
                            function(error) {
                                //no existe la tabla de Usuario
                                var tablaUsuarios = 'CREATE TABLE IF NOT EXISTS usuario ( _id text,apellidos text, correo text, celular text, avatar_principal text, contrasena text, pais text, puntos text, configuracion text, contactos text, sincronizado text, foto_publica text, vehiculo text, disponible text);';
                                Database.ejecutarSQL(tablaUsuarios, []).then(
                                    function(resultado) {
                                        //Verificamos la existencia de la tabla de usuario Logueado
                                        var consulta = "SELECT * FROM usuarioLogueado;";
                                        Database.ejecutarSQL(consulta, []).then(
                                            function(resultado) {
                                                //existe la tabla de usuarioLogueado, no hay que proceder
                                                fulfill(true);
                                            },
                                            function(error) {
                                                //no existe la tabla de Usuario
                                                var tablaUsuarioLogueado = 'CREATE TABLE IF NOT EXISTS usuarioLogueado ( idUsuario text );';
                                                Database.ejecutarSQL(tablaUsuarioLogueado, []).then(
                                                    function(resultado) {
                                                        fulfill(true);
                                                    },
                                                    function(error) {
                                                        reject('UsuarioModel1');
                                                    }
                                                );
                                            }
                                        );
                                    },
                                    function(error) {
                                        reject('UsuarioModel2');
                                    }
                                );
                            }
                        );
                    });
                };

                //Funciones de autenticación
                Modelo.isLogged = function(Database, checkString) {
                    try {
                        var sqlConsulta = 'SELECT * FROM usuarioLogueado;';
                        return new Promise(function(fulfill, reject) {
                            Database.ejecutarSQL(sqlConsulta, []).then(
                                function(result) {
                                    if (result.rows.length > 0) {
                                        var id_usuario = result.rows.item(0).idUsuario;

                                        Modelo.buscar('_id', id_usuario).then(
                                            function(resultado) {
                                                var usuario = resultado.rows.item(0);
                                                API.Autenticar().save({
                                                        client_id: API.ClientID,
                                                        client_secret: API.ClientSecret,
                                                        state_param: checkString,
                                                        grant_type: 'password',
                                                        password: usuario.contrasena,
                                                        username: usuario.correo
                                                    },
                                                    function(authData) {
                                                        API.SetToken(authData.access_token);
                                                        //buscamos las actualizaciones
                                                        //TODO: Lógica de Actualizaciones
                                                        //Actualizamos los datos en la web del Usuario
                                                        if (resultado.rows.length > 0) {
                                                            Modelo.cargarSesion(resultado.rows.item(0));
                                                        };

                                                        API.BuscarUsuario('_id', id_usuario).get(
                                                            function(resultado) {
                                                                console.log(resultado);
                                                                if (resultado.success === true) {
                                                                    Modelo.cargarSesion(resultado.data[0]);
                                                                    Modelo.actualizar(resultado.data[0]);
                                                                    Modelo.autenticar(resultado.data[0]._id);
                                                                    fulfill(true);
                                                                } else {
                                                                    Modelo.descargarSesion();
                                                                    var sqlConsulta = 'DELETE FROM usuario WHERE _id = "' + id_usuario + '";';
                                                                    Database.ejecutarSQL(sqlConsulta, []);
                                                                    reject(false);
                                                                }
                                                            },
                                                            function(error) {
                                                                fulfill(true);
                                                            }
                                                        );

                                                    },
                                                    function(error) {
                                                        reject(false);
                                                    }
                                                );


                                            },
                                            function(err) {
                                                reject(err)
                                            }
                                        );

                                    } else {
                                        reject(false);
                                    }
                                },
                                function(error) {
                                    reject(error);
                                }
                            );
                        });
                    } catch (e) {}
                };

                //Función de búsqueda por cualquier campo del 
                Modelo.buscar = function(campo, valor) {
                    return new Promise(function(fulfill, reject) {
                        Database.ejecutarSQL('SELECT * FROM usuario WHERE ' + campo + '="' + valor + '";', []).then(
                            function(resultado) {
                                fulfill(resultado);
                            },
                            function(error) {
                                reject(error);
                            }
                        );
                    });
                };

                //registrar un nuevo usuario
                Modelo.registrar = function(modelo) {
                    return new Promise(
                        function(fulfill, reject) {
                            API.RegistrarUsuario.save(
                                modelo,
                                function(result) {
                                    if (result.success === true) {
                                        fulfill(true);
                                    } else {
                                        reject('UsrRegistro1');
                                    }
                                },
                                function(error) {
                                    reject('UsrRegistro2');
                                }
                            );
                        }
                    );
                };

                //Iniciar sesión
                Modelo.iniciarSesion = function(model) {
                    return new Promise(
                        function(fulfill, reject) {
                            AuthService.iniciarSesion(model.correo, model.contrasena).then(
                                function(usuario) {
                                    usuario.contrasena = model.contrasena;
                                    Modelo.autenticar(usuario._id).then(
                                        function(respuesta) {
                                            Modelo.crearLocal(usuario);
                                            fulfill(true);
                                        },
                                        function(error) {
                                            reject(error);
                                        }
                                    );


                                },
                                function(error) {
                                    reject(error);
                                }
                            );
                        }
                    );
                };

                //Registra el usuario actual en la app
                Modelo.autenticar = function(id_usuario) {
                    return new Promise(function(fulfill, reject) {
                        Database.ejecutarSQL("DELETE FROM usuarioLogueado;", []).then(
                            function(resultado) {
                                Database.ejecutarSQL('INSERT INTO usuarioLogueado(idUsuario) VALUES (?)', [id_usuario]).then(
                                    function(resultado) {
                                        fulfill(resultado);
                                    },
                                    function(error) {
                                        reject(error);
                                    }
                                );
                            },
                            function(error) {
                                reject(error);
                            }
                        );

                    });
                };

                //Carga los datos del usuario en la sesión de la aplicación
                Modelo.cargarSesion = function(data) {
                    Modelo.data = data;
                };

                //Elimina los datos del usuario de la sesión.
                Modelo.descargarSesion = function() {
                    Modelo.data = {
                        _id: '',
                        nombres: '',
                        apellidos: '',
                        correo: '',
                        celular: '',
                        avatar_principal: '',
                        contrasena: '',
                        pais: '',
                        puntos: '',
                        configuracion: '',
                        contactos: '',
                        sincronizado: '',
                        foto_publica: '',
                        vehiculo: {
                            placa: '',
                            modelo: '',
                            foto: ''
                        }
                    };
                    Database.ejecutarSQL("DELETE FROM usuarioLogueado;", []);
                };

                Modelo.crearLocal = function(data) {
                    var baseData = ['_id', 'apellidos', 'correo', 'celular', 'avatar_principal', 'contrasena', 'pais', 'puntos', 'configuracion', 'contactos', 'sincronizado', 'foto_publica', 'vehiculo', 'disponible'];
                    var query = "INSERT INTO usuario(" + baseData.join() + ") VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                    var dataQuery = [];

                    baseData.forEach(function(element, index, array) {
                        dataQuery[index] = String(data[element]) || '';
                    });

                    Database.ejecutarSQL(query, dataQuery);
                };

                Modelo.actualizar = function(data) {
                    return new Promise(function(fulfill, reject) {
                        var baseData = ['_id', 'apellidos', 'correo', 'celular', 'avatar_principal', 'contrasena', 'pais', 'puntos', 'configuracion', 'contactos', 'sincronizado', 'foto_publica', 'vehiculo', 'disponible'];
                        var dataQuery = [];

                        baseData.forEach(function(element, index, array) {
                            if (data[element]) {
                                if (typeof data[element] === 'object') {
                                    dataQuery.push(element + ' =\'' + JSON.stringify(data[element]) + '\'');
                                } else {
                                    dataQuery.push(element + ' =\'' + data[element] + '\'');
                                }
                            };
                        });
                        var query = 'UPDATE usuario SET ' + dataQuery.join() + ' WHERE _id ="' + data._id + '";';
                        Database.ejecutarSQL(query, []).then(
                            function(resultado) {
                                fulfill(data);
                            },
                            function(error) {
                                reject(error);
                            }
                        );
                    });
                }

                return Modelo;
            }
        ];
    }
]);