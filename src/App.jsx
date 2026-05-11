// ════════════════════════════════════════════════════════════════
// GYMOS DASHBOARD — App.jsx
// Sistema de gestión visual de gimnasios — Dashboard BI móvil-first
//
// Características:
//   ✓ Login con Supabase Auth
//   ✓ Layout app-like con tabs inferiores
//   ✓ 4 secciones: Inicio, Clientes, Finanzas, Operación
//   ✓ Movimiento ambiental constante (fondo animado, partículas, glow)
//   ✓ Filtros de período por tab
//   ✓ Glassmorphism y animaciones suaves
//   ✓ Optimizado para celular
//
// ════════════════════════════════════════════════════════════════

import { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid,
  Legend,
} from "recharts";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);


// ════════════════════════════════════════════════════════════════
// PALETA DE COLORES Y CONSTANTES
// ════════════════════════════════════════════════════════════════

const COLORS = {
  bg:        "#0a0a0a",
  bgCard:    "#111",
  bgCard2:   "#161616",
  border:    "#1e1e1e",
  border2:   "#2a2a2a",
  text:      "#e2e8f0",
  textMuted: "#888",
  textDim:   "#555",
  accent:    "#c9f23e",
  green:     "#4ade80",
  red:       "#f87171",
  yellow:    "#fbbf24",
  blue:      "#60a5fa",
  purple:    "#a78bfa",
  orange:    "#fb923c",
  pink:      "#f472b6",
};


// ════════════════════════════════════════════════════════════════
// HELPERS DE FECHA Y FORMATO
// ════════════════════════════════════════════════════════════════

function fechaLegibleCorta(f) {
  if (!f) return "—";
  const meses = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  const [y, mo, d] = f.split("-");
  return `${parseInt(d)} ${meses[parseInt(mo)-1]}`;
}

function fmt(n) {
  return Number(n || 0).toLocaleString("es-BO");
}

function fmtMoneda(n) {
  return `Bs. ${fmt(n)}`;
}

function rangoFechas(periodo) {
  const hoy = new Date();
  const desde = new Date();
  switch (periodo) {
    case "hoy":      desde.setHours(0,0,0,0); break;
    case "semana":   desde.setDate(hoy.getDate() - 7); break;
    case "mes":      desde.setDate(1); break;
    case "3meses":   desde.setMonth(hoy.getMonth() - 3); break;
    case "anio":     desde.setMonth(0); desde.setDate(1); break;
    default:         desde.setDate(1);
  }
  return {
    desde: desde.toISOString().split("T")[0],
    hasta: hoy.toISOString().split("T")[0],
  };
}


// ════════════════════════════════════════════════════════════════
// FONDO ANIMADO — movimiento ambiental constante
// ════════════════════════════════════════════════════════════════

function FondoAnimado() {
  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      pointerEvents: "none",
      zIndex: 0,
      overflow: "hidden",
    }}>
      {/* Gradiente que se mueve lentamente */}
      <div style={{
        position: "absolute",
        top: "-50%", left: "-50%",
        width: "200%", height: "200%",
        background: `radial-gradient(circle at 30% 40%, rgba(201,242,62,0.06), transparent 50%),
                     radial-gradient(circle at 70% 60%, rgba(96,165,250,0.04), transparent 50%),
                     radial-gradient(circle at 50% 80%, rgba(167,139,250,0.03), transparent 50%)`,
        animation: "fondoMover 25s ease-in-out infinite",
      }} />

      {/* Partículas flotantes */}
      {[...Array(15)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: 2 + Math.random() * 3,
          height: 2 + Math.random() * 3,
          background: i % 3 === 0 ? COLORS.accent : i % 3 === 1 ? COLORS.blue : COLORS.purple,
          borderRadius: "50%",
          opacity: 0.15 + Math.random() * 0.25,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `flotar${i % 3} ${15 + Math.random() * 20}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 5}s`,
          boxShadow: `0 0 ${4 + Math.random() * 6}px currentColor`,
        }} />
      ))}

      {/* Línea de "respiración" abajo */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: 1,
        background: `linear-gradient(90deg, transparent, ${COLORS.accent}40, transparent)`,
        animation: "lineaRespira 4s ease-in-out infinite",
      }} />
    </div>
  );
}


// ════════════════════════════════════════════════════════════════
// ESTILOS GLOBALES (animaciones CSS)
// ════════════════════════════════════════════════════════════════

const ESTILOS_GLOBALES = `
  @keyframes fondoMover {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    33% { transform: translate(5%, -3%) rotate(2deg); }
    66% { transform: translate(-3%, 5%) rotate(-2deg); }
  }
  @keyframes flotar0 {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(30px, -40px); }
  }
  @keyframes flotar1 {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(-30px, 30px); }
  }
  @keyframes flotar2 {
    0%, 100% { transform: translate(0, 0); }
    33% { transform: translate(20px, -20px); }
    66% { transform: translate(-20px, 20px); }
  }
  @keyframes lineaRespira {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }
  @keyframes pulso {
    0%, 100% { box-shadow: 0 0 0 0 rgba(201,242,62,0.4); }
    50% { box-shadow: 0 0 0 10px rgba(201,242,62,0); }
  }
  @keyframes pulsoRojo {
    0%, 100% { box-shadow: 0 0 0 0 rgba(248,113,113,0.5); }
    50% { box-shadow: 0 0 0 8px rgba(248,113,113,0); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes contarNumero {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes glow {
    0%, 100% { filter: drop-shadow(0 0 4px rgba(201,242,62,0.3)); }
    50% { filter: drop-shadow(0 0 12px rgba(201,242,62,0.6)); }
  }

  * { box-sizing: border-box; }
  body { margin: 0; background: #0a0a0a; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }

  /* Hover táctil */
  .tap-feedback:active {
    transform: scale(0.97);
    transition: transform 0.1s;
  }
`;


