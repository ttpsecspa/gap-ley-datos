-- =============================================
-- SEED: 57 Preguntas GAP - Ley 21.719
-- Checklist de Cumplimiento Proteccion de Datos
-- =============================================

-- Categoria 1: Principios de Tratamiento (Art. 3-4)
INSERT INTO gap_categories (id, name, description, law_reference, weight, "order") VALUES
('c1000000-0000-0000-0000-000000000001', 'Principios de Tratamiento de Datos', 'Evaluacion del cumplimiento de los principios fundamentales que rigen el tratamiento de datos personales', 'Art. 3, Art. 4', 1.0, 1);

INSERT INTO gap_questions (id, category_id, question_text, help_text, law_article, question_type, weight, is_mandatory, "order") VALUES
('q1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Se cuenta con una base de licitud definida para cada tratamiento de datos personales?', 'Todo tratamiento debe contar con una base legal que lo legitime: consentimiento, ley, contrato, interes legitimo, interes vital o mision publica.', 'Art. 3 letra a)', 'SI_NO', 1.5, true, 1),
('q1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'Los datos personales son tratados exclusivamente para las finalidades informadas al titular?', 'El principio de finalidad exige que los datos solo se utilicen para los fines especificos, explicitos y legitimos para los cuales fueron recolectados.', 'Art. 3 letra b)', 'SI_NO', 1.5, true, 2),
('q1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 'Se recolectan unicamente los datos personales estrictamente necesarios para la finalidad declarada?', 'Principio de proporcionalidad y minimizacion: no se deben recolectar mas datos de los necesarios.', 'Art. 3 letra c)', 'SI_NO', 1.0, true, 3),
('q1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000001', 'Existen mecanismos para mantener los datos personales exactos y actualizados?', 'Principio de calidad: los datos deben ser exactos, completos y actuales en relacion con la finalidad del tratamiento.', 'Art. 3 letra d)', 'SI_NO', 1.0, true, 4),
('q1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000001', 'Se ha definido un plazo de conservacion de los datos personales acorde a la finalidad?', 'Los datos deben conservarse solo por el tiempo necesario para cumplir la finalidad del tratamiento.', 'Art. 3 letra e)', 'SI_NO', 1.0, true, 5),
('q1000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000001', 'El responsable puede demostrar el cumplimiento de los principios de tratamiento (responsabilidad proactiva)?', 'Principio de responsabilidad: el responsable debe ser capaz de acreditar el cumplimiento de la ley.', 'Art. 3 letra f)', 'SI_NO', 1.5, true, 6),
('q1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000001', 'Se garantiza la transparencia en el tratamiento de datos personales informando claramente al titular?', 'El titular tiene derecho a conocer la existencia del tratamiento, su finalidad y la identidad del responsable.', 'Art. 3 letra g)', 'SI_NO', 1.0, true, 7);

-- Categoria 2: Derechos de los Titulares (Art. 5-11)
INSERT INTO gap_categories (id, name, description, law_reference, weight, "order") VALUES
('c1000000-0000-0000-0000-000000000002', 'Derechos de los Titulares', 'Evaluacion del respeto y facilitacion de los derechos ARCO-POB de los titulares de datos', 'Art. 5 al Art. 11', 1.5, 2);

