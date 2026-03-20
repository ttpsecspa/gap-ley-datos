// Supabase Database Types for GAP Ley 21.719

export type UserRole = "ADMIN" | "DPO" | "RESPONSABLE" | "AUDITOR" | "CONSULTOR" | "USUARIO"
export type OrgType = "PUBLICA" | "PRIVADA"
export type DataCategory = "PERSONAL" | "SENSIBLE" | "BIOMETRICO"
export type LegalBasis = "CONSENTIMIENTO" | "LEY" | "CONTRATO" | "INTERES_LEGITIMO" | "INTERES_VITAL" | "MISION_PUBLICA"
export type RiskLevel = "BAJO" | "MEDIO" | "ALTO" | "CRITICO"
export type ComplianceLevel = "NO_CUMPLE" | "PARCIAL" | "CUMPLE" | "NO_APLICA"
export type AssessmentStatus = "BORRADOR" | "EN_PROGRESO" | "COMPLETADA" | "ARCHIVADA"
export type QuestionType = "SI_NO" | "ESCALA" | "TEXTO" | "MULTIPLE"
export type FindingType = "BRECHA" | "RIESGO" | "OBSERVACION"
export type FindingSeverity = "ALTA" | "MEDIA" | "BAJA"
export type FindingStatus = "ABIERTO" | "EN_PROGRESO" | "CERRADO"
export type PlanStatus = "BORRADOR" | "ACTIVO" | "COMPLETADO" | "CANCELADO"
export type Priority = "CRITICA" | "ALTA" | "MEDIA" | "BAJA"
export type ActionStatus = "PENDIENTE" | "EN_PROGRESO" | "COMPLETADA" | "VENCIDA" | "CANCELADA"
export type DocType = "CATALOGO" | "POLITICA" | "PROTOCOLO" | "PROCEDIMIENTO" | "ACTA" | "OTRO"
export type DocStatus = "BORRADOR" | "EN_REVISION" | "APROBADO" | "VIGENTE" | "OBSOLETO"
export type RequestType = "ACCESO" | "RECTIFICACION" | "SUPRESION" | "OPOSICION" | "PORTABILIDAD" | "BLOQUEO"
export type RequestStatus = "RECIBIDA" | "EN_PROCESO" | "RESPONDIDA" | "CERRADA" | "VENCIDA"
export type RequestResolution = "ACEPTADA" | "RECHAZADA" | "PARCIAL"
export type BreachSeverity = "BAJA" | "MEDIA" | "ALTA" | "CRITICA"
export type BreachStatus = "DETECTADA" | "INVESTIGANDO" | "NOTIFICADA" | "RESUELTA"
export type CommitteeRole = "PRESIDENTE" | "SECRETARIO" | "MIEMBRO"

export interface Organization {
  id: string
  name: string
  rut: string | null
  type: OrgType
  sector: string | null
  address: string | null
  website: string | null
  dpo_name: string | null
  dpo_email: string | null
  responsible_name: string | null
  responsible_email: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string
  name: string
  role: UserRole
  is_active: boolean
  organization_id: string
  last_login: string | null
  created_at: string
  updated_at: string
}

export interface Department {
  id: string
  name: string
  head_name: string | null
  head_email: string | null
  organization_id: string
  created_at: string
  updated_at: string
}

export interface Committee {
  id: string
  name: string
  objective: string | null
  meeting_frequency: string | null
  constituted_at: string | null
  organization_id: string
  created_at: string
  updated_at: string
}

export interface CommitteeMember {
  id: string
  committee_id: string
  user_id: string
  role_in_committee: CommitteeRole
  joined_at: string
}

export interface DataInventory {
  id: string
  organization_id: string
  department_id: string | null
  data_name: string
  data_description: string | null
  data_category: DataCategory
  titulars_universe: string | null
  purpose: string
  legal_basis: LegalBasis
  legal_basis_detail: string | null
  data_source: string | null
  recipients: string | null
  internal_responsible: string | null
  retention_period: string | null
  platform_system: string | null
  storage_infrastructure: string | null
  international_transfer: boolean
  transfer_country: string | null
  transfer_entity: string | null
  access_areas: string | null
  risk_level: RiskLevel
  notes: string | null
  database_registry_id: string | null
  created_at: string
  updated_at: string
  department?: Department
}

export interface GapAssessment {
  id: string
  organization_id: string
  created_by_id: string
  name: string
  description: string | null
  assessment_date: string
  status: AssessmentStatus
  overall_score: number | null
  overall_risk_level: RiskLevel | null
  findings_summary: string | null
  created_at: string
  updated_at: string
  answers?: GapAnswer[]
  findings?: GapFinding[]
}

export interface GapCategory {
  id: string
  name: string
  description: string | null
  law_reference: string | null
  weight: number
  order: number
  questions?: GapQuestion[]
}

export interface GapQuestion {
  id: string
  category_id: string
  question_text: string
  help_text: string | null
  law_article: string | null
  question_type: QuestionType
  weight: number
  is_mandatory: boolean
  order: number
  category?: GapCategory
}

export interface GapAnswer {
  id: string
  assessment_id: string
  question_id: string
  answered_by_id: string
  answer_value: string | null
  evidence_text: string | null
  evidence_files: string[]
  compliance_level: ComplianceLevel
  answered_at: string
  question?: GapQuestion
}

export interface GapFinding {
  id: string
  assessment_id: string
  category_id: string
  finding_type: FindingType
  description: string
  severity: FindingSeverity
  recommendation: string | null
  status: FindingStatus
  created_at: string
  updated_at: string
}

