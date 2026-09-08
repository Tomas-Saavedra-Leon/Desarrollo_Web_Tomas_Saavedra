# Tarea 1: Registro de Avistamientos

## 1. Decisiones de Diseño e Interfaz
Para priorizar la fluidez del usuario, se tomaron las siguientes decisiones respecto a los formularios:
*   **Campos de texto libre:** Se decidió que campos como el **tipo de ave** y la **comuna** sean campos de texto abierto (inputs) en lugar de listas desplegables. Hacer un listado exhaustivo de todas las comunas de Chile sobrecargaría el HTML, por lo que fue mejor dejar al usuario escribirlas, asumiendo y permitiendo el margen de error humano en la escritura.
*   Esta misma lógica de texto libre se aplicó para ingresar el **nombre del ave** y el **lugar específico del avistamiento**, dando mayor libertad de registro.

## 2. Panel de Listado
El diseño del panel de listado de avistamientos se redujo a una interfaz simple y directa. Cuenta únicamente con un buscador para filtrar por el nombre/tipo de ave y un control de ordenamiento que permite organizar los registros visualmente por fecha.

## 3. Métricas y Gráficos (Uso de Arrays)
Dado que las restricciones de la tarea no permiten el uso de un backend o una base de datos real, se tomó la decisión técnica de utilizar **arreglos (arrays) en memoria** mediante JavaScript. 

**Razón de su uso y ejecución:**
Esto es estrictamente necesario para que los gráficos funcionen, ya que los arrays nos permiten recorrer toda la información almacenada, contar las incidencias (por ejemplo, cuántas aves de un mismo tipo hay o cuántos voluntarios pertenecen a cierta región), calcular sus porcentajes matemáticos y, finalmente, construir y dibujar las barras de los gráficos de forma dinámica alterando el HTML y CSS en tiempo real.