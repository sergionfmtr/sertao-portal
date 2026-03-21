-- ============================================
-- V1__SCHEMA_COMPLETO.SQL
-- Cria todas as tabelas da clinica medica
-- ============================================

USE clinica_medica;

-- 1. ESPECIALIDADES
CREATE TABLE IF NOT EXISTS especialidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- 2. MEDICOS
CREATE TABLE IF NOT EXISTS medicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    crm VARCHAR(20) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    email VARCHAR(100) UNIQUE
) ENGINE=InnoDB;

-- 3. MEDICO_ESPECIALIDADE
CREATE TABLE IF NOT EXISTS medico_especialidade (
    medico_id INT NOT NULL,
    especialidade_id INT NOT NULL,
    PRIMARY KEY (medico_id, especialidade_id),
    FOREIGN KEY (medico_id) REFERENCES medicos(id),
    FOREIGN KEY (especialidade_id) REFERENCES especialidades(id)
) ENGINE=InnoDB;

-- 4. PACIENTES
CREATE TABLE IF NOT EXISTS pacientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    data_nascimento DATE NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(100)
) ENGINE=InnoDB;

-- 5. ENDERECOS
CREATE TABLE IF NOT EXISTS endereco (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id INT NOT NULL,
    cep VARCHAR(9) NOT NULL,
    logradouro VARCHAR(200) NOT NULL,
    numero VARCHAR(10),
    complemento VARCHAR(50),
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(30) NOT NULL,
    estado CHAR(2) NOT NULL,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
    INDEX idx_paciente (paciente_id)
) ENGINE=InnoDB;

-- 6. CONSULTAS
CREATE TABLE IF NOT EXISTS consultas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id INT NOT NULL,
    medico_id INT NOT NULL,
    especialidade_id INT NOT NULL,
    data_consulta DATE NOT NULL,
    horario TIME NOT NULL,
    status ENUM('Agendado', 'Realizado', 'Cancelado', 'Em atendimento', 'Confirmado') DEFAULT 'Agendado',
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
    FOREIGN KEY (medico_id) REFERENCES medicos(id),
    FOREIGN KEY (especialidade_id) REFERENCES especialidades(id)
) ENGINE=InnoDB;