INSERT INTO gap_questions (id, category_id, question_text, help_text, law_article, question_type, weight, is_mandatory, "order") VALUES
('q1000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000002', 'Existe un procedimiento formal para atender solicitudes de derecho de acceso de los titulares?', 'El titular tiene derecho a solicitar y obtener confirmacion de si sus datos estan siendo tratados y acceder a ellos.', 'Art. 5', 'SI_NO', 1.5, true, 1),
('q1000000-0000-0000-0000-000000000009', 'c1000000-0000-0000-0000-000000000002', 'Se cuenta con un mecanismo para rectificar datos personales inexactos o incompletos?', 'El titular tiene derecho a que se modifiquen sus datos cuando sean inexactos, desactualizados o incompletos.', 'Art. 6', 'SI_NO', 1.0, true, 2),
('q1000000-0000-0000-0000-000000000010', 'c1000000-0000-0000-0000-000000000002', 'Se permite la supresion de datos personales cuando corresponda legalmente?', 'El titular puede solicitar la eliminacion de sus datos cuando ya no sean necesarios o retire el consentimiento.', 'Art. 7', 'SI_NO', 1.5, true, 3),
('q1000000-0000-0000-0000-000000000011', 'c1000000-0000-0000-0000-000000000002', 'Se respeta el derecho de oposicion al tratamiento de datos personales?', 'El titular puede oponerse al tratamiento de sus datos en ciertos supuestos previstos por la ley.', 'Art. 8', 'SI_NO', 1.0, true, 4),
('q1000000-0000-0000-0000-000000000012', 'c1000000-0000-0000-0000-000000000002', 'Se facilita la portabilidad de datos personales en formato estructurado?', 'El titular tiene derecho a recibir sus datos en un formato comun y de lectura mecanizada, y a transmitirlos.', 'Art. 9', 'SI_NO', 1.0, true, 5),
('q1000000-0000-0000-0000-000000000013', 'c1000000-0000-0000-0000-000000000002', 'Existe un mecanismo de bloqueo temporal de datos personales?', 'El titular puede solicitar la suspension temporal del tratamiento de sus datos.', 'Art. 10', 'SI_NO', 1.0, true, 6),
('q1000000-0000-0000-0000-000000000014', 'c1000000-0000-0000-0000-000000000002', 'Se responde a las solicitudes de derechos dentro del plazo legal de 30 dias habiles?', 'La ley establece un plazo maximo para responder. El incumplimiento puede generar sanciones.', 'Art. 11', 'SI_NO', 1.5, true, 7),
('q1000000-0000-0000-0000-000000000015', 'c1000000-0000-0000-0000-000000000002', 'Se informa al titular sobre los canales y procedimientos para ejercer sus derechos?', 'El responsable debe facilitar el ejercicio de derechos poniendo a disposicion canales claros y accesibles.', 'Art. 11', 'SI_NO', 1.0, true, 8);

-- Categoria 3: Consentimiento (Art. 12-13)
INSERT INTO gap_categories (id, name, description, law_reference, weight, "order") VALUES
('c1000000-0000-0000-0000-000000000003', 'Consentimiento', 'Evaluacion de la obtencion, gestion y revocacion del consentimiento para tratamiento de datos', 'Art. 12, Art. 13', 1.5, 3);

INSERT INTO gap_questions (id, category_id, question_text, help_text, law_article, question_type, weight, is_mandatory, "order") VALUES
('q1000000-0000-0000-0000-000000000016', 'c1000000-0000-0000-0000-000000000003', 'El consentimiento es obtenido de forma libre, informada, previa, especifica e inequivoca?', 'El consentimiento debe cumplir todos estos requisitos para ser valido. No se aceptan consentimientos genericos.', 'Art. 12', 'SI_NO', 2.0, true, 1),
('q1000000-0000-0000-0000-000000000017', 'c1000000-0000-0000-0000-000000000003', 'Se puede acreditar documentalmente la obtencion del consentimiento?', 'El responsable debe poder demostrar que obtuvo el consentimiento valido del titular.', 'Art. 12', 'SI_NO', 1.5, true, 2),
('q1000000-0000-0000-0000-000000000018', 'c1000000-0000-0000-0000-000000000003', 'Existe un mecanismo sencillo para que el titular revoque su consentimiento?', 'La revocacion debe ser tan facil como la otorgacion del consentimiento.', 'Art. 12', 'SI_NO', 1.5, true, 3),
('q1000000-0000-0000-0000-000000000019', 'c1000000-0000-0000-0000-000000000003', 'Se informa al titular sobre la finalidad, los datos tratados y los destinatarios antes de obtener el consentimiento?', 'La informacion debe ser clara, comprensible y estar disponible antes de que el titular otorgue su consentimiento.', 'Art. 12', 'SI_NO', 1.0, true, 4),
('q1000000-0000-0000-0000-000000000020', 'c1000000-0000-0000-0000-000000000003', 'Para datos sensibles, se obtiene consentimiento explicito y especifico?', 'El tratamiento de datos sensibles requiere un nivel reforzado de consentimiento.', 'Art. 12, Art. 16', 'SI_NO', 2.0, true, 5),
('q1000000-0000-0000-0000-000000000021', 'c1000000-0000-0000-0000-000000000003', 'Se distinguen y documentan los tratamientos basados en consentimiento de los basados en otras bases legales?', 'Es fundamental identificar la base legal de cada tratamiento, especialmente cuando no es el consentimiento.', 'Art. 13', 'SI_NO', 1.0, true, 6);