export interface ActionPlan {
  id: string
  organization_id: string
  assessment_id: string | null
  created_by_id: string
  name: string
  description: string | null
  status: PlanStatus
  start_date: string | null
  target_end_date: string | null
  created_at: string
  updated_at: string
  items?: ActionItem[]
}

export interface ActionItem {
  id: string
  action_plan_id: string
  finding_id: string | null
  responsible_user_id: string | null
  responsible_department_id: string | null
  title: string
  description: string | null
  priority: Priority
  status: ActionStatus
  start_date: string | null
  due_date: string | null
  completed_date: string | null
  completion_percentage: number
  notes: string | null
  created_at: string
  updated_at: string
  responsible_user?: Profile
  responsible_department?: Department
  comments?: ActionItemComment[]
}

export interface ActionItemComment {
  id: string
  action_item_id: string
  user_id: string
  comment_text: string
  created_at: string
  user?: Profile
}

export interface Document {
  id: string
  organization_id: string
  type: DocType
  title: string
  description: string | null
  version: string
  status: DocStatus
  content: string | null
  file_path: string | null
  created_by_id: string
  approved_by_id: string | null
  approved_at: string | null
  valid_until: string | null
  created_at: string
  updated_at: string
}

export interface SubjectRequest {
  id: string
  organization_id: string
  request_type: RequestType
  requester_name: string
  requester_email: string
  requester_rut: string | null
  description: string
  status: RequestStatus
  received_date: string
  due_date: string
  response_date: string | null
  assigned_to_id: string | null
  response_text: string | null
  resolution: RequestResolution | null
  created_at: string
  updated_at: string
  assigned_to?: Profile
  logs?: SubjectRequestLog[]
}

export interface SubjectRequestLog {
  id: string
  request_id: string
  action: string
  performed_by_id: string
  notes: string | null
  performed_at: string
  performed_by?: Profile
}

export interface SecurityBreach {
  id: string
  organization_id: string
  responsible_user_id: string
  detected_date: string
  reported_date: string | null
  description: string
  severity: BreachSeverity
  affected_data_types: string | null
  affected_titulars_count: number | null
  notified_agency: boolean
  agency_notification_date: string | null
  notified_titulars: boolean
  titulars_notification_date: string | null
  corrective_measures: string | null
  status: BreachStatus
  created_at: string
  updated_at: string
  responsible_user?: Profile
  timeline?: BreachTimeline[]
}

export interface BreachTimeline {
  id: string
  breach_id: string
  event_description: string
  event_date: string
  recorded_by_id: string
  evidence_url: string | null
  created_at: string
  recorded_by?: Profile
}

export interface AuditLog {
  id: string
  user_id: string
  action: string
  entity: string
  entity_id: string | null
  details: string | null
  ip_address: string | null
  created_at: string
}

// Supabase Database type helper
export interface Database {
  public: {
    Tables: {
      organizations: { Row: Organization; Insert: Omit<Organization, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<Organization, 'id'>> }
      profiles: { Row: Profile; Insert: Partial<Profile> & Pick<Profile, 'id' | 'email' | 'name' | 'organization_id'>; Update: Partial<Omit<Profile, 'id'>> }
      departments: { Row: Department; Insert: Omit<Department, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<Department, 'id'>> }
      committees: { Row: Committee; Insert: Omit<Committee, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<Committee, 'id'>> }
      committee_members: { Row: CommitteeMember; Insert: Omit<CommitteeMember, 'id'>; Update: Partial<Omit<CommitteeMember, 'id'>> }
      data_inventories: { Row: DataInventory; Insert: Omit<DataInventory, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<DataInventory, 'id'>> }
      gap_assessments: { Row: GapAssessment; Insert: Omit<GapAssessment, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<GapAssessment, 'id'>> }
      gap_categories: { Row: GapCategory; Insert: Omit<GapCategory, 'id'>; Update: Partial<Omit<GapCategory, 'id'>> }
      gap_questions: { Row: GapQuestion; Insert: Omit<GapQuestion, 'id'>; Update: Partial<Omit<GapQuestion, 'id'>> }
      gap_answers: { Row: GapAnswer; Insert: Omit<GapAnswer, 'id'>; Update: Partial<Omit<GapAnswer, 'id'>> }
      gap_findings: { Row: GapFinding; Insert: Omit<GapFinding, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<GapFinding, 'id'>> }
      action_plans: { Row: ActionPlan; Insert: Omit<ActionPlan, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<ActionPlan, 'id'>> }
      action_items: { Row: ActionItem; Insert: Omit<ActionItem, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<ActionItem, 'id'>> }
      action_item_comments: { Row: ActionItemComment; Insert: Omit<ActionItemComment, 'id' | 'created_at'>; Update: Partial<Omit<ActionItemComment, 'id'>> }
      documents: { Row: Document; Insert: Omit<Document, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<Document, 'id'>> }
      subject_requests: { Row: SubjectRequest; Insert: Omit<SubjectRequest, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<SubjectRequest, 'id'>> }
      subject_request_logs: { Row: SubjectRequestLog; Insert: Omit<SubjectRequestLog, 'id'>; Update: Partial<Omit<SubjectRequestLog, 'id'>> }
      security_breaches: { Row: SecurityBreach; Insert: Omit<SecurityBreach, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<SecurityBreach, 'id'>> }
      breach_timelines: { Row: BreachTimeline; Insert: Omit<BreachTimeline, 'id' | 'created_at'>; Update: Partial<Omit<BreachTimeline, 'id'>> }
      audit_logs: { Row: AuditLog; Insert: Omit<AuditLog, 'id' | 'created_at'>; Update: Partial<Omit<AuditLog, 'id'>> }
    }
  }
}
