1. Parámetros de Apariencia Visual:

tema: Define el tema visual de la factura.

PurpuraGrad: Aplica un tema con tonos púrpuras y degradados.

Ejemplo: ?tema=PurpuraGrad

AzulAbstractPro: Aplica un tema con tonos azules y un diseño abstracto.

Ejemplo: ?tema=AzulAbstractPro

Ausencia o valor inválido: Si no se especifica o el valor no es reconocido, se usará el tema predeterminado (gris claro).

Ejemplo: ?tema=OtroTema (resulta en el tema predeterminado)

Logo1: URL de la imagen del logo principal de la empresa (izquierda del encabezado).

Ejemplo: ?Logo1=https://ejemplo.com/logo-principal.png

Logo2: URL de la imagen del logo secundario (derecha del encabezado). Se usa para marcas o certificaciones adicionales.

Ejemplo: ?Logo2=https://ejemplo.com/logo-certificado.png

2. Parámetros de Información General:

Factura: Número de factura.

Ejemplo: ?Factura=001-2024

Fecha: Fecha de emisión de la factura.

Ejemplo: ?Fecha=2024-07-26

Hora: Hora de emisión de la factura.

Ejemplo: ?Hora=14:30

De: Información del emisor (empresa que factura). Permite múltiples líneas (usa %0A para saltos de línea en la URL).

Ejemplo: ?De=Mi%20Empresa%0ACalle%20Falsa%20123%0ACiudad,Pais (Esto mostrará 3 líneas)

Para: Información del receptor (cliente). También permite múltiples líneas.

Ejemplo: ?Para=Cliente%20Ejemplo%0ACalle%20del%20Cliente%20456%0ACiudad,Pais (Esto mostrará ¡3 líneas)



3 - Parámetros de Tabla

Esta sección describe cómo configurar la tabla de items en la factura dinámica a través de parámetros en la URL.

columna: Define el nombre de una columna en la tabla. Se repite para cada columna. El orden de los parámetros columna define el orden de las columnas en la tabla.

Ejemplo: ?columna=Producto&columna=Cantidad&columna=Precio&columna=Total

[Nombre de Columna]: Parámetro con el nombre de cada columna (definido con columna). Contiene los datos separados por comas para cada fila de la columna.

Ejemplo: ?Producto=Laptop,Mouse&Cantidad=1,2&Precio=1200,25&Total=1200,50

Ejemplo Completo de Tabla:

?columna=Producto&columna=Cantidad&columna=Precio&columna=Total&Producto=Laptop,Mouse&Cantidad=1,2&Precio=1200,25&Total=1200,50
Use code with caution.
En este ejemplo, la tabla tendrá 2 filas:

Fila 1: Producto=Laptop, Cantidad=1, Precio=1200, Total=1200

Fila 2: Producto=Mouse, Cantidad=2, Precio=25, Total=50

Notas:

Cada columna requiere su propio parámetro con datos separados por comas.

Asegúrate de que todas las columnas tengan la misma cantidad de elementos.

El orden de los parámetros columna es fundamental para la estructura de la tabla.