-- Categoria 4: Obligaciones del Responsable (Art. 14 - 14 quater)
INSERT INTO gap_categories (id, name, description, law_reference, weight, "order") VALUES
('c1000000-0000-0000-0000-000000000004', 'Obligaciones del Responsable de Datos', 'Evaluacion del cumplimiento de las obligaciones especificas del responsable del tratamiento', 'Art. 14 al Art. 14 quater', 1.0, 4);

INSERT INTO gap_questions (id, category_id, question_text, help_text, law_article, question_type, weight, is_mandatory, "order") VALUES
('q1000000-0000-0000-0000-000000000022', 'c1000000-0000-0000-0000-000000000004', 'Se mantiene un registro actualizado de las actividades de tratamiento de datos personales?', 'El responsable debe llevar un registro de los tratamientos que realiza con su descripcion, finalidad, categorias de datos y destinatarios.', 'Art. 14', 'SI_NO', 1.5, true, 1),
('q1000000-0000-0000-0000-000000000023', 'c1000000-0000-0000-0000-000000000004', 'Se han implementado medidas de seguridad tecnicas y organizativas adecuadas?', 'Las medidas deben ser apropiadas al riesgo, incluyendo cifrado, seudonimizacion, control de acceso, etc.', 'Art. 14 bis', 'SI_NO', 1.5, true, 2),
('q1000000-0000-0000-0000-000000000025', 'c1000000-0000-0000-0000-000000000004', 'Existen contratos formales con los encargados del tratamiento (procesadores)?', 'Los contratos deben establecer las instrucciones, medidas de seguridad y obligaciones del encargado.', 'Art. 14', 'SI_NO', 1.0, true, 3),
('q1000000-0000-0000-0000-000000000026', 'c1000000-0000-0000-0000-000000000004', 'Se realizan evaluaciones de impacto en la proteccion de datos (EIPD) cuando es requerido?', 'Las EIPD son obligatorias para tratamientos de alto riesgo o que involucren datos sensibles a gran escala.', 'Art. 14 ter', 'SI_NO', 1.5, true, 4),
('q1000000-0000-0000-0000-000000000027', 'c1000000-0000-0000-0000-000000000004', 'Se ha implementado un modelo de prevencion de infracciones?', 'El modelo debe incluir politicas, procedimientos, capacitacion y mecanismos de supervision internos.', 'Art. 14 quater', 'SI_NO', 1.0, true, 5),
('q1000000-0000-0000-0000-000000000028', 'c1000000-0000-0000-0000-000000000004', 'Se aplica el principio de proteccion de datos desde el diseno y por defecto?', 'Desde la concepcion de sistemas y procesos deben incorporarse medidas de proteccion de datos.', 'Art. 14 bis', 'SI_NO', 1.0, true, 6),
('q1000000-0000-0000-0000-000000000029', 'c1000000-0000-0000-0000-000000000004', 'Se notifica a los titulares sobre cambios sustanciales en las politicas de tratamiento?', 'Los cambios relevantes en finalidad, destinatarios o condiciones deben ser informados.', 'Art. 14', 'SI_NO', 1.0, true, 7);

-- Categoria 5: Transferencia Internacional (Art. 27-28)
INSERT INTO gap_categories (id, name, description, law_reference, weight, "order") VALUES
('c1000000-0000-0000-0000-000000000005', 'Transferencia Internacional de Datos', 'Evaluacion del cumplimiento de requisitos para transferencias internacionales de datos personales', 'Art. 27, Art. 28', 1.0, 5);

