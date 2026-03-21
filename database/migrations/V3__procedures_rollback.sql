-- Descrição: Conjunto de procedures para gerenciamento de consultas, pacientes e médicos

-- Muda para permitir ; dentro da procedure
DELIMITER //

-- Procedure: Cadastrar paciente completo (com endereço)
CREATE PROCEDURE sp_cadastrar_paciente_completo(
    IN p_nome VARCHAR(150),
    IN p_cpf VARCHAR(14),
    IN p_data_nascimento DATE,
    IN p_telefone VARCHAR(18),
    IN p_email VARCHAR(100),
    IN p_cep VARCHAR(9),
    IN p_logradouro VARCHAR(200),
    IN p_numero VARCHAR(10),
    IN p_complemento VARCHAR(50),
    IN p_bairro VARCHAR(100),
    IN p_cidade VARCHAR(30),
    IN p_estado CHAR(2),
    OUT p_paciente_id INT,
    OUT p_sucesso BOOLEAN,
    OUT p_mensagem VARCHAR(255)
)
BEGIN
    -- Handler de erro: se der qualquer erro, faz ROLLBACK
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;  --  Desfaz TUDO que foi feito na transacao
        SET p_sucesso = FALSE;
        SET p_mensagem = 'Erro ao cadastrar paciente. Todos os dados foram desfeitos (ROLLBACK executado).';
        RESIGNAL;  -- Mostra o erro original no log
    END;

    START TRANSACTION;  -- Inicia transacao (BEGIN)

    -- 1. Insere paciente
    INSERT INTO pacientes (nome, cpf, data_nascimento, telefone, email)
    VALUES (p_nome, p_cpf, p_data_nascimento, p_telefone, p_email);
    
    -- Pega o ID gerado
    SET p_paciente_id = LAST_INSERT_ID();

    -- 2. Insere endereco vinculado ao paciente
    INSERT INTO endereco (paciente_id, cep, logradouro, numero, complemento, bairro, cidade, estado)
    VALUES (p_paciente_id, p_cep, p_logradouro, p_numero, p_complemento, p_bairro, p_cidade, p_estado);

    -- Se chegou aqui, tudo deu certo!
    COMMIT;  --  Confirma definitivamente no banco
    
    SET p_sucesso = TRUE;
    SET p_mensagem = 'Paciente cadastrado com sucesso!';

END //
DELIMITER //
-- Procedure: Agendar consulta (com verificação de conflito)
CREATE PROCEDURE sp_agendar_consulta(
IN p_paciente_id INT,
IN p_medico_id INT,
IN p_especialidade_id INT,
IN p_data_consulta DATE,
IN p_horario TIME,
OUT p_consulta_id INT,
OUT p_sucesso BOOLEAN,
OUT p_mensagem VARCHAR(255)
)
BEGIN
	DECLARE v_conflito INT DEFAULT 0;
    DECLARE v_paciente_existe INT DEFAULT 0;
    DECLARE v_medico_existe INT DEFAULT 0;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
    ROLLBACK;
    SET p_sucesso = FALSE;
    SET p_mensagem = 'Erro ao agendar consulta. Operação cancelada.';
    RESIGNAL;
END;
START TRANSACTION;
-- Verifica se paciente e medico existem
SELECT COUNT(*) INTO v_paciente_existe FROM pacientes WHERE id = p_paciente_id = TRUE;
SELECT COUNT(*) INTO v_medico_existe FROM medicos WHERE id = p_medico_id = TRUE;

IF v_paciente_existe = 0 THEN 
ROLLBACK;
SET p_sucesso = FALSE;
SET p_mensagem = 'Paciente nao encontrado!';
ELSEIF v_medico_existe = 0 THEN 
ROLLBACK;
SET p_sucesso = FALSE;
SET p_mensagem = 'Medico nao encontrado!';
ELSE
SELECT COUNT(*) INTO v_conflito
FROM consultas
WHERE medico_id = p_medico_id
	AND data_consulta = p_data_consulta
    AND horario = p_horario
    AND status != 'Cancelado';

IF v_conflito > 0 THEN
	ROLLBACK; -- Desfaz porque deu conflito
    SET p_sucesso = FALSE;
    SET p_mensagem = 'Medico ja tem consulta nesse horario';
