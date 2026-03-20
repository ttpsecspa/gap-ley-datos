-- =============================================
-- SUPABASE MIGRATION - GAP LEY 21.719
-- Proteccion de Datos Personales Chile
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- ENUMS
-- =============================================

CREATE TYPE user_role AS ENUM ('ADMIN', 'DPO', 'RESPONSABLE', 'AUDITOR', 'CONSULTOR', 'USUARIO');
CREATE TYPE org_type AS ENUM ('PUBLICA', 'PRIVADA');
CREATE TYPE data_category AS ENUM ('PERSONAL', 'SENSIBLE', 'BIOMETRICO');
CREATE TYPE legal_basis AS ENUM ('CONSENTIMIENTO', 'LEY', 'CONTRATO', 'INTERES_LEGITIMO', 'INTERES_VITAL', 'MISION_PUBLICA');
CREATE TYPE risk_level AS ENUM ('BAJO', 'MEDIO', 'ALTO', 'CRITICO');
CREATE TYPE compliance_level AS ENUM ('NO_CUMPLE', 'PARCIAL', 'CUMPLE', 'NO_APLICA');
CREATE TYPE assessment_status AS ENUM ('BORRADOR', 'EN_PROGRESO', 'COMPLETADA', 'ARCHIVADA');
CREATE TYPE question_type AS ENUM ('SI_NO', 'ESCALA', 'TEXTO', 'MULTIPLE');
CREATE TYPE finding_type AS ENUM ('BRECHA', 'RIESGO', 'OBSERVACION');
CREATE TYPE finding_severity AS ENUM ('ALTA', 'MEDIA', 'BAJA');
CREATE TYPE finding_status AS ENUM ('ABIERTO', 'EN_PROGRESO', 'CERRADO');
CREATE TYPE plan_status AS ENUM ('BORRADOR', 'ACTIVO', 'COMPLETADO', 'CANCELADO');
CREATE TYPE priority AS ENUM ('CRITICA', 'ALTA', 'MEDIA', 'BAJA');
CREATE TYPE action_status AS ENUM ('PENDIENTE', 'EN_PROGRESO', 'COMPLETADA', 'VENCIDA', 'CANCELADA');
CREATE TYPE doc_type AS ENUM ('CATALOGO', 'POLITICA', 'PROTOCOLO', 'PROCEDIMIENTO', 'ACTA', 'OTRO');
CREATE TYPE doc_status AS ENUM ('BORRADOR', 'EN_REVISION', 'APROBADO', 'VIGENTE', 'OBSOLETO');
CREATE TYPE request_type AS ENUM ('ACCESO', 'RECTIFICACION', 'SUPRESION', 'OPOSICION', 'PORTABILIDAD', 'BLOQUEO');
CREATE TYPE request_status AS ENUM ('RECIBIDA', 'EN_PROCESO', 'RESPONDIDA', 'CERRADA', 'VENCIDA');
CREATE TYPE request_resolution AS ENUM ('ACEPTADA', 'RECHAZADA', 'PARCIAL');
CREATE TYPE breach_severity AS ENUM ('BAJA', 'MEDIA', 'ALTA', 'CRITICA');
CREATE TYPE breach_status AS ENUM ('DETECTADA', 'INVESTIGANDO', 'NOTIFICADA', 'RESUELTA');
CREATE TYPE committee_role AS ENUM ('PRESIDENTE', 'SECRETARIO', 'MIEMBRO');

-- =============================================
-- TABLES
-- =============================================

-- Organizations
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  rut TEXT UNIQUE,
  type org_type NOT NULL,
  sector TEXT,
  address TEXT,
  website TEXT,
  dpo_name TEXT,
  dpo_email TEXT,
  responsible_name TEXT,
  responsible_email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles (linked to Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role user_role DEFAULT 'USUARIO',
  is_active BOOLEAN DEFAULT TRUE,
  organization_id UUID REFERENCES organizations(id),
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Departments
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  head_name TEXT,
  head_email TEXT,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Committees
CREATE TABLE committees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  objective TEXT,
  meeting_frequency TEXT,
  constituted_at TIMESTAMPTZ,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE committee_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  committee_id UUID NOT NULL REFERENCES committees(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  role_in_committee committee_role DEFAULT 'MIEMBRO',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(committee_id, user_id)
);

-- Data Inventory
CREATE TABLE database_registries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  contains_sensitive_data BOOLEAN DEFAULT FALSE,
  access_controls TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE data_inventories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id),
  data_name TEXT NOT NULL,
  data_description TEXT,
  data_category data_category NOT NULL,
  titulars_universe TEXT,
  purpose TEXT NOT NULL,
  legal_basis legal_basis NOT NULL,
  legal_basis_detail TEXT,
  data_source TEXT,
  recipients TEXT,
  internal_responsible TEXT,
  retention_period TEXT,
  platform_system TEXT,
  storage_infrastructure TEXT,
  international_transfer BOOLEAN DEFAULT FALSE,
  transfer_country TEXT,
  transfer_entity TEXT,
  access_areas TEXT,
  risk_level risk_level DEFAULT 'MEDIO',
  notes TEXT,
  database_registry_id UUID REFERENCES database_registries(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- GAP Assessment
CREATE TABLE gap_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  law_reference TEXT,
  weight FLOAT DEFAULT 1.0,
  "order" INT NOT NULL
);

