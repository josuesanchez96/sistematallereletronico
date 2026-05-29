const { Client } = require('pg');
require('dotenv').config();

async function main() {
  // Obtenemos la URL de la base de datos del archivo .env
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('Error: La variable de entorno DATABASE_URL no está configurada.');
    process.exit(1);
  }

  // Modificamos la URL temporalmente para conectarnos a la base de datos por defecto 'postgres'
  let postgresDbUrl = dbUrl;
  if (dbUrl.includes('/talleres_electronicos')) {
    postgresDbUrl = dbUrl.replace('/talleres_electronicos', '/postgres');
  } else {
    console.log('Asegúrate de que estás apuntando a la base de datos "postgres" para crear "talleres_electronicos".');
  }

  console.log('Conectando a AWS RDS (base de datos postgres) para crear "talleres_electronicos"...');

  const client = new Client({
    connectionString: postgresDbUrl,
  });

  try {
    await client.connect();
    // Ejecutamos la consulta SQL para crear la base de datos
    await client.query('CREATE DATABASE talleres_electronicos;');
    console.log('🎉 ¡Base de datos "talleres_electronicos" creada exitosamente en AWS RDS!');
  } catch (error) {
    // Si ya existe (código de error 42P04), no lo consideramos un fallo
    if (error.code === '42P04') {
      console.log('ℹ️ La base de datos "talleres_electronicos" ya existe en este servidor.');
    } else {
      console.error('❌ Error al crear la base de datos:', error.message);
      process.exit(1);
    }
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('Error inesperado:', err);
  process.exit(1);
});
