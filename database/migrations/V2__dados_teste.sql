INSERT INTO especialidades (id, nome) VALUES
(1, 'Clinico Geral'),
(2, 'Cardiologia'),
(3, 'Dermatologia'),
(4, 'Pediatria' ),
(5, 'Ortopedia' ),
(6, 'Psicólogo'),
(7, 'Ginecologia');


INSERT INTO medicos (id, nome, crm, telefone, email) VALUES
(1, 'Dr. Carlos Silva', 'CRM-CE 001', '(85) 91111-1111', 'carlos@email.com'),
(2, 'Dra. Ana Mendes', 'CRM-CE 002', '(85) 92222-2222', 'ana@email.com'),
(3, 'Dr. Roberto Costa', 'CRM-CE 003', '(85) 93333-3333', 'roberto@email.com'),
(4, 'Dra. Fernanda Lima', 'CRM-CE 004', '(85) 94444-4444', 'fernanda@email.com');


INSERT INTO medico_especialidade (medico_id, especialidade_id) VALUES
(1, 1),
(1, 2),
(2, 3),
(2, 7),
(3, 5),
(3, 1),
(4, 4),
(4, 6);


INSERT INTO pacientes (id, nome, cpf, data_nascimento, telefone, email) VALUES
(1, 'Joao Ferreira', '111.111.111-11', '1985-03-15', '(85) 95555-5555', 'joao@email.com'),
(2, 'Maria Oliveira', '222.222.222-22', '1992-07-22', '(85) 96666-6666', 'maria@email.com'),
(3, 'Pedro Souza', '333.333.333-33', '1978-11-05', '(85) 97777-7777', 'pedro@email.com'),
(4, 'Lucia Costa', '444.444.444-44', '1995-01-30', '(85) 98888-8888', 'lucia@email.com'),
(5, 'Ana Lima', '555.555.555-55', '2002-09-12', '(85) 99999-9999', 'ana@email.com');


INSERT INTO endereco (id, paciente_id, cep, logradouro, numero, complemento, bairro, cidade, estado) VALUES
(1, 1, '60000-000', 'Av. Monsenhor Tabosa', '100', 'Apto 1', 'Centro', 'Fortaleza', 'CE'),
(2, 2, '60100-000', 'Rua Major Weyne', '200', 'Casa', 'Aldeota', 'Fortaleza', 'CE'),
(3, 3, '60200-000', 'Av. Dom Luis', '300', 'Bloco A', 'Meireles', 'Fortaleza', 'CE'),
(4, 4, '60300-000', 'Rua Dragao do Mar', '400', NULL, 'Praia de Iracema', 'Fortaleza', 'CE'),
(5, 5, '63000-000', 'Av. Padre Cicero', '500', 'Bloco B', 'Centro', 'Juazeiro do Norte', 'CE');


INSERT INTO consultas (id, paciente_id, medico_id, especialidade_id, data_consulta, horario, status) VALUES
(1, 1, 1, 1, CURDATE(), '09:00', 'Agendado'),
(2, 2, 2, 3, CURDATE(), '10:00', 'Agendado'),
(3, 3, 3, 5, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '14:00', 'Agendado');