CREATE TABLE gap_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES gap_categories(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  help_text TEXT,
  law_article TEXT,
  question_type question_type DEFAULT 'SI_NO',
  weight FLOAT DEFAULT 1.0,
  is_mandatory BOOLEAN DEFAULT TRUE,
  "order" INT NOT NULL
);

CREATE TABLE gap_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_by_id UUID NOT NULL REFERENCES profiles(id),
  name TEXT NOT NULL,
  description TEXT,
  assessment_date TIMESTAMPTZ DEFAULT NOW(),
  status assessment_status DEFAULT 'BORRADOR',
  overall_score FLOAT,
  overall_risk_level risk_level,
  findings_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE gap_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES gap_assessments(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES gap_questions(id),
  answered_by_id UUID NOT NULL REFERENCES profiles(id),
  answer_value TEXT,
  evidence_text TEXT,
  evidence_files TEXT[] DEFAULT '{}',
  compliance_level compliance_level DEFAULT 'NO_CUMPLE',
  answered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(assessment_id, question_id)
);

CREATE TABLE gap_findings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES gap_assessments(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES gap_categories(id),
  finding_type finding_type NOT NULL,
  description TEXT NOT NULL,
  severity finding_severity NOT NULL,
  recommendation TEXT,
  status finding_status DEFAULT 'ABIERTO',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Action Plans
CREATE TABLE action_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES gap_assessments(id),
  created_by_id UUID NOT NULL REFERENCES profiles(id),
  name TEXT NOT NULL,
  description TEXT,
  status plan_status DEFAULT 'BORRADOR',
  start_date TIMESTAMPTZ,
  target_end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE action_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action_plan_id UUID NOT NULL REFERENCES action_plans(id) ON DELETE CASCADE,
  finding_id UUID REFERENCES gap_findings(id),
  responsible_user_id UUID REFERENCES profiles(id),
  responsible_department_id UUID REFERENCES departments(id),
  title TEXT NOT NULL,
  description TEXT,
  priority priority DEFAULT 'MEDIA',
  status action_status DEFAULT 'PENDIENTE',
  start_date TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  completed_date TIMESTAMPTZ,
  completion_percentage INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE action_item_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action_item_id UUID NOT NULL REFERENCES action_items(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  comment_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  type doc_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  version TEXT DEFAULT '1.0',
  status doc_status DEFAULT 'BORRADOR',
  content TEXT,
  file_path TEXT,
  created_by_id UUID NOT NULL REFERENCES profiles(id),
  approved_by_id UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE document_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  version_number TEXT NOT NULL,
  changes_description TEXT,
  file_path TEXT,
  is_current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subject Requests (ARCO-POB)
CREATE TABLE subject_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  request_type request_type NOT NULL,
  requester_name TEXT NOT NULL,
  requester_email TEXT NOT NULL,
  requester_rut TEXT,
  description TEXT NOT NULL,
  status request_status DEFAULT 'RECIBIDA',
  received_date TIMESTAMPTZ DEFAULT NOW(),
  due_date TIMESTAMPTZ NOT NULL,
  response_date TIMESTAMPTZ,
  assigned_to_id UUID REFERENCES profiles(id),
  response_text TEXT,
  resolution request_resolution,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE subject_request_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES subject_requests(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  performed_by_id UUID NOT NULL REFERENCES profiles(id),
  notes TEXT,
  performed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Security Breaches
CREATE TABLE security_breaches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  responsible_user_id UUID NOT NULL REFERENCES profiles(id),
  detected_date TIMESTAMPTZ NOT NULL,
  reported_date TIMESTAMPTZ,
  description TEXT NOT NULL,
  severity breach_severity NOT NULL,
  affected_data_types TEXT,
  affected_titulars_count INT,
  notified_agency BOOLEAN DEFAULT FALSE,
  agency_notification_date TIMESTAMPTZ,
  notified_titulars BOOLEAN DEFAULT FALSE,
  titulars_notification_date TIMESTAMPTZ,
  corrective_measures TEXT,
  status breach_status DEFAULT 'DETECTADA',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE breach_timelines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  breach_id UUID NOT NULL REFERENCES security_breaches(id) ON DELETE CASCADE,
  event_description TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  recorded_by_id UUID NOT NULL REFERENCES profiles(id),
  evidence_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Log
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id UUID,
  details TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_profiles_org ON profiles(organization_id);
CREATE INDEX idx_departments_org ON departments(organization_id);
CREATE INDEX idx_data_inventories_org ON data_inventories(organization_id);
CREATE INDEX idx_data_inventories_dept ON data_inventories(department_id);
CREATE INDEX idx_gap_assessments_org ON gap_assessments(organization_id);
CREATE INDEX idx_gap_answers_assessment ON gap_answers(assessment_id);
CREATE INDEX idx_gap_findings_assessment ON gap_findings(assessment_id);
CREATE INDEX idx_action_plans_org ON action_plans(organization_id);
CREATE INDEX idx_action_items_plan ON action_items(action_plan_id);
CREATE INDEX idx_documents_org ON documents(organization_id);
CREATE INDEX idx_subject_requests_org ON subject_requests(organization_id);
CREATE INDEX idx_security_breaches_org ON security_breaches(organization_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity, entity_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_inventories ENABLE ROW LEVEL SECURITY;
ALTER TABLE gap_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE gap_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE gap_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE gap_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE subject_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_breaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can read their own org data
CREATE POLICY "Users read own org" ON organizations FOR SELECT
  USING (id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users read own profile" ON profiles FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users read own org departments" ON departments FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users read own org data" ON data_inventories FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users read own org assessments" ON gap_assessments FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Anyone read categories" ON gap_categories FOR SELECT USING (true);
CREATE POLICY "Anyone read questions" ON gap_questions FOR SELECT USING (true);

CREATE POLICY "Users read own org answers" ON gap_answers FOR SELECT
  USING (assessment_id IN (
    SELECT id FROM gap_assessments WHERE organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  ));

CREATE POLICY "Users read own org plans" ON action_plans FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users read own org items" ON action_items FOR SELECT
  USING (action_plan_id IN (
    SELECT id FROM action_plans WHERE organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  ));

CREATE POLICY "Users read own org docs" ON documents FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users read own org requests" ON subject_requests FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users read own org breaches" ON security_breaches FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users read own audit" ON audit_logs FOR SELECT
  USING (user_id = auth.uid());

-- INSERT policies (authenticated users for their org)
CREATE POLICY "Users insert own org data" ON data_inventories FOR INSERT
  WITH CHECK (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users insert assessments" ON gap_assessments FOR INSERT
  WITH CHECK (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users insert answers" ON gap_answers FOR INSERT
  WITH CHECK (assessment_id IN (
    SELECT id FROM gap_assessments WHERE organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  ));

CREATE POLICY "Users insert plans" ON action_plans FOR INSERT
  WITH CHECK (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users insert items" ON action_items FOR INSERT
  WITH CHECK (action_plan_id IN (
    SELECT id FROM action_plans WHERE organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  ));

CREATE POLICY "Users insert docs" ON documents FOR INSERT
  WITH CHECK (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users insert requests" ON subject_requests FOR INSERT
  WITH CHECK (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users insert breaches" ON security_breaches FOR INSERT
  WITH CHECK (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- UPDATE policies
CREATE POLICY "Users update own org data" ON data_inventories FOR UPDATE
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users update assessments" ON gap_assessments FOR UPDATE
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users update answers" ON gap_answers FOR UPDATE
  USING (assessment_id IN (
    SELECT id FROM gap_assessments WHERE organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  ));

CREATE POLICY "Users update plans" ON action_plans FOR UPDATE
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users update items" ON action_items FOR UPDATE
  USING (action_plan_id IN (
    SELECT id FROM action_plans WHERE organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  ));

CREATE POLICY "Users update docs" ON documents FOR UPDATE
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users update requests" ON subject_requests FOR UPDATE
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users update breaches" ON security_breaches FOR UPDATE
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- =============================================
-- TRIGGERS: auto-update updated_at
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_organizations_updated BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_profiles_updated BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_departments_updated BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_data_inventories_updated BEFORE UPDATE ON data_inventories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_gap_assessments_updated BEFORE UPDATE ON gap_assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_gap_findings_updated BEFORE UPDATE ON gap_findings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_action_plans_updated BEFORE UPDATE ON action_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_action_items_updated BEFORE UPDATE ON action_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_documents_updated BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_subject_requests_updated BEFORE UPDATE ON subject_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_security_breaches_updated BEFORE UPDATE ON security_breaches FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name, organization_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    (NEW.raw_user_meta_data->>'organization_id')::UUID
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
