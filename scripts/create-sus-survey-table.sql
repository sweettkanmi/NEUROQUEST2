-- Script para crear la tabla de cuestionarios SUS (System Usability Scale)
-- Esta tabla almacena las respuestas de los usuarios al cuestionario de usabilidad

CREATE TABLE IF NOT EXISTS sus_surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Respuestas a las 10 preguntas SUS (valores 1-5)
  q1 SMALLINT NOT NULL CHECK (q1 >= 1 AND q1 <= 5),
  q2 SMALLINT NOT NULL CHECK (q2 >= 1 AND q2 <= 5),
  q3 SMALLINT NOT NULL CHECK (q3 >= 1 AND q3 <= 5),
  q4 SMALLINT NOT NULL CHECK (q4 >= 1 AND q4 <= 5),
  q5 SMALLINT NOT NULL CHECK (q5 >= 1 AND q5 <= 5),
  q6 SMALLINT NOT NULL CHECK (q6 >= 1 AND q6 <= 5),
  q7 SMALLINT NOT NULL CHECK (q7 >= 1 AND q7 <= 5),
  q8 SMALLINT NOT NULL CHECK (q8 >= 1 AND q8 <= 5),
  q9 SMALLINT NOT NULL CHECK (q9 >= 1 AND q9 <= 5),
  q10 SMALLINT NOT NULL CHECK (q10 >= 1 AND q10 <= 5),
  
  -- Puntaje SUS calculado (0-100)
  sus_score DECIMAL(5,2) NOT NULL CHECK (sus_score >= 0 AND sus_score <= 100),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indice para busquedas por usuario
CREATE INDEX IF NOT EXISTS idx_sus_surveys_user_id ON sus_surveys(user_id);

-- Indice para ordenar por fecha
CREATE INDEX IF NOT EXISTS idx_sus_surveys_created_at ON sus_surveys(created_at DESC);

-- Habilitar Row Level Security
ALTER TABLE sus_surveys ENABLE ROW LEVEL SECURITY;

-- Politica: Los usuarios solo pueden ver sus propias respuestas
CREATE POLICY "Users can view own sus_surveys"
  ON sus_surveys FOR SELECT
  USING (auth.uid() = user_id);

-- Politica: Los usuarios solo pueden insertar sus propias respuestas
CREATE POLICY "Users can insert own sus_surveys"
  ON sus_surveys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Comentarios de documentacion
COMMENT ON TABLE sus_surveys IS 'Almacena respuestas al cuestionario System Usability Scale (SUS)';
COMMENT ON COLUMN sus_surveys.q1 IS 'Creo que me gustaria usar este sistema con frecuencia';
COMMENT ON COLUMN sus_surveys.q2 IS 'Encontre el sistema innecesariamente complejo';
COMMENT ON COLUMN sus_surveys.q3 IS 'Pense que el sistema era facil de usar';
COMMENT ON COLUMN sus_surveys.q4 IS 'Creo que necesitaria el apoyo de una persona tecnica para poder usar este sistema';
COMMENT ON COLUMN sus_surveys.q5 IS 'Encontre que las funciones del sistema estaban bien integradas';
COMMENT ON COLUMN sus_surveys.q6 IS 'Pense que habia demasiada inconsistencia en este sistema';
COMMENT ON COLUMN sus_surveys.q7 IS 'Imagino que la mayoria de las personas aprenderian a usar este sistema muy rapidamente';
COMMENT ON COLUMN sus_surveys.q8 IS 'Encontre el sistema muy complicado de usar';
COMMENT ON COLUMN sus_surveys.q9 IS 'Me senti muy seguro usando el sistema';
COMMENT ON COLUMN sus_surveys.q10 IS 'Necesite aprender muchas cosas antes de poder usar el sistema';
COMMENT ON COLUMN sus_surveys.sus_score IS 'Puntaje SUS calculado (0-100), donde 68+ es considerado por encima del promedio';