// ════════════════════════════════════════════════════════════════
// PANTALLA DE LOGIN
// ════════════════════════════════════════════════════════════════

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function entrar() {
    setError(null);
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Email o contraseña incorrectos");
    } else {
      onLogin(data.user);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: COLORS.bg,
      color: COLORS.text,
      fontFamily: "'DM Sans',system-ui,sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      position: "relative",
    }}>
      <FondoAnimado />

      <div style={{
        background: "rgba(17,17,17,0.6)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${COLORS.border2}`,
        borderRadius: 20,
        padding: 32,
        width: "100%",
        maxWidth: 380,
        position: "relative",
        zIndex: 1,
        animation: "fadeInUp 0.5s ease-out",
      }}>
        {/* Logo */}
        <div style={{
          textAlign: "center",
          marginBottom: 28,
        }}>
          <div style={{
            fontSize: 36,
            fontWeight: 900,
            letterSpacing: "-1.5px",
            animation: "glow 3s ease-in-out infinite",
          }}>
            Gym<span style={{
              background: COLORS.accent,
              color: COLORS.bg,
              padding: "2px 8px",
              borderRadius: 6,
            }}>OS</span>
          </div>
          <p style={{
            color: COLORS.textMuted,
            fontSize: 13,
            margin: 0,
            marginTop: 6,
          }}>
            Sistema integral de gestión
          </p>
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{
              display: "block",
              fontSize: 11,
              color: COLORS.textMuted,
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              fontWeight: 600,
            }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@gymos.com"
              style={{
                width: "100%",
                padding: "12px 14px",
                background: COLORS.bg,
                border: `1px solid ${COLORS.border2}`,
                borderRadius: 10,
                color: COLORS.text,
                fontSize: 14,
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = COLORS.accent}
              onBlur={e => e.target.style.borderColor = COLORS.border2}
            />
          </div>

          <div>
            <label style={{
              display: "block",
              fontSize: 11,
              color: COLORS.textMuted,
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              fontWeight: 600,
            }}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e => e.key === "Enter" && entrar()}
              style={{
                width: "100%",
                padding: "12px 14px",
                background: COLORS.bg,
                border: `1px solid ${COLORS.border2}`,
                borderRadius: 10,
                color: COLORS.text,
                fontSize: 14,
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = COLORS.accent}
              onBlur={e => e.target.style.borderColor = COLORS.border2}
            />
          </div>

          {error && (
            <div style={{
              background: "rgba(248,113,113,0.08)",
              border: "1px solid rgba(248,113,113,0.25)",
              borderRadius: 10,
              padding: "10px 12px",
              color: COLORS.red,
              fontSize: 12,
              animation: "fadeIn 0.3s",
            }}>{error}</div>
          )}

          <button
            onClick={entrar}
            disabled={loading || !email || !password}
            className="tap-feedback"
            style={{
              padding: "13px",
              background: loading || !email || !password ? COLORS.border2 : COLORS.accent,
              color: COLORS.bg,
              border: "none",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              cursor: loading || !email || !password ? "not-allowed" : "pointer",
              marginTop: 8,
              letterSpacing: "0.5px",
              transition: "all 0.2s",
            }}
          >
            {loading ? "Verificando..." : "Entrar"}
          </button>
        </div>

        <p style={{
          textAlign: "center",
          marginTop: 24,
          fontSize: 11,
          color: COLORS.textDim,
        }}>
          Acceso restringido al administrador
        </p>
      </div>
    </div>
  );
}


// ════════════════════════════════════════════════════════════════
// COMPONENTES REUTILIZABLES
// ════════════════════════════════════════════════════════════════

// KPI animado — el número sube de 0 al valor real al cargar
function NumeroAnimado({ valor, formato = "numero", duracion = 800 }) {
  const [actual, setActual] = useState(0);
  const objetivoRef = useRef(valor);

  useEffect(() => {
    objetivoRef.current = valor;
    const inicio = Date.now();
    const valInicial = actual;
    const delta = valor - valInicial;

    const animar = () => {
      const t = Math.min(1, (Date.now() - inicio) / duracion);
      const ease = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setActual(valInicial + delta * ease);
      if (t < 1) requestAnimationFrame(animar);
    };
    requestAnimationFrame(animar);
  }, [valor]);

  if (formato === "moneda") return `Bs. ${fmt(Math.round(actual))}`;
  return fmt(Math.round(actual));
}

// KPI Card — con glassmorphism y animación
function KPI({ label, valor, sub, color = COLORS.accent, icono, alerta, delay = 0, formato = "numero" }) {
  return (
    <div className="tap-feedback" style={{
      background: `linear-gradient(135deg, rgba(17,17,17,0.7), rgba(22,22,22,0.5))`,
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      border: `1px solid ${COLORS.border}`,
      borderRadius: 16,
      padding: "16px 16px 14px",
      position: "relative",
      overflow: "hidden",
      animation: `fadeInUp 0.5s ease-out ${delay}s both`,
      cursor: "pointer",
    }}>
      {/* Línea de color arriba */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: 2,
        background: color,
        boxShadow: `0 0 8px ${color}80`,
      }} />

      {/* Punto pulsante si hay alerta */}
      {alerta && (
        <div style={{
          position: "absolute",
          top: 12, right: 12,
          width: 8, height: 8,
          background: COLORS.red,
          borderRadius: "50%",
          animation: "pulsoRojo 1.5s infinite",
        }} />
      )}

      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        marginBottom: 8,
      }}>
        {icono && <span style={{ fontSize: 13 }}>{icono}</span>}
        <span style={{
          fontSize: 10,
          color: COLORS.textMuted,
          textTransform: "uppercase",
          letterSpacing: "0.7px",
          fontWeight: 600,
        }}>{label}</span>
      </div>

      <div style={{
        fontSize: 24,
        fontWeight: 800,
        color,
        lineHeight: 1.1,
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: "-0.5px",
      }}>
        <NumeroAnimado valor={valor} formato={formato} />
      </div>

      {sub && (
        <div style={{
          marginTop: 4,
          fontSize: 11,
          color: COLORS.textDim,
        }}>{sub}</div>
      )}
    </div>
  );
}