INSERT INTO gap_questions (id, category_id, question_text, help_text, law_article, question_type, weight, is_mandatory, "order") VALUES
('q1000000-0000-0000-0000-000000000030', 'c1000000-0000-0000-0000-000000000005', 'Se han identificado todas las transferencias internacionales de datos personales?', 'Es necesario mapear los flujos de datos que salen del pais, incluyendo servicios cloud y proveedores extranjeros.', 'Art. 27', 'SI_NO', 1.5, true, 1),
('q1000000-0000-0000-0000-000000000031', 'c1000000-0000-0000-0000-000000000005', 'Los paises destinatarios cuentan con un nivel adecuado de proteccion de datos?', 'La transferencia es libre a paises declarados con nivel adecuado por la Agencia.', 'Art. 27', 'SI_NO', 1.0, true, 2),
('q1000000-0000-0000-0000-000000000032', 'c1000000-0000-0000-0000-000000000005', 'Para paises sin nivel adecuado, se utilizan clausulas contractuales tipo u otros mecanismos autorizados?', 'Clausulas contractuales, normas corporativas vinculantes o consentimiento explicito del titular.', 'Art. 28', 'SI_NO', 1.5, true, 3),
('q1000000-0000-0000-0000-000000000033', 'c1000000-0000-0000-0000-000000000005', 'Se informa al titular sobre la transferencia internacional de sus datos?', 'El titular debe ser informado sobre el hecho de la transferencia, el pais de destino y las garantias existentes.', 'Art. 27', 'SI_NO', 1.0, true, 4),
('q1000000-0000-0000-0000-000000000034', 'c1000000-0000-0000-0000-000000000005', 'Se mantiene documentacion actualizada de las transferencias internacionales realizadas?', 'Debe existir un registro de transferencias con detalle de destinatarios, paises, bases legales y garantias.', 'Art. 27', 'SI_NO', 1.0, true, 5),
('q1000000-0000-0000-0000-000000000035', 'c1000000-0000-0000-0000-000000000005', 'Los proveedores internacionales de servicios cloud cumplen con las garantias exigidas por la ley?', 'Incluye AWS, Azure, Google Cloud, etc. Deben cumplir con medidas de seguridad y condiciones contractuales.', 'Art. 28', 'SI_NO', 1.0, true, 6);

-- Categoria 6: Seguridad de Datos (Art. 14 quinquies)
INSERT INTO gap_categories (id, name, description, law_reference, weight, "order") VALUES
('c1000000-0000-0000-0000-000000000006', 'Seguridad de Datos Personales', 'Evaluacion de las medidas de seguridad tecnicas y organizativas implementadas', 'Art. 14 quinquies', 1.5, 6);

