# 2020-06-24 (V 2.1.1)
    Se cambia el plano cartesiano para que se muestren varios riesgos a la vez
    Se le agregan los permisos para ver, crear y modificar

# 2020-06-22 (V 2.1.0)
    Se cambian graficas por un plano cartesiano
    Se le da funcionalidad al plano cartesiano
    Se adaptan todos los guardianes a la nueva sección
    Se eliminan archivos innecesarios
# 2020-06-15 (V 2.0.0)
    Se baja la versión de angular
    Se instala FullCalendar 
    Se hacen ajustes para la versión inferior de angular
    Se crea el calendario
    Se crea dialog para insertar citas    
# 2020-06-15 (V 1.8.0)
    Se crea componente de calendario y se corrigen otras cosas
# 2020-05-28 (V 1.7.3)
    Se realiza cambio en area riesgos porque se programod de manera erronea
    Se eliminan las imagenes que ya no se utilizan en el proyecto
    Se agrega la imagen enviada por Roberto
    Se cambian los logos por el de enviado
    Se agrega el import para poder actualizar la página (se agregar un /#/)
    Se agrega para que el navegador de chrome cambie de color
    Se oculta una sección a petición de Roberto
# 2020-05-28 (V 1.7.2)
    Se realiza cambio en riesgos puntos de interés porque se programó de manera erronea 
# 2020-05-25 (V 1.7.1)
    Se corrige lo que faltaba de la validación de los permisos
# 2020-05-25 (V 1.7.0)
    Se valida la sesión duplicada
    Cada 4 minutos se renueva la sesión activa
# 2020-05-25 (V 1.6.1)
    Se modifica cliente, riesgos y areas Con agregar, importar, ver, modificar, deshabilitar y eliminar
    Queda pendiente validar sesión duplicada y estár actualizando la sesión cada 5 minutos
# 2020-05-24 (V 1.6.0)
    Se crea Encuesta riesgos y áreas
    Con agregar, importar, ver, modificar, deshabilitar y eliminar
    Se crea solo el componente cliente, riesgos y areas
# 2020-05-24 (V 1.5.0)
    Se crea Encuesta riesgos y puntos de interés
    Con agregar, importar, ver, modificar, deshabilitar y eliminar
# 2020-05-24 (V 1.4.2)
    Se corrige el nombre del excel de "PANTILLA" a "PLANTILLA"
# 2020-05-24 (V 1.4.1)
    Se agrega el IdUsuario a cada API para validar permiso
    Se crea y se agrega el guardian de encuesta riesgos y puntos de interés
# 2020-05-21 (V 1.4.0)
    Se agrega validación de los permisos a las actividades que puede realizar por sección
    Se crea servicio para validar por actividad y por sección
# 2020-05-21 (V 1.3.2)
    Se corrigen los guardianes agregando que cada guardian pueda armar el menu y evitar una posible falla después    
# 2020-05-21 (V 1.3.1)
    Se corrigen los guardianes 
# 2020-05-20 (V 1.3.0)
    Se crean guardianes para validar que se tenga acceso a cada sección
    Se muestra el menú dependiendo de los permisos que se tengan
    Se agregan los guardianes al app-routing
    Se modifican las secciones para que solo se muestre la información si se tiene permiso (por si llegaran a fallar los guardianes)
    Se crean nuevos observables para poder armar las secciones dinamicamente
    Se modifica el login para tomar más información del usuario (permisos)
# 2020-05-19 (V 1.2.7)
    Se agregan iconos al sidenav
    Se agrega la columna de identificador a la tabla en riesgos
    Se agrega el scrow a las tablas que faltan
    Se cambiar el enviroment de desarrollo
    Se cambian los importadores para quitar las imagenes de ejemplo
# 2020-05-02 (V 1.2.6)
    Se le agrega el scroll a las tablas para que sean responsivas 100%    
    Se le agregar el MIME type="text/javascript" para importar los archivos js
    Se agrega la validación el recaptcha en productivo
    Se agrega la funcionalidad de cerrar el sidenav a la hora de entrar a una sección
# 2020-04-30 (V 1.2.5)
    Se cambia el logo
    Se crea el archivo app.yaml (para subirlo app engine)
    Se modifica angular.json (segun documentacion para subir el proyecto)
    Se realiza modificaciones en los catálogos para que se puedan descargar las plantillas    
# 2020-04-27 (V 1.2.4)
    Corrección de la imagen de fondo en el login y el logo del sistema
# 2020-04-23 (V 1.2.3)
    Se realizan correcciones generales a las secciones anteriores
    Se realiza el CRUD completo del catálogo de criterios
# 2020-04-22 (V 1.2.2)
    Se realiza el CRUD completo del catálogo de dimensiones
    Se realiza el CRUD completo del catálogo tipo de riesgo 
    Se agregan las rutas de todos los catálogos   
    Se agregan los colores de los snackbars    
    Se adapta el login al nuevo backend
# 2020-04-21 (V 1.2.1)
    Se agrega el botón para poder descargar un excel desde un array 
    Se agrega validación con snackbar a la hora de eliminar un registro
# 2020-04-20 (V 1.2.0)
    Se modifica el dialog de Catálogo de riesgo
    Se toma mejor ejemplo
    Se agrega importador de excel
# 2020-04-15 (V 1.1.0)
    Se agrega el recaptcha de ejemplo para la presentación, es necesario pagarlo para que sea el funcional ya en productivo
    Se ajusta el sidebar con Expansion panel y la imagen al inicio
    Se crea componente de CatalogoRiesgo y se acomoda la ruta
# 2020-04-13 (V 1.O.0)
    Comienzo de proyecto