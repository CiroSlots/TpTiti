// ===== 1. DATOS =====
const productos = [
  { nombre: "Coca Cola 1,5 Lts", precio: 2000, stock: 45, minimo: 10 },
  { nombre: "Shampoo", precio: 50000, stock: 70, minimo: 10 },
  { nombre: "Yerba 1 kg", precio: 3400, stock: 12, minimo: 10 },
  { nombre: "Arroz 500 g", precio: 1250, stock: 9, minimo: 10 }
];

const rubros = ["Kioscos y almacenes", "Supermercados", "Ferreterías", "Farmacias y perfumerías",
  "Indumentaria", "Distribuidoras mayoristas", "Pet shops", "Librerías", "Autopartes", "Dietéticas"];

const modulos = [
  { icono: "📦", titulo: "Control de stock", texto: "Productos con código de barras, lotes, vencimientos, costo y margen." },
  { icono: "🚚", titulo: "Pedidos y proveedores", texto: "Armás el pedido, registrás lo que llega y el sistema marca los faltantes." },
  { icono: "👥", titulo: "Clientes", texto: "Ficha con historial de compras, descuentos y cuenta corriente." },
  { icono: "🛒", titulo: "Punto de venta", texto: "Escaneás el producto, elegís el medio de pago y cobrás." }
];

const beneficios = [
  { titulo: "Menos ventas perdidas", texto: "Detectás qué falta antes de que un cliente lo pida." },
  { titulo: "Menos tiempo en tareas", texto: "Ventas, pedidos y stock en un mismo lugar." },
  { titulo: "Decisiones con datos", texto: "Ves qué se vende más y cuánta ganancia dejó." },
  { titulo: "Información ordenada", texto: "Todo registrado y accesible desde cualquier dispositivo." }
];

const pasos = [
  { titulo: "Nos escribís por WhatsApp", texto: "Contanos tu rubro, usuarios y sucursales." },
  { titulo: "Cargamos tu comercio", texto: "Dejamos listos tus productos, precios y clientes." },
  { titulo: "Empezás a vender", texto: "Lo usás en tu mostrador con soporte directo." }
];

const preguntas = [
  { p: "¿Necesito instalar algo en las computadoras?", r: "No, funciona desde el navegador." },
  { p: "¿Puedo usarlo desde el celular o una tablet?", r: "Sí, se adapta a cualquier pantalla." },
  { p: "¿Puedo pasar mi stock actual al sistema?", r: "Sí, te ayudamos a cargarlo en la puesta en marcha." },
  { p: "¿Puedo exportar reportes o imprimir tickets?", r: "Sí, todo se exporta a PDF o se imprime." },
  { p: "¿Cómo se contrata?", r: "Nos escribís por WhatsApp y armamos la propuesta." }
];

// ===== 2. FUNCIONES DE AYUDA =====
// Busca un elemento del HTML por su id
function $(id) {
  return document.getElementById(id);
}

// Da formato de plata: 2000 -> "$ 2.000"
function plata(numero) {
  return "$ " + numero.toLocaleString("es-AR");
}

// Arma una tarjeta simple con título y texto
function tarjeta(titulo, texto, arriba) {
  return `<div class="tarjeta">${arriba}<h3>${titulo}</h3><p class="gris">${texto}</p></div>`;
}

// ===== 3. SECCIONES QUE SE GENERAN DESDE LOS ARRAYS =====
$("rubros").innerHTML = rubros.map(r => `<span>${r}</span>`).join("");
$("listaModulos").innerHTML = modulos.map(m => tarjeta(m.titulo, m.texto, `<i>${m.icono}</i>`)).join("");
$("listaBeneficios").innerHTML = beneficios.map(b => tarjeta(b.titulo, b.texto, "")).join("");
$("listaPasos").innerHTML = pasos.map((p, i) => tarjeta(p.titulo, p.texto, `<b class="azul">0${i + 1}</b>`)).join("");
$("listaPreguntas").innerHTML = preguntas.map(q =>
  `<div class="pregunta"><b>${q.p}</b><p class="gris">${q.r}</p></div>`).join("");

// ===== 4. INVENTARIO =====
function mostrarInventario() {
  $("tablaStock").innerHTML = productos.map(p => {
    const estado = p.stock < p.minimo ? `<b class="bajo">Bajo</b>` : `<b class="ok">OK</b>`;
    return `<tr><td>${p.nombre}</td><td class="azul">${plata(p.precio)}</td><td>${p.stock}</td><td>${estado}</td></tr>`;
  }).join("");

  const bajos = productos.filter(p => p.stock < p.minimo).length;
  $("resumen").textContent = `${productos.length} productos · ${bajos} bajo el mínimo`;
}

// ===== 5. PUNTO DE VENTA =====
let carrito = []; // guarda la posición de cada producto agregado

function mostrarProductos() {
  $("productos").innerHTML = productos.map((p, i) =>
    `<button class="producto" onclick="agregar(${i})">
      <b>${p.nombre}</b><small class="gris">Disponible: ${p.stock}</small><span class="azul">${plata(p.precio)}</span>
    </button>`).join("");
}

function agregar(i) {
  const enCarrito = carrito.filter(x => x === i).length;
  if (enCarrito >= productos[i].stock) {
    $("mensaje").textContent = "⚠ No hay más stock de " + productos[i].nombre;
    return;
  }
  carrito.push(i);
  actualizarTotal();
}

function actualizarTotal() {
  let total = 0;
  carrito.forEach(i => total += productos[i].precio);
  $("total").textContent = plata(total);
  return total;
}

$("btnCobrar").addEventListener("click", () => {
  if (carrito.length === 0) {
    $("mensaje").textContent = "Agregá un producto primero";
    return;
  }
  const total = actualizarTotal();
  carrito.forEach(i => productos[i].stock--); // baja el stock
  carrito = [];
  $("mensaje").textContent = "✔ Venta cobrada: " + plata(total);
  actualizarTotal();
  mostrarProductos();
  mostrarInventario();
});

$("btnVaciar").addEventListener("click", () => {
  carrito = [];
  $("mensaje").textContent = "";
  actualizarTotal();
});

// ===== 6. EXTRAS =====
// Abre y cierra las preguntas al hacer clic
document.querySelectorAll(".pregunta").forEach(div => {
  div.addEventListener("click", () => div.classList.toggle("abierta"));
});

// Menú hamburguesa en celular
$("btnMenu").addEventListener("click", () => $("menu").classList.toggle("visible"));

// Año actual en el pie
$("anio").textContent = new Date().getFullYear();

// ===== 7. ARRANQUE =====
mostrarProductos();
mostrarInventario();