// Tarjeta contenedora
function Card({ titulo, accion, children, delay = 0 }) {
  return (
    <div style={{
      background: "rgba(17,17,17,0.6)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      border: `1px solid ${COLORS.border}`,
      borderRadius: 16,
      padding: 16,
      marginBottom: 14,
      animation: `fadeInUp 0.5s ease-out ${delay}s both`,
    }}>
      {(titulo || accion) && (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}>
          {titulo && (
            <span style={{
              fontSize: 11,
              color: COLORS.accent,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}>{titulo}</span>
          )}
          {accion}
        </div>
      )}
      {children}
    </div>
  );
}

// Selector de período
function SelectorPeriodo({ valor, onChange }) {
  const opciones = [
    { id: "hoy",     label: "Hoy" },
    { id: "semana",  label: "Semana" },
    { id: "mes",     label: "Mes" },
    { id: "3meses",  label: "3 meses" },
    { id: "anio",    label: "Año" },
  ];

  return (
    <div style={{
      display: "flex",
      gap: 4,
      background: COLORS.bg,
      padding: 3,
      borderRadius: 9,
      border: `1px solid ${COLORS.border}`,
      marginBottom: 16,
      overflowX: "auto",
    }}>
      {opciones.map(op => (
        <button
          key={op.id}
          onClick={() => onChange(op.id)}
          className="tap-feedback"
          style={{
            padding: "6px 12px",
            background: valor === op.id ? COLORS.accent : "transparent",
            color: valor === op.id ? COLORS.bg : COLORS.textMuted,
            border: "none",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
            transition: "all 0.2s",
            flex: 1,
          }}
        >
          {op.label}
        </button>
      ))}
    </div>
  );
}

// Badge
function Badge({ color = "gray", children }) {
  const colores = {
    green:  { bg: "rgba(74,222,128,0.12)", text: COLORS.green },
    red:    { bg: "rgba(248,113,113,0.12)", text: COLORS.red },
    yellow: { bg: "rgba(251,191,36,0.12)", text: COLORS.yellow },
    blue:   { bg: "rgba(96,165,250,0.12)", text: COLORS.blue },
    purple: { bg: "rgba(167,139,250,0.12)", text: COLORS.purple },
    gray:   { bg: "rgba(120,120,120,0.12)", text: COLORS.textMuted },
  };
  const c = colores[color];
  return (
    <span style={{
      background: c.bg,
      color: c.text,
      padding: "2px 8px",
      borderRadius: 5,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.3px",
    }}>{children}</span>
  );
}

// Tooltip personalizado para los gráficos
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: "rgba(17,17,17,0.95)",
      border: `1px solid ${COLORS.border2}`,
      borderRadius: 8,
      padding: "8px 12px",
      fontSize: 11,
      backdropFilter: "blur(10px)",
    }}>
      {label && <div style={{ color: COLORS.textMuted, marginBottom: 4 }}>{label}</div>}
      {payload.map((entry, i) => (
        <div key={i} style={{ color: entry.color, fontWeight: 600 }}>
          {entry.name}: {fmt(entry.value)}
        </div>
      ))}
    </div>
  );
}

// Indicador de carga
function Cargando() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 60,
      gap: 12,
    }}>
      <div style={{
        width: 32,
        height: 32,
        border: `3px solid ${COLORS.border2}`,
        borderTopColor: COLORS.accent,
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <span style={{ fontSize: 12, color: COLORS.textMuted }}>Cargando datos...</span>
    </div>
  );
}

// Empty state
function Vacio({ icono = "📭", mensaje }) {
  return (
    <div style={{
      textAlign: "center",
      padding: "30px 20px",
      color: COLORS.textDim,
      fontSize: 13,
      animation: "fadeIn 0.4s",
    }}>
      <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.5 }}>{icono}</div>
      <div>{mensaje}</div>
    </div>
  );
}


// ════════════════════════════════════════════════════════════════
// SECCIÓN 1: INICIO
// ════════════════════════════════════════════════════════════════

