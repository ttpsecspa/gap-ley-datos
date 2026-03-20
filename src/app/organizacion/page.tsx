"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import {
  Building2,
  Users,
  UserPlus,
  Pencil,
  Trash2,
  Plus,
  Mail,
  Phone,
  Globe,
  MapPin,
  X,
  Save,
  Shield,
} from "lucide-react"

// --- Types ---

interface OrgInfo {
  name: string
  rut: string
  type: "PUBLICA" | "PRIVADA"
  sector: string
  address: string
  website: string
  phone: string
}

interface DPOInfo {
  name: string
  email: string
}

interface Department {
  id: string
  name: string
  head_name: string
  head_email: string
}

interface CommitteeMember {
  id: string
  name: string
  email: string
  role: "PRESIDENTE" | "SECRETARIO" | "MIEMBRO"
}

// --- Mock Data ---

const initialOrgInfo: OrgInfo = {
  name: "Empresa Ejemplo SpA",
  rut: "76.123.456-7",
  type: "PRIVADA",
  sector: "Tecnología",
  address: "Av. Providencia 1234, Piso 8, Providencia, Santiago",
  website: "https://www.empresaejemplo.cl",
  phone: "+56 2 2345 6789",
}

const initialDPO: DPOInfo = {
  name: "María González Fuentes",
  email: "dpo@empresaejemplo.cl",
}

const initialDepartments: Department[] = [
  { id: "1", name: "Tecnología e Informática", head_name: "Carlos Muñoz", head_email: "cmunoz@empresaejemplo.cl" },
  { id: "2", name: "Recursos Humanos", head_name: "Ana Pérez", head_email: "aperez@empresaejemplo.cl" },
  { id: "3", name: "Comercial y Ventas", head_name: "Roberto Silva", head_email: "rsilva@empresaejemplo.cl" },
  { id: "4", name: "Legal y Cumplimiento", head_name: "Patricia Torres", head_email: "ptorres@empresaejemplo.cl" },
]

const initialCommittee: CommitteeMember[] = [
  { id: "1", name: "María González Fuentes", email: "dpo@empresaejemplo.cl", role: "PRESIDENTE" },
  { id: "2", name: "Patricia Torres", email: "ptorres@empresaejemplo.cl", role: "SECRETARIO" },
  { id: "3", name: "Carlos Muñoz", email: "cmunoz@empresaejemplo.cl", role: "MIEMBRO" },
  { id: "4", name: "Ana Pérez", email: "aperez@empresaejemplo.cl", role: "MIEMBRO" },
]

// --- Helpers ---

const roleLabel = (role: string) => {
  switch (role) {
    case "PRESIDENTE": return "Presidente"
    case "SECRETARIO": return "Secretario"
    case "MIEMBRO": return "Miembro"
    default: return role
  }
}

const roleBadgeVariant = (role: string) => {
  switch (role) {
    case "PRESIDENTE": return "default" as const
    case "SECRETARIO": return "warning" as const
    case "MIEMBRO": return "secondary" as const
    default: return "outline" as const
  }
}

// --- Component ---