INSERT INTO gap_questions (id, category_id, question_text, help_text, law_article, question_type, weight, is_mandatory, "order") VALUES
('q1000000-0000-0000-0000-000000000036', 'c1000000-0000-0000-0000-000000000006', 'Se han implementado medidas de seguridad tecnicas como cifrado, seudonimizacion y control de acceso?', 'Medidas tecnicas adecuadas al nivel de riesgo del tratamiento y la sensibilidad de los datos.', 'Art. 14 quinquies', 'SI_NO', 2.0, true, 1),
('q1000000-0000-0000-0000-000000000037', 'c1000000-0000-0000-0000-000000000006', 'Se realizan evaluaciones periodicas de riesgo sobre los datos personales tratados?', 'Las evaluaciones deben considerar amenazas, vulnerabilidades e impacto potencial sobre los titulares.', 'Art. 14 quinquies', 'SI_NO', 1.5, true, 2),
('q1000000-0000-0000-0000-000000000038', 'c1000000-0000-0000-0000-000000000006', 'Existe un protocolo de respuesta ante brechas de seguridad de datos personales?', 'El protocolo debe definir pasos de contencion, investigacion, notificacion y remediacion.', 'Art. 14 quinquies', 'SI_NO', 2.0, true, 3),
('q1000000-0000-0000-0000-000000000039', 'c1000000-0000-0000-0000-000000000006', 'Se notifica a la Agencia y a los titulares afectados en caso de brecha de seguridad?', 'La notificacion a la Agencia debe realizarse lo antes posible. Los titulares deben ser notificados cuando existe riesgo para sus derechos.', 'Art. 14 quinquies', 'SI_NO', 2.0, true, 4),
('q1000000-0000-0000-0000-000000000040', 'c1000000-0000-0000-0000-000000000006', 'Se cuenta con politicas de control de acceso basadas en roles y privilegios minimos?', 'Solo el personal autorizado debe acceder a los datos personales, segun sus funciones.', 'Art. 14 quinquies', 'SI_NO', 1.0, true, 5),
('q1000000-0000-0000-0000-000000000041', 'c1000000-0000-0000-0000-000000000006', 'Se realizan copias de respaldo periodicas y se prueban los procedimientos de recuperacion?', 'Backup y disaster recovery son medidas esenciales para la disponibilidad e integridad de los datos.', 'Art. 14 quinquies', 'SI_NO', 1.0, true, 6),
('q1000000-0000-0000-0000-000000000042', 'c1000000-0000-0000-0000-000000000006', 'Se registran y monitorean los accesos a datos personales?', 'Logs de acceso para trazabilidad y deteccion de accesos no autorizados.', 'Art. 14 quinquies', 'SI_NO', 1.0, true, 7),
('q1000000-0000-0000-0000-000000000043', 'c1000000-0000-0000-0000-000000000006', 'Se realizan auditorias de seguridad periodicas sobre los sistemas que tratan datos personales?', 'Las auditorias permiten verificar la eficacia de las medidas implementadas y detectar vulnerabilidades.', 'Art. 14 quinquies', 'SI_NO', 1.0, true, 8);

-- Categoria 7: Datos Sensibles (Art. 16 - 16 bis)
INSERT INTO gap_categories (id, name, description, law_reference, weight, "order") VALUES
('c1000000-0000-0000-0000-000000000007', 'Tratamiento de Datos Sensibles', 'Evaluacion del tratamiento especial de datos sensibles, biometricos, de salud y de menores', 'Art. 16, Art. 16 bis', 1.5, 7);

INSERT INTO gap_questions (id, category_id, question_text, help_text, law_article, question_type, weight, is_mandatory, "order") VALUES
('q1000000-0000-0000-0000-000000000044', 'c1000000-0000-0000-0000-000000000007', 'Se han identificado todos los tratamientos de datos sensibles en la organizacion?', 'Datos sensibles incluyen: origen etnico, opiniones politicas, religion, salud, vida sexual, datos biometricos, datos penales.', 'Art. 16', 'SI_NO', 1.5, true, 1),
('q1000000-0000-0000-0000-000000000045', 'c1000000-0000-0000-0000-000000000007', 'Se cuenta con consentimiento explicito para el tratamiento de datos sensibles?', 'El consentimiento para datos sensibles debe ser explicito, especifico y documentado.', 'Art. 16', 'SI_NO', 2.0, true, 2),
('q1000000-0000-0000-0000-000000000046', 'c1000000-0000-0000-0000-000000000007', 'Se aplican medidas de seguridad reforzadas para datos sensibles?', 'Los datos sensibles requieren un nivel de proteccion superior al de los datos personales comunes.', 'Art. 16', 'SI_NO', 1.5, true, 3),
('q1000000-0000-0000-0000-000000000047', 'c1000000-0000-0000-0000-000000000007', 'El tratamiento de datos de salud cumple con las condiciones especiales establecidas?', 'Los datos de salud tienen regulacion especifica sobre quien puede tratarlos y bajo que condiciones.', 'Art. 16 bis', 'SI_NO', 1.5, true, 4),
('q1000000-0000-0000-0000-000000000048', 'c1000000-0000-0000-0000-000000000007', 'Se cumplen las condiciones especiales para el tratamiento de datos biometricos?', 'Los datos biometricos se consideran sensibles y requieren consentimiento explicito.', 'Art. 16 bis', 'SI_NO', 1.5, true, 5),
('q1000000-0000-0000-0000-000000000049', 'c1000000-0000-0000-0000-000000000007', 'Se cumplen las condiciones especiales para el tratamiento de datos de menores de edad?', 'El tratamiento de datos de menores de 14 anos requiere autorizacion del representante legal.', 'Art. 16 bis', 'SI_NO', 2.0, true, 6),
('q1000000-0000-0000-0000-000000000050', 'c1000000-0000-0000-0000-000000000007', 'Se ha realizado una evaluacion de impacto para tratamientos de datos sensibles a gran escala?', 'La EIPD es obligatoria cuando el tratamiento de datos sensibles es sistematico y a gran escala.', 'Art. 16', 'SI_NO', 1.0, true, 7);

