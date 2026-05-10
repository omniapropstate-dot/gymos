import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ── HELPERS ───────────────────────────────────────────────────
function fechaLegible(f) {
  if (!f) return "—";
  const meses = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  const [y, mo, d] = f.split("-");
  return `${parseInt(d)} ${meses[parseInt(mo)-1]} ${y}`;
}

function Badge({ color, children }) {
  const colores = {
    green:  { bg: "#1a2e1a", text: "#4ade80", border: "#2d4a2d" },
    red:    { bg: "#2e1a1a", text: "#f87171", border: "#4a2d2d" },
    yellow: { bg: "#2e2a1a", text: "#facc15", border: "#4a421d" },
    blue:   { bg: "#1a2235", text: "#60a5fa", border: "#1e3a5f" },
    gray:   { bg: "#1e1e1e", text: "#9ca3af", border: "#2d2d2d" },
  };
  const c = colores[color] || colores.gray;
  return (
    <span style={{
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      padding: "2px 8px", borderRadius: 5, fontSize: 11, fontWeight: 600,
    }}>{children}</span>
  );
}

function KPI({ label, value, sub, color = "#e2e8f0" }) {
  return (
    <div style={{
      background: "#111", border: "1px solid #222", borderRadius: 12,
      padding: "16px 20px", display: "flex", flexDirection: "column", gap: 4,
    }}>
      <span style={{ fontSize: 11, color: "#666", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
      <span style={{ fontSize: 28, fontWeight: 700, color, lineHeight: 1 }}>{value}</span>
      {sub && <span style={{ fontSize: 11, color: "#555" }}>{sub}</span>}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "#555", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>{title}</div>
      {children}
    </div>
  );
}

function Table({ cols, rows, empty = "Sin datos" }) {
  return (
    <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 10, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #1e1e1e" }}>
            {cols.map(c => (
              <th key={c} style={{ padding: "10px 14px", textAlign: "left", color: "#555", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em" }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={cols.length} style={{ padding: "20px 14px", color: "#444", textAlign: "center" }}>{empty}</td></tr>
          ) : rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: i < rows.length - 1 ? "1px solid #1a1a1a" : "none" }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: "10px 14px", color: "#ccc" }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── SECCIONES ─────────────────────────────────────────────────

function Dashboard({ data }) {
  const mes = new Date().getMonth() + 1;
  const anio = new Date().getFullYear();

  const activos   = data.clientes.filter(c => c.estado === "activo").length;
  const vencidos  = data.clientes.filter(c => c.estado === "vencido").length;
  const congelados = data.clientes.filter(c => c.estado === "congelado").length;

  const hoy = new Date();
  const en7 = new Date(); en7.setDate(hoy.getDate() + 7);
  const porVencer = data.clientes.filter(c =>
    c.estado === "activo" &&
    new Date(c.fecha_vencimiento) <= en7 &&
    new Date(c.fecha_vencimiento) >= hoy
  ).length;

  const ingresos  = data.pagos.filter(p => p.mes === mes && p.anio === anio && p.estado === "pagado")
    .reduce((a,b) => a + Number(b.monto), 0);
  const gastos    = data.gastos.filter(g => g.mes === mes && g.anio === anio)
    .reduce((a,b) => a + Number(b.monto), 0);
  const nomina    = data.pagos_personal.filter(p => p.mes === mes && p.anio === anio)
    .reduce((a,b) => a + Number(b.monto), 0);
  const resultado = ingresos - gastos - nomina;

  const equiposFuera = data.equipamiento.filter(e => e.estado !== "operativo").length;

  const chartData = [
    { name: "Ingresos", valor: ingresos, color: "#4ade80" },
    { name: "Gastos", valor: gastos, color: "#f87171" },
    { name: "Nómina", valor: nomina, color: "#facc15" },
  ];

  return (
    <div>
      <Section title="Este mes">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
          <KPI label="Ingresos" value={`Bs. ${ingresos.toLocaleString()}`} color="#4ade80" />
          <KPI label="Gastos" value={`Bs. ${gastos.toLocaleString()}`} color="#f87171" />
          <KPI label="Nómina" value={`Bs. ${nomina.toLocaleString()}`} color="#facc15" />
          <KPI label="Resultado" value={`Bs. ${resultado.toLocaleString()}`} color={resultado >= 0 ? "#4ade80" : "#f87171"} />
        </div>
      </Section>

      <Section title="Clientes">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10 }}>
          <KPI label="Activos" value={activos} color="#4ade80" />
          <KPI label="Vencidos" value={vencidos} color="#f87171" />
          <KPI label="Congelados" value={congelados} color="#60a5fa" />
          <KPI label="Vencen en 7 días" value={porVencer} color="#facc15" />
        </div>
      </Section>

      <Section title="Finanzas del mes">
        <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 10, padding: "16px 8px" }}>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData} margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: "#666", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#555", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "#999" }}
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
              />
              <Bar dataKey="valor" radius={[4,4,0,0]}>
                {chartData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Section>

      {equiposFuera > 0 && (
        <div style={{
          background: "#2e1a1a", border: "1px solid #4a2d2d", borderRadius: 10,
          padding: "12px 16px", color: "#f87171", fontSize: 13,
        }}>
          ⚠️ {equiposFuera} equipo{equiposFuera > 1 ? "s" : ""} fuera de servicio o en revisión
        </div>
      )}
    </div>
  );
}

function Clientes({ data }) {
  const [filtro, setFiltro] = useState("todos");
  const filtrados = filtro === "todos" ? data.clientes : data.clientes.filter(c => c.estado === filtro);
  const estadoColor = { activo: "green", vencido: "red", congelado: "blue" };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {["todos","activo","vencido","congelado"].map(f => (
          <button key={f} onClick={() => setFiltro(f)} style={{
            padding: "6px 14px", borderRadius: 7, border: "1px solid",
            borderColor: filtro === f ? "#e2e8f0" : "#2d2d2d",
            background: filtro === f ? "#e2e8f0" : "transparent",
            color: filtro === f ? "#0a0a0a" : "#666",
            fontSize: 12, fontWeight: 500, cursor: "pointer",
          }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
        ))}
      </div>
      <Table
        cols={["Nombre", "Plan", "Monto", "Próximo pago", "Estado"]}
        rows={filtrados.map(c => [
          c.nombre,
          c.plan,
          c.monto_plan ? `Bs. ${c.monto_plan}` : "—",
          fechaLegible(c.fecha_vencimiento),
          <Badge color={estadoColor[c.estado]}>{c.estado}</Badge>
        ])}
        empty="No hay clientes"
      />
    </div>
  );
}

function Personal({ data }) {
  return (
    <Table
      cols={["Nombre", "Rol", "Tipo pago", "Monto", "Turno"]}
      rows={data.personal.filter(p => p.activo).map(p => [
        p.nombre,
        p.rol,
        p.tipo_pago,
        `Bs. ${p.monto}`,
        p.turno || "—",
      ])}
      empty="No hay personal registrado"
    />
  );
}

function Equipamiento({ data }) {
  const estadoColor = { operativo: "green", en_revision: "yellow", fuera_de_servicio: "red" };
  return (
    <Table
      cols={["Equipo", "Estado", "Última revisión", "Notas"]}
      rows={data.equipamiento.map(e => [
        e.nombre,
        <Badge color={estadoColor[e.estado]}>{e.estado.replace("_"," ")}</Badge>,
        fechaLegible(e.fecha_ultima_revision),
        e.notas || "—",
      ])}
      empty="No hay equipamiento registrado"
    />
  );
}

function Finanzas({ data }) {
  const mes = new Date().getMonth() + 1;
  const anio = new Date().getFullYear();

  const pagosDelMes = data.pagos.filter(p => p.mes === mes && p.anio === anio);
  const gastosDelMes = data.gastos.filter(g => g.mes === mes && g.anio === anio);

  return (
    <div>
      <Section title="Pagos de clientes este mes">
        <Table
          cols={["Cliente", "Monto", "Fecha", "Estado"]}
          rows={pagosDelMes.map(p => {
            const cliente = data.clientes.find(c => c.id === p.cliente_id);
            return [
              cliente?.nombre || "—",
              `Bs. ${p.monto}`,
              fechaLegible(p.fecha_pago),
              <Badge color={p.estado === "pagado" ? "green" : "yellow"}>{p.estado}</Badge>
            ];
          })}
          empty="Sin pagos este mes"
        />
      </Section>
      <Section title="Gastos operativos este mes">
        <Table
          cols={["Concepto", "Categoría", "Monto", "Fecha"]}
          rows={gastosDelMes.map(g => [
            g.concepto,
            g.categoria,
            `Bs. ${g.monto}`,
            fechaLegible(g.fecha),
          ])}
          empty="Sin gastos registrados"
        />
      </Section>
    </div>
  );
}

// ── APP PRINCIPAL ─────────────────────────────────────────────
const NAV = [
  { id: "dashboard",    label: "Resumen" },
  { id: "clientes",     label: "Clientes" },
  { id: "personal",     label: "Personal" },
  { id: "equipamiento", label: "Equipamiento" },
  { id: "finanzas",     label: "Finanzas" },
];

export default function App() {
  const [tab, setTab]   = useState("dashboard");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargar() {
      const [c, p, per, pp, cl, g, e] = await Promise.all([
        supabase.from("clientes").select("*").order("created_at", { ascending: false }),
        supabase.from("pagos").select("*").order("created_at", { ascending: false }),
        supabase.from("personal").select("*").order("nombre"),
        supabase.from("pagos_personal").select("*"),
        supabase.from("clases").select("*,personal(nombre)").eq("activa", true),
        supabase.from("gastos").select("*").order("fecha", { ascending: false }),
        supabase.from("equipamiento").select("*").order("nombre"),
      ]);
      setData({
        clientes:       c.data || [],
        pagos:          p.data || [],
        personal:       per.data || [],
        pagos_personal: pp.data || [],
        clases:         cl.data || [],
        gastos:         g.data || [],
        equipamiento:   e.data || [],
      });
      setLoading(false);
    }
    cargar();
  }, []);

  const secciones = { dashboard: Dashboard, clientes: Clientes, personal: Personal, equipamiento: Equipamiento, finanzas: Finanzas };
  const Seccion = secciones[tab];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#e2e8f0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* HEADER */}
      <div style={{ borderBottom: "1px solid #1a1a1a", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 52 }}>
        <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.5px" }}>
          Gym<span style={{ background: "#c9f23e", color: "#0a0a0a", padding: "1px 4px", borderRadius: 3 }}>OS</span>
        </div>
        <div style={{ fontSize: 11, color: "#444" }}>
          {new Date().toLocaleDateString("es-BO", { weekday: "long", day: "numeric", month: "long" })}
        </div>
      </div>

      {/* NAV */}
      <div style={{ borderBottom: "1px solid #1a1a1a", padding: "0 24px", display: "flex", gap: 0, overflowX: "auto" }}>
        {NAV.map(n => (
          <button key={n.id} onClick={() => setTab(n.id)} style={{
            padding: "12px 16px", background: "none", border: "none",
            borderBottom: tab === n.id ? "2px solid #c9f23e" : "2px solid transparent",
            color: tab === n.id ? "#c9f23e" : "#555",
            fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap",
            transition: "color 0.15s",
          }}>{n.label}</button>
        ))}
      </div>

      {/* CONTENIDO */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 20px" }}>
        {loading ? (
          <div style={{ color: "#444", textAlign: "center", paddingTop: 60, fontSize: 13 }}>Cargando datos...</div>
        ) : (
          <Seccion data={data} />
        )}
      </div>
    </div>
  );
}