export default function OrganizacionPage() {
  // Organization info state
  const [orgInfo, setOrgInfo] = useState<OrgInfo>(initialOrgInfo)
  const [editingOrg, setEditingOrg] = useState(false)
  const [orgForm, setOrgForm] = useState<OrgInfo>(initialOrgInfo)

  // DPO state
  const [dpo, setDpo] = useState<DPOInfo>(initialDPO)
  const [editingDPO, setEditingDPO] = useState(false)
  const [dpoForm, setDpoForm] = useState<DPOInfo>(initialDPO)

  // Departments state
  const [departments, setDepartments] = useState<Department[]>(initialDepartments)
  const [editingDept, setEditingDept] = useState<string | null>(null)
  const [deptForm, setDeptForm] = useState<Omit<Department, "id">>({ name: "", head_name: "", head_email: "" })
  const [showAddDept, setShowAddDept] = useState(false)

  // Committee state
  const [committee, setCommittee] = useState<CommitteeMember[]>(initialCommittee)
  const [editingMember, setEditingMember] = useState<string | null>(null)
  const [memberForm, setMemberForm] = useState<Omit<CommitteeMember, "id">>({ name: "", email: "", role: "MIEMBRO" })
  const [showAddMember, setShowAddMember] = useState(false)

  // --- Org handlers ---
  const handleSaveOrg = () => {
    setOrgInfo(orgForm)
    setEditingOrg(false)
  }

  const handleCancelOrg = () => {
    setOrgForm(orgInfo)
    setEditingOrg(false)
  }

  // --- DPO handlers ---
  const handleSaveDPO = () => {
    setDpo(dpoForm)
    setEditingDPO(false)
  }

  const handleCancelDPO = () => {
    setDpoForm(dpo)
    setEditingDPO(false)
  }

  // --- Department handlers ---
  const handleAddDept = () => {
    const newDept: Department = {
      id: String(Date.now()),
      ...deptForm,
    }
    setDepartments([...departments, newDept])
    setDeptForm({ name: "", head_name: "", head_email: "" })
    setShowAddDept(false)
  }

  const handleEditDept = (dept: Department) => {
    setEditingDept(dept.id)
    setDeptForm({ name: dept.name, head_name: dept.head_name, head_email: dept.head_email })
  }

  const handleSaveDept = (id: string) => {
    setDepartments(departments.map((d) => (d.id === id ? { ...d, ...deptForm } : d)))
    setEditingDept(null)
    setDeptForm({ name: "", head_name: "", head_email: "" })
  }

  const handleDeleteDept = (id: string) => {
    setDepartments(departments.filter((d) => d.id !== id))
  }

  // --- Committee handlers ---
  const handleAddMember = () => {
    const newMember: CommitteeMember = {
      id: String(Date.now()),
      ...memberForm,
    }
    setCommittee([...committee, newMember])
    setMemberForm({ name: "", email: "", role: "MIEMBRO" })
    setShowAddMember(false)
  }

  const handleEditMember = (member: CommitteeMember) => {
    setEditingMember(member.id)
    setMemberForm({ name: member.name, email: member.email, role: member.role })
  }

  const handleSaveMember = (id: string) => {
    setCommittee(committee.map((m) => (m.id === id ? { ...m, ...memberForm } : m)))
    setEditingMember(null)
    setMemberForm({ name: "", email: "", role: "MIEMBRO" })
  }

  const handleDeleteMember = (id: string) => {
    setCommittee(committee.filter((m) => m.id !== id))
  }

  // --- Department columns ---
  const deptColumns = [
    {
      key: "name",
      header: "Departamento",
      render: (item: Record<string, unknown>) => {
        const dept = item as unknown as Department
        if (editingDept === dept.id) {
          return (
            <Input
              value={deptForm.name}
              onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
              placeholder="Nombre del departamento"
            />
          )
        }
        return <span className="font-medium text-gray-900">{dept.name}</span>
      },
    },
    {
      key: "head_name",
      header: "Responsable",
      render: (item: Record<string, unknown>) => {
        const dept = item as unknown as Department
        if (editingDept === dept.id) {
          return (
            <Input
              value={deptForm.head_name}
              onChange={(e) => setDeptForm({ ...deptForm, head_name: e.target.value })}
              placeholder="Nombre del responsable"
            />
          )
        }
        return <span className="text-gray-700">{dept.head_name}</span>
      },
    },
    {
      key: "head_email",
      header: "Email",
      render: (item: Record<string, unknown>) => {
        const dept = item as unknown as Department
        if (editingDept === dept.id) {
          return (
            <Input
              type="email"
              value={deptForm.head_email}
              onChange={(e) => setDeptForm({ ...deptForm, head_email: e.target.value })}
              placeholder="Email del responsable"
            />
          )
        }
        return (
          <span className="text-gray-500 flex items-center gap-1">
            <Mail className="h-3.5 w-3.5" />
            {dept.head_email}
          </span>
        )
      },
    },
    {
      key: "actions",
      header: "Acciones",
      className: "w-28 text-right",
      render: (item: Record<string, unknown>) => {
        const dept = item as unknown as Department
        if (editingDept === dept.id) {
          return (
            <div className="flex items-center justify-end gap-1">
              <Button size="sm" variant="ghost" onClick={() => handleSaveDept(dept.id)}>
                <Save className="h-4 w-4 text-green-600" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setEditingDept(null)}>
                <X className="h-4 w-4 text-gray-400" />
              </Button>
            </div>
          )
        }
        return (
          <div className="flex items-center justify-end gap-1">
            <Button size="sm" variant="ghost" onClick={() => handleEditDept(dept)}>
              <Pencil className="h-4 w-4 text-gray-500" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleDeleteDept(dept.id)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <AppShell>
      <Header
        title="Organización"
        subtitle="Información de la organización y estructura de gobernanza"
      />
      <div className="p-6 space-y-6">
        {/* Organization Info + DPO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Organization Info Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  Información de la Organización
                </CardTitle>
                {!editingOrg && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setOrgForm(orgInfo)
                      setEditingOrg(true)
                    }}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {editingOrg ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Razón Social</label>
                      <Input
                        value={orgForm.name}
                        onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">RUT</label>
                      <Input
                        value={orgForm.rut}
                        onChange={(e) => setOrgForm({ ...orgForm, rut: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                      <select
                        className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={orgForm.type}
                        onChange={(e) => setOrgForm({ ...orgForm, type: e.target.value as "PUBLICA" | "PRIVADA" })}
                      >
                        <option value="PUBLICA">Pública</option>
                        <option value="PRIVADA">Privada</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
                      <Input
                        value={orgForm.sector}
                        onChange={(e) => setOrgForm({ ...orgForm, sector: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                    <Textarea
                      value={orgForm.address}
                      onChange={(e) => setOrgForm({ ...orgForm, address: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sitio Web</label>
                      <Input
                        value={orgForm.website}
                        onChange={(e) => setOrgForm({ ...orgForm, website: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                      <Input
                        value={orgForm.phone}
                        onChange={(e) => setOrgForm({ ...orgForm, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={handleCancelOrg}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveOrg}>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Razón Social</p>
                      <p className="text-sm font-medium text-gray-900 mt-0.5">{orgInfo.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">RUT</p>
                      <p className="text-sm font-medium text-gray-900 mt-0.5">{orgInfo.rut}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Tipo</p>
                      <Badge variant={orgInfo.type === "PUBLICA" ? "default" : "secondary"} className="mt-1">
                        {orgInfo.type === "PUBLICA" ? "Pública" : "Privada"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Sector</p>
                      <p className="text-sm font-medium text-gray-900 mt-0.5">{orgInfo.sector}</p>
                    </div>
                  </div>
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {orgInfo.address}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <a href={orgInfo.website} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                        {orgInfo.website}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {orgInfo.phone}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* DPO Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Delegado de Protección de Datos
                </CardTitle>
                {!editingDPO && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setDpoForm(dpo)
                      setEditingDPO(true)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {editingDPO ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                    <Input
                      value={dpoForm.name}
                      onChange={(e) => setDpoForm({ ...dpoForm, name: e.target.value })}
                      placeholder="Nombre del DPO"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <Input
                      type="email"
                      value={dpoForm.email}
                      onChange={(e) => setDpoForm({ ...dpoForm, email: e.target.value })}
                      placeholder="Email del DPO"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={handleCancelDPO}>
                      Cancelar
                    </Button>
                    <Button size="sm" onClick={handleSaveDPO}>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{dpo.name}</p>
                      <p className="text-xs text-gray-500">Delegado de Protección de Datos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a href={`mailto:${dpo.email}`} className="text-blue-600 hover:underline">
                      {dpo.email}
                    </a>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-green-700">
                      El DPO es el responsable de supervisar el cumplimiento de la Ley 21.719 y actúa como punto de contacto
                      con la Agencia de Protección de Datos Personales.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Departments Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-purple-600" />
                Departamentos
              </CardTitle>
              <Button
                size="sm"
                onClick={() => {
                  setDeptForm({ name: "", head_name: "", head_email: "" })
                  setShowAddDept(!showAddDept)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Departamento
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {showAddDept && (
              <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
                <p className="text-sm font-medium text-gray-700">Nuevo Departamento</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    placeholder="Nombre del departamento"
                    value={deptForm.name}
                    onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                  />
                  <Input
                    placeholder="Nombre del responsable"
                    value={deptForm.head_name}
                    onChange={(e) => setDeptForm({ ...deptForm, head_name: e.target.value })}
                  />
                  <Input
                    type="email"
                    placeholder="Email del responsable"
                    value={deptForm.head_email}
                    onChange={(e) => setDeptForm({ ...deptForm, head_email: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowAddDept(false)}>
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAddDept}
                    disabled={!deptForm.name || !deptForm.head_name || !deptForm.head_email}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </Button>
                </div>
              </div>
            )}
            <DataTable
              columns={deptColumns}
              data={departments as unknown as Record<string, unknown>[]}
              emptyMessage="No hay departamentos registrados"
            />
          </CardContent>
        </Card>

        {/* Committee Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-600" />
                Comité de Protección de Datos
              </CardTitle>
              <Button
                size="sm"
                onClick={() => {
                  setMemberForm({ name: "", email: "", role: "MIEMBRO" })
                  setShowAddMember(!showAddMember)
                }}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Agregar Miembro
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {showAddMember && (
              <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
                <p className="text-sm font-medium text-gray-700">Nuevo Miembro del Comité</p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <Input
                    placeholder="Nombre completo"
                    value={memberForm.name}
                    onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={memberForm.email}
                    onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                  />
                  <select
                    className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={memberForm.role}
                    onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value as CommitteeMember["role"] })}
                  >
                    <option value="PRESIDENTE">Presidente</option>
                    <option value="SECRETARIO">Secretario</option>
                    <option value="MIEMBRO">Miembro</option>
                  </select>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={handleAddMember}
                      disabled={!memberForm.name || !memberForm.email}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Guardar
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowAddMember(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Committee member cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {committee.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-gray-500 text-sm">
                  No hay miembros en el comité
                </div>
              ) : (
                committee.map((member) => (
                  <div
                    key={member.id}
                    className="border rounded-lg p-4 hover:shadow-sm transition-shadow bg-white"
                  >
                    {editingMember === member.id ? (
                      <div className="space-y-3">
                        <Input
                          value={memberForm.name}
                          onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                          placeholder="Nombre completo"
                        />
                        <Input
                          type="email"
                          value={memberForm.email}
                          onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                          placeholder="Email"
                        />
                        <select
                          className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={memberForm.role}
                          onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value as CommitteeMember["role"] })}
                        >
                          <option value="PRESIDENTE">Presidente</option>
                          <option value="SECRETARIO">Secretario</option>
                          <option value="MIEMBRO">Miembro</option>
                        </select>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => setEditingMember(null)}>
                            Cancelar
                          </Button>
                          <Button size="sm" onClick={() => handleSaveMember(member.id)}>
                            <Save className="h-4 w-4 mr-2" />
                            Guardar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                            <Users className="h-5 w-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <a href={`mailto:${member.email}`} className="text-xs text-blue-600 hover:underline">
                                {member.email}
                              </a>
                            </div>
                            <Badge variant={roleBadgeVariant(member.role)} className="mt-2 text-[10px]">
                              {roleLabel(member.role)}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEditMember(member)}>
                            <Pencil className="h-4 w-4 text-gray-500" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteMember(member.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