-- Categoria 8: DPO y Gobernanza (Art. 14 ter - 14 quater)
INSERT INTO gap_categories (id, name, description, law_reference, weight, "order") VALUES
('c1000000-0000-0000-0000-000000000008', 'DPO y Gobernanza de Datos', 'Evaluacion de la estructura de gobernanza, DPO y modelo de prevencion', 'Art. 14 ter, Art. 14 quater', 1.0, 8);

INSERT INTO gap_questions (id, category_id, question_text, help_text, law_article, question_type, weight, is_mandatory, "order") VALUES
('q1000000-0000-0000-0000-000000000051', 'c1000000-0000-0000-0000-000000000008', 'Se ha designado formalmente un Delegado de Proteccion de Datos (DPO)?', 'El DPO es obligatorio para organismos publicos y para ciertas organizaciones segun volumen y tipo de datos tratados.', 'Art. 14 ter', 'SI_NO', 2.0, true, 1),
('q1000000-0000-0000-0000-000000000052', 'c1000000-0000-0000-0000-000000000008', 'El DPO cuenta con independencia y recursos adecuados para ejercer sus funciones?', 'El DPO no debe recibir instrucciones sobre el ejercicio de sus funciones y debe contar con recursos suficientes.', 'Art. 14 ter', 'SI_NO', 1.5, true, 2),
('q1000000-0000-0000-0000-000000000053', 'c1000000-0000-0000-0000-000000000008', 'El DPO tiene conocimiento especializado en proteccion de datos personales?', 'Se requiere formacion y experiencia acreditables en materia de proteccion de datos.', 'Art. 14 ter', 'SI_NO', 1.0, true, 3),
('q1000000-0000-0000-0000-000000000054', 'c1000000-0000-0000-0000-000000000008', 'Existe un modelo de prevencion de infracciones implementado y documentado?', 'Debe incluir: identificacion de riesgos, protocolos, capacitacion, mecanismo de denuncia y respuesta.', 'Art. 14 quater', 'SI_NO', 1.5, true, 4),
('q1000000-0000-0000-0000-000000000055', 'c1000000-0000-0000-0000-000000000008', 'Se realizan capacitaciones periodicas al personal sobre proteccion de datos?', 'La capacitacion debe ser continua y abarcar a todo el personal que trate datos personales.', 'Art. 14 quater', 'SI_NO', 1.0, true, 5),
('q1000000-0000-0000-0000-000000000056', 'c1000000-0000-0000-0000-000000000008', 'Existe un canal de denuncias interno para reportar posibles infracciones a la proteccion de datos?', 'Parte del modelo de prevencion debe incluir mecanismos para reportar incumplimientos internos.', 'Art. 14 quater', 'SI_NO', 1.0, true, 6),
('q1000000-0000-0000-0000-000000000057', 'c1000000-0000-0000-0000-000000000008', 'Se ha certificado o esta en proceso de certificacion el modelo de prevencion ante la Agencia?', 'La certificacion del modelo de prevencion puede servir como atenuante en caso de infracciones.', 'Art. 14 quater', 'SI_NO', 1.0, true, 7);

-- Verificacion: total 57 preguntas en 8 categorias
-- SELECT c.name, COUNT(q.id) as preguntas FROM gap_categories c LEFT JOIN gap_questions q ON q.category_id = c.id GROUP BY c.name ORDER BY c."order";
