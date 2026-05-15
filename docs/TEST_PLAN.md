# Plan de Pruebas - TennoStore

Este documento detalla los casos de prueba ejecutados para verificar la estabilidad, seguridad e integración del sistema TennoStore.

## 1. Pruebas de Seguridad y Acceso
| ID | Caso de Prueba | Resultado Esperado | Estado |
|----|----------------|-------------------|--------|
| S01 | Acceso a /admin sin token | Redirección o bloqueo de acceso | ✅ OK |
| S02 | Intento de borrado de usuario ajeno | El backend debe devolver Error 401/403 | ✅ OK |
| S03 | Registro con email duplicado | El sistema debe impedir el registro y avisar | ✅ OK |

## 2. Pruebas de Integridad de Datos (Stock)
| ID | Caso de Prueba | Resultado Esperado | Estado |
|----|----------------|-------------------|--------|
| I01 | Reserva de stock (añadir al carro) | El stock en la DB debe bajar -1 inmediatamente | ✅ OK |
| I02 | Expiración de tiempo (10 min) | El stock debe devolverse +1 automáticamente | ✅ OK |
| I03 | Refresco de página con carro | El carro persiste (localStorage) y el stock sigue reservado | ✅ OK |
| I04 | Doble reserva (2 pestañas) | El sistema debe aislar los carritos por usuario ID | ✅ OK |

## 3. Pruebas de Funcionalidad
| ID | Caso de Prueba | Resultado Esperado | Estado |
|----|----------------|-------------------|--------|
| F01 | Búsqueda por relevancia (MA) | Mario Kart (empieza por MA) sale antes que Spider-Man | ✅ OK |
| F02 | Generación de Informe PDF | El PDF contiene el desglose de juegos comprados | ✅ OK |
| F03 | Historial de Precios | El gráfico muestra la evolución real de la base de datos | ✅ OK |

## 4. Pruebas de Recuperación (Backup)
| ID | Caso de Prueba | Resultado Esperado | Estado |
|----|----------------|-------------------|--------|
| R01 | Ejecución de backup_db.bat | Se genera un archivo .sql con la estructura y datos | ✅ OK |
| R02 | Restauración en DB vacía | La tienda vuelve a mostrar los juegos y usuarios | ✅ OK |

---
**Fecha de última prueba:** 13/05/2026
**Responsable:** Cristian (Desarrollador Principal)