ELSE
	-- Insere consulta
	INSERT INTO consultas (paciente_id, medico_id, especialidade_id, data_consulta, horario, status)
    VALUES (p_paciente_id, p_medico_id, p_especialidade_id, p_data_consulta, p_horario, 'Agendado');
    
    SET p_consulta_id = LAST_INSERT_ID();
    COMMIT; -- Confirma no banco
    SET p_sucesso = TRUE;
    SET p_mensagem = 'Consulta agendada com sucesso!';
    END IF;
END IF;
END //

DELIMITER //
-- Cancelar consulta com verificacao
CREATE PROCEDURE sp_cancelar_consulta(
    IN p_consulta_id INT,
    OUT p_sucesso BOOLEAN,
    OUT p_mensagem VARCHAR(255)
)
BEGIN
    DECLARE v_existe INT DEFAULT 0;
    DECLARE v_status VARCHAR(20);
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_sucesso = FALSE;
        SET p_mensagem = 'Erro ao cancelar consulta.';
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Verifica se consulta existe e pega status
    SELECT status INTO v_status 
FROM consultas 
WHERE id = p_consulta_id;

IF v_status IS NULL THEN
    ROLLBACK;
    SET p_sucesso = FALSE;
    SET p_mensagem = 'Consulta nao encontrada!';
    ELSEIF v_status = 'Cancelado' THEN
        ROLLBACK;
        SET p_sucesso = FALSE;
        SET p_mensagem = 'Consulta ja esta cancelada!';
    ELSEIF v_status = ('Realizado', 'Em atendimento') THEN
        ROLLBACK;
        SET p_sucesso = FALSE;
        SET p_mensagem = 'Nao pode cancelar consulta ja realizada!';
    ELSE
        -- Atualiza status
        UPDATE consultas 
        SET status = 'Cancelado' 
        WHERE id = p_consulta_id;
        
        COMMIT;
        SET p_sucesso = TRUE;
        SET p_mensagem = 'Consulta cancelada com sucesso!';
    END IF;

END //

DELIMITER //
-- Marca consulta como realizada
CREATE PROCEDURE sp_marcar_realizado(
    IN p_consulta_id INT,
    OUT p_sucesso BOOLEAN,
    OUT p_mensagem VARCHAR(255)
)
BEGIN
    DECLARE v_data DATE;
	DECLARE v_status VARCHAR(20);
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_sucesso = FALSE;
        SET p_mensagem = 'Erro ao marcar consulta como realizada.';
        RESIGNAL;
    END;

    START TRANSACTION;

    SELECT data_consulta, status INTO v_data, v_status 
    FROM consultas 
    WHERE id = p_consulta_id;
    
    IF v_data IS NULL THEN
        ROLLBACK;
        SET p_sucesso = FALSE;
        SET p_mensagem = 'Consulta nao encontrada!';
    ELSE IF v_status = 'Realizado' THEN
		ROLLBACK;
        SET p_sucesso = FALSE;
        SET p_mensagem = 'Consulta ja esta marcada como realizada';
    ELSEIF v_status = 'Cancelado' THEN
		ROLLBACK;
        SET p_sucesso = FALSE;
        SET p_mensagem = 'Nao pode marcar como realizada uma consulta cancelada!';
    ELSEIF v_data > CURDATE() THEN
        ROLLBACK;
        SET p_sucesso = FALSE;
        SET p_mensagem = 'Nao pode marcar como realizada uma consulta futura!';
    ELSE
        UPDATE consultas 
        SET status = 'Realizado'
        WHERE id = p_consulta_id;
        
        COMMIT;
        SET p_sucesso = TRUE;
        SET p_mensagem = 'Consulta marcada como realizada!';
    END IF;