function SeccionInicio({ data, periodo, setPeriodo }) {
  const { desde, hasta } = rangoFechas(periodo);

  // Cálculos
  const clientesActivos = data.clientes.filter(c => c.estado === "activo").length;
  const clientesVencidos = data.clientes.filter(c => c.estado === "vencido").length;
  const clientesCongelados = data.clientes.filter(c => c.estado === "congelado").length;

  const hoy = new Date();
  const en7 = new Date(); en7.setDate(hoy.getDate() + 7);
  const porVencer = data.clientes.filter(c =>
    c.estado === "activo" &&
    new Date(c.fecha_vencimiento) <= en7 &&
    new Date(c.fecha_vencimiento) >= hoy
  );

  const pagosPeriodo = data.pagos.filter(p =>
    p.fecha_pago >= desde && p.fecha_pago <= hasta && p.estado === "pagado"
  );
  const gastosPeriodo = data.gastos.filter(g =>
    g.fecha >= desde && g.fecha <= hasta
  );
  const nominaPeriodo = data.pagos_personal.filter(n => {
    // Filtrar por mes/año
    const fechaPeriodo = new Date(desde);
    return n.mes === fechaPeriodo.getMonth() + 1 && n.anio === fechaPeriodo.getFullYear();
  });

  const ingresos = pagosPeriodo.reduce((a, b) => a + Number(b.monto), 0);
  const gastos = gastosPeriodo.reduce((a, b) => a + Number(b.monto), 0);
  const nomina = nominaPeriodo.reduce((a, b) => a + Number(b.monto), 0);
  const resultado = ingresos - gastos - nomina;

  const equiposFuera = data.equipamiento.filter(e => e.estado !== "operativo").length;

  // Datos para mini gráfico (últimos 7 días de ingresos)
  const ultimosDias = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const fecha = d.toISOString().split("T")[0];
    const totalDia = data.pagos
      .filter(p => p.fecha_pago === fecha && p.estado === "pagado")
      .reduce((a, b) => a + Number(b.monto), 0);
    return {
      dia: d.toLocaleDateString("es-BO", { weekday: "short" }).slice(0, 2),
      monto: totalDia,
    };
  });

  return (
    <div style={{ padding: "16px 16px 100px", animation: "fadeIn 0.4s" }}>

      {/* Header con saludo */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{
          fontSize: 22,
          fontWeight: 800,
          margin: 0,
          letterSpacing: "-0.5px",
        }}>Resumen general</h1>
        <p style={{
          margin: 0,
          marginTop: 4,
          fontSize: 12,
          color: COLORS.textMuted,
        }}>
          {new Date().toLocaleDateString("es-BO", {
            weekday: "long", day: "numeric", month: "long"
          })}
        </p>
      </div>

      {/* Selector */}
      <SelectorPeriodo valor={periodo} onChange={setPeriodo} />

      {/* KPIs financieros */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10,
        marginBottom: 14,
      }}>
        <KPI label="Ingresos" valor={ingresos} formato="moneda" color={COLORS.green} icono="💵" delay={0.0} />
        <KPI label="Gastos" valor={gastos + nomina} formato="moneda" color={COLORS.red} icono="📤" delay={0.05} />
      </div>

      {/* Resultado destacado */}
      <div style={{
        background: `linear-gradient(135deg, rgba(17,17,17,0.7), rgba(${resultado >= 0 ? "74,222,128" : "248,113,113"},0.08))`,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: `1px solid ${resultado >= 0 ? "rgba(74,222,128,0.25)" : "rgba(248,113,113,0.25)"}`,
        borderRadius: 16,
        padding: 20,
        marginBottom: 14,
        textAlign: "center",
        animation: `fadeInUp 0.5s ease-out 0.1s both, ${resultado >= 0 ? "pulso" : "pulsoRojo"} 3s infinite`,
      }}>
        <div style={{
          fontSize: 10,
          color: COLORS.textMuted,
          textTransform: "uppercase",
          letterSpacing: "1px",
          fontWeight: 600,
          marginBottom: 4,
        }}>Resultado del período</div>
        <div style={{
          fontSize: 32,
          fontWeight: 900,
          color: resultado >= 0 ? COLORS.green : COLORS.red,
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "-1px",
        }}>
          <NumeroAnimado valor={resultado} formato="moneda" />
        </div>
      </div>

      {/* Mini gráfico de ingresos */}
      <Card titulo="Ingresos últimos 7 días" delay={0.15}>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={ultimosDias} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
            <defs>
              <linearGradient id="gradIng" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.accent} stopOpacity={0.4}/>
                <stop offset="100%" stopColor={COLORS.accent} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="dia" tick={{ fill: COLORS.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: COLORS.textDim, fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="monto" stroke={COLORS.accent} strokeWidth={2} fill="url(#gradIng)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Estado de clientes */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 10,
        marginBottom: 14,
      }}>
        <KPI label="Activos" valor={clientesActivos} color={COLORS.green} icono="✓" delay={0.2} />
        <KPI label="Por vencer" valor={porVencer.length} color={COLORS.yellow} icono="⏰" alerta={porVencer.length > 3} delay={0.25} />
        <KPI label="Vencidos" valor={clientesVencidos} color={COLORS.red} icono="✗" alerta={clientesVencidos > 0} delay={0.3} />
        <KPI label="Congelados" valor={clientesCongelados} color={COLORS.blue} icono="❄" delay={0.35} />
      </div>

      {/* Alerta de equipamiento si hace falta */}
      {equiposFuera > 0 && (
        <div style={{
          background: "rgba(248,113,113,0.06)",
          border: "1px solid rgba(248,113,113,0.25)",
          borderRadius: 12,
          padding: "12px 14px",
          color: COLORS.red,
          fontSize: 12,
          marginBottom: 14,
          animation: "slideInRight 0.4s ease-out",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <span><strong>{equiposFuera} equipo{equiposFuera > 1 ? "s" : ""}</strong> necesita{equiposFuera > 1 ? "n" : ""} atención</span>
        </div>
      )}

      {/* Próximos vencimientos */}
      {porVencer.length > 0 && (
        <Card titulo="⏰ Próximos vencimientos" delay={0.4}>
          {porVencer.slice(0, 5).map(c => (
            <div key={c.id} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom: `1px solid ${COLORS.border}`,
            }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{c.nombre}</span>
              <Badge color="yellow">{fechaLegibleCorta(c.fecha_vencimiento)}</Badge>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}


// ════════════════════════════════════════════════════════════════
// SECCIÓN 2: CLIENTES
// ════════════════════════════════════════════════════════════════

function SeccionClientes({ data }) {
  const [filtro, setFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  const totales = {
    activo: data.clientes.filter(c => c.estado === "activo").length,
    vencido: data.clientes.filter(c => c.estado === "vencido").length,
    congelado: data.clientes.filter(c => c.estado === "congelado").length,
  };

  let filtrados = filtro === "todos"
    ? data.clientes
    : data.clientes.filter(c => c.estado === filtro);

  if (busqueda) {
    filtrados = filtrados.filter(c =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
  }

  // Distribución por plan
  const porPlan = {};
  data.clientes.forEach(c => {
    porPlan[c.plan] = (porPlan[c.plan] || 0) + 1;
  });
  const datosPlan = Object.entries(porPlan).map(([nombre, valor]) => ({ nombre, valor }));

  // Pie chart de estados
  const datosEstado = [
    { name: "Activos", value: totales.activo, color: COLORS.green },
    { name: "Vencidos", value: totales.vencido, color: COLORS.red },
    { name: "Congelados", value: totales.congelado, color: COLORS.blue },
  ].filter(d => d.value > 0);

  const estadoColor = { activo: "green", vencido: "red", congelado: "blue" };

  return (
    <div style={{ padding: "16px 16px 100px", animation: "fadeIn 0.4s" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, marginBottom: 4, letterSpacing: "-0.5px" }}>Clientes</h1>
      <p style={{ margin: 0, marginBottom: 20, fontSize: 12, color: COLORS.textMuted }}>
        {data.clientes.length} total · {totales.activo} activos
      </p>

      {/* KPIs por estado */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 14 }}>
        <KPI label="Activos" valor={totales.activo} color={COLORS.green} delay={0} />
        <KPI label="Vencidos" valor={totales.vencido} color={COLORS.red} delay={0.05} />
        <KPI label="Congelados" valor={totales.congelado} color={COLORS.blue} delay={0.1} />
      </div>

      {/* Distribución por estado (pie) */}
      {datosEstado.length > 0 && (
        <Card titulo="Distribución por estado" delay={0.15}>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={datosEstado}
                cx="50%" cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
                animationDuration={800}
              >
                {datosEstado.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                wrapperStyle={{ fontSize: 11, color: COLORS.textMuted }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Distribución por plan */}
      {datosPlan.length > 0 && (
        <Card titulo="Clientes por plan" delay={0.2}>
          <ResponsiveContainer width="100%" height={Math.max(120, datosPlan.length * 32)}>
            <BarChart data={datosPlan} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
              <XAxis type="number" tick={{ fill: COLORS.textDim, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="nombre" tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
              <Bar dataKey="valor" fill={COLORS.accent} radius={[0, 6, 6, 0]} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Buscador */}
      <input
        type="text"
        placeholder="🔍 Buscar cliente..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 14px",
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 10,
          color: COLORS.text,
          fontSize: 13,
          outline: "none",
          marginBottom: 12,
        }}
      />

      {/* Filtros */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12, overflowX: "auto" }}>
        {["todos", "activo", "vencido", "congelado"].map(f => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className="tap-feedback"
            style={{
              padding: "6px 14px",
              borderRadius: 7,
              border: `1px solid ${filtro === f ? COLORS.accent : COLORS.border2}`,
              background: filtro === f ? COLORS.accent : "transparent",
              color: filtro === f ? COLORS.bg : COLORS.textMuted,
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.2s",
            }}
          >
            {f === "todos" ? "Todos" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Lista de clientes */}
      <Card delay={0.25}>
        {filtrados.length === 0 ? (
          <Vacio icono="👥" mensaje="No hay clientes con ese filtro" />
        ) : (
          filtrados.slice(0, 50).map((c, i) => (
            <div key={c.id} className="tap-feedback" style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 0",
              borderBottom: i < Math.min(filtrados.length, 50) - 1 ? `1px solid ${COLORS.border}` : "none",
              cursor: "pointer",
              animation: `fadeInUp 0.3s ease-out ${i * 0.02}s both`,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: COLORS.text,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>{c.nombre}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>
                  {c.plan} · vence {fechaLegibleCorta(c.fecha_vencimiento)}
                </div>
              </div>
              <Badge color={estadoColor[c.estado]}>{c.estado}</Badge>
            </div>
          ))
        )}
        {filtrados.length > 50 && (
          <div style={{
            textAlign: "center",
            padding: "12px 0 0",
            fontSize: 11,
            color: COLORS.textDim,
          }}>
            Mostrando 50 de {filtrados.length} · Usá el buscador para encontrar uno específico
          </div>
        )}
      </Card>
    </div>
  );
}


// ════════════════════════════════════════════════════════════════
// SECCIÓN 3: FINANZAS
// ════════════════════════════════════════════════════════════════

function SeccionFinanzas({ data, periodo, setPeriodo }) {
  const { desde, hasta } = rangoFechas(periodo);
  const [tipoGrafico, setTipoGrafico] = useState("area"); // area | barras

  const pagosPeriodo = data.pagos.filter(p =>
    p.fecha_pago >= desde && p.fecha_pago <= hasta && p.estado === "pagado"
  );
  const gastosPeriodo = data.gastos.filter(g => g.fecha >= desde && g.fecha <= hasta);

  // Filtrar nómina por mes del período
  const mesPeriodo = parseInt(desde.split("-")[1]);
  const anioPeriodo = parseInt(desde.split("-")[0]);
  const nominaPeriodo = data.pagos_personal.filter(n =>
    n.mes === mesPeriodo && n.anio === anioPeriodo
  );

  const ingresos = pagosPeriodo.reduce((a, b) => a + Number(b.monto), 0);
  const gastos = gastosPeriodo.reduce((a, b) => a + Number(b.monto), 0);
  const nomina = nominaPeriodo.reduce((a, b) => a + Number(b.monto), 0);
  const resultado = ingresos - gastos - nomina;

  // Gastos por categoría
  const porCategoria = {};
  gastosPeriodo.forEach(g => {
    porCategoria[g.categoria] = (porCategoria[g.categoria] || 0) + Number(g.monto);
  });
  const datosCat = Object.entries(porCategoria)
    .map(([nombre, valor]) => ({ nombre, valor }))
    .sort((a, b) => b.valor - a.valor);

  // Datos para gráfico financiero
  const datosFin = [
    { name: "Ingresos", valor: ingresos, color: COLORS.green },
    { name: "Gastos", valor: gastos, color: COLORS.red },
    { name: "Nómina", valor: nomina, color: COLORS.yellow },
  ];

  // Evolución diaria de ingresos y gastos
  const dias = [];
  const numDias = periodo === "hoy" ? 1 : periodo === "semana" ? 7 : periodo === "mes" ? 30 : periodo === "3meses" ? 90 : 365;
  for (let i = numDias - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const fecha = d.toISOString().split("T")[0];
    const ing = data.pagos.filter(p => p.fecha_pago === fecha && p.estado === "pagado").reduce((a, b) => a + Number(b.monto), 0);
    const gas = data.gastos.filter(g => g.fecha === fecha).reduce((a, b) => a + Number(b.monto), 0);
    dias.push({
      fecha: numDias > 30 ? "" : d.getDate(),
      ingresos: ing,
      gastos: gas,
    });
  }

  // Top 5 pagos
  const topPagos = [...pagosPeriodo].sort((a, b) => Number(b.monto) - Number(a.monto)).slice(0, 5);

  return (
    <div style={{ padding: "16px 16px 100px", animation: "fadeIn 0.4s" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, marginBottom: 4, letterSpacing: "-0.5px" }}>Finanzas</h1>
      <p style={{ margin: 0, marginBottom: 20, fontSize: 12, color: COLORS.textMuted }}>
        Ingresos, gastos y rentabilidad
      </p>

      <SelectorPeriodo valor={periodo} onChange={setPeriodo} />

      {/* Resultado destacado */}
      <div style={{
        background: `linear-gradient(135deg, rgba(17,17,17,0.7), rgba(${resultado >= 0 ? "74,222,128" : "248,113,113"},0.08))`,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: `1px solid ${resultado >= 0 ? "rgba(74,222,128,0.25)" : "rgba(248,113,113,0.25)"}`,
        borderRadius: 16,
        padding: 20,
        marginBottom: 14,
        textAlign: "center",
        animation: "fadeInUp 0.5s ease-out 0s both",
      }}>
        <div style={{
          fontSize: 10,
          color: COLORS.textMuted,
          textTransform: "uppercase",
          letterSpacing: "1px",
          fontWeight: 600,
          marginBottom: 4,
        }}>Resultado neto</div>
        <div style={{
          fontSize: 36,
          fontWeight: 900,
          color: resultado >= 0 ? COLORS.green : COLORS.red,
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "-1px",
        }}>
          <NumeroAnimado valor={resultado} formato="moneda" />
        </div>
      </div>

      {/* KPIs financieros */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 14 }}>
        <KPI label="Ingresos" valor={ingresos} formato="moneda" color={COLORS.green} delay={0.1} />
        <KPI label="Gastos" valor={gastos} formato="moneda" color={COLORS.red} delay={0.15} />
        <KPI label="Nómina" valor={nomina} formato="moneda" color={COLORS.yellow} delay={0.2} />
      </div>

      {/* Evolución diaria */}
      <Card
        titulo="Evolución del período"
        accion={
          <div style={{ display: "flex", gap: 4 }}>
            {[
              { id: "area", icono: "▴" },
              { id: "barras", icono: "▮" },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTipoGrafico(t.id)}
                className="tap-feedback"
                style={{
                  width: 28, height: 24,
                  background: tipoGrafico === t.id ? COLORS.accent : COLORS.bg,
                  border: `1px solid ${tipoGrafico === t.id ? COLORS.accent : COLORS.border2}`,
                  borderRadius: 6,
                  color: tipoGrafico === t.id ? COLORS.bg : COLORS.textMuted,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >{t.icono}</button>
            ))}
          </div>
        }
        delay={0.25}
      >
        <ResponsiveContainer width="100%" height={180}>
          {tipoGrafico === "area" ? (
            <AreaChart data={dias} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
              <defs>
                <linearGradient id="gradIng2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.green} stopOpacity={0.4}/>
                  <stop offset="100%" stopColor={COLORS.green} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gradGas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.red} stopOpacity={0.3}/>
                  <stop offset="100%" stopColor={COLORS.red} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke={COLORS.border} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="fecha" tick={{ fill: COLORS.textDim, fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: COLORS.textDim, fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="ingresos" stroke={COLORS.green} strokeWidth={2} fill="url(#gradIng2)" name="Ingresos" />
              <Area type="monotone" dataKey="gastos" stroke={COLORS.red} strokeWidth={2} fill="url(#gradGas)" name="Gastos" />
            </AreaChart>
          ) : (
            <BarChart data={datosFin} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <CartesianGrid stroke={COLORS.border} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: COLORS.textDim, fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="valor" radius={[8, 8, 0, 0]} animationDuration={800}>
                {datosFin.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </Card>

      {/* Gastos por categoría */}
      {datosCat.length > 0 && (
        <Card titulo="Gastos por categoría" delay={0.3}>
          {datosCat.map((c, i) => {
            const pct = Math.round((c.valor / gastos) * 100);
            return (
              <div key={c.nombre} style={{ marginBottom: 12, animation: `fadeInUp 0.3s ease-out ${i * 0.05}s both` }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: COLORS.text, fontWeight: 500, textTransform: "capitalize" }}>{c.nombre}</span>
                  <span style={{ color: COLORS.textMuted }}>{fmtMoneda(c.valor)} <span style={{ color: COLORS.textDim }}>({pct}%)</span></span>
                </div>
                <div style={{
                  height: 6,
                  background: COLORS.bg,
                  borderRadius: 3,
                  overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%",
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${COLORS.red}, ${COLORS.orange})`,
                    borderRadius: 3,
                    transition: "width 0.8s ease-out",
                  }} />
                </div>
              </div>
            );
          })}
        </Card>
      )}

      {/* Top pagos */}
      {topPagos.length > 0 && (
        <Card titulo="Top pagos recibidos" delay={0.35}>
          {topPagos.map((p, i) => {
            const cliente = data.clientes.find(c => c.id === p.cliente_id);
            return (
              <div key={p.id} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 0",
                borderBottom: i < topPagos.length - 1 ? `1px solid ${COLORS.border}` : "none",
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{cliente?.nombre || "—"}</div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{fechaLegibleCorta(p.fecha_pago)}</div>
                </div>
                <div style={{ color: COLORS.green, fontWeight: 700, fontFamily: "monospace" }}>{fmtMoneda(p.monto)}</div>
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}


// ════════════════════════════════════════════════════════════════
// SECCIÓN 4: OPERACIÓN
// ════════════════════════════════════════════════════════════════

function SeccionOperacion({ data, periodo, setPeriodo }) {
  const { desde, hasta } = rangoFechas(periodo);

  // Personal
  const personalActivo = data.personal.filter(p => p.activo);
  const totalNominaProyectada = personalActivo.reduce((a, b) => a + Number(b.monto || 0), 0);

  // Equipamiento
  const equipoTotal = data.equipamiento.length;
  const equipoOk = data.equipamiento.filter(e => e.estado === "operativo").length;
  const equipoEnRev = data.equipamiento.filter(e => e.estado === "en_revision").length;
  const equipoFuera = data.equipamiento.filter(e => e.estado === "fuera_de_servicio").length;
  const pctOperativo = equipoTotal > 0 ? Math.round((equipoOk / equipoTotal) * 100) : 0;

  // Ocupación de clases
  const clases = data.clases || [];

  return (
    <div style={{ padding: "16px 16px 100px", animation: "fadeIn 0.4s" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, marginBottom: 4, letterSpacing: "-0.5px" }}>Operación</h1>
      <p style={{ margin: 0, marginBottom: 20, fontSize: 12, color: COLORS.textMuted }}>
        Personal, equipamiento y clases
      </p>

      <SelectorPeriodo valor={periodo} onChange={setPeriodo} />

      {/* Personal y equipamiento */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <KPI label="Empleados" valor={personalActivo.length} color={COLORS.purple} icono="👥" delay={0} />
        <KPI label="Equipos" valor={equipoTotal} color={COLORS.blue} icono="🏋️" delay={0.05} />
      </div>

      {/* Estado del equipamiento - barra de progreso */}
      <Card titulo={`Estado del equipamiento — ${pctOperativo}% operativo`} delay={0.1}>
        <div style={{
          display: "flex",
          height: 24,
          borderRadius: 8,
          overflow: "hidden",
          marginBottom: 14,
          gap: 2,
        }}>
          {equipoOk > 0 && (
            <div style={{
              width: `${(equipoOk / equipoTotal) * 100}%`,
              background: `linear-gradient(90deg, ${COLORS.green}, ${COLORS.accent})`,
              transition: "width 0.8s",
            }} />
          )}
          {equipoEnRev > 0 && (
            <div style={{
              width: `${(equipoEnRev / equipoTotal) * 100}%`,
              background: COLORS.yellow,
              transition: "width 0.8s",
            }} />
          )}
          {equipoFuera > 0 && (
            <div style={{
              width: `${(equipoFuera / equipoTotal) * 100}%`,
              background: COLORS.red,
              transition: "width 0.8s",
            }} />
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-around", fontSize: 11, gap: 8 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: COLORS.green, fontWeight: 700, fontSize: 16 }}>{equipoOk}</div>
            <div style={{ color: COLORS.textMuted }}>Operativos</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: COLORS.yellow, fontWeight: 700, fontSize: 16 }}>{equipoEnRev}</div>
            <div style={{ color: COLORS.textMuted }}>En revisión</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: COLORS.red, fontWeight: 700, fontSize: 16 }}>{equipoFuera}</div>
            <div style={{ color: COLORS.textMuted }}>Fuera</div>
          </div>
        </div>
      </Card>

      {/* Lista equipamiento con problemas */}
      {(equipoEnRev > 0 || equipoFuera > 0) && (
        <Card titulo="Equipos que requieren atención" delay={0.15}>
          {data.equipamiento.filter(e => e.estado !== "operativo").map((e, i) => (
            <div key={e.id} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0",
              borderBottom: i < equipoEnRev + equipoFuera - 1 ? `1px solid ${COLORS.border}` : "none",
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{e.nombre}</div>
                {e.notas && (
                  <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{e.notas}</div>
                )}
              </div>
              <Badge color={e.estado === "en_revision" ? "yellow" : "red"}>
                {e.estado.replace("_", " ")}
              </Badge>
            </div>
          ))}
        </Card>
      )}

      {/* Personal */}
      <Card titulo="Personal activo" delay={0.2}>
        {personalActivo.length === 0 ? (
          <Vacio icono="👥" mensaje="No hay personal registrado" />
        ) : (
          personalActivo.map((p, i) => (
            <div key={p.id} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0",
              borderBottom: i < personalActivo.length - 1 ? `1px solid ${COLORS.border}` : "none",
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{p.nombre}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>
                  {p.rol} · {p.tipo_pago}
                </div>
              </div>
              <div style={{ color: COLORS.purple, fontWeight: 700, fontFamily: "monospace", fontSize: 13 }}>
                {fmtMoneda(p.monto)}
              </div>
            </div>
          ))
        )}
        {personalActivo.length > 0 && (
          <div style={{
            marginTop: 12,
            paddingTop: 12,
            borderTop: `1px solid ${COLORS.border}`,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 11,
            color: COLORS.textMuted,
          }}>
            <span>Nómina proyectada total</span>
            <span style={{ fontWeight: 700, color: COLORS.text }}>{fmtMoneda(totalNominaProyectada)}</span>
          </div>
        )}
      </Card>

      {/* Clases */}
      {clases.length > 0 && (
        <Card titulo="Horario de clases" delay={0.25}>
          {clases.map((cl, i) => (
            <div key={cl.id} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0",
              borderBottom: i < clases.length - 1 ? `1px solid ${COLORS.border}` : "none",
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{cl.nombre}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>
                  {cl.dia_semana} · {cl.hora?.slice(0, 5)}
                  {cl.personal?.nombre && ` · ${cl.personal.nombre}`}
                </div>
              </div>
              <Badge color="blue">cap. {cl.capacidad_max}</Badge>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}


// ════════════════════════════════════════════════════════════════
// TAB BAR INFERIOR (estilo app móvil)
// ════════════════════════════════════════════════════════════════

function TabBar({ tab, setTab, onLogout }) {
  const tabs = [
    { id: "inicio",    label: "Inicio",    icono: "🏠" },
    { id: "clientes",  label: "Clientes",  icono: "👥" },
    { id: "finanzas",  label: "Finanzas",  icono: "💰" },
    { id: "operacion", label: "Operación", icono: "⚙️" },
  ];

  return (
    <>
      {/* Tab bar */}
      <div style={{
        position: "fixed",
        bottom: 0, left: 0, right: 0,
        background: "rgba(10,10,10,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: `1px solid ${COLORS.border}`,
        padding: "8px 8px calc(8px + env(safe-area-inset-bottom))",
        display: "flex",
        justifyContent: "space-around",
        zIndex: 10,
      }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="tap-feedback"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              padding: "6px 4px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              cursor: "pointer",
              borderRadius: 10,
              transition: "all 0.2s",
            }}
          >
            <span style={{
              fontSize: 20,
              filter: tab === t.id ? "none" : "grayscale(1)",
              opacity: tab === t.id ? 1 : 0.5,
              transition: "all 0.2s",
            }}>{t.icono}</span>
            <span style={{
              fontSize: 10,
              fontWeight: 600,
              color: tab === t.id ? COLORS.accent : COLORS.textMuted,
              letterSpacing: "0.3px",
              transition: "color 0.2s",
            }}>{t.label}</span>
            {tab === t.id && (
              <div style={{
                position: "absolute",
                top: 0,
                width: 24,
                height: 2,
                background: COLORS.accent,
                borderRadius: 1,
                boxShadow: `0 0 8px ${COLORS.accent}`,
                animation: "fadeIn 0.3s",
              }} />
            )}
          </button>
        ))}
      </div>

      {/* Botón logout flotante (arriba a la derecha) */}
      <button
        onClick={onLogout}
        className="tap-feedback"
        title="Cerrar sesión"
        style={{
          position: "fixed",
          top: "calc(14px + env(safe-area-inset-top))",
          right: 14,
          width: 36, height: 36,
          background: "rgba(17,17,17,0.7)",
          backdropFilter: "blur(10px)",
          border: `1px solid ${COLORS.border2}`,
          borderRadius: 10,
          color: COLORS.textMuted,
          fontSize: 14,
          cursor: "pointer",
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >⏻</button>
    </>
  );
}


// ════════════════════════════════════════════════════════════════
// APP PRINCIPAL — manejo de sesion y carga
// ════════════════════════════════════════════════════════════════

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);
  const [tab, setTab] = useState("inicio");
  const [periodo, setPeriodo] = useState("mes");
  const [data, setData] = useState(null);
  const [cargandoData, setCargandoData] = useState(true);

  // Inyectar estilos globales una sola vez
  useEffect(() => {
    const id = "gymos-estilos-globales";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = ESTILOS_GLOBALES;
    document.head.appendChild(style);
  }, []);

  // Detectar sesion activa al cargar
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUsuario(session?.user || null);
      setCargandoSesion(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Cargar datos cuando hay usuario
  useEffect(() => {
    if (!usuario) return;
    cargarData();
  }, [usuario]);

  async function cargarData() {
    setCargandoData(true);
    try {
      const [c, p, per, pp, cl, g, e] = await Promise.all([
        supabase.from("clientes").select("*").order("created_at", { ascending: false }),
        supabase.from("pagos").select("*"),
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
    } catch (err) {
      console.error("Error cargando data:", err);
    }
    setCargandoData(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    setUsuario(null);
  }

  if (cargandoSesion) {
    return (
      <div style={{
        minHeight: "100vh",
        background: COLORS.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <FondoAnimado />
        <Cargando />
      </div>
    );
  }

  if (!usuario) {
    return <Login onLogin={setUsuario} />;
  }

  if (cargandoData || !data) {
    return (
      <div style={{
        minHeight: "100vh",
        background: COLORS.bg,
        color: COLORS.text,
        position: "relative",
      }}>
        <FondoAnimado />
        <Cargando />
      </div>
    );
  }

  const secciones = {
    inicio:    () => <SeccionInicio    data={data} periodo={periodo} setPeriodo={setPeriodo} />,
    clientes:  () => <SeccionClientes  data={data} />,
    finanzas:  () => <SeccionFinanzas  data={data} periodo={periodo} setPeriodo={setPeriodo} />,
    operacion: () => <SeccionOperacion data={data} periodo={periodo} setPeriodo={setPeriodo} />,
  };
  const Seccion = secciones[tab];

  return (
    <div style={{
      minHeight: "100vh",
      background: COLORS.bg,
      color: COLORS.text,
      fontFamily: "'DM Sans', system-ui, sans-serif",
      position: "relative",
    }}>
      <FondoAnimado />

      <div style={{
        position: "relative",
        zIndex: 1,
        maxWidth: 480,
        margin: "0 auto",
        paddingTop: "env(safe-area-inset-top)",
      }}>
        <Seccion />
      </div>

      <TabBar tab={tab} setTab={setTab} onLogout={logout} />
    </div>
  );
}
