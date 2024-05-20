import { MemoryDB, addKeyword, createBot, createFlow, createProvider } from '@bot-whatsapp/bot';
import { BaileysProvider } from '@bot-whatsapp/provider-baileys';




// Función para determinar si es de día o de tarde
function getSaludo() {
    const horaActual = new Date().getHours();
    if (horaActual >= 6 && horaActual < 12) {
        return 'Buenos días';
    } else if (horaActual >= 12 && horaActual < 18) {
        return 'Buenas tardes';
    } else {
        return 'Buenas noches';
    }
}

// Flujo de saludo inicial
const flowSaludoInicial = addKeyword('SaludoInicial')
    .addAnswer(`${getSaludo()}, bienvenido al menú principal. Por favor elige una opción:\n1. Información\n2. Servicios\n3. Contacto\nEscribe el número de la opción deseada.`);

// Flujo del menú principal
const flowMenu = addKeyword('Menu')
    .addAnswer('Bienvenido al menú principal. Por favor elige una opción:\n1. Información\n2. Servicios\n3. Contacto\nEscribe el número de la opción deseada.');

// Flujos para cada opción del menú
const flowInformacion = addKeyword(['1', 'Información'])
    .addAnswer('Puedo proporcionarte información sobre nuestros servicios. ¿Qué te gustaría saber?');

const flowServicios = addKeyword(['2', 'Servicios'])
    .addAnswer('Ofrecemos una variedad de servicios, incluyendo:\n1. Asesoría\n2. Soporte técnico\n3. Desarrollo personalizado\n¿Cuál te interesa?');

const flowContacto = addKeyword(['3', 'Contacto'])
    .addAnswer('Puedes contactarnos por correo en soporte@ejemplo.com o llamarnos al 123-456-7890.');

// Flujos adicionales
const flowBienvenida = addKeyword('Hola')
    .addAnswer('¡Hola! ¿Cómo estás? ¿En qué puedo ayudarte hoy?\nSi necesitas ver el menú principal, escribe "Menu".');

const flowAyuda = addKeyword('Ayuda')
    .addAnswer('Claro, estoy aquí para ayudarte. ¿Qué necesitas saber?\nPara ver el menú principal, escribe "Menu".');

const flowAdios = addKeyword('Adios')
    .addAnswer('Hasta luego, que tengas un buen día.\nPara ver el menú principal en cualquier momento, escribe "Menu".');

// Flujo de fallback para capturar cualquier otro mensaje y mostrar el menú
const flowFallback = addKeyword('')
.addAnswer(`${getSaludo()}, bienvenido al menú principal. Por favor elige una opción:\n1. Información\n2. Servicios\n3. Contacto\nEscribe el número de la opción deseada.`);

// Flujo para cuando el usuario no responde después de ver el menú
const flowNoRespuesta = addKeyword('NoRespuesta')
    .addAnswer('Lo siento, no has elegido ninguna de las opciones. Por favor, inténtalo de nuevo.');

// Combinar los flujos en un flujo principal
const mainFlow = createFlow([
    flowSaludoInicial,
    flowBienvenida,
    flowAyuda,
    flowAdios,
    flowMenu,
    flowInformacion,
    flowServicios,
    flowContacto,
    flowNoRespuesta, // Nuevo flujo para capturar cuando no hay respuesta después del menú
    flowFallback  // El flujo de fallback debe ir al final para capturar cualquier otro mensaje
]);

// Función principal para inicializar el bot
const main = async () => {
    const provider = createProvider(BaileysProvider);
    provider.initHttpServer(3002);

    await createBot({
        flow: mainFlow,
        database: new MemoryDB(),
        provider
    });
};

// Ejecutar la función principal
main();