END //
DELIMITER //
DELIMITER //
CREATE PROCEDURE sp_cadastrar_medico_completo(
    IN p_nome VARCHAR(150),
    IN p_crm VARCHAR(20),
    IN p_telefone VARCHAR(20),
    IN p_email VARCHAR(100),
    IN p_especialidade_ids VARCHAR(255),
    OUT p_medico_id INT,
    OUT p_sucesso BOOLEAN,
    OUT p_mensagem VARCHAR(255)
)
BEGIN
    DECLARE v_crm_existe INT DEFAULT 0;
    DECLARE v_esp_id INT;
    DECLARE v_pos INT DEFAULT 1;
    DECLARE v_str VARCHAR(255);
    DECLARE v_contador INT DEFAULT 0;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_sucesso = FALSE;
        SET p_mensagem = 'Erro no cadastro do médico.';
        SET p_medico_id = NULL;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Validação 1: Verifica se informou especialidades
    IF p_especialidade_ids IS NULL OR TRIM(p_especialidade_ids) = '' THEN
        ROLLBACK;
        SET p_sucesso = FALSE;
        SET p_mensagem = 'Informe pelo menos uma especialidade!';
        SET p_medico_id = NULL;
    ELSE
        -- Validação 2: Verifica CRM duplicado
        SELECT COUNT(*) INTO v_crm_existe FROM medicos WHERE crm = p_crm;
        
        IF v_crm_existe > 0 THEN
            ROLLBACK;
            SET p_sucesso = FALSE;
            SET p_mensagem = 'CRM já cadastrado!';
            SET p_medico_id = NULL;
        ELSE
            -- Insere médico
            INSERT INTO medicos (nome, crm, telefone, email) 
            VALUES (p_nome, p_crm, p_telefone, p_email);
            
            SET p_medico_id = LAST_INSERT_ID();
            
            -- Loop para inserir especialidades
            SET v_str = p_especialidade_ids;
            WHILE LENGTH(v_str) > 0 DO
                SET v_pos = LOCATE(',', v_str);
                IF v_pos = 0 THEN
                    SET v_esp_id = CAST(TRIM(v_str) AS UNSIGNED);
                    SET v_str = '';
                ELSE
                    SET v_esp_id = CAST(TRIM(LEFT(v_str, v_pos - 1)) AS UNSIGNED);
                    SET v_str = TRIM(SUBSTRING(v_str, v_pos + 1));
                END IF;
                
                -- Validação 3: ID da especialidade deve ser > 0
                IF v_esp_id > 0 THEN
                    INSERT INTO medico_especialidade (medico_id, especialidade_id)
                    VALUES (p_medico_id, v_esp_id);
                    SET v_contador = v_contador + 1;
                END IF;
            END WHILE;
            
            -- Validação 4: Verifica se inseriu pelo menos 1 especialidade válida
            IF v_contador = 0 THEN
                ROLLBACK;
                SET p_sucesso = FALSE;
                SET p_mensagem = 'Nenhuma especialidade válida informada!';
                SET p_medico_id = NULL;
            ELSE
                COMMIT;
                SET p_sucesso = TRUE;
                SET p_mensagem = 'Médico cadastrado com sucesso!';
            END IF;
        END IF;
    END IF;
END //


DELIMITER //
CREATE PROCEDURE sp_relatorio_consultas(
    IN p_data_inicio DATE,
    IN p_data_fim DATE,
    IN p_status VARCHAR(20) -- 'Todos', 'Agendado', 'Realizado', 'Cancelado', 'Em atendimento', 'Confirmado'
)
BEGIN
    IF p_status = 'Todos' THEN
        SELECT 
            c.id AS consulta_id,
            p.nome AS paciente,
            m.nome AS medico,
            e.nome AS especialidade,
            c.data_consulta,
            c.horario,
            c.status
        FROM consultas c
        JOIN pacientes p ON c.paciente_id = p.id
        JOIN medicos m ON c.medico_id = m.id
        JOIN especialidades e ON c.especialidade_id = e.id
        WHERE c.data_consulta BETWEEN p_data_inicio AND p_data_fim
        ORDER BY c.data_consulta, c.horario;
    ELSE
        SELECT 
            c.id AS consulta_id,
            p.nome AS paciente,
            m.nome AS medico,
            e.nome AS especialidade,
            c.data_consulta,
            c.horario,
            c.status
        FROM consultas c
        JOIN pacientes p ON c.paciente_id = p.id
        JOIN medicos m ON c.medico_id = m.id
        JOIN especialidades e ON c.especialidade_id = e.id
        WHERE c.data_consulta BETWEEN p_data_inicio AND p_data_fim
          AND c.status = p_status
        ORDER BY c.data_consulta, c.horario;
    END IF;
END //
DELIMITER ;
