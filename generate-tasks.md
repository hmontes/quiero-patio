# Regla: Generar una Lista de Tareas desde un PRD

## Objetivo

Guiar a un asistente de IA para crear una lista de tareas detallada y paso a paso en formato Markdown, basada en un Documento de Requerimientos de Producto (PRD) existente. La lista de tareas debe guiar a un desarrollador durante la implementación.

## Salida

- **Formato:** Markdown (`.md`)
- **Ubicación:** `/tasks/`
- **Nombre del archivo:** `tasks-[nombre-del-archivo-prd].md` (por ejemplo: `tasks-prd-user-profile-editing.md`)

## Proceso

1. **Recibir referencia del PRD:** El usuario indica al asistente de IA un archivo PRD específico.
2. **Analizar el PRD:** La IA lee y analiza los requisitos funcionales, historias de usuario y otras secciones del PRD especificado.
3. **Evaluar el estado actual:** Revisar la base de código existente para entender la infraestructura, patrones arquitectónicos y convenciones actuales. También identificar cualquier componente o funcionalidad que ya exista y que pueda ser relevante para los requisitos del PRD. Luego, identificar archivos, componentes y utilidades relacionadas que se puedan aprovechar o que necesiten modificación.
4. **Fase 1: Generar tareas principales:** Basándose en el análisis del PRD y la evaluación del estado actual, crear el archivo y generar las tareas principales de alto nivel necesarias para implementar la funcionalidad. Usar el criterio propio para determinar cuántas tareas de alto nivel utilizar (probablemente alrededor de 5). Presentar estas tareas al usuario en el formato especificado (sin sub-tareas aún). Informar al usuario: "He generado las tareas principales basadas en el PRD. ¿Listo para generar las sub-tareas? Responde con 'Go' para continuar."
5. **Esperar confirmación:** Pausar y esperar a que el usuario responda con "Go".
6. **Fase 2: Generar sub-tareas:** Una vez que el usuario confirme, desglosar cada tarea principal en sub-tareas más pequeñas y accionables, necesarias para completar la tarea principal. Asegurarse de que las sub-tareas sigan una secuencia lógica a partir de la tarea principal, cubran los detalles de implementación implícitos en el PRD y consideren los patrones existentes de la base de código, sin estar completamente limitados por ellos.
7. **Identificar archivos relevantes:** Con base en las tareas y el PRD, identificar los archivos que podrían necesitar ser creados o modificados. Listarlos en la sección `Relevant Files`, incluyendo los archivos de prueba correspondientes si aplica.
8. **Generar la salida final:** Combinar las tareas principales, sub-tareas, archivos relevantes y notas en la estructura final de Markdown.
9. **Guardar la lista de tareas:** Guardar el documento generado en el directorio `/tasks/` con el nombre `tasks-[nombre-del-archivo-prd].md`, donde `[nombre-del-archivo-prd]` corresponde al nombre base del PRD de entrada (por ejemplo, si el archivo de entrada es `prd-user-profile-editing.md`, la salida será `tasks-prd-user-profile-editing.md`).

## Formato de salida

La lista de tareas generada **debe** seguir esta estructura:

```markdown
## Archivos relevantes

- `path/to/potential/file1.ts` - Breve descripción de por qué este archivo es relevante (por ejemplo: Contiene el componente principal para esta funcionalidad).
- `path/to/another/file.tsx` - Breve descripción (por ejemplo: Manejador de ruta API para el envío de datos).
- `lib/utils/helpers.ts` - Breve descripción (por ejemplo: Funciones utilitarias necesarias para cálculos).

## Tareas

- [ ] 1.0 Título de la tarea principal
  - [ ] 1.1 [Descripción de sub-tarea 1.1]
  - [ ] 1.2 [Descripción de sub-tarea 1.2]
- [ ] 2.0 Título de la tarea principal
  - [ ] 2.1 [Descripción de sub-tarea 2.1]
- [ ] 3.0 Título de la tarea principal (puede no requerir sub-tareas si es puramente estructural o de configuración)
```

## Modelo de interacción

El proceso requiere explícitamente una pausa después de generar las tareas principales para obtener la confirmación del usuario ("Go") antes de proceder a generar las sub-tareas detalladas. Esto asegura que el plan de alto nivel esté alineado con las expectativas del usuario antes de entrar en los detalles.

## Audiencia objetivo

Se debe asumir que el lector principal de la lista de tareas es un **desarrollador junior** que implementará la funcionalidad teniendo en cuenta el contexto de la base de código existente.
