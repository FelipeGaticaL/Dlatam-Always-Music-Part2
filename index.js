
//Crear base de datos en PgAdmin alwaymusic
//Crear tabla en PgAdmin

/* CREATE TABLE estudiantes (
    rut VARCHAR(12) PRIMARY KEY,
    nombre VARCHAR(50),
    curso VARCHAR(50),
    nivel INT
)
 */


const { Pool } = require("pg");

const config = {
    user: 'postgres',
    host: 'localhost',
    database: 'alwaymusic',
    password: '1234',
    port: 5432,
};

const pool = new Pool(config);

/* Sección argumentos por consola */
//console.log(process.argv);
const argumentos = process.argv.slice(2);
const funcion = argumentos[0];
const rut = argumentos[1];
const nombre = argumentos[2];
const curso = argumentos[3];
const nivel = argumentos[4];

/* Agregar query json-string */
const postEstudiantes = async ({ rut, nombre, curso, nivel }) => {
    try {
        const SQLQuery = {

            rowMode: 'array',
            text: `INSERT INTO estudiantes (rut, nombre, curso, nivel) values ($1, $2, $3,$4) RETURNING *;`,
            values: [rut, nombre, curso, nivel]
        }

        const res = await pool.query(SQLQuery);
        console.log("Ultimo registro agregado: ", res.rows[0]);
        console.log(`Estudiante agregado con éxito`);
        console.log("Registros afectados", res.rowCount)

    } catch (error) {
        const { code } = error;
        console.log(error)
        console.log(code)

    }

};

//postEstudiantes({rut: '11.111.111-2', nombre: 'Pedro', curso: 'Lenguaje', nivel: 5})

/* Consultar query json-string*/
/* 4. Obtener el registro de los estudiantes registrados en formato de arreglos. */
const getEstudiantes = async () => {
    try {
        const res = await pool.query({
            rowMode: 'array',
            text: "SELECT * FROM estudiantes",
        });

        console.log(`Lista estudiantes formato array`, res.rows);

    } catch(error) {
        const { code } = error;
        console.log(error)
        console.log(code)
    }

};

//getEstudiantes();

/* Actualizar query json-string*/

const editarEstudiantes = async ({ rut, nombre, curso, nivel }) => {
    try {
        const SQLQuery = {
            rowMode: 'array',
            text: `UPDATE estudiantes SET rut=$1, nombre=$2, curso=$3, nivel=$4 WHERE rut=$1 RETURNING *;`,
            values: [rut, nombre, curso, nivel]
        };
        const res = await pool.query(SQLQuery);
        const { rowCount } = res;
        if (!rowCount) throw 'No existe ningún registro con este Rut';

        console.log(`Estudiante editado con exito`);
    } catch (error) {
        console.log(`Ocurrio un error al editar el estudiante`);
        console.log('Error:', error);
    }
}

//editarEstudiantes({ rut: '11.111.111-2', nombre: 'Jaime', curso: 'Filosofía',nivel: 1});



/* Eliminar query json-string*/

const eliminarEstudiante = async ({ rut }) => {
    try {
      
        const SQLQuery = {
            rowMode: 'array',
            text: `DELETE FROM estudiantes WHERE rut=$1`,
            values: [rut]
        };
        const result = await pool.query(SQLQuery);

        console.log(result);
        const { rowCount } = result;
        if (rowCount === 0) throw 'No existe ningún registro con este rut';

        console.log(`Estudiante eliminado con éxito`);
    } catch (error) {
        console.log(`Ocurrio el siguiente error al eliminar el estudiante: `, error);
    }
    finally {
        console.log("Finally");
        
    }
}

//eliminarEstudiante({ rut: '11.111.111-1' });

/* Creando función con 4 métodos, para poder ejecutarlo como promesa */

const funciones = {
    get: getEstudiantes,
    post: postEstudiantes,
    actualizar: editarEstudiantes,
    delete: eliminarEstudiante
};

 (async ()=>{
    try{
        await funciones[funcion]({rut,nombre,curso,nivel})
    }catch{
        const { code } = error;
        console.log(error)
        console.log(code)
    }finally{
        console.log('Finalizado')
        pool.end();
    }
    
})();
 

//Consulta a través de consola: node index get
//agregando nuevos valores a través de consola: node index post "22.222.222-3" "alberto" "inglés" 6
//editando  valores a través de consola: node index actualizar "22.222.222-3" "rafael" "inglés" 6
//eliminando  valores a través de consola: node index delete "22.222.222-3"
